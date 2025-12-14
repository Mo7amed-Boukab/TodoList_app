# To-Do List Application

A modern, responsive, and full-featured Kanban-style To-Do List application. This project features a robust backend built with Node.js/Express and MongoDB, and a dynamic frontend built with React and Tailwind CSS. It supports drag-and-drop task management, filtering, searching, and responsive design for all devices.

## Features

- **Kanban Board:** Organize tasks visually into "To Do", "In Progress", and "Completed" columns.
- **Drag & Drop:** Seamlessly reorder tasks and move them between columns using `@dnd-kit`.
- **Responsive Design:** Optimized for Mobile, Tablet, and Desktop, ensuring a smooth experience everywhere.
- **Task Management:** Create, Read, Update, and Delete (CRUD) tasks with ease.
- **Filtering & Search:** find tasks instantly using the search bar or filter by Priority and Status.
- **Rich Details:** Add descriptions, set priorities (Low, Medium, High, Urgent), and due dates for every task.
- **Authentication:** Secure User Registration and Login using JWT (JSON Web Tokens).

## Tech Stack

**Frontend:**

- React.js (Vite)
- Tailwind CSS (Styling)
- @dnd-kit (Drag-and-Drop)
- Lucide React (Icons)
- Axios (API Requests)

**Backend:**

- Node.js & Express.js
- MongoDB (Database) & Mongoose
- JWT (Authentication)
- Bcrypt (Password Hashing)

## Installation & Setup

### Option 1: Using Docker (Recommended)

This project is fully containerized. You can run the entire stack (Frontend, Backend, Database) with a single command.

**Prerequisites:**

- Docker Desktop installed and running.

**Steps:**

1.  **Clone the Repository**

    ```bash
    git clone <repository_url>
    cd TodoList_app
    ```

2.  **Run with Docker Compose**

    ```bash
    docker-compose up --build
    ```

    - The `--build` flag ensures that the images are built from scratch.
    - Wait for a few minutes for the containers to start and dependencies to install.

3.  **Access the Application**

    - **Frontend:** [http://localhost:5173](http://localhost:5173)
    - **Backend API:** [http://localhost:5000](http://localhost:5000)
    - **MongoDB:** Running on port `27017`

4.  **Stop the Application**
    Press `Ctrl + C` in the terminal or run:
    ```bash
    docker-compose down
    ```
    To stop and remove volumes (reset database):
    ```bash
    docker-compose down -v
    ```

### Option 2: Manual Installation (Local)

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB installed locally or a MongoDB Atlas URI

### 1. Clone the Repository

```bash
git clone <repository_url>
cd TodoList_Express
```

### 2. Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo_db
JWT_SECRET=your_super_secret_key_change_this
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Navigate to the frontend folder and install dependencies:

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

## Project Structure

```
TodoList_Express/
├── backend/                # Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers (Auth, Todo)
│   │   ├── models/         # Mongoose Schemas (User, Todo)
│   │   ├── routes/         # API Routes
│   │   ├── middleware/     # Auth middleware
│   │   └── utils/          # Helpers (Logger, DB Connection)
│   └── server.js           # Entry point
│
└── frontend/               # React Application
    ├── src/
    │   ├── components/
    │   │   ├── common/     # Reusable UI (Buttons, Card, Badge)
    │   │   ├── kanban/     # Board, Column, TaskCard
    │   │   ├── layout/     # Header, Layout wrappers
    │   │   └── modals/     # Add/Edit/Delete Modals
    │   ├── context/        # Auth Context
    │   ├── pages/          # Home, Login, Register
    │   ├── services/       # API Services (Auth, Todo)
    │   └── App.jsx         # Main Component
    └── index.css           # Global Styles & Tailwind Directives
```

## Usage

1.  **Register/Login:** Create an account to start managing your personal tasks.
2.  **Create Tasks:** Click "Add Task" to create a new item.
3.  **Manage:** Drag tasks to change their status or reorder them. Double-click a task to view details or edit.
4.  **Filter:** Use the filter dropdowns to view specific priorities or statuses.
5.  **Search:** Use the search bar to find tasks by title or description.

---

Developed with by Mohamed Boukab
