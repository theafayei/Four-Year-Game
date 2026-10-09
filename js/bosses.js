const LOGIC_GATES = [
  { name: 'AND', fn: (a, b) => a && b },
  { name: 'OR', fn: (a, b) => a || b },
  { name: 'NOT', fn: (a) => !a },
  { name: 'XOR', fn: (a, b) => (a && !b) || (!a && b) },
  { name: 'NAND', fn: (a, b) => !(a && b) }
];

function generateLogicRound() {
  const gate = LOGIC_GATES[Math.floor(Math.random() * LOGIC_GATES.length)];
  const a = Math.random() > 0.5;
  const b = Math.random() > 0.5;
  let answer;
  if (gate.name === 'NOT') {
    answer = gate.fn(a);
    return {
      gate: gate.name,
      inputs: { A: a },
      options: [
        '0',
        '1',
        'A',
        'B'
      ],
      answer: answer ? '1' : '0',
      question: 'What is NOT A when A = ' + (a ? '1' : '0') + '?'
    };
  }

  answer = gate.fn(a, b) ? '1' : '0';
  const outputText = answer === '1' ? '1' : '0';
  return {
    gate: gate.name,
    inputs: { A: a, B: b },
    options: ['0', '1', 'A', 'B'],
    answer: outputText,
    question: 'What is the output of ' + gate.name + ' when A = ' + (a ? '1' : '0') + ' and B = ' + (b ? '1' : '0') + '?'
  };
}

