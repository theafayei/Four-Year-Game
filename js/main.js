const STORAGE_KEY = 'it-four-year-game-save';
const QUESTION_SEEN_KEY = 'it-four-year-game-question-seen';

const GAME_STATE = {
  player: {
    name: 'Student',
    gender: 'boy',
    year: 1,
    stats: { grades: 50, sanity: 50, money: 50, friends: 50, skill: 50 },
    seenQuestionsByPool: {}
  },
  screen: 'start',
  eventIndex: 0,
  timeline: [],
  activeBoss: null,
  activeBossState: null,
  currentEvent: null,
  pendingResult: null,
  questionPool: null,
  questionSeen: [],
  saves: { progress: null },
  muted: false,
  activeQuestion: null,
  activeChoice: null,
  travelling: false,
  endingOptions: {},
  loadedScreen: null,
  yearTransition: null,
  terminalSave: null
};

const el = {
  startScreen: document.getElementById('startScreen'),
  characterScreen: document.getElementById('characterScreen'),
  gameScreen: document.getElementById('gameScreen'),
  endingScreen: document.getElementById('endingScreen'),
  startButton: document.getElementById('startButton'),
  continueButton: document.getElementById('continueButton'),
  beginGameButton: document.getElementById('beginGameButton'),
  playerNameInput: document.getElementById('playerName'),
  playerNameDisplay: document.getElementById('playerNameDisplay'),
  yearDisplay: document.getElementById('yearDisplay'),
  statsContainer: document.getElementById('statsContainer'),
  eventPanel: document.getElementById('eventPanel'),
  endingPanel: document.getElementById('endingPanel'),
  mutedButton: document.getElementById('muteButton'),
  lookStrip: document.getElementById('lookStrip'),
  sceneCanvas: document.getElementById('sceneCanvas'),
  eventDialog: document.getElementById('eventDialog')
};

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function getQuestionSeenState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(QUESTION_SEEN_KEY) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function setQuestionSeenState(value) {
  localStorage.setItem(QUESTION_SEEN_KEY, JSON.stringify(value));
}

function saveProgress() {
  // Opening the title or character screen must not overwrite an existing run.
  if (GAME_STATE.screen !== 'game' && GAME_STATE.screen !== 'ending') return;
  const payload = {
    name: GAME_STATE.player.name,
    gender: GAME_STATE.player.gender,
    year: GAME_STATE.player.year,
    stats: GAME_STATE.player.stats,
    eventIndex: GAME_STATE.eventIndex,
    resumeEventIndex: GAME_STATE.travelling ? GAME_STATE.eventIndex : Math.max(0, GAME_STATE.eventIndex - 1),
    activeChoice: GAME_STATE.activeChoice,
    endingOptions: GAME_STATE.endingOptions,
    activeQuestion: GAME_STATE.activeQuestion,
    seenQuestions: GAME_STATE.player.seenQuestionsByPool,
    timeline: GAME_STATE.timeline,
    screen: GAME_STATE.screen,
    muted: GAME_STATE.muted,
    yearTransition: GAME_STATE.yearTransition,
    terminalSave: GAME_STATE.terminalSave
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    if (!data) return false;
    GAME_STATE.player.name = data.name || 'Student';
    GAME_STATE.player.gender = data.gender || 'boy';
    GAME_STATE.player.year = data.year || 1;
    GAME_STATE.player.stats = { ...GAME_STATE.player.stats, ...(data.stats || {}) };
    GAME_STATE.eventIndex = data.resumeEventIndex ?? data.eventIndex ?? 0;
    GAME_STATE.activeQuestion = data.activeQuestion || null;
    GAME_STATE.activeChoice = data.activeChoice || null;
    GAME_STATE.endingOptions = data.endingOptions || {};
    GAME_STATE.loadedScreen = data.screen;
    GAME_STATE.yearTransition = data.yearTransition || null;
    GAME_STATE.terminalSave = data.terminalSave || null;
    GAME_STATE.travelling = false;
    GAME_STATE.player.seenQuestionsByPool = data.seenQuestions || {};
    GAME_STATE.timeline = data.timeline || buildTimeline();
    GAME_STATE.muted = Boolean(data.muted);
    updateMuteButton();
    return true;
  } catch (error) {
    console.error('Could not load save', error);
    return false;
  }
}

function ensureSeenQuestions() {
  if (!GAME_STATE.player.seenQuestionsByPool) {
    GAME_STATE.player.seenQuestionsByPool = {};
  }
  Object.keys(QUESTION_POOLS).forEach((pool) => {
    if (!GAME_STATE.player.seenQuestionsByPool[pool]) {
      GAME_STATE.player.seenQuestionsByPool[pool] = [];
    }
  });
}

function hasDropout() {
  return Object.values(GAME_STATE.player.stats).some((value) => value <= 0);
}

