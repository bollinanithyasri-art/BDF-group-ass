
const express = require('express');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware to read JSON data
app.use(express.json());

// Allowed book genres
const allowedGenres = ['Fiction', 'Science', 'History'];

// Home route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to PageTurn Library API'
    });
});

// =====================================
// 1. READERS ROUTES
// =====================================

// Get all readers
app.get('/readers', (req, res) => {
    db.all('SELECT * FROM readers', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(200).json(rows);
    });
});

// Get one reader
app.get('/readers/:id', (req, res) => {
    const id = req.params.id;

    db.get(
        'SELECT * FROM readers WHERE reader_id = ?',
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!row) {
                return res.status(404).json({
                    message: 'Reader not found'
                });
            }

            res.status(200).json(row);
        }
    );
});

// Add a reader
app.post('/readers', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            error: 'Name and email are required'
        });
    }

    db.run(
        'INSERT INTO readers (name, email) VALUES (?, ?)',
        [name, email],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(409).json({
                        error: 'Email already exists'
                    });
                }

                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: 'Reader added successfully',
                reader_id: this.lastID
            });
        }
    );
});

// =====================================
// 2. BOOKS ROUTES
// =====================================

// Get all books and search by genre
app.get('/books', (req, res) => {
    const genre = req.query.genre;

    let sql = 'SELECT * FROM books';
    let params = [];

    if (genre) {
        // Validate genre before searching
        if (!allowedGenres.includes(genre)) {
            return res.status(400).json({
                error: 'Invalid genre. Allowed genres are: Fiction, Science, History'
            });
        }

        sql += ' WHERE genre = ?';
        params.push(genre);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(200).json(rows);
    });
});

// Get one book
app.get('/books/:id', (req, res) => {
    const id = req.params.id;

    db.get(
        'SELECT * FROM books WHERE book_id = ?',
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!row) {
                return res.status(404).json({
                    message: 'Book not found'
                });
            }

            res.status(200).json(row);
        }
    );
});

// Add a book
app.post('/books', (req, res) => {
    const { name, genre } = req.body;

    if (!name || !genre) {
        return res.status(400).json({
            error: 'Book name and genre are required'
        });
    }

    if (!allowedGenres.includes(genre)) {
        return res.status(400).json({
            error: 'Invalid genre. Allowed genres are: Fiction, Science, History'
        });
    }

    db.run(
        'INSERT INTO books (name, genre) VALUES (?, ?)',
        [name, genre],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: 'Book added successfully',
                book_id: this.lastID
            });
        }
    );
});

// Update a book
app.put('/books/:id', (req, res) => {
    const id = req.params.id;
    const { name, genre } = req.body;

    if (!name || !genre) {
        return res.status(400).json({
            error: 'Book name and genre are required'
        });
    }

    if (!allowedGenres.includes(genre)) {
        return res.status(400).json({
            error: 'Invalid genre. Allowed genres are: Fiction, Science, History'
        });
    }

    db.run(
        'UPDATE books SET name = ?, genre = ? WHERE book_id = ?',
        [name, genre, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: 'Book not found'
                });
            }

            res.status(200).json({
                message: 'Book updated successfully'
            });
        }
    );
});

// Delete a book
app.delete('/books/:id', (req, res) => {
    const id = req.params.id;

    db.run(
        'DELETE FROM books WHERE book_id = ?',
        [id],
        function (err) {
            if (err) {
                return res.status(409).json({
                    error: 'Cannot delete this book because it may have loan records'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: 'Book not found'
                });
            }

            res.status(200).json({
                message: 'Book deleted successfully'
            });
        }
    );
});

// =====================================
// 3. LOANS ROUTES
// =====================================

// Get all loans with reader name and book name
app.get('/loans', (req, res) => {
    const sql = `
        SELECT
            loans.loan_id,
            readers.name AS reader_name,
            books.name AS book_name,
            loans.loan_date,
            loans.return_date
        FROM loans
        JOIN readers ON loans.reader_id = readers.reader_id
        JOIN books ON loans.book_id = books.book_id
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(200).json(rows);
    });
});

// Add a loan
app.post('/loans', (req, res) => {
    const { reader_id, book_id, loan_date } = req.body;

    if (!reader_id || !book_id) {
        return res.status(400).json({
            error: 'Reader ID and Book ID are required'
        });
    }

    const date = loan_date || new Date().toISOString().split('T')[0];

    db.run(
        `INSERT INTO loans (reader_id, book_id, loan_date)
         VALUES (?, ?, ?)`,
        [reader_id, book_id, date],
        function (err) {
            if (err) {
                if (err.message.includes('FOREIGN KEY')) {
                    return res.status(400).json({
                        error: 'Reader ID or Book ID does not exist'
                    });
                }

                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: 'Loan created successfully',
                loan_id: this.lastID
            });
        }
    );
});

// Mark a loan as returned
app.put('/loans/:id/return', (req, res) => {
    const id = req.params.id;
    const returnDate = new Date().toISOString().split('T')[0];

    db.run(
        'UPDATE loans SET return_date = ? WHERE loan_id = ?',
        [returnDate, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: 'Loan not found'
                });
            }

            res.status(200).json({
                message: 'Book return recorded successfully',
                return_date: returnDate
            });
        }
    );
});

// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
