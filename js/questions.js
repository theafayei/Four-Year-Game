// questions.js
// Skill question pools. Each pool has 10 questions.
// Add more questions to any pool anytime. The game picks randomly.
// answer = index of the correct option (0 to 3). The game shuffles options.

const q = (id, question, options, answer, explanation) => ({
  id, question, options, answer, explanation
});

const QUESTION_POOLS = {

  // ---------- YEAR 1 ----------
  "Y1-A": [ // Number systems
    q("Y1A-01", "What is 1101 in decimal?", ["11", "12", "13", "15"], 2, "8 + 4 + 0 + 1 = 13."),
    q("Y1A-02", "What is the decimal number 10 in binary?", ["1001", "1010", "1100", "1110"], 1, "8 + 2 = 10, so it is 1010."),
    q("Y1A-03", "Which number system uses only 0 and 1?", ["Octal", "Decimal", "Binary", "Hexadecimal"], 2, "Binary is base 2."),
    q("Y1A-04", "What is hexadecimal F in decimal?", ["10", "14", "15", "16"], 2, "Hex counts 0-9, then A-F. A is 10, so F is 15."),
    q("Y1A-05", "How many bits are in one byte?", ["4", "8", "16", "32"], 1, "1 byte = 8 bits."),
    q("Y1A-06", "What is binary 1000 in decimal?", ["4", "6", "8", "10"], 2, "Only the 8s place is on, so it is 8."),
    q("Y1A-07", "What is the decimal number 5 in binary?", ["100", "101", "110", "111"], 1, "4 + 1 = 5, so it is 101."),
    q("Y1A-08", "Which number system has a base of 8?", ["Binary", "Decimal", "Hexadecimal", "Octal"], 3, "Octal uses the digits 0 to 7."),
    q("Y1A-09", "What is hexadecimal A in decimal?", ["9", "10", "11", "12"], 1, "A = 10, B = 11, up to F = 15."),
    q("Y1A-10", "What is binary 111 in decimal?", ["5", "6", "7", "8"], 2, "4 + 2 + 1 = 7.")
  ],

  "Y1-B": [ // Basic programming and logic
    q("Y1B-01", "A loop uses for (i = 0; i <= 5; i++) on an array with 5 items. What is wrong?", ["The loop goes one step too far", "The array is empty", "i should be text", "A semicolon is missing"], 0, "An array of 5 has indexes 0 to 4. i <= 5 goes past the end. Use i < 5."),
    q("Y1B-02", "What is a loop used for?", ["Storing a file", "Drawing a picture", "Repeating code", "Closing a program"], 2, "Loops repeat code until a condition is no longer true."),
    q("Y1B-03", "What is a variable?", ["A type of error", "A named place that stores a value", "A kind of loop", "A web page"], 1, "A variable holds a value that can change."),
    q("Y1B-04", "Which symbol compares two values for equality in most languages?", ["=", "=>", "&&", "=="], 3, "= assigns a value. == compares two values."),
    q("Y1B-05", "What is x after this code? x = 5; x = x + 2;", ["5", "7", "52", "2"], 1, "x starts at 5, then 2 is added, so x is 7."),
    q("Y1B-06", "What does an if statement do?", ["Repeats code forever", "Deletes a variable", "Runs code only when a condition is true", "Saves a file"], 2, "An if statement makes a decision."),
    q("Y1B-07", "What happens with while (true) { print('hi'); } and no break?", ["It prints hi once", "It prints hi forever", "It gives a syntax error", "It prints nothing"], 1, "The condition is always true, so the loop never stops."),
    q("Y1B-08", "In most programming languages, what is the index of the first item in an array?", ["1", "-1", "2", "0"], 3, "Arrays start counting at 0."),
    q("Y1B-09", "Your program runs, but the answer is wrong. What kind of error is this?", ["Syntax error", "Logic error", "Hardware error", "Network error"], 1, "A logic error means the code runs but does the wrong thing."),
    q("Y1B-10", "What is a function?", ["A type of loop only", "A way to color text", "A reusable block of code that does one task", "A kind of file"], 2, "Functions let you write code once and use it many times.")
  ],

  // ---------- YEAR 2 ----------
  "Y2-A": [ // SQL and databases
    q("Y2A-01", "Which query returns all students with a grade above 90?", ["GET * FROM students IF grade > 90;", "SELECT students WHERE grade > 90;", "SELECT * FROM students WHERE grade > 90;", "FIND ALL students grade > 90;"], 2, "SELECT picks the columns, FROM picks the table, WHERE filters rows."),
    q("Y2A-02", "Which SQL command adds a new row to a table?", ["INSERT INTO", "ADD ROW", "UPDATE", "CREATE ROW"], 0, "INSERT INTO adds new data."),
    q("Y2A-03", "What does DELETE FROM students WHERE id = 5; do?", ["Deletes the whole table", "Shows student 5", "Deletes the student with id 5", "Updates student 5"], 2, "The WHERE clause limits it to one row."),
    q("Y2A-04", "What is a primary key?", ["A password for the database", "A column that uniquely identifies each row", "The first column in any table", "A backup of the table"], 1, "No two rows can have the same primary key."),
    q("Y2A-05", "What does UPDATE students SET grade = 95 WHERE id = 1; do?", ["Adds a new student", "Deletes student 1", "Changes the grade of student 1 to 95", "Shows all grades"], 2, "UPDATE changes existing data."),
    q("Y2A-06", "Which clause sorts the results of a query?", ["SORT BY", "GROUP BY", "ARRANGE", "ORDER BY"], 3, "ORDER BY sorts the results, for example ORDER BY grade DESC."),
    q("Y2A-07", "Which function counts the number of rows?", ["SUM()", "COUNT()", "TOTAL()", "LENGTH()"], 1, "COUNT(*) returns how many rows match."),
    q("Y2A-08", "What is a foreign key?", ["A column that links to the primary key of another table", "A key written in another language", "A copy of the primary key in the same table", "A key that is always empty"], 0, "Foreign keys connect related tables."),
    q("Y2A-09", "What does a JOIN do?", ["Deletes duplicate rows", "Combines rows from two tables using a related column", "Renames a table", "Backs up the database"], 1, "For example, joining students and courses by student id."),
    q("Y2A-10", "What does DROP TABLE students; do?", ["Deletes one row", "Hides the table", "Renames the table", "Deletes the entire table and its data"], 3, "DROP TABLE removes the table completely. Be careful.")
  ],

  "Y2-B": [ // Data structures and algorithms
    q("Y2B-01", "Which data structure fits an undo feature?", ["Stack", "Queue", "Tree", "Graph"], 0, "Undo takes back the most recent action first (last in, first out)."),
    q("Y2B-02", "Which structure works first in, first out (FIFO)?", ["Stack", "Array", "Queue", "Tree"], 2, "Like a line of people: the first person in line is served first."),
    q("Y2B-03", "What does LIFO mean?", ["Last In, First Out", "Left In, Fast Out", "List In, File Out", "Last Item, First Order"], 0, "A stack is LIFO."),
    q("Y2B-04", "What is an array?", ["A list of items accessed by index", "A type of loop", "A kind of network", "A database"], 0, "Arrays store items in order, and you get them by position."),
    q("Y2B-05", "Binary search only works if the data is what?", ["Random", "Sorted", "Text only", "Unique"], 1, "Binary search cuts the list in half each step, so the list must be in order."),
    q("Y2B-06", "Which of these is a sorting algorithm?", ["Linked list", "Stack", "Pointer", "Bubble sort"], 3, "Bubble sort swaps neighbors until the list is in order."),
    q("Y2B-07", "How does linear search find an item?", ["Checks items one by one", "Cuts the list in half", "Sorts the list first", "Guesses randomly"], 0, "It starts at the beginning and checks each item."),
    q("Y2B-08", "Which structure stores key-value pairs for fast lookup?", ["Stack", "Queue", "Hash table", "Array"], 2, "A hash table finds a value quickly using its key."),
    q("Y2B-09", "In a tree, what is the top node called?", ["Leaf", "Root", "Branch", "Head"], 1, "The root is the first node. Nodes with no children are leaves."),
    q("Y2B-10", "Which is faster for finding an item in a sorted list of 1,000,000 items?", ["Linear search", "Bubble sort", "They are the same", "Binary search"], 3, "Binary search needs only about 20 steps for a million items.")
  ],

  // ---------- YEAR 3 ----------
  "Y3-A": [ // Networking
    q("Y3A-01", "How many usable hosts are in a /24 network?", ["24", "128", "254", "256"], 2, "256 addresses minus the network and broadcast addresses = 254."),
    q("Y3A-02", "Which service translates domain names into IP addresses?", ["DHCP", "DNS", "FTP", "HTTP"], 1, "DNS is like the phone book of the internet."),
    q("Y3A-03", "What does DHCP do?", ["Encrypts traffic", "Blocks websites", "Automatically assigns IP addresses", "Stores web pages"], 2, "DHCP gives devices an IP address when they join the network."),
    q("Y3A-04", "Which port does HTTP use by default?", ["21", "22", "80", "443"], 2, "HTTP uses port 80. HTTPS uses 443."),
    q("Y3A-05", "Which port does HTTPS use by default?", ["80", "443", "25", "53"], 1, "HTTPS is the secure version of HTTP and uses port 443."),
    q("Y3A-06", "Which device connects different networks and forwards packets between them?", ["Hub", "Repeater", "Switch", "Router"], 3, "Routers send data between networks, like your home network and the internet."),
    q("Y3A-07", "What kind of address is 192.168.1.1?", ["Public IPv4", "Private IPv4", "IPv6", "MAC address"], 1, "192.168.x.x is a private range used inside local networks."),
    q("Y3A-08", "What is the ping command used for?", ["Checking if another device is reachable", "Deleting a file", "Encrypting traffic", "Showing disk space"], 0, "Ping sends a small test message and waits for a reply."),
    q("Y3A-09", "What does a MAC address identify?", ["A website", "A user's password", "A network card (hardware)", "A Wi-Fi name"], 2, "Every network interface has a unique MAC address."),
    q("Y3A-10", "How many bits are in an IPv4 address?", ["16", "32", "64", "128"], 1, "IPv4 has 32 bits, shown as four numbers like 192.168.1.1.")
  ],

  "Y3-B": [ // Web development and Laravel
    q("Y3B-01", "In Laravel, which file defines your web routes?", ["app/web.php", "config/routes.php", "public/routes.php", "routes/web.php"], 3, "routes/web.php holds the routes for web pages."),
    q("Y3B-02", "Which command runs your Laravel database migrations?", ["php artisan migrate", "php migrate run", "composer migrate", "npm run migrate"], 0, "php artisan migrate creates or updates the tables."),
    q("Y3B-03", "What does MVC stand for?", ["Multi View Code", "Model View Controller", "Main Virtual Class", "Module Version Control"], 1, "MVC splits an app into data (Model), screens (View), and logic (Controller)."),
    q("Y3B-04", "What is Blade in Laravel?", ["A database", "A testing tool", "A templating engine for views", "A web server"], 2, "Blade files end in .blade.php and make pages with PHP and HTML."),
    q("Y3B-05", "What is Eloquent in Laravel?", ["An ORM for working with the database", "A CSS framework", "A web server", "A login page"], 0, "Eloquent lets you use PHP models instead of writing raw SQL."),
    q("Y3B-06", "Which Laravel file stores database credentials and app settings?", ["index.php", ".env", "web.php", "package.json"], 1, "The .env file holds settings like DB_HOST and APP_KEY."),
    q("Y3B-07", "Which tool installs PHP packages for Laravel?", ["npm", "pip", "Composer", "apt"], 2, "Composer manages PHP dependencies."),
    q("Y3B-08", "Which language controls how a web page looks (colors, layout)?", ["HTML", "CSS", "SQL", "PHP"], 1, "HTML is the structure and CSS is the style."),
    q("Y3B-09", "Which command creates a controller in Laravel?", ["php artisan new controller", "php make controller", "php artisan make:controller StudentController", "composer controller"], 2, "Artisan has make: commands for controllers, models, and more."),
    q("Y3B-10", "Which HTTP method is normally used to submit a form with new data?", ["GET", "POST", "HEAD", "TRACE"], 1, "GET asks for data. POST sends data to the server.")
  ],

  // ---------- YEAR 4 ----------
  "Y4-A": [ // Information Assurance and Security
    q("Y4A-01", "A system stores passwords as plain text. What should it do instead?", ["Hash them (for example, bcrypt)", "Store them in a text file", "Email them to users", "Write them in uppercase"], 0, "Hashing makes stored passwords unreadable if the database leaks."),
    q("Y4A-02", "What does the CIA triad stand for?", ["Control, Identity, Access", "Confidentiality, Integrity, Availability", "Cyber, Internet, Analysis", "Copy, Insert, Archive"], 1, "These are the three main goals of information security."),
    q("Y4A-03", "What is phishing?", ["A virus that deletes files", "A way to speed up a network", "A backup method", "Fake messages that trick people into giving up information"], 3, "Phishing often uses fake emails or sites that look real."),
    q("Y4A-04", "Which is the strongest password?", ["123456", "qwerty", "Tr33!Bus_Ride#88", "iloveyou"], 2, "Long passwords with mixed letters, numbers, and symbols are harder to guess."),
    q("Y4A-05", "What is two-factor authentication (2FA)?", ["Using two passwords that are the same", "A second proof of identity besides your password", "Logging in on two devices", "Having two accounts"], 1, "For example, a code sent to your phone."),
    q("Y4A-06", "What is SQL injection?", ["A way to speed up queries", "A database backup tool", "Typing malicious SQL into an input field to attack a database", "A type of join"], 2, "Prepared statements and input validation help prevent it."),
    q("Y4A-07", "What does encryption do?", ["Makes data unreadable without the key", "Deletes old data", "Makes a network faster", "Compresses files"], 0, "Only people with the right key can read the data."),
    q("Y4A-08", "What does a firewall do?", ["Stores passwords", "Filters network traffic based on rules", "Speeds up the internet", "Backs up files"], 1, "A firewall allows or blocks traffic."),
    q("Y4A-09", "What does the principle of least privilege mean?", ["Everyone gets admin access", "Users only get the access they need", "Only one user is allowed", "Passwords never expire"], 1, "Less access means less damage if an account is compromised."),
    q("Y4A-10", "Which of these is an example of malware?", ["Firewall", "VPN", "Antivirus", "Ransomware"], 3, "Ransomware locks your files and demands payment.")
  ],

  "Y4-B": [ // System Administration and Linux
    q("Y4B-01", "Which Linux command shows disk space usage in a readable format?", ["df -h", "ls -h", "du -a", "disk show"], 0, "df -h shows size, used, and free space in KB, MB, and GB."),
    q("Y4B-02", "Which command lists the files in a folder?", ["cd", "ls", "cat", "rm"], 1, "ls lists files. ls -a also shows hidden files."),
    q("Y4B-03", "Which command shows your current directory?", ["ls", "whoami", "pwd", "cat"], 2, "pwd means print working directory."),
    q("Y4B-04", "Which command changes file permissions?", ["chown", "chmod", "ls", "passwd"], 1, "For example, chmod 644 file.txt."),
    q("Y4B-05", "What does sudo do?", ["Deletes a file", "Shows running processes", "Runs a command with admin (superuser) rights", "Restarts the computer"], 2, "sudo means superuser do."),
    q("Y4B-06", "What does systemctl restart nginx do?", ["Restarts the nginx service", "Installs nginx", "Deletes nginx", "Shows the nginx logs"], 0, "systemctl manages services."),
    q("Y4B-07", "What does tail -n 20 server.log show?", ["The first 20 lines", "The last 20 lines", "20 random lines", "The file size"], 1, "tail shows the end of a file. It is great for reading the newest log entries."),
    q("Y4B-08", "Which command displays the contents of a text file?", ["cp", "mv", "mkdir", "cat"], 3, "cat prints the file in the terminal."),
    q("Y4B-09", "Which command searches for text inside files?", ["find", "grep", "ls", "top"], 1, "For example, grep error server.log shows lines containing the word error."),
    q("Y4B-10", "Which command shows running processes and CPU usage live?", ["top", "ping", "cd", "mkdir"], 0, "top updates in real time, like the Task Manager.")
  ]
};
