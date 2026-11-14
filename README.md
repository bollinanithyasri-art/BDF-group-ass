# 📚 PageTurn Library API

## Group Details
- **Group Number:** 2
- **Section:** AIDE2A
- **Project Name:** PageTurn Library
- **Project Type:** Book Lending Management System
Learning Group - 02
  Bollina Nithya Sri - 5028
  Duriseti Varshini - 5040
  Kakumani Charitha - 5062
  Dadi Hemkesh - 5034
  Illendula Manish - 5054
  
## 1. Project Description

PageTurn Library is a Book Lending Management System developed using Node.js, Express.js and SQLite.

This project helps manage readers, books and book lending records through REST API endpoints.

## 2. Technologies Used

- Node.js
- Express.js
- SQLite Database
- JavaScript
- Postman
- GitHub

## 3. Project Features

- Manage reader details.
- Add new books.
- View all books and individual book details.
- Update book information.
- Delete books.
- Search books by genre using query parameters.
- Manage book loan records.
- Display loan details with reader names and book names using SQL JOIN.
- Validate book details during insertion and updating.
- Restrict book genres to allowed values.

## 4. Database Tables

The project uses SQLite with three related tables:

1. **Readers** – Stores reader ID, name and email.
2. **Books** – Stores book ID, book name and genre.
3. **Loans** – Stores loan ID, reader ID, book ID, loan date and return date.

Foreign keys are used to establish relationships between the tables.

## 5. Allowed Book Genres

Only the following genres are accepted:

- Fiction
- Science
- History

If any other genre is entered, the API returns HTTP 400 Bad Request with a message listing the allowed genres.

## 6. API Endpoints

### Books API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get a book by ID |
| POST | `/books` | Add a new book |
| PUT | `/books/:id` | Update book details |
| DELETE | `/books/:id` | Delete a book |

### Readers API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/readers` | Get all readers |
| GET | `/readers/:id` | Get a reader by ID |
| POST | `/readers` | Add a new reader |

### Loans API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/loans` | Get loan details with reader and book names using JOIN |
| POST | `/loans` | Create a new loan |
| PUT | `/loans/:id/return` | Record a book return |

## 7. Search Books by Genre

Books can be searched using a query parameter.

**Example:**

`GET /books?genre=Science`

This returns books belonging to the Science genre.

## 8. HTTP Status Codes

- **200 OK** – Request completed successfully.
- **201 Created** – New record created successfully.
- **400 Bad Request** – Invalid input or genre.
- **404 Not Found** – Requested record does not exist.
- **409 Conflict** – Conflict while creating or deleting a record.
- **500 Internal Server Error** – Server-side error.

## 9. Installation and Execution

### Step 1: Clone the repository

```bash
git clone https://github.com/bollinanithyasri-art/BDF-group-ass.git
```

### Step 2: Open the project folder

```bash
cd BDF-group-ass
```

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Start the server

```bash
node server.js
```

### Step 5: Open the API

`http://localhost:3000`

The server runs on port 3000.

The SQLite database and required tables are initialized when the application starts.

## 10. API Testing

All API endpoints are tested using Postman.

Testing includes:
- GET, POST, PUT and DELETE operations.
- Reader and loan creation.
- SQL JOIN operation.
- Genre search.
- Invalid genre validation.
- HTTP status code verification.

Postman testing screenshots are available in the `screenshots` folder.

## 11. GitHub Repository

**Repository Link:**

https://github.com/bollinanithyasri-art/BDF-group-ass

## 12. Conclusion

The PageTurn Library API project demonstrates the implementation of REST APIs using Express.js and SQLite. It provides book, reader and loan management functionalities, database relationships, search operations and input validation. This project helped us understand backend development and API testing.
