const YEAR_EVENTS = {
  1: [
    {
      id: 'y1-1',
      type: 'choice',
      title: 'Wifi Woes',
      description: 'The wifi dies the night before a programming activity. {{name}} has to decide how to work around it.',
      choices: [
        { label: 'Go to a cafe', effects: { money: -10, grades: 5 } },
        { label: 'Use mobile data', effects: { money: -5, sanity: -5 } },
        { label: 'Skip it', effects: { grades: -10, sanity: 5 } }
      ]
    },
    {
      id: 'y1-2',
      type: 'choice',
      title: 'Group Project Drama',
      description: 'A groupmate asks to "just see" your code. The solution is easy, but so is the temptation to help too much.',
      choices: [
        { label: 'Send it', effects: { friends: 10, skill: -5 } },
        { label: 'Explain it instead', effects: { skill: 8, sanity: -5 } },
        { label: 'Refuse', effects: { friends: -10, grades: 3 } }
      ]
    },
    {
      id: 'y1-3',
      type: 'choice',
      title: 'CAST Day',
      description: 'The department is hosting CAST Day. There is a programming contest and a keyboarding contest. Should {{name}} join or save energy?',
      choices: [
        { label: 'Join', effects: { friends: 10, money: -5, sanity: -5 } },
        { label: 'Skip', effects: { sanity: 5, friends: -5 } }
      ]
    },
    {
      id: 'y1-4',
      type: 'skill',
      title: 'Skill Check: Number Systems',
      description: 'The basics come back at the worst hour. Quick conversion and logic check time.',
      pool: 'Y1-A'
    },
    {
      id: 'y1-5',
      type: 'skill',
      title: 'Skill Check: Programming Logic',
      description: 'A small debugging challenge appears. You can either test the theory or just guess and hope.',
      pool: 'Y1-B'
    }
  ],
  2: [
    {
      id: 'y2-1',
      type: 'choice',
      title: 'Missing Groupmate',
      description: 'A groupmate disappears two days before the deadline. The workload falls on {{name}}.',
      choices: [
        { label: 'Finish it yourself', effects: { grades: 8, sanity: -15 } },
        { label: 'Call them out in the group chat', effects: { friends: -10, sanity: 5 } },
        { label: 'Split their part among the others', effects: { friends: 5, sanity: -5 } }
      ]
    },
    {
      id: 'y2-2',
      type: 'choice',
      title: 'Freelance Gig',
      description: 'A freelance web job pays well but clashes with finals week. This one can help the budget or wreck the GPA.',
      choices: [
        { label: 'Take it', effects: { money: 20, grades: -10 } },
        { label: 'Decline', effects: { grades: 5, money: -5 } }
      ]
    },
    {
      id: 'y2-3',
      type: 'choice',
      title: '2 AM Panic',
      description: 'It is 2 AM and the project is due at 8. The coffee is strong, but sleep is stronger.',
      choices: [
        { label: 'Pull an all-nighter', effects: { grades: 8, sanity: -15 } },
        { label: 'Sleep and submit what you have', effects: { sanity: 10, grades: -5 } }
      ]
    },
    {
      id: 'y2-4',
      type: 'skill',
      title: 'Skill Check: SQL',
      description: 'A quick database quiz appears. It feels like a trap, but it is just basic SQL.',
      pool: 'Y2-A'
    },
    {
      id: 'y2-5',
      type: 'skill',
      title: 'Skill Check: Data Structures',
      description: 'The professor asks a data structures question in the middle of lunch. A correct answer is worth a lot of points.',
      pool: 'Y2-B'
    }
  ],
  3: [
    {
      id: 'y3-1',
      type: 'choice',
      title: 'Deployment Disaster',
      description: 'The Laravel project works on the laptop but breaks on the hosting site the night before submission.',
      choices: [
        { label: 'Debug until morning', effects: { skill: 8, sanity: -15 } },
        { label: 'Ask a classmate who is good at it', effects: { friends: 5, skill: 3 } },
        { label: 'Submit the local demo only', effects: { grades: -5, sanity: 5 } }
      ]
    },
    {
      id: 'y3-2',
      type: 'choice',
      title: 'Networking Lab',
      description: 'The configuration will not connect, and a groupmate says to just copy the other team’s setup.',
      choices: [
        { label: 'Copy it', effects: { grades: 3, skill: -8 } },
        { label: 'Troubleshoot it yourself', effects: { skill: 8, sanity: -8 } },
        { label: 'Ask the instructor', effects: { skill: 5, grades: 2 } }
      ]
    },
    {
      id: 'y3-3',
      type: 'choice',
      title: 'Sticky Note Problem',
      description: 'A classmate finds a password on a sticky note in the lab. It is an easy temptation.',
      choices: [
        { label: 'Tell them', effects: { friends: 5, skill: 3 } },
        { label: 'Ignore it', effects: { sanity: -5 } }
      ]
    },
    {
      id: 'y3-4',
      type: 'skill',
      title: 'Skill Check: Networking',
      description: 'A networking check flashes on the screen. It is all subnet masks, ports, and protocols.',
      pool: 'Y3-A'
    },
    {
      id: 'y3-5',
      type: 'skill',
      title: 'Skill Check: Laravel and Web',
      description: 'The professor asks about MVC, routes, and migrations right at the end of the lab.',
      pool: 'Y3-B'
    }
  ],
  summer: [
    {
      id: 'summer-1',
      type: 'choice',
      title: 'Capstone Group Formation',
      description: 'The proposal is approved and the summer starts with the capstone group formation. Your friends and your future success are both on the line.',
      choices: [
        { label: 'Pick your close friends', effects: { friends: 10, skill: -5 } },
        { label: 'Pick the best coders', effects: { skill: 10, friends: -5 } }
      ]
    }
  ],
  4: [
    {
      id: 'y4-1',
      type: 'choice',
      title: 'Pre-Oral Defense Week',
      description: 'The pre-oral defense is next week and the system still has bugs. The team needs direction.',
      choices: [
        { label: 'Spend the week fixing bugs', effects: { skill: 8, sanity: -10 } },
        { label: 'Practice presenting', effects: { grades: 8, skill: -3 } },
        { label: 'Split the tasks with your team', effects: { friends: 5, sanity: -5 } }
      ]
    },
    {
      id: 'y4-2',
      type: 'choice',
      title: 'IAS Exam Answer Leak',
      description: 'A classmate offers to share the IAS exam answers. This is a decision that could make an exam easier or a conscience much heavier.',
      choices: [
        { label: 'Accept', effects: { grades: 5, skill: -8 } },
        { label: 'Decline', effects: { skill: 3, friends: -3 } },
        { label: 'Report it', effects: { skill: 5, friends: -8 } }
      ]
    },
    {
      id: 'y4-3',
      type: 'choice',
      title: 'Client vs. Panel',
      description: 'The client wants a feature that conflicts with what the panel asked for. The compromise matters.',
      choices: [
        { label: 'Follow the client', effects: { friends: 5, grades: -5 } },
        { label: 'Follow the panel', effects: { grades: 8, friends: -5 } },
        { label: 'Ask both to meet in the middle', effects: { skill: 8, sanity: -8 } }
      ]
    },
    {
      id: 'y4-4',
      type: 'skill',
      title: 'Skill Check: Information Assurance',
      description: 'The finals include one very serious security quiz. It is all CIA, hashing, encryption, and safe practice.',
      pool: 'Y4-A'
    },
    {
      id: 'y4-5',
      type: 'skill',
      title: 'Skill Check: SysAdmin and Linux',
      description: 'Only the Linux and maintenance portion remains. This one can make or break a good semester.',
      pool: 'Y4-B'
    }
  ]
};

