# Book Collection API

## Description

The Book Collection API is a Node.js and Express-based application designed to manage a collection of books, allowing users to perform CRUD operations on books and manage user accounts. It's built with Node.js, Express, and uses Sequelize with a PostgreSQL database.

## Features

- User Registration and Authentication
- CRUD operations for books

## Installation

1. Clone the repository: `git clone https://github.com/Shakbr/book-collection.git`
2. Change directory: `cd book-collection`
3. Install dependencies: `npm install`
4. Configure environment variables: Copy `.env.example` to `.env` and fill in your details.
   - Example `.env`:
     ```
     NODE_ENV=development
     PORT=3000
     DB_TYPE=postgres
     DB_HOST=localhost
     DB_PORT=5432
     DB_USERNAME=your_username
     DB_PASSWORD=your_password
     DB_DATABASE=your_database
     JWT_SECRET=your_secret_key
     ```
5. Set up your database:

- Open Docker and run `docker-compose up` to start the PostgreSQL container, or add `-d` flag to run it in background.

6. Run the application: `npm start`

## API Endpoints

### User Endpoints

- `POST /api/users/register`: Register a new user.
- `POST /api/users/login`: Authenticate a user.

### Book Endpoints

- `GET /api/books`: Retrieve all books.
- `POST /api/books`: Add a new book.
- `GET /api/books/{id}`: Get a book by ID.
- `PUT /api/books/{id}`: Update a book's details.
- `DELETE /api/books/{id}`: Delete a book.

## Running Tests

To run the test suite, execute:

```bash
npm test
```

## Using the Postman Collection

I've included a Postman collection in this repository to help you easily test the API endpoints.

### Initial Setup

Before testing the Book API endpoints, it's essential to set up user data in the database. You can do this in two ways:

1. **Using the Seeder Script**:

   - Run the seeder script provided in the repository to populate the database with initial data.
   - Use the command `npm run seed` to execute the seeder script. This script requires the `ts-node` and `dotenv` packages to run.

2. **Manual User Registration**:
   - If you choose not to use the seeder script or need additional users, you can manually register new users through the API.
   - Use the `Register` endpoint from User collection to create new users. After registering, you can use these user accounts to test the Book API endpoints.

Ensure you follow either of these steps to have active user accounts, which are necessary for accessing the Book API functionalities.

### Steps to Use the Collection:

1. **Import the Collection**: Download the Postman collection JSON file from the `/docs` directory in this repository. In Postman, import the collection by selecting 'Import' and selecting the downloaded file.

2. **Set up Authorization**:

   - For the Book collection, you require authorization, because these endpoints are secured by JWT token. Only required actions here is to set `jwt_secret` to match the one in your project's `.env`. The `jwt_secret` variable is in Collection's Variables.
   - In the Authorization tab, ensure the JWT payload uses the above variables. The `id` field in the payload should match the user ID obtained upon registration.
     - Example for an admin user:
       ```json
       {
           "user": {
               "id": "1",  // Adjust based on the actual user ID
               "name": {{admin_user_name}},
               "email": {{admin_user_email}},
               "role": {{admin_user_role}}
           }
       }
       ```
     - Modify the payload similarly for a regular user, using the regular user variables.

3. **Test the Endpoints**: With the collection and environment set up, you can now test the various API endpoints.

Remember to adjust the user ID in the JWT payload based on the actual user ID obtained during registration or from your database.

## Contributing

Guidelines for contributing to the project.