const BOSS_SCENARIOS = {
  "databaseDown": {
    "id": "databaseDown",
    "title": "Database Down",
    "type": "terminal",
    "situation": "Someone ran a bad DELETE. The students table is empty. A backup may still be available.",
    "goal": "Restore the 120 students and check that they are back.",
    "success": {
      "skill": 10,
      "grades": 5
    },
    "failure": {
      "grades": -10,
      "sanity": -10
    },
    "steps": [
      {
        "command": "SHOW TABLES;",
        "meaning": "List the tables",
        "output": "students\nbackup_students",
        "clue": "Check how many rows remain in students."
      },
      {
        "command": "SELECT COUNT(*) FROM students;",
        "meaning": "Count student rows",
        "output": "0",
        "clue": "students is empty. Count the backup rows next."
      },
      {
        "command": "SELECT COUNT(*) FROM backup_students;",
        "meaning": "Count backup rows",
        "output": "120",
        "clue": "A backup exists with 120 rows. Copy them into students."
      },
      {
        "command": "INSERT INTO students SELECT * FROM backup_students;",
        "meaning": "Restore the backup",
        "output": "120 rows inserted",
        "clue": "Check the students count again to verify your restore."
      },
      {
        "command": "SELECT COUNT(*) FROM students;",
        "meaning": "Verify the restore",
        "output": "120",
        "clue": "All 120 students are back."
      }
    ]
  },
  "serverDown": {
    "id": "serverDown",
    "title": "Server Down",
    "type": "terminal",
    "situation": "The school website is not loading. nginx (say “engine-x”) is the program that serves its web pages. Follow the clues to get it running.",
    "goal": "Find the blocked file, make it readable, and restart the website.",
    "success": {
      "skill": 10,
      "grades": 5
    },
    "failure": {
      "grades": -10,
      "sanity": -10
    },
    "steps": [
      {
        "command": "ping 192.168.1.10",
        "meaning": "Check the server connection",
        "output": "Reply from 192.168.1.10: time=1ms. Connection OK.",
        "clue": "The network is fine, so the problem is the web service. Check nginx."
      },
      {
        "command": "systemctl status nginx",
        "meaning": "Check the website service",
        "output": "nginx.service — Active: failed",
        "clue": "Check the error log to see why the service failed."
      },
      {
        "command": "tail /var/log/nginx/error.log",
        "meaning": "Read the latest error",
        "output": "open() /var/www/html/index.html failed (13: Permission denied)",
        "clue": "A permissions problem. List the web folder to see who can read the file."
      },
      {
        "command": "ls -l /var/www/html",
        "meaning": "Inspect file permissions",
        "output": "-rw------- root root index.html",
        "clue": "Only root can read this file. chmod 644 lets the web service read it too."
      },
      {
        "command": "chmod 644 /var/www/html/index.html",
        "meaning": "Allow the page to be read",
        "output": "Permissions changed: -rw-r--r-- index.html",
        "clue": "The file is readable. Restart nginx to bring the site back."
      },
      {
        "command": "systemctl restart nginx",
        "meaning": "Restart the website service",
        "output": "nginx.service — active (running)",
        "clue": "The school website is online again."
      }
    ]
  },
  "clientServerDown": {
    "id": "clientServerDown",
    "title": "Client Server Down",
    "type": "terminal",
    "login": true,
    "situation": "The client’s app has stopped responding. Connect using the sticky-note password, then look for a storage problem.",
    "goal": "Free disk space and restart the app.",
    "success": {
      "skill": 10,
      "sanity": 5
    },
    "failure": {
      "grades": -10,
      "sanity": -10
    },
    "steps": [
      {
        "command": "df -h",
        "meaning": "Check available disk space",
        "output": "Filesystem    Size  Used  Avail  Use%\n/var           20G   20G     0G  100%",
        "clue": "Disk is full on /var. Look in /var/log for a huge file."
      },
      {
        "command": "ls -lh /var/log",
        "meaning": "List log file sizes",
        "output": "old.log   18G\napp.log   12K",
        "clue": "This huge old log is filling the disk. Remove old.log."
      },
      {
        "command": "rm /var/log/old.log",
        "meaning": "Remove the old log",
        "output": "Removed old.log. 18G freed. /var is now 10% used.",
        "clue": "There is space again. Restart the app."
      },
      {
        "command": "systemctl restart app",
        "meaning": "Restart the app",
        "output": "app.service — active (running)",
        "clue": "The client app is working again."
      }
    ]
  },
  "finalDefense": {
    "id": "finalDefense",
    "title": "The Night Before Defense",
    "type": "terminal",
    "browser": true,
    "situation": "Defense is in 30 minutes. You opened your capstone on the defense laptop and it does not work. Fix every error, then reload the page.",
    "goal": "Fix four errors, in order, until the capstone page opens.",
    "success": {
      "grades": 15,
      "skill": 10
    },
    "failure": {
      "grades": -15,
      "sanity": -15
    },
    "steps": [
      {
        "command": "php artisan key:generate",
        "meaning": "Generate the Laravel app key",
        "output": "Application key set successfully.",
        "clue": "Laravel needs an APP_KEY in your .env file."
      },
      {
        "command": "php artisan migrate",
        "meaning": "Create the database tables",
        "output": "create_users_table ........ DONE\ncreate_sessions_table .... DONE",
        "clue": "The database has no tables yet. Create them with a migration."
      },
      {
        "command": "npm run build",
        "meaning": "Build the frontend files",
        "output": "vite: building for production...\nbuilt in 4.2s",
        "clue": "The frontend files were not built."
      },
      {
        "command": "php artisan config:clear",
        "meaning": "Clear old cached settings",
        "output": "Configuration cache cleared successfully.",
        "clue": "Laravel is using old cached settings."
      }
    ],
    "errors": [
      "No application encryption key has been specified.",
      "SQLSTATE[42S02]: Base table or view not found: 1146 Table 'capstone.users' doesn't exist",
      "Vite manifest not found at: public/build/manifest.json",
      "Server Error 500"
    ],
    "clues": [
      "Laravel needs an APP_KEY in your .env file.",
      "The database has no tables yet. Create them with a migration.",
      "The frontend files were not built.",
      "APP_DEBUG=true in .env but the page still behaves like production. Laravel is using old cached settings."
    ]
  }
};
BOSS_SCENARIOS.logicGateMidterm = {
  id:'logicGateMidterm',title:'Logic Gate Midterm',type:'logic',
  intro:'Choose the output of each logic gate.',totalRounds:4,maxTime:18,generateRound:generateLogicRound
};
function normalizeCommand(raw) {
  return String(raw || '').trim().replace(/;+$/, '').replace(/\s+/g, ' ').toLowerCase();
}
function getBossScenario(key) { return BOSS_SCENARIOS[key] || null; }