const STAT_DETAILS = {
  grades: ['Grades', 'Your academic performance. Keep it above zero.'],
  sanity: ['Sanity', 'Your energy and wellbeing. Keep it above zero.'],
  money: ['Money', 'Your budget for student life.'],
  friends: ['Friends', 'Your connections and support network.'],
  skill: ['Skill', 'Your practical IT knowledge.']
};
let displayedStats = {};
let activeTooltip = null;

function hideStatTooltip() {
  activeTooltip = null;
  document.getElementById('statTooltip').classList.add('hidden');
  el.statsContainer.querySelectorAll('.stat-button').forEach(button => button.setAttribute('aria-expanded', 'false'));
}
function showStatTooltip(key) {
  hideStatTooltip();
  activeTooltip = key;
  const tooltip = document.getElementById('statTooltip');
  tooltip.textContent = STAT_DETAILS[key][0] + ': ' + GAME_STATE.player.stats[key] + '/100 — ' + STAT_DETAILS[key][1];
  tooltip.classList.remove('hidden');
  document.getElementById('stat-' + key).setAttribute('aria-expanded', 'true');
}
function setupStatsHUD() {
  Object.keys(STAT_DETAILS).forEach(key => {
    const item = document.createElement('div');
    item.className = 'stat-item';
    item.innerHTML = '<button type="button" class="stat-button" id="stat-' + key + '" data-stat="' + key + '" aria-expanded="false" aria-describedby="statTooltip">' +
      '<canvas class="stat-icon" width="36" height="36" aria-hidden="true"></canvas>' +
      '<span class="stat-meter" aria-hidden="true"><span class="stat-name">' + STAT_DETAILS[key][0] + '</span>' +
      '<span class="stat-bar"><span class="stat-fill"></span></span></span>' +
      '<span class="stat-value" aria-hidden="true">50</span></button>';
    el.statsContainer.appendChild(item);
    const button = item.querySelector('button');
    drawStatIcon(item.querySelector('canvas'), key);
    button.addEventListener('mouseenter', () => showStatTooltip(key));
    button.addEventListener('mouseleave', hideStatTooltip);
    button.addEventListener('focus', () => showStatTooltip(key));
    button.addEventListener('blur', hideStatTooltip);
    // Click also works on touch devices, where hover does not exist.
    button.addEventListener('click', () => showStatTooltip(key));
  });
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.stat-item')) hideStatTooltip();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { hideStatTooltip(); finishTypewriter(); }
  });
}
function updateStatsDisplay() {
  Object.keys(STAT_DETAILS).forEach(key => {
    const value = clamp(GAME_STATE.player.stats[key]);
    const button = document.getElementById('stat-' + key);
    if (!button) return;
    button.setAttribute('aria-label', STAT_DETAILS[key][0] + ': ' + value + '/100');
    const fill = button.querySelector('.stat-fill');
    fill.style.width = value + '%';
    button.querySelector('.stat-value').textContent = value;
    button.classList.toggle('low', value <= 20);
    const difference = value - (displayedStats[key] ?? value);
    if (difference && GAME_STATE.screen === 'game') {
      const float = document.createElement('span');
      float.className = 'stat-float ' + (difference > 0 ? 'positive' : 'negative');
      float.textContent = (difference > 0 ? '+' : '') + difference;
      float.setAttribute('aria-hidden', 'true');
      button.parentElement.appendChild(float);
      fill.classList.remove('stat-flash');
      void fill.offsetWidth;
      fill.classList.add('stat-flash');
      setTimeout(() => { float.remove(); fill.classList.remove('stat-flash'); }, 1400);
    }
    displayedStats[key] = value;
  });
  if (activeTooltip) showStatTooltip(activeTooltip);
}

function renderEffectIcons(container, effects) {
  container.replaceChildren();
  container.className = 'effect-list';
  Object.entries(effects).forEach(([key, amount]) => {
    const chip = document.createElement('span');
    chip.className = 'effect-chip ' + (amount > 0 ? 'positive' : 'negative');
    const label = STAT_DETAILS[key][0] + ' ' + (amount > 0 ? '+' : '') + amount;
    chip.setAttribute('aria-label', label);
    chip.title = label;
    const icon = document.createElement('canvas');
    icon.width = 24; icon.height = 24;
    icon.setAttribute('aria-hidden', 'true');
    chip.appendChild(icon);
    drawStatIcon(icon, key);
    const change = document.createElement('span');
    change.textContent = (amount > 0 ? '+' : '') + amount;
    change.setAttribute('aria-hidden', 'true');
    chip.appendChild(change);
    container.appendChild(chip);
  });
}

