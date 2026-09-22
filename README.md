# Student Course Enrollment System

A full-stack B.Tech laboratory project for managing students, courses, enrollments and demo payments. The application uses React + Vite for the client, Spring Boot for the REST API, and MySQL for persistence.

## Features

- JWT-based registration and login with ADMIN / STUDENT roles
- Student and course CRUD operations with server-side validation
- Enrollment management with payment status and a simulated PhonePe payment flow
- Dashboard statistics, search, sorting, pagination, profile image upload, light/dark mode and Swagger API documentation

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Axios, React Router, Recharts |
| Backend | Java 17, Spring Boot 3, Spring Security, Spring Data JPA |
| Database | MySQL 8 |
| Documentation | OpenAPI / Swagger UI |

## Run locally

1. Ensure MySQL is running. The default connection creates `student_course_db` automatically. If your MySQL account cannot create databases, run `CREATE DATABASE student_course_db;` once in MySQL Workbench.
2. Set your database password for the current PowerShell session:

   ```powershell
   $env:DB_PASSWORD = "your-mysql-password"
   ```

3. Start the backend:

   ```powershell
   cd StudentCourseEnrollmentSystem
   .\mvnw.cmd spring-boot:run
   ```

4. In a second terminal, start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

Open `http://localhost:5173`. API documentation is available at `http://localhost:8080/swagger-ui/index.html`.

## Demo credentials

The database script creates `admin@system.com` / `Admin@123` and `student@system.com` / `Student@123`. Change or remove these sample accounts before any real deployment.

## Verification

```powershell
cd StudentCourseEnrollmentSystem
.\mvnw.cmd test

cd ..\frontend
npm run build
```

## Project structure

```text
student-course-enrollment/
├── frontend/                         # React user interface
├── StudentCourseEnrollmentSystem/    # Spring Boot REST API
├── README.md                          # setup and verification instructions
└── SUBMISSION_CHECKLIST.md            # lab submission and demo guide
```
