Build a browser game called "IT: The Four Year Game", a life-sim about
surviving four years as an IT student. It is inspired by the web game
"Life is a Game": a stat-based life simulation where the player makes
choices each year, faces random events, and gets an ending based on how
they did. Use that game as a reference for the feel (choose a name and
a character, choose-your-path events, stat bars, multiple endings), but
make all content original and about IT school life. It is for a System
Administration class, so it must show real IT and sysadmin knowledge.
Other students will play it, so keep everything about "your capstone"
generic (do not name any specific project).

STACK (strict)
- Plain HTML, CSS, vanilla JavaScript. No frameworks, no build step, no
  npm. It must run by opening index.html.
- Pixel art look: canvas or CSS, image-rendering: pixelated, Google font
  "Press Start 2P". Draw sprites in code as color arrays (no external
  image files).
- 8-bit sound effects with the Web Audio API. Include a mute button.
- localStorage for saving progress and the list of questions already
  seen.
- Must be deployable on GitHub Pages as static files.

FILE STRUCTURE
- index.html
- style.css
- /js/main.js (game loop, screens, state)
- /js/events.js (story events and endings as data, not hardcoded)
- /js/questions.js (the skill question pools)
- /js/terminal.js (reusable fake terminal engine)
- /js/bosses.js (the bosses)
- /js/sprites.js (pixel sprite data)
- /js/scenery.js (pixel drawing toolkit, tiny font, emotes, cat, time-of-day palettes)
- /js/settings.js (the places: campus, classroom, lab, server room, dorm, cafe, defense room)
- /js/scene.js (wide animated scene engine, plus the title, character and ending stages)
- /js/audio.js

START SCREEN AND CHARACTER
- Title screen, then a character screen where the player:
  1. Types a name (max 12 characters, default "Student").
  2. Chooses a character: Boy or Girl, with a pixel preview of each.
- Make two sprite sets (boy and girl), each with 4 looks: freshman,
  sophomore, junior, senior. The sprite changes at the start of each
  year. The year 4 bosses can show a tired version of the sprite.
- Use the player's name in events, boss dialogue, and endings. Write
  story text so it works for both characters (avoid he/she).

GAME FLOW
Year 1 -> 5 events -> boss. Year 2 -> 5 events -> boss. Year 3 -> 5
events -> boss. Summer interlude (1 event). Year 4 -> 5 events -> mini
boss -> final boss. Then an ending based on stats.

STATS (0-100): Grades (G), Sanity (S), Money (M), Friends (F), Skill (K).
Start all at 50. Clamp between 0 and 100. If Sanity or Grades hits 0 at
any point, trigger a dropout ending.

EVENT TYPES
- Choice events: a short situation with 2-3 choices that change stats.
- Skill events: a multiple choice question (4 options) picked from a
  question pool (see SKILL QUESTION POOLS). Pass gives a Skill boost,
  fail gives a penalty. Show the correct answer and a one-line
  explanation after answering.
Show the year, stat bars, the player's name, and the pixel character on
screen at all times. Tone: funny, relatable to IT students (group
projects, last-minute coding, boarding house wifi, panel defense).

EVENTS (put these in events.js; effects are stat changes)

YEAR 1
1. Choice: The wifi dies the night before a programming activity.
   - Go to a cafe: M-10, G+5
   - Use mobile data: M-5, S-5
   - Skip it: G-10, S+5
2. Choice: A groupmate asks to "just see" your code.
   - Send it: F+10, K-5
   - Explain it instead: K+8, S-5
   - Refuse: F-10, G+3
3. Choice: CAST Day, the department's yearly event, has a programming
   contest and a keyboarding contest. Join or skip? (Year 1 only. No
   actual contest is played, only a result message.)
   - Join: F+10, M-5, S-5
   - Skip: S+5, F-5
4. Skill: pool Y1-A (number systems). Pass K+10, fail G-5.
5. Skill: pool Y1-B (basic programming and logic bugs). Pass K+10,
   fail G-5.
BOSS 1, "Logic Gate Midterm": timed rounds. Show a logic circuit or
truth table (AND, OR, NOT, XOR, NAND) and the player picks the correct
output. Randomize the circuits each run. Boss health bar drops for each
correct answer; wrong answers cost time. Win: K+10, G+5. Lose: G-10,
S-10.

YEAR 2
1. Choice: A groupmate disappears two days before the deadline.
   - Finish it yourself: G+8, S-15
   - Call them out in the group chat: F-10, S+5
   - Split their part among the others: F+5, S-5