function updateNameAndYear() {
  el.playerNameDisplay.textContent = GAME_STATE.player.name;
  el.yearDisplay.textContent = GAME_STATE.player.year;
  el.gameScreen.dataset.year = GAME_STATE.player.year;
  campusScene.draw();
}

// Character screen: the two pick cards, and the four looks your student wears over the years.
function renderCharacterPreview() {
  document.querySelectorAll('.pick-card canvas').forEach(canvas => renderCharacterSprite(canvas, canvas.dataset.gender, 1, false));
  if (!el.lookStrip.children.length) {
    ['Freshman', 'Sophomore', 'Junior', 'Senior'].forEach((label, index) => {
      const cell = document.createElement('figure');
      cell.innerHTML = '<canvas width="48" height="68" aria-hidden="true"></canvas><figcaption></figcaption>';
      cell.querySelector('figcaption').textContent = 'Y' + (index + 1) + ' ' + label;
      el.lookStrip.appendChild(cell);
    });
  }
  el.lookStrip.querySelectorAll('canvas').forEach((canvas, index) => renderCharacterSprite(canvas, GAME_STATE.player.gender, index + 1, false));
  const count = document.getElementById('nameCount');
  if (count) count.textContent = el.playerNameInput.value.length + '/12';
}

function setScreen(name) {
  const screens = [
    el.startScreen,
    el.characterScreen,
    el.gameScreen,
    el.endingScreen
  ];

  screens.forEach((screen) => {
    screen.classList.add('hidden');
    screen.classList.remove('active');
  });

  const target = {
    start: el.startScreen,
    character: el.characterScreen,
    game: el.gameScreen,
    ending: el.endingScreen
  }[name];

  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
  }
  GAME_STATE.screen = name;
  document.body.dataset.screen = name;
  if (name === 'start') titleStage.start(); else titleStage.stop();
  if (name === 'character') characterStage.start(); else characterStage.stop();
  if (name !== 'ending' && endingStage) { endingStage.stop(); endingStage = null; }
  if (name !== 'game') { campusScene.cancel(); closeEventDialog(); }
  else campusScene.resize();
  if (name === 'ending') saveProgress();
}

function setPlayerNameFromInput() {
  const raw = el.playerNameInput.value.trim();
  GAME_STATE.player.name = raw || 'Student';
  if (GAME_STATE.player.name.length > 12) {
    GAME_STATE.player.name = GAME_STATE.player.name.slice(0, 12);
    el.playerNameInput.value = GAME_STATE.player.name;
  }
  el.playerNameDisplay.textContent = GAME_STATE.player.name;
}

function showStartScreen() {
  setScreen('start');
  el.playerNameInput.value = GAME_STATE.player.name;
}

function goToCharacterScreen() {
  setScreen('character');
  renderCharacterPreview();
  el.playerNameInput.value = GAME_STATE.player.name;
  document.querySelectorAll('input[name="character"]').forEach(radio => {
    radio.checked = radio.value === GAME_STATE.player.gender;
  });
}

function updateMuteButton() {
  el.mutedButton.textContent = GAME_STATE.muted ? '🔇' : '🔊';
  if (GAME_STATE.muted) {
    soundEngine.enabled = false;
  } else {
    soundEngine.enabled = true;
  }
}

function handleMuteToggle() {
  GAME_STATE.muted = !GAME_STATE.muted;
  updateMuteButton();
  saveProgress();
}

function applyStatEffects(effects) {
  Object.keys(effects).forEach((key) => {
    const statKey = key;
    GAME_STATE.player.stats[statKey] = clamp(GAME_STATE.player.stats[statKey] + effects[key]);
  });

  if (GAME_STATE.player.stats.grades <= 0 || GAME_STATE.player.stats.sanity <= 0) {
    showEnding({ final: true, trigger: 'dropout' });
    return true;
  }

  updateStatsDisplay();
  return false;
}