const ENDING_DATA = [
  {
    id: 'dropout',
    title: 'Dropout',
    check: (stats) => stats.grades <= 0 || stats.sanity <= 0,
    text: 'The system wins, the classes win, and {{name}} has to leave the program before the end of the semester. This is what happens when the coffee budget runs out and the stress never does.'
  },
  {
    id: 'lost-final-boss',
    title: 'Defended Without a Demo',
    check: (stats, result) => result && result.endingTrigger === 'final-boss-loss',
    text: 'The defense is over and the capstone is not. {{name}} arrives with a strong story, a shaky project, and a dramatic explanation of why the demo did not load. It is a heroic attempt, but the panel still sees the crash.'
  },
  {
    id: 'honor-student',
    title: 'Honor Student, No Social Life',
    check: (stats) => stats.grades >= 80 && stats.friends < 30,
    text: '{{name}} graduates with a solid GPA, a clean transcript, and a suspiciously empty social calendar. The proof is in the certificates and the five unopened notifications from friends.'
  },
  {
    id: 'burned-out-employed',
    title: 'Burned Out but Employed',
    check: (stats) => stats.skill >= 80 && stats.sanity < 30,
    text: 'The internship offers are rolling in, the sleep schedule is a myth, and {{name}} somehow lands a job. It is not sustainable, but it pays well enough to buy a new keyboard and a lot of energy drinks.'
  },
  {
    id: 'group-project-hero',
    title: 'Group Project Hero',
    check: (stats) => stats.friends >= 80 && stats.grades >= 60,
    text: '{{name}} is the one everyone wants to work with, the one who can keep the team alive during a crisis, and the one who also somehow makes deadlines. This is a local legend.'
  },
  {
    id: 'rich-freelancer',
    title: 'Rich Freelancer',
    check: (stats) => stats.money >= 80,
    text: 'By graduation, {{name}} has income, influence, and an impressive side hustle. The only problem is that the laptop is still over the limit and the coffee budget is infinite.'
  },
  {
    id: 'barely-graduated',
    title: 'Barely Graduated',
    check: () => true,
    text: 'The final paperwork is signed, the last bell rings, and {{name}} somehow makes it through the entire program. The degree is real, the stories are realer, and the only thing stronger than the skill is the memory of the panic.'
  }
];