2. Choice: A freelance web job pays well but clashes with finals week.
   - Take it: M+20, G-10
   - Decline: G+5, M-5
3. Choice: It is 2 AM and the project is due at 8.
   - Pull an all-nighter: G+8, S-15
   - Sleep and submit what you have: S+10, G-5
4. Skill: pool Y2-A (SQL and databases). Pass K+10, fail G-5.
5. Skill: pool Y2-B (data structures and algorithms). Pass K+10,
   fail G-5.
BOSS 2, "Database Down": terminal boss (see TERMINAL ENGINE). Scenario:
the students table was wiped. Player runs SHOW TABLES; finds
backup_students, checks it with SELECT * FROM backup_students;, then
restores with INSERT INTO students SELECT * FROM backup_students;.
Win: K+10, G+5. Lose: G-10, S-10.

YEAR 3 (focus: web systems, Laravel, networking)
1. Choice: Your Laravel project works on your laptop but breaks on the
   hosting site the night before submission.
   - Debug until morning: K+8, S-15
   - Ask a classmate who is good at it: F+5, K+3
   - Submit the local demo only: G-5, S+5
2. Choice: In a networking lab, your configuration will not connect and
   a groupmate says just copy the other group's setup.
   - Copy it: G+3, K-8
   - Troubleshoot it yourself: K+8, S-8
   - Ask the instructor: K+5, G+2
3. Choice: You find a classmate's password on a sticky note in the lab.
   - Tell them: F+5, K+3
   - Ignore it: S-5
4. Skill: pool Y3-A (networking). Pass K+10, fail G-5.
5. Skill: pool Y3-B (web development and Laravel). Pass K+10, fail G-5.
BOSS 3, "Server Down": Linux terminal boss. Scenario: the website is
down. Files: /var/log/nginx/error.log shows "permission denied" on
/var/www/html/index.html. Player should: ping the server (works),
systemctl status nginx (failed), tail /var/log/nginx/error.log, chmod
644 /var/www/html/index.html, systemctl restart nginx. Win: K+10, G+5.
Lose: G-10, S-10.

SUMMER INTERLUDE (one event, between Year 3 and Year 4)
- Choice: Capstone group formation. The proposal is also finished this
  summer (no feedback scene, just a short "proposal approved" message).
  - Pick your close friends: F+10, K-5
  - Pick the best coders: K+10, F-5

YEAR 4 (capstone, Information Assurance & Security, System
Administration and Maintenance. Panels are kind, the proposal is done.)
1. Choice: The pre-oral defense is next week and the system still has
   bugs.
   - Spend the week fixing bugs: K+8, S-10
   - Practice presenting: G+8, K-3
   - Split the tasks with your team: F+5, S-5
2. Choice: A classmate offers to share the IAS exam answers.
   - Accept: G+5, K-8
   - Decline: K+3, F-3
   - Report it: K+5, F-8
3. Choice: The client wants a feature that conflicts with what the
   panel asked for.
   - Follow the client: F+5, G-5
   - Follow the panel: G+8, F-5
   - Ask both to meet in the middle: K+8, S-8
4. Skill: pool Y4-A (Information Assurance and Security). Pass K+10,
   fail G-5.
5. Skill: pool Y4-B (System Administration and Linux). Pass K+10,
   fail G-5.
MINI BOSS 4A, "Client Server Down": fake RDP/SSH login screen, then a
terminal. Scenario: the client's server is not responding because the
disk is full. Player runs df -h (shows 100% on /var), ls -lh /var/log
(shows a huge old.log), rm /var/log/old.log, then systemctl restart
app. Win: K+10, S+5. Lose: G-10, S-10.
FINAL BOSS 4B, "The Night Before Defense": the player's capstone breaks
the night before the final defense. Terminal boss with a "panel
arrives" timer bar. Four bugs, one after another, each showing a
realistic error screen:
  a. 500 error, missing app key -> php artisan key:generate
  b. "Table not found" -> php artisan migrate
  c. "Vite manifest not found" -> npm run build
  d. Old settings still loading -> php artisan config:clear
Hint appears after 2 wrong commands. Win: G+15, K+10. Lose: G-15, S-15.

SKILL QUESTION POOLS (questions.js)
- There are 8 skill slots, one pool each, with AT LEAST 10 different
  questions per pool (80 or more in total):
  Y1-A number systems (binary, decimal, hex, octal conversions)
  Y1-B basic programming and logic bugs (loops, variables, conditions,
       off-by-one errors)
  Y2-A SQL and databases (SELECT, WHERE, JOIN, keys, normalization)
  Y2-B data structures and algorithms (stack, queue, arrays, sorting,
       searching)
  Y3-A networking (IP addresses, subnets, ports, protocols, DNS, DHCP)
  Y3-B web development and Laravel (routes, MVC, Blade, Eloquent,
       artisan, migrations)
  Y4-A Information Assurance and Security (CIA triad, hashing,
       encryption, phishing, SQL injection, access control)
  Y4-B System Administration and Linux (commands, permissions,
       processes, services, disk and logs)