function shuffleOptions(options) {
  const arr = [...options];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getAvailableQuestion(poolName) {
  const pool = QUESTION_POOLS[poolName] || [];
  const seen = GAME_STATE.player.seenQuestionsByPool[poolName] || [];
  let available = pool.filter(question => !seen.includes(question.id));
  // Recycle only after every question in this pool has been used.
  if (!available.length) {
    GAME_STATE.player.seenQuestionsByPool[poolName] = [];
    available = pool;
  }
  const history = getQuestionSeenState();
  const previous = Array.isArray(history[poolName]) ? history[poolName] : [];
  const fresh = available.filter(question => !previous.includes(question.id));
  if (fresh.length) return fresh;
  history[poolName] = [];
  setQuestionSeenState(history);
  return available;
}

function pickQuestion(poolName) {
  const available = getAvailableQuestion(poolName);
  if (!available.length) return null;
  const question = available[Math.floor(Math.random() * available.length)];
  const seen = GAME_STATE.player.seenQuestionsByPool[poolName] || [];
  seen.push(question.id);
  GAME_STATE.player.seenQuestionsByPool[poolName] = seen;
  const history = getQuestionSeenState();
  const previous = Array.isArray(history[poolName]) ? history[poolName] : [];
  history[poolName] = [...new Set([...previous, question.id])];
  setQuestionSeenState(history);
  return question;
}

function renderQuestionEvent(event) {
  let saved = GAME_STATE.activeQuestion;
  let question = saved && saved.eventId === event.id
    ? QUESTION_POOLS[event.pool].find(item => item.id === saved.questionId) : null;
  if (!question) {
    question = pickQuestion(event.pool);
    saved = {eventId: event.id, questionId: question.id,
      order: shuffleOptions(question.options.map((_, index) => index)), selected: null};
    GAME_STATE.activeQuestion = saved;
  }

  el.eventPanel.innerHTML = '<div class="dialog-reading"><div class="paper-head"><span class="paper-name"></span><span>Year ' + GAME_STATE.player.year + '</span></div>' +
    '<div class="event-header"><h3></h3><span></span></div>' +
    '<div class="event-description"></div><div class="question-text"></div>' +
    '<div class="answer-feedback hidden" id="questionFeedback" role="status"></div></div>' +
    '<div class="dialog-actions"><div class="skill-options"></div>' +
    '<button type="button" class="hidden" id="nextQuestionButton">Continue</button></div>';
  el.eventPanel.querySelector('h3').textContent = event.title;
  el.eventPanel.querySelector('.paper-name').textContent = 'Name: ' + GAME_STATE.player.name;
  el.eventPanel.querySelector('.event-header span').textContent = 'Skill check';
  el.eventPanel.querySelector('.event-description').textContent = event.description;
  // textContent preserves code, punctuation, and angle brackets in the supplied questions.
  el.eventPanel.querySelector('.question-text').textContent = question.question;
  const optionsRoot = el.eventPanel.querySelector('.skill-options');
  const feedback = document.getElementById('questionFeedback');
  const nextButton = document.getElementById('nextQuestionButton');
  const buttons = [];

  function showFeedback() {
    buttons.forEach(({button, index}) => {
      button.disabled = true;
      if (index === question.answer) button.classList.add('correct');
      else if (index === saved.selected) button.classList.add('incorrect');
    });
    feedback.classList.remove('hidden');
    feedback.dataset.result = saved.selected === question.answer ? 'CORRECT' : 'WRONG';
    feedback.textContent = (saved.selected === question.answer ? 'Correct! ' : 'Not quite. ') +
      'Correct answer: ' + question.options[question.answer] + '. ' + question.explanation;
    nextButton.classList.remove('hidden');
  }

  saved.order.forEach(index => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'skill-button';
    button.innerHTML = '<span class="opt-key"></span><span class="opt-text"></span>';
    button.querySelector('.opt-key').textContent = String.fromCharCode(65 + saved.order.indexOf(index));
    button.querySelector('.opt-text').textContent = question.options[index];
    button.addEventListener('click', () => {
      if (saved.selected !== null) return;
      finishTypewriter();
      saved.selected = index;
      const correct = index === question.answer;
      if (correct) soundEngine.success(); else soundEngine.fail();
      const droppedOut = applyStatEffects(correct ? {skill: 10} : {grades: -5});
      saveProgress();
      if (!droppedOut) { showFeedback(); campusScene.react(correct ? 'happy' : 'sad'); }
    });
    buttons.push({button, index});
    optionsRoot.appendChild(button);
  });
  // Keep the explanation visible until the player is ready; never award twice on reload.
  nextButton.addEventListener('click', () => {
    nextButton.disabled = true;
    GAME_STATE.activeQuestion = null;
    advanceStory();
  });
  if (saved.selected !== null) showFeedback();
}

