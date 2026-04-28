# Employee Task Manager

A full-stack web application for managing employee tasks with real-time status updates, user authentication, and comprehensive task tracking. Built with modern technologies to deliver a smooth, responsive experience.

---

## Features

- **User Authentication** — Secure registration and login with JWT-based authentication
- **Task Management** — Create, read, update, and delete tasks with ease
- **Task Assignment** — Assign tasks to specific team members
- **Status Tracking** — Track task progress with three statuses: To Do, In Progress, Done
- **Priority Levels** — Categorize tasks by priority: Low, Medium, High
- **Filtering** — Filter tasks by status, priority, and due date
- **Dashboard** — View task summary with counts for each status
- **History Tracking** — Automatically track status changes with timestamps and users
- **Responsive UI** — Clean, modern interface that works on all devices

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Java 17, Spring Boot 3.x |
| Frontend | React 18, Vite, Axios |
| Database | MySQL 8.x |
| Authentication | JWT (JSON Web Token) |
| Build Tool | Maven |
| API Style | RESTful |

---

## Project Structure

```
employee-task-manager/
├── backend/
│   ├── src/main/java/com/taskmanager/
│   │   ├── controller/       # REST API Controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── exception/       # Global Exception Handling
│   │   ├── model/           # JPA Entities
│   │   ├── repository/     # Data Access Layer
│   │   ├── security/       # JWT & Security Config
│   │   └── service/        # Business Logic
│   ├── pom.xml
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── services/       # API Service Layer
│   │   ├── App.jsx        # Main App Component
│   │   ├── main.jsx       # Entry Point
│   │   └── index.css      # Global Styles
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Java 17** or higher
- **Maven** 3.x
- **Node.js** 18.x or higher
- **MySQL** 8.x

### Database Setup

Create a MySQL database (or let the app create it automatically):

```sql
CREATE DATABASE taskmanager_db;
```

Update `backend/src/main/resources/application.properties` with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanager_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
```

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start at `http://localhost:8080`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173` to start using the application.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Tasks (Protected - Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (with optional filters) |
| GET | `/api/tasks/{id}` | Get task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/{id}` | Update task details |
| PATCH | `/api/tasks/{id}/status` | Update only task status |
| DELETE | `/api/tasks/{id}` | Delete a task |
| GET | `/api/tasks/summary` | Get task count by status |

### Query Parameters

For `GET /api/tasks`:

| Parameter | Type | Description |
|-----------|------|-------------|
| status | String | Filter by status (TODO, IN_PROGRESS, DONE) |
| priority | String | Filter by priority (LOW, MEDIUM, HIGH) |
| dueDate | Date | Filter by due date (YYYY-MM-DD) |
| assignedTo | Long | Filter by assigned user ID |

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table

```sql
CREATE TABLE tasks (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status ENUM('TODO', 'IN_PROGRESS', 'DONE') DEFAULT 'TODO',
  priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
  due_date DATE,
  assigned_to BIGINT,
  created_by BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Task History Table

```sql
CREATE TABLE task_history (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  task_id BIGINT NOT NULL,
  changed_by BIGINT NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (changed_by) REFERENCES users(id)
);
```

---

## Sample API Requests

### Register User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "John@123"}'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "John@123"}'
```

### Create Task

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Fix login bug",
    "description": "Login fails on mobile devices",
    "priority": "HIGH",
    "dueDate": "2025-06-01"
  }'
```

### Update Task Status

```bash
curl -X PATCH http://localhost:8080/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"status": "IN_PROGRESS"}'
```

---

## Security

- Passwords are encrypted using BCrypt
- JWT tokens are used for authentication
- Token expiration is set to 24 hours
- CORS is configured for frontend development
- All task endpoints require valid JWT token

---

## License

This project is licensed under the MIT License.

---

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

---

## Acknowledgments

Built with Spring Boot and React — SRV
