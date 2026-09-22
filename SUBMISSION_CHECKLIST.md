# B.Tech Lab Submission Checklist

## Implemented in this repository

- React frontend with login, registration, protected routes, light/dark theme, and responsive dashboard layout
- Spring Boot REST API with validation, exception handling, Swagger/OpenAPI, JWT authentication, and role-based admin access
- MySQL persistence with student, course, enrollment, profile, and user-management features
- Student, course, and enrollment create/read/update/delete flows, search, sorting, pagination, and demo payment status flow
- Dashboard statistics, recent activity, profile image upload, password change, and settings
- Automated backend tests and frontend production-build/lint checks

## Submit separately to the faculty

- Project report: problem statement, objective, modules, technology stack, screenshots, conclusion, and future scope
- ER diagram: `User`, `Student`, `Course`, and `Enrollment` entities with their relationships
- Use-case diagram and a simple system architecture diagram: React -> Spring Boot REST API -> MySQL
- PPT (8-12 slides): title, problem, objective, tech stack, architecture, key screens, results, conclusion
- Screenshots of Login, Dashboard, Students, Courses, Enrollments, Admin Panel, Profile, and Swagger UI
- A short demo video or live demonstration, if required by the lab rubric

## Final demo sequence

1. Start MySQL, backend, and frontend according to `README.md`.
2. Log in as `admin@system.com` with password `Admin@123`.
3. Add or edit a student, add a course, create an enrollment, and show payment-status update.
4. Show dashboard count changes, student search/sorting, admin panel, profile, and Swagger UI.
5. Run `mvnw.cmd test` and `npm run build` as final proof of verification.
