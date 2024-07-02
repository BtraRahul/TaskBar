
# TaskBar

## Overview

Welcome to the Project Management Tool! This application is designed to help users create, manage, and track their projects and tasks efficiently. Built with modern web technologies, it provides a user-friendly interface and robust functionality to streamline project management processes. Each user's data is securely separated and personalized through Clerk authentication.

## Features

- **User Authentication**: Secure login and registration using Clerk.
- **Project Management**: Create, update, delete, and view projects.
- **Task Management**: Add, update, delete, and track tasks within projects.
- **Deadline Tracking**: Set and manage deadlines for projects and tasks.
- **Progress Tracking**: Monitor the progress of tasks and projects.
- **User-specific Data**: Each user's projects and tasks are linked to their email address, ensuring personalized data management.

## Technologies Used

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces.
- **Axios**: A promise-based HTTP client for making API requests.
- **Clerk**: A user management and authentication solution.

### Backend
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: A web application framework for Node.js.
- **MongoDB**: A NoSQL database for storing project and task data.
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js.

### Additional Libraries
- **React Router**: For handling routing in the React application.
- **Dotenv**: For loading environment variables from a `.env` file.

## Project Structure

### Frontend
```
src/
├── components/
│   ├── Project.js
│   ├── ProjectForm.js
│   ├── Task.js
│   └── TaskForm.js
├── pages/
│   ├── Dashboard.js
│   ├── Login.js
│   └── Register.js
├── App.js
└── index.js
```

### Backend
```
server/
├── models/
│   └── Project.js
├── routes/
│   └── projects.js
├── controllers/
│   └── projectController.js
├── config/
│   └── db.js
├── server.js
└── .env
```

## Installation and Setup

### Prerequisites
- Node.js
- MongoDB

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/project-management-tool.git
   cd project-management-tool/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend` directory and add your environment variables:
   ```env
   REACT_APP_CLERK_FRONTEND_API=<your-clerk-frontend-api>
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd project-management-tool/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add your environment variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/project-management-tool
   CLERK_API_KEY=<your-clerk-api-key>
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

## Usage

1. Register or log in using the Clerk authentication system.
2. Create new projects and add tasks to each project.
3. Set deadlines and track the progress of tasks and projects.
4. Each user's projects and tasks are linked to their email address, ensuring data is user-specific.

## Contributions

Contributions are welcome! Please feel free to submit a pull request or open an issue to improve the project.
