const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('content.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS articles (content TEXT)");

  const stmt = db.prepare("INSERT INTO articles VALUES (?)");
  const content = fs.readFileSync('content.txt', 'utf-8');
  stmt.run(content);
  stmt.finalize();
});

db.close();
console.log('Database initialized with scraped content.');