- Keep these starter questions inside their pools:
  Y1-A: What is 1101 in decimal? (13)
  Y1-B: A loop "for (i = 0; i <= 5; i++)" goes through an array of
        size 5. What is wrong? (off-by-one error)
  Y2-A: Which query returns all students with a grade above 90?
        (SELECT * FROM students WHERE grade > 90;)
  Y2-B: Which data structure fits an "undo" feature? (stack)
  Y3-A: How many usable hosts are in a /24 network? (254)
  Y3-B: In Laravel, which file defines your web routes?
        (routes/web.php)
  Y4-A: A system stores passwords as plain text. What should it do
        instead? (hash them, e.g. bcrypt)
  Y4-B: Which Linux command shows disk space usage in a readable
        format? (df -h)
- Question format: { id, question, options: [4 strings], answer: index,
  explanation: one short line }.
- Difficulty: easy to medium, answerable by an IT student who studied.
  Wrong options must be plausible, not silly. Every answer must be
  factually correct. Double-check them.
- Each time a skill event runs, pick a random question from its pool
  that has NOT been seen in this run. Also save seen question ids in
  localStorage, and prefer questions not seen in previous runs. When
  the pool is used up, reset it. Shuffle the order of the options each
  time.
- Mix of question styles: concept questions, "what does this command or
  code do", and "what is wrong here" questions.

ENDINGS (check in this order, first match wins)
1. Dropout: Sanity or Grades hit 0 at any point.
2. "Defended Without a Demo": lost the final boss.
3. "Honor Student, No Social Life": Grades 80+ and Friends under 30.
4. "Burned Out but Employed": Skill 80+ and Sanity under 30.
5. "Group Project Hero": Friends 80+ and Grades 60+.
6. "Rich Freelancer": Money 80+.
7. "Barely Graduated": everything else.
Each ending has a title, a short funny paragraph using the player's
name, and a pixel scene with the chosen character. Show final stats and
a "Play Again" button (go back to the character screen).

TERMINAL ENGINE (terminal.js)
- Fake filesystem as a JS object, command parser, command history with
  up/down arrows, and a "help" command.
- Each boss defines its own scenario: files, logs, and the win
  condition. Only support commands needed for the scenario. Unknown
  commands show a realistic error ("command not found").
- Database boss accepts SQL typed in the same terminal.

USE THE ATTACHED LESSONS FILE
- Read it first. Base the question pools on the actual topics in it,
  grouped by year where possible. Fill any gaps with standard,
  accurate IT knowledge.
- Do not change the stat effects or the event order.
- At the end, give me a list of which lesson topics went into which
  pool, so I can check them.

WORKING RULES
- Keep code simple and commented so a student can read and edit it.
- Build in this order and stop after each step so I can test:
  1. Start screen, character select, engine, stats, screen layout, and
     the Year 1 events
  2. Question pools, all events, the summer interlude, and endings
  3. Terminal engine and Boss 3 (Server Down)
  4. Remaining bosses (1, 2, 4A, 4B)
  5. Sprites for both characters, sound, and polish
- Do not add features beyond this spec without asking.

VISUAL POLISH (added after the first build; story text, effects and questions are untouched)
- Still plain HTML, CSS, vanilla JavaScript and canvas. No new tools or libraries.
  Extra Google fonts: "Pixelify Sans" (story text) and "VT323" (terminal look).
- The game scene is a wide canvas (96 logical pixels tall, scaled by whole numbers) with the HUD on top
  of it. The dialog sits below it, and the page must never need scrolling to reach the options.
- Walking: parallax layers on the campus; rooms slide past with a door frame between places.
- Every event has a place (EVENT_SCENES and BOSS_SCENES in events.js): campus, classroom, lab,
  server room, dorm, cafe or defense room, plus a dialog theme:
  social (cream box), paper (exams, lined sheet) or terminal (code and sysadmin, with ">").
- Title screen: two students and a cat walk through the four school years (outfit and time of day change).
- Character screen: live preview, boy/girl cards, and the four looks.
- Ending screen: your student at sunset with weather or confetti that matches the ending.
- Number keys 1-4 (or A-D on exam questions) pick the matching option.
