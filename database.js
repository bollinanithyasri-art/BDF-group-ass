
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./library.db', (err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Database connected successfully');
    }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create three related tables
db.serialize(() => {

    // Readers table
    db.run(`
        CREATE TABLE IF NOT EXISTS readers (
            reader_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        )
    `);

    // Books table
    db.run(`
        CREATE TABLE IF NOT EXISTS books (
            book_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            genre TEXT NOT NULL
                CHECK (genre IN ('Fiction', 'Science', 'History'))
        )
    `);

    // Loans table
    db.run(`
        CREATE TABLE IF NOT EXISTS loans (
            loan_id INTEGER PRIMARY KEY AUTOINCREMENT,
            reader_id INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            loan_date TEXT NOT NULL,
            return_date TEXT,
            FOREIGN KEY (reader_id) REFERENCES readers(reader_id),
            FOREIGN KEY (book_id) REFERENCES books(book_id)
        )
    `);

    console.log('Database tables created successfully');
});

// Export database
module.exports = db;
