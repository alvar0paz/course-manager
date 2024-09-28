# Course Manager

A simple web app to manage course information.

## Quick Start

### Using Docker

1. Install Docker and Docker Compose.
2. Clone this repo.
3. In the project root, run:

   ```
   docker-compose up
   ```

4. Open http://localhost:3000 in your browser.

### Using Yarn (Local Setup)

1. Install Node.js and Yarn:

   - Install Node.js:
     - On macOS with Homebrew: `brew install node`
     - On Windows or other systems: Download from [Node.js official website](https://nodejs.org/)
   - Install Yarn:
     - On macOS with Homebrew: `brew install yarn`
     - On Windows or other systems: Follow instructions on [Yarn's official website](https://classic.yarnpkg.com/en/docs/install)

2. Install MongoDB:

   - On macOS with Homebrew:
     ```
     brew tap mongodb/brew
     brew install mongodb-community
     brew services start mongodb-community
     ```
   - For other systems, check [MongoDB's official documentation](https://docs.mongodb.com/manual/installation/).

3. Clone this repo.

4. In the project root, run:

   ```
   cd backend
   yarn install
   yarn dev
   ```

5. Open a new terminal, then run:

   ```
   cd frontend
   yarn install
   yarn start
   ```

6. Open http://localhost:3000 in your browser.

## Running Tests

### Backend Tests

To run the backend tests using Jest and Supertest:

1. Ensure MongoDB is Running:

   - If you installed MongoDB locally, start the MongoDB server:
     - On macOS with Homebrew:
       ```
       brew services start mongodb-community
       ```
     - On other systems, refer to your operating system's instructions for starting MongoDB.

2. Navigate to the Backend Directory:

   ```
   cd backend
   ```

3. Install Dependencies (if not already done):

   ```
   yarn install
   ```

4. Run the Tests:
   ```
   yarn test
   ```

This command executes the test suite located in `backend/src/tests/courses.test.js`. The tests cover:

- Adding courses
- Retrieving courses
- Deleting courses
- Searching courses
- Input validation and edge cases

Note: The test script uses the `--runInBand` flag to run tests sequentially, ensuring that database operations do not interfere with each other.

## Features

- Add, delete, and search courses
- Stores data in MongoDB
- Simple, responsive UI

## Tech Stack

- Backend: Node.js, Express, MongoDB
- Frontend: React, styled-components