function renderChoiceEvent(event) {
  const saved = GAME_STATE.activeChoice?.eventId === event.id
    ? GAME_STATE.activeChoice : {eventId: event.id, selected: null};
  GAME_STATE.activeChoice = saved;
  el.eventPanel.innerHTML = '<div class="dialog-reading"><div class="event-header"><h3></h3><span></span></div>' +
    '<div class="term-lines"></div>' +
    '<div class="event-description"></div>' +
    '<div id="choiceEffects" class="hidden" role="status"></div></div>' +
    '<div class="dialog-actions"><div class="choice-list"></div>' +
    '<button id="nextChoiceButton" type="button" class="hidden">Continue</button></div>';
  const flavour = getEventScene({type: 'event', event}).term;
  if (flavour) {   // a few real-looking terminal lines for the technical situations
    const lines = el.eventPanel.querySelector('.term-lines');
    [['student@campus:~$ ' + flavour.cmd, 'cmd'], ...flavour.out.map(text => [text, 'out'])].forEach(([text, kind]) => {
      const line = document.createElement('div'); line.className = 'term-line ' + kind; line.textContent = text; lines.appendChild(line);
    });
  }
  el.eventPanel.querySelector('h3').textContent = event.title;
  el.eventPanel.querySelector('.event-header span').textContent = 'Year ' + GAME_STATE.player.year;
  el.eventPanel.querySelector('.event-description').textContent = event.description.replace(/\{\{name\}\}/g, GAME_STATE.player.name);
  const choices = el.eventPanel.querySelector('.choice-list');
  const effects = document.getElementById('choiceEffects');
  const next = document.getElementById('nextChoiceButton');
  function showResult() {
    choices.querySelectorAll('button').forEach((button, index) => {
      button.disabled = true;
      button.classList.toggle('picked', index === saved.selected);
    });
    renderEffectIcons(effects, event.choices[saved.selected].effects);
    effects.classList.remove('hidden');
    next.classList.remove('hidden');
  }
  event.choices.forEach((choice, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice-button';
    button.innerHTML = '<span class="opt-key"></span><span class="opt-text"></span>';
    button.querySelector('.opt-key').textContent = index + 1;
    button.querySelector('.opt-text').textContent = choice.label;
    button.addEventListener('click', () => {
      if (saved.selected !== null) return;
      finishTypewriter();
      saved.selected = index;
      soundEngine.click();
      const droppedOut = applyStatEffects(choice.effects);
      saveProgress();
      if (!droppedOut) {
        showResult();
        campusScene.react(Object.values(choice.effects).reduce((sum, amount) => sum + amount, 0) >= 0 ? 'happy' : 'sad');
      }
    });
    choices.appendChild(button);
  });
  next.addEventListener('click', () => {
    if (saved.selected === null || GAME_STATE.travelling) return;
    next.disabled = true;
    advanceStory();
  });
  if (saved.selected !== null) showResult();
}

