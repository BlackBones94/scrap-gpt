const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('content.db');

db.serialize(() => {
  db.each("SELECT content FROM articles", (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return;
    }
    console.log('Content from database:', row.content);
  });
});

db.close();