function buildTimeline() {
  const timeline = [];
  const bosses = ['logicGateMidterm', 'databaseDown', 'serverDown'];
  for (let year = 1; year <= 3; year += 1) {
    YEAR_EVENTS[year].forEach(event => timeline.push({type: 'event', year, event}));
    timeline.push({type: 'boss', bossId: bosses[year - 1]});
  }
  YEAR_EVENTS.summer.forEach(event => timeline.push({type: 'event', year: 'summer', event}));
  YEAR_EVENTS[4].forEach(event => timeline.push({type: 'event', year: 4, event}));
  timeline.push({type: 'boss', bossId: 'clientServerDown'});
  timeline.push({type: 'boss', bossId: 'finalDefense'});
  return timeline;
}

function getEndingForStats(stats, result) {
  let chosen = ENDING_DATA.find((ending) => ending.check(stats, result));
  if (!chosen) {
    chosen = ENDING_DATA[ENDING_DATA.length - 1];
  }
  return chosen;
}

// Scene direction stays data-driven alongside the events.
const EVENT_SCENES = {
  'y1-1': {room:'courtyard', npcs:[], prop:'wifi'},
  'y1-2': {room:'courtyard', npcs:['studious']},
  'y1-3': {room:'courtyard', npcs:['officer'], banner:'CAST DAY'},
  'y2-1': {room:'courtyard', npcs:['clown'], ghost:true},
  'y2-2': {room:'courtyard', npcs:['client']},
  'y2-3': {room:'nightDesk', npcs:[]},
  'y3-1': {room:'nightDesk', npcs:[]},
  'y3-2': {room:'lab', npcs:['gamer'], prop:'router'},
  'y3-3': {room:'lab', npcs:['studious'], prop:'note'},
  'summer-1': {room:'courtyard', npcs:['studious','clown','gamer','officer']},
  'y4-1': {room:'panel', npcs:['panel1','panel2','panel3']},
  'y4-2': {room:'classroom', npcs:['gamer'], prop:'sweat'},
  'y4-3': {room:'panel', npcs:['client','panel1','panel2','panel3']}
};
function getEventScene(item) {
  if (item?.type === 'boss') return {room:item.bossId === 'logicGateMidterm' ? 'classroom' : 'lab', npcs:item.bossId === 'logicGateMidterm' ? ['teacher'] : [], terminal:item.bossId !== 'logicGateMidterm'};
  if (item?.event?.type === 'skill') return {room:'classroom', npcs:['teacher'], exam:true};
  return EVENT_SCENES[item?.event?.id] || {room:'courtyard', npcs:[]};
}
