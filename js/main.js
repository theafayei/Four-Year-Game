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
  previewCanvas: document.getElementById('characterPreview'),
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
    item.innerHTML = '<button type="button" class="stat-button" id="stat-' + key + '" aria-expanded="false" aria-describedby="statTooltip">' +
      '<canvas class="stat-icon" width="36" height="36" aria-hidden="true"></canvas>' +
      '<span class="stat-bar" aria-hidden="true"><span class="stat-fill"></span></span></button>';
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
  document.getElementById('sceneYearLabel').textContent = CAMPUS_THEMES[GAME_STATE.player.year].name;
  el.gameScreen.dataset.year = GAME_STATE.player.year;
  campusScene.draw();
}

function renderCharacterPreview() {
  renderCharacterSprite(el.previewCanvas, GAME_STATE.player.gender, 1, false);
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

  el.eventPanel.innerHTML = '<div class="event-header"><h3></h3><span></span></div>' +
    '<div class="event-description"></div><div class="question-text"></div>' +
    '<div class="skill-options"></div>' +
    '<div class="answer-feedback hidden" id="questionFeedback" role="status"></div>' +
    '<button type="button" class="hidden" id="nextQuestionButton">Continue</button>';
  el.eventPanel.querySelector('h3').textContent = event.title;
  el.eventPanel.querySelector('.event-header span').textContent = 'Name: ' + GAME_STATE.player.name;
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
    button.textContent = String.fromCharCode(65 + saved.order.indexOf(index)) + '. ' + question.options[index];
    button.addEventListener('click', () => {
      if (saved.selected !== null) return;
      finishTypewriter();
      saved.selected = index;
      const correct = index === question.answer;
      if (correct) soundEngine.success(); else soundEngine.fail();
      const droppedOut = applyStatEffects(correct ? {skill: 10} : {grades: -5});
      saveProgress();
      if (!droppedOut) showFeedback();
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
  el.eventPanel.innerHTML = '<div class="event-header"><h3></h3><span></span></div>' +
    '<div class="event-description"></div><div class="choice-list"></div>' +
    '<div id="choiceEffects" class="hidden" role="status"></div>' +
    '<button id="nextChoiceButton" type="button" class="hidden">Continue</button>';
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
    button.textContent = choice.label;
    button.addEventListener('click', () => {
      if (saved.selected !== null) return;
      finishTypewriter();
      saved.selected = index;
      soundEngine.click();
      const droppedOut = applyStatEffects(choice.effects);
      saveProgress();
      if (!droppedOut) showResult();
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
    <div class="boss-panel">
      <div class="boss-header">
        <h3>${boss.title}</h3>
        <span>Round ${state.currentRound + 1}/${state.totalRounds}</span>
      </div>
      <div class="boss-bar"><div class="boss-bar-fill" style="width:${state.bossHealth}%"></div></div>
      <div class="time-bar"><div class="time-bar-fill" style="width:${state.timeLeft / state.maxTime * 100}%"></div></div>
      <div class="logic-card">
        <strong>${round.question}</strong>
        <div class="logic-grid">
          ${Object.entries(round.inputs).map(([label, value]) => `<div><span>${label} = ${value ? '1' : '0'}</span></div>`).join('')}
        </div>
      </div>
      <div class="choice-list">
        ${round.options.map((option) => `
          <button class="action-button logic-answer" type="button" data-option="${option}">${option}</button>
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
  campusScene.cancel();
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
  const sceneCharacter = GAME_STATE.player.gender || 'boy';
  const paragraph = ending.text.replace(/\{\{name\}\}/g, GAME_STATE.player.name);

  const markup = `
    <h2>${ending.title}</h2>
    <div class="ending-paragraph">${paragraph}</div>
    <canvas class="pixel-scene" id="endingSpriteCanvas" width="144" height="204" role="img" aria-label="Your graduating character"></canvas>
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
  renderCharacterSprite(document.getElementById('endingSpriteCanvas'), sceneCharacter, 4, ending.title.includes('Dropout') || ending.title.includes('Defended') || ending.title.includes('Burned'));
  setScreen('ending');

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
    campusScene.cancel();
    campusScene.npcEntrance = 1;
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

// Separate reading and actions so the choices do not disappear below a tall scene.
function arrangeEventPanel() {
  if (!el.eventPanel.querySelector('.choice-list, .skill-options')) return;
  const reading=document.createElement('div');reading.className='dialog-reading';
  const actions=document.createElement('div');actions.className='dialog-actions';
  [...el.eventPanel.children].forEach(node=>{
    if(node.matches('.event-header, .event-description, .question-text'))reading.appendChild(node);
    else actions.appendChild(node);
  });
  el.eventPanel.appendChild(reading);el.eventPanel.appendChild(actions);
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
  finishTypewriter();
  el.eventDialog.classList.add('hidden');
}
function openEventDialog() {
  const item = buildTimeline()[GAME_STATE.eventIndex - 1];
  const speaker = item?.type === 'boss' ? 'System' : item?.event.type === 'skill' ? 'Instructor' : GAME_STATE.player.name;
  document.getElementById('dialogSpeaker').textContent = speaker;
  el.eventDialog.classList.remove('hidden');
  el.eventPanel.classList.toggle('exam-sheet', item?.event?.type === 'skill');
  el.eventPanel.classList.toggle('terminal-event', item?.type === 'boss' && item.bossId !== 'logicGateMidterm');
  arrangeEventPanel();
  document.getElementById('sceneStatus').textContent = item?.type === 'boss' ? 'Challenge in progress' : 'Make your choice';
  typeDialogText(el.eventPanel.querySelector('.event-description'));
  el.eventDialog.focus({preventScroll: true});
}

// Three tile layers plus the fastest ground layer. Offsets wrap at their tile periods.
class CampusScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.viewport = document.getElementById('sceneViewport');
    this.scene = {room:'courtyard', npcs:[]};
    this.npcEntrance = 0;
    this.sceneTime = 0;
    this.width = 320;
    this.scale = 1;
    this.distance = 0;
    this.clock = 0;
    this.walkClock = 0;
    this.speed = 0;
    this.mode = 'idle';
    this.elapsed = 0;
    this.onArrival = null;
    this.lastTime = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('visibilitychange', () => { this.lastTime = null; });
    requestAnimationFrame(time => this.frame(time));
  }
  resize() {
    const available = this.viewport.clientWidth || 960;
    this.scale = Math.max(1, Math.min(3, Math.floor(available / 220)));
    const heightBudget = window.innerWidth >= 900 ? Math.max(144, window.innerHeight - 250) : Math.min(180, window.innerHeight * 0.23);
    this.scale = Math.max(1, Math.min(this.scale, Math.floor(heightBudget / 144)));
    this.width = Math.max(1, Math.floor(available / this.scale));
    this.canvas.width = this.width * this.scale;
    this.canvas.height = 144 * this.scale;
    this.canvas.style.width = this.canvas.width + 'px';
    this.canvas.style.height = this.canvas.height + 'px';
    this.draw();
  }
  travel(onArrival) {
    this.onArrival = onArrival;
    this.elapsed = 0;
    this.speed = 0;
    this.mode = 'walking';
    document.getElementById('sceneStatus').textContent = 'Walking to the next event…';
  }
  cancel() {
    this.mode = 'idle';
    this.speed = 0;
    this.onArrival = null;
  }
  update(dt) {
    this.clock += dt;
    this.sceneTime += dt;
    if (this.mode === 'walking') {
      this.elapsed += dt;
      this.speed = Math.min(1, this.elapsed / 0.4);
      if (this.elapsed >= (spriteMotion.matches ? 0.1 : 2.4)) {
        this.mode = 'stopping';
        this.elapsed = 0;
      }
    } else if (this.mode === 'stopping') {
      this.elapsed += dt;
      this.speed = Math.max(0, 1 - this.elapsed / 0.65);
      if (this.speed === 0 || spriteMotion.matches) {
        this.mode = 'entering';
        this.speed = 0;
        this.npcEntrance = spriteMotion.matches ? 1 : 0;
        this.sceneTime = 0;
      }
    }
    if (this.mode === 'entering') {
      this.npcEntrance = Math.min(1, this.npcEntrance + dt / 0.75);
      if (this.npcEntrance >= 1) {
        this.mode = 'idle';
        const callback = this.onArrival;
        this.onArrival = null;
        if (callback) callback();
      }
    }
    if (!spriteMotion.matches) {
      this.distance = (this.distance + dt * this.speed * 40) % 122880;
      this.walkClock += dt * this.speed;
    }
  }
  frame(time) {
    const dt = this.lastTime === null ? 0 : Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    if (!document.hidden && GAME_STATE.screen === 'game') {
      this.update(dt);
      this.draw();
    }
    requestAnimationFrame(next => this.frame(next));
  }
  repeat(period, ratio, draw) {
    const offset = Math.floor(this.distance * ratio) % period;
    for (let x = -period - offset; x < this.width + period; x += period) draw(x);
  }
  draw() {
    const ctx = this.ctx;
    const theme = CAMPUS_THEMES[GAME_STATE.player.year] || CAMPUS_THEMES[1];
    ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = theme.sky;
    ctx.fillRect(0, 0, this.width, 144);
    ctx.fillStyle = theme.horizon;
    ctx.fillRect(0, 70, this.width, 50);
    if (this.scene.room !== 'courtyard') {
      this.drawRoom();
      this.drawCast();
      return;
    }
    // Layer 1: sky/clouds. Stars and a moon replace the sun at night.
    this.repeat(256, 0.125, x => {
      if (GAME_STATE.player.year === 4) {
        [[20, 16], [89, 33], [152, 12], [221, 47]].forEach(([sx, sy]) =>
          drawPixelGrid(ctx, CAMPUS_TILES.star, theme, x + sx, sy));
      }
      drawPixelGrid(ctx, CAMPUS_TILES.cloud, theme, x + 38, 25, 2);
      drawPixelGrid(ctx, CAMPUS_TILES.cloud, theme, x + 183, 52, 1);
    });
    ctx.fillStyle = theme.W;
    ctx.fillRect(this.width - 48, 16, 16, 16);
    ctx.fillRect(this.width - 50, 20, 20, 8);
    if (GAME_STATE.player.year === 4) {
      ctx.fillStyle = theme.sky;
      ctx.fillRect(this.width - 42, 14, 14, 15);
    }
    // Layer 2: school blocks with a clock, tiled windows and entrances.
    this.repeat(240, 0.25, x => {
      drawPixelGrid(ctx, CAMPUS_TILES.school, theme, x + 15, 62, 2);
      drawPixelGrid(ctx, CAMPUS_TILES.school, theme, x + 132, 50, 2);
    });
    ctx.fillStyle = theme.grass;
    ctx.fillRect(0, 108, this.width, 16);
    // Layer 3: fence and trees, faster than the distant buildings.
    this.repeat(32, 0.5, x => drawPixelGrid(ctx, CAMPUS_TILES.fence, theme, x, 105, 2));
    this.repeat(160, 0.5, x => drawPixelGrid(ctx, CAMPUS_TILES.tree, theme, x + 5, 69, 3));
    // Ground repeats at a matching pixel boundary; no seams or interpolated edges.
    this.repeat(32, 1, x => drawPixelGrid(ctx, CAMPUS_TILES.path, theme, x, 124, 2));
    this.repeat(192, 0.5, x => {
      drawProp(ctx, 'bench', x + 64, 107, 2);
      drawProp(ctx, 'flowers', x + 14, 116, 2);
      drawProp(ctx, 'bin', x + 106, 105, 2);
      drawProp(ctx, 'lamp', x + 144, 87, 3);
    });
    if (this.scene.banner) {
      ctx.fillStyle = '#f6d0a4'; ctx.fillRect(12, 40, 92, 16);
      ctx.fillStyle = '#66506b'; ctx.font = 'bold 8px monospace'; ctx.fillText(this.scene.banner, 23, 51);
    }
    this.drawCast();
  }
  configure(item) {
    this.scene = getEventScene(item);
    this.npcEntrance = 0;
    this.sceneTime = 0;
    document.getElementById('sceneYearLabel').textContent = ({courtyard:'Campus courtyard', classroom:'Classroom', lab:'Computer lab', nightDesk:'Late-night study desk', panel:'Defense room'})[this.scene.room];
  }
  drawRoom() {
    const ctx = this.ctx;
    const night = this.scene.room === 'nightDesk';
    ctx.fillStyle = night ? '#615978' : '#eddfc9'; ctx.fillRect(0,0,this.width,144);
    ctx.fillStyle = night ? '#4c485f' : '#b9cabb'; ctx.fillRect(0,82,this.width,30);
    ctx.fillStyle = '#be947d';ctx.fillRect(0,112,this.width,32);
    ctx.fillStyle = '#a77b69';
    for(let y=115;y<144;y+=9) {ctx.fillRect(0,y,this.width,1);for(let x=(y%2)*16;x<this.width;x+=32)ctx.fillRect(x,y,1,9);}
    // Window, sill, a classroom board, bookshelves and a wall clock.
    ctx.fillStyle='#9c7a6a';ctx.fillRect(14,18,54,47);
    ctx.fillStyle=night?'#2e3557':CAMPUS_THEMES[GAME_STATE.player.year].sky;ctx.fillRect(17,21,48,40);
    ctx.fillStyle='#f5e9cc';ctx.fillRect(39,21,3,40);ctx.fillRect(17,39,48,3);ctx.fillRect(11,64,60,4);
    drawProp(ctx,'clock',this.width-28,14,2);
    ctx.fillStyle='#b98f86';ctx.fillRect(this.width-66,36,24,27);
    ctx.fillStyle='#f4d7a5';ctx.fillRect(this.width-64,38,20,23);
    ctx.fillStyle='#84ac9d';ctx.fillRect(this.width-61,42,14,3);ctx.fillRect(this.width-61,48,10,2);
    drawProp(ctx,'plant',12,94,2);
    drawProp(ctx,'shelf',this.width-34,84,2);
    if(this.scene.room==='classroom'||this.scene.room==='panel') {
      drawProp(ctx,'board',Math.floor(this.width/2)-32,24,2);
      drawProp(ctx,'desk',30,98,2);drawProp(ctx,'chair',34,92,2);
      drawProp(ctx,'desk',this.width-84,98,2);drawProp(ctx,'chair',this.width-80,91,2);
      drawProp(ctx,'shelf',80,62,2);
      drawProp(ctx,'plant',this.width-65,81,2);
    } else {
      const deskX=Math.floor(this.width/2)-60;
      drawProp(ctx,'desk',deskX,102,3);
      drawProp(ctx,'computer',deskX+5,76,3);
      drawProp(ctx,'coffee',deskX+38,94,1);
      drawProp(ctx,'shelf',76,54,2);
      if(this.scene.prop==='router')drawProp(ctx,'router',deskX+41,92,2);
      if(this.scene.prop==='note')drawProp(ctx,'note',deskX+31,78,1);
    }
  }
  drawCast() {
    const ctx=this.ctx;
    const group=this.scene.npcs || [];
    const playerX=group.length>=3 ? 16 : Math.floor(this.width/2)-48;
    const walking=this.speed>0.05&&!spriteMotion.matches;
    const frame=spriteMotion.matches?0:walking?Math.floor(this.walkClock*7)%4:Math.floor(this.clock/0.55)%2;
    drawScenePlayer(ctx,GAME_STATE.player.gender,GAME_STATE.player.year,playerX,61,walking,frame);
    if(this.mode==='idle'||this.mode==='entering') {
      group.forEach((id,index)=>{
        const scale=2;
        const target=group.length>=3 ? 62+index*Math.min(50,Math.floor((this.width-110)/Math.max(1,group.length-1))) : Math.min(this.width-54,playerX+64);
        const x=Math.round(target+(this.width-target)*(1-this.npcEntrance));
        ctx.save();
        if(this.scene.ghost&&this.mode==='idle')ctx.globalAlpha=Math.max(0,1-this.sceneTime/2.5);
        drawNPC(ctx,this.scene.ghost&&this.sceneTime>0.8?'ghost':id,x,scale===1?94:61,scale,Math.floor(this.clock*5)%4,this.mode==='entering');
        ctx.restore();
      });
      if(this.scene.room==='panel') {
        ctx.fillStyle='#bd8a74';ctx.fillRect(70,115,Math.min(138,this.width-78),9);
        ctx.fillStyle='#7e6165';ctx.fillRect(76,124,5,10);ctx.fillRect(Math.min(195,this.width-14),124,5,10);
      }
      if(this.scene.prop==='wifi')drawProp(ctx,'wifi',playerX+12,43,2);
      if(this.scene.prop==='sweat')drawProp(ctx,'sweat',Math.min(this.width-15,playerX+91),61,1);
      if(this.scene.exam && GAME_STATE.activeQuestion?.selected !== null && GAME_STATE.activeQuestion?.selected !== undefined) {
        drawProp(ctx,'heart',Math.min(this.width-24,playerX+79),43,2);
      }
    }
    this.canvas.setAttribute('aria-label',this.scene.room+': '+GAME_STATE.player.name+(walking?' walking':' with '+group.map(id=>NPC_SPRITES[id].label).join(', ')));
  }
}

const campusScene = new CampusScene(el.sceneCanvas);

setupEvents();
showStartScreen();