function renderBossLogic() {
  const boss = getBossScenario(GAME_STATE.activeBoss);
  const state = GAME_STATE.activeBossState;
  if (!boss || !state) return;

  const round = state.rounds[state.currentRound];
  const markup = `
    <div class="dialog-reading boss-panel">
      <div class="paper-head"><span>Name: ${GAME_STATE.player.name}</span><span>Midterm exam</span></div>
      <div class="boss-header">
        <h3>${boss.title}</h3>
        <span>Round ${state.currentRound + 1}/${state.totalRounds}</span>
      </div>
      <div class="boss-meters">
        <label>Exam boss<div class="boss-bar"><div class="boss-bar-fill" style="width:${state.bossHealth}%"></div></div></label>
        <label>Time left<div class="time-bar"><div class="time-bar-fill" style="width:${state.timeLeft / state.maxTime * 100}%"></div></div></label>
      </div>
      <div class="logic-card">
        <strong class="question-text">${round.question}</strong>
        <div class="logic-grid">
          ${Object.entries(round.inputs).map(([label, value]) => `<div><span>${label} = ${value ? '1' : '0'}</span></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="dialog-actions">
      <div class="choice-list skill-options">
        ${round.options.map((option, index) => `
          <button class="action-button skill-button logic-answer" type="button" data-option="${option}"><span class="opt-key">${'ABCD'[index]}</span><span class="opt-text">${option}</span></button>
        `).join('')}
      </div>
    </div>
  `;
  el.eventPanel.innerHTML = markup;

  el.eventPanel.querySelectorAll('.logic-answer').forEach((button) => {
    button.addEventListener('click', () => {
      const chosen = button.dataset.option;
      const correct = round.answer;
      if (chosen === correct) {
        soundEngine.success();
        state.bossHealth = clamp(state.bossHealth - 25);
        state.score += 1;
        if (state.bossHealth <= 0) {
          GAME_STATE.player.stats.skill = clamp(GAME_STATE.player.stats.skill + 10);
          GAME_STATE.player.stats.grades = clamp(GAME_STATE.player.stats.grades + 5);
          updateStatsDisplay();
          setTimeout(() => advanceStory(), 500);
          return;
        }
      } else {
        soundEngine.fail();
        state.timeLeft = clamp(state.timeLeft - 5);
      }
      if (state.timeLeft <= 0) {
        GAME_STATE.player.stats.grades = clamp(GAME_STATE.player.stats.grades - 10);
        GAME_STATE.player.stats.sanity = clamp(GAME_STATE.player.stats.sanity - 10);
        updateStatsDisplay();
        if (GAME_STATE.player.stats.grades <= 0 || GAME_STATE.player.stats.sanity <= 0) {
          showEnding({ final: true, trigger: 'dropout' });
          return;
        }
        setTimeout(() => advanceStory(), 500);
        return;
      }
      state.currentRound += 1;
      if (state.currentRound >= state.totalRounds) {
        GAME_STATE.player.stats.grades = clamp(GAME_STATE.player.stats.grades - 10);
        GAME_STATE.player.stats.sanity = clamp(GAME_STATE.player.stats.sanity - 10);
        updateStatsDisplay();
        setTimeout(() => advanceStory(), 500);
        return;
      }
      renderBossLogic();
    });
  });
}

function getBossDefinitionForYear(year) {
  if (year === 1) return 'logicGateMidterm';
  if (year === 2) return 'databaseDown';
  if (year === 3) return 'serverDown';
  if (year === 4) return 'clientServerDown';
  return null;
}

function startBoss(bossKey) {
  const boss = getBossScenario(bossKey);
  if (!boss) return;
  GAME_STATE.activeBoss = bossKey;

  if (boss.type === 'logic') {
    GAME_STATE.activeBossState = {
      bossHealth: 100,
      score: 0,
      timeLeft: boss.maxTime,
      maxTime: boss.maxTime,
      totalRounds: boss.totalRounds,
      currentRound: 0,
      rounds: Array.from({ length: boss.totalRounds }, () => boss.generateRound())
    };
    renderBossLogic();
    return;
  }

  const state = GAME_STATE.terminalSave?.bossId === bossKey ? GAME_STATE.terminalSave : {
    bossId:bossKey,step:0,patience:100,wrongStreak:0,hintLevel:0,easy:true,
    awaitReload:false,finished:false,won:false,rewardApplied:false,history:[],output:[],loggedIn:!boss.login
  };
  GAME_STATE.terminalSave=state;
  const root=document.createElement('div');root.className='terminal-boss';
  el.eventPanel.replaceChildren(root);
  const terminal=new TerminalEngine({container:root,scenario:boss,state,
    onChange:()=>saveProgress(),
    onFinish:won=>{
      if(!state.rewardApplied){
        state.rewardApplied=true;
        const droppedOut=applyStatEffects(won?boss.success:boss.failure);
        saveProgress();
        if(droppedOut)return;
      }
      if(!won&&bossKey==='finalDefense')showEnding({final:true,trigger:'final-boss-loss'});
      else advanceStory();
    }
  });
  GAME_STATE.activeBossState={terminal};
  terminal.mount();
}

function renderNextStoryItem() {
  if (GAME_STATE.player.stats.grades <= 0 || GAME_STATE.player.stats.sanity <= 0) {
    showEnding({ final: true, trigger: 'dropout' });
    return;
  }

  const orderedEvents = buildTimeline();
  const nextItem = orderedEvents[GAME_STATE.eventIndex];

  if (!nextItem) {
    showEnding();
    return;
  }

  if (nextItem.type === 'event') {
    GAME_STATE.currentEvent = nextItem.event;
    GAME_STATE.player.year = nextItem.year === 'summer' ? 3 : nextItem.year;
    if (nextItem.year === 'summer') {
      GAME_STATE.player.year = 3;
    }
    updateNameAndYear();
    if (GAME_STATE.currentEvent.type === 'choice') {
      renderChoiceEvent(GAME_STATE.currentEvent);
    } else if (GAME_STATE.currentEvent.type === 'skill') {
      renderQuestionEvent(GAME_STATE.currentEvent);
    }
    GAME_STATE.eventIndex += 1;
    updateStatsDisplay();
    saveProgress();
    return;
  }

  if (nextItem.type === 'boss') {
    GAME_STATE.eventIndex += 1;
    const bossKey = nextItem.bossId;
    if (bossKey === 'finalDefense') {
      GAME_STATE.player.year = 4;
    }
    startBoss(bossKey);
    updateNameAndYear();
    saveProgress();
  }
}

function beginGame() {
  campusScene.reset();
  displayedStats = {};
  GAME_STATE.travelling = false;
  GAME_STATE.activeChoice = null;
  GAME_STATE.endingOptions = {};
  GAME_STATE.yearTransition = null;
  GAME_STATE.terminalSave = null;
  setPlayerNameFromInput();
  GAME_STATE.player.year = 1;
  GAME_STATE.activeQuestion = null;
  GAME_STATE.player.stats = { grades: 50, sanity: 50, money: 50, friends: 50, skill: 50 };
  GAME_STATE.player.seenQuestionsByPool = {};
  GAME_STATE.eventIndex = 0;
  GAME_STATE.timeline = buildTimeline();
  ensureSeenQuestions();
  updateStatsDisplay();
  updateNameAndYear();
  renderCharacterPreview();
  setScreen('game');
  advanceStory();
}

function showEnding(options = {}) {
  GAME_STATE.endingOptions = options;
  GAME_STATE.travelling = false;
  const result = options.final ? { endingTrigger: options.trigger } : null;
  const ending = getEndingForStats(GAME_STATE.player.stats, result);
    const paragraph = ending.text.replace(/\{\{name\}\}/g, GAME_STATE.player.name);

  const markup = `
    <h2>${ending.title}</h2>
    <div class="ending-paragraph">${paragraph}</div>
    <div class="ending-stage" id="endingHost"><canvas id="endingCanvas" role="img" aria-label="Your student at the end of the four years"></canvas></div>
    <div class="stat-summary">
      <div>Grades: ${GAME_STATE.player.stats.grades}</div>
      <div>Sanity: ${GAME_STATE.player.stats.sanity}</div>
      <div>Money: ${GAME_STATE.player.stats.money}</div>
      <div>Friends: ${GAME_STATE.player.stats.friends}</div>
      <div>Skill: ${GAME_STATE.player.stats.skill}</div>
    </div>
    <div class="ending-buttons">
      <button type="button" id="playAgainButton">Play Again</button>
    </div>
  `;

  el.endingPanel.innerHTML = markup;
  setScreen('ending');
  endingStage = createEndingStage(document.getElementById('endingCanvas'), document.getElementById('endingHost'), () => GAME_STATE.player, () => ending.id);
  endingStage.start();

  document.getElementById('playAgainButton').addEventListener('click', () => {
    GAME_STATE.player.name = 'Student';
    GAME_STATE.player.gender = 'boy';
    el.playerNameInput.value = GAME_STATE.player.name;
    goToCharacterScreen();
  });
}

function setupEvents() {
  setupStatsHUD();
  document.getElementById('finishTextButton').addEventListener('click', finishTypewriter);
  el.startButton.addEventListener('click', () => goToCharacterScreen());
  el.continueButton.addEventListener('click', () => {
    const saved = loadProgress();
    if (saved) {
      setScreen('game');
      updateStatsDisplay();
      updateNameAndYear();
      renderCharacterPreview();
      if (GAME_STATE.loadedScreen === 'ending') showEnding(GAME_STATE.endingOptions);
      else advanceStory(true);
    } else {
      goToCharacterScreen();
    }
  });
  el.beginGameButton.addEventListener('click', () => beginGame());
  el.mutedButton.addEventListener('click', handleMuteToggle);
  document.querySelectorAll('input[name="character"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
      GAME_STATE.player.gender = event.target.value;
      characterStage.poke('player'); soundEngine.pop();
      renderCharacterPreview();
    });
  });
  el.playerNameInput.addEventListener('input', () => {
    setPlayerNameFromInput();
    renderCharacterPreview();
    updateNameAndYear();
  });
  updateStatsDisplay();
  updateNameAndYear();
  renderCharacterPreview();
  updateMuteButton();
}

// Scene timing is presentation only: it does not consume questions or apply effects.
function advanceStory(resume = false) {
  if (GAME_STATE.travelling) return;
  if (GAME_STATE.player.stats.grades <= 0 || GAME_STATE.player.stats.sanity <= 0) {
    showEnding({final: true, trigger: 'dropout'});
    return;
  }
  const next = buildTimeline()[GAME_STATE.eventIndex];
  if (!next) { showEnding(); return; }
  closeEventDialog();
  const previousYear = GAME_STATE.player.year;
  if (next.year) GAME_STATE.player.year = next.year === 'summer' ? 3 : next.year;
  updateNameAndYear();
  campusScene.configure(next);
  const arrive = () => {
    GAME_STATE.travelling = false;
    renderNextStoryItem();
    if (GAME_STATE.screen === 'game') openEventDialog();
  };
  if (GAME_STATE.yearTransition || (!resume && GAME_STATE.player.year > previousYear)) {
    GAME_STATE.travelling = true;
    GAME_STATE.yearTransition ||= {from: previousYear, to: GAME_STATE.player.year};
    saveProgress();
    showYearTransition(() => campusScene.travel(arrive));
  } else if (resume) {
    campusScene.show(next);
    arrive();
  } else {
    GAME_STATE.travelling = true;
    saveProgress(); // A reload during travel resumes the upcoming event, not the last one.
    campusScene.travel(arrive);
  }
}


function showYearTransition(onContinue) {
  const transition = GAME_STATE.yearTransition;
  campusScene.cancel();
  const dialog = document.getElementById('yearTransition');
  dialog.dataset.year = transition.to;
  document.getElementById('yearComplete').textContent = 'YEAR ' + transition.from + ' COMPLETE';
  document.getElementById('yearTitle').textContent = 'YEAR ' + transition.to;
  document.getElementById('yearSubtitle').textContent = ['','Freshman Year','Sophomore Year','Junior Year','Senior Year'][transition.to];
  renderCharacterSprite(document.getElementById('yearSprite'), GAME_STATE.player.gender, transition.to);
  const recap = document.getElementById('yearRecap'); recap.replaceChildren();
  Object.entries(GAME_STATE.player.stats).forEach(([key,value]) => {
    const item = document.createElement('div');
    item.title = STAT_DETAILS[key][0] + ': ' + value + '/100';
    item.setAttribute('aria-label', item.title);
    const icon = document.createElement('canvas');icon.width=24;icon.height=24;
    item.appendChild(icon);drawStatIcon(icon,key);
    const bar=document.createElement('span');bar.className='stat-bar';
    const fill=document.createElement('span');fill.className='stat-fill';fill.style.width=value+'%';
    bar.appendChild(fill);item.appendChild(bar);recap.appendChild(item);
  });
  const mute=document.getElementById('yearMute');
  const updateMute=()=>{mute.textContent=GAME_STATE.muted?'Unmute sound':'Mute sound';};
  mute.onclick=()=>{handleMuteToggle();updateMute();};updateMute();
  document.getElementById('yearContinue').onclick=()=>{
    dialog.close();GAME_STATE.yearTransition=null;saveProgress();onContinue();
  };
  dialog.oncancel=event=>event.preventDefault();
  if(!dialog.open)dialog.showModal();
  soundEngine.levelUp();
}

let typewriterTimer = null;
let completeTypewriter = null;
function finishTypewriter() {
  clearTimeout(typewriterTimer);
  typewriterTimer = null;
  if (completeTypewriter) completeTypewriter();
  completeTypewriter = null;
  document.getElementById('finishTextButton').classList.add('hidden');
}
function typeDialogText(node) {
  finishTypewriter();
  if (!node || spriteMotion.matches) return;
  const text = node.textContent;
  const accessibleText = document.createElement('span');
  accessibleText.className = 'sr-only';
  accessibleText.textContent = text;
  const visualText = document.createElement('span');
  visualText.setAttribute('aria-hidden', 'true');
  node.replaceChildren(accessibleText, visualText);
  let index = 0;
  const skip = document.getElementById('finishTextButton');
  completeTypewriter = () => { visualText.textContent = text; };
  skip.classList.remove('hidden');
  function tick() {
    if (document.hidden) { typewriterTimer = setTimeout(tick, 100); return; }
    index = Math.min(text.length, index + 2);
    visualText.textContent = text.slice(0, index);
    if (index < text.length) typewriterTimer = setTimeout(tick, 24);
    else finishTypewriter();
  }
  tick();
}
function closeEventDialog() {
  campusScene.setCompact(false);
  finishTypewriter();
  el.eventDialog.classList.add('hidden');
}
function openEventDialog() {
  const item = buildTimeline()[GAME_STATE.eventIndex - 1];
  const speaker = item?.type === 'boss' ? 'System' : item?.event.type === 'skill' ? 'Instructor' : GAME_STATE.player.name;
  document.getElementById('dialogSpeaker').textContent = speaker;
  el.eventDialog.classList.remove('hidden');
  const theme = getEventScene(item).theme;
  el.eventDialog.dataset.theme = theme;
  campusScene.setCompact(item?.type === 'boss' && item.bossId !== 'logicGateMidterm');
  document.getElementById('sceneStatus').textContent = item?.type === 'boss' ? 'Challenge in progress' : 'Make your choice';
  // Exam paper shows the question straight away; the other boxes type their story out.
  if (theme !== 'paper') typeDialogText(el.eventPanel.querySelector('.event-description'));
  el.eventDialog.focus({preventScroll: true});
}

const campusScene = new WorldScene(el.sceneCanvas);

// Animated stages for the title and character screens (the ending stage is created when needed).
let endingStage = null;
const titleStage = createTitleStage(document.getElementById('titleCanvas'), document.getElementById('titleHost'), phase => {
  document.querySelectorAll('.year-pips span').forEach((pip, index) => pip.classList.toggle('on', index === phase));
});
const characterStage = createCharacterStage(document.getElementById('characterCanvas'), document.getElementById('characterHost'), () => GAME_STATE.player);

// Number keys pick the matching option: 1-4 (or A-D on exam questions).
document.addEventListener('keydown', event => {
  if (GAME_STATE.screen !== 'game' || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.target.closest('input, textarea')) return;
  const key = event.key.toLowerCase();
  const buttons = [...el.eventPanel.querySelectorAll('.choice-button, .skill-button')];
  let index = '1234'.indexOf(key);
  if (index < 0 && el.eventPanel.querySelector('.skill-button')) index = 'abcd'.indexOf(key);
  if (key.length === 1 && index >= 0 && buttons[index] && !buttons[index].disabled) buttons[index].click();
});

setupEvents();
showStartScreen();
