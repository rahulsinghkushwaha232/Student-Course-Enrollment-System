import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  /* =========================================================
     STATE
  ========================================================= */

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* =========================================================
     LOAD DASHBOARD DATA
     
     IMPORTANT:
     We are NOT using /dashboard API.
     
     Existing backend APIs:
       /students
       /courses
       /enrollments
  ========================================================= */

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(false);

      const [
        studentsResponse,
        coursesResponse,
        enrollmentsResponse,
      ] = await Promise.all([
        api.get("/students"),
        api.get("/courses"),
        api.get("/enrollments"),
      ]);

      /* =====================================================
         STUDENTS
      ===================================================== */

      const studentsData = Array.isArray(studentsResponse.data)
        ? studentsResponse.data
        : [];

      setStudents(studentsData);

      /* =====================================================
         COURSES
      ===================================================== */

      const coursesData = Array.isArray(coursesResponse.data)
        ? coursesResponse.data
        : [];

      setCourses(coursesData);

      /* =====================================================
         ENROLLMENTS
      ===================================================== */

      const enrollmentsData = Array.isArray(enrollmentsResponse.data)
        ? enrollmentsResponse.data
        : [];

      setEnrollments(enrollmentsData);

      console.log("Dashboard Students:", studentsData);
      console.log("Dashboard Courses:", coursesData);
      console.log("Dashboard Enrollments:", enrollmentsData);
    } catch (error) {
      console.error(
        "Failed to load dashboard data:",
        error
      );

      setError(true);

      setStudents([]);
      setCourses([]);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadDashboardData();
  }, []);

  /* =========================================================
     TOTAL RECORDS
  ========================================================= */

  const totalRecords =
    students.length +
    courses.length +
    enrollments.length;

  /* =========================================================
     LATEST RECORDS
  ========================================================= */

  const latestStudent =
    students.length > 0
      ? students[students.length - 1]
      : null;

  const latestCourse =
    courses.length > 0
      ? courses[courses.length - 1]
      : null;

  const latestEnrollment =
    enrollments.length > 0
      ? enrollments[enrollments.length - 1]
      : null;

  /* =========================================================
     SAFE STUDENT VALUES
  ========================================================= */

  const latestStudentName =
    latestStudent?.name ||
    latestStudent?.studentName ||
    "Unknown Student";

  const latestStudentEmail =
    latestStudent?.email ||
    latestStudent?.studentEmail ||
    "No email available";

  /* =========================================================
     SAFE COURSE VALUES
  ========================================================= */

  const latestCourseName =
    latestCourse?.courseName ||
    latestCourse?.name ||
    "Unknown Course";

  const latestCourseDuration =
    latestCourse?.duration ||
    latestCourse?.courseDuration ||
    "Duration not available";

  const latestCourseInstructor =
    latestCourse?.instructor ||
    latestCourse?.courseInstructor ||
    "Instructor not available";

  /* =========================================================
     SAFE ENROLLMENT VALUES
  ========================================================= */

  const latestEnrollmentStudent =
    latestEnrollment?.student?.name ||
    latestEnrollment?.studentName ||
    latestEnrollment?.student?.studentName ||
    "Unknown Student";

  const latestEnrollmentCourse =
    latestEnrollment?.course?.courseName ||
    latestEnrollment?.course?.name ||
    latestEnrollment?.courseName ||
    "Unknown Course";

  const latestEnrollmentDate =
    latestEnrollment?.enrollmentDate ||
    "Date not available";

  /* =========================================================
     KEYBOARD NAVIGATION
  ========================================================= */

  const handleCardKeyDown = (event, path) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      navigate(path);
    }
  };

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="dashboard-page">

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div className="dashboard-error">

          <span>
            ⚠️ Unable to load dashboard data.
            Please check whether the backend is running.
          </span>

          <button
            type="button"
            onClick={loadDashboardData}
          >
            🔄 Retry
          </button>

        </div>
      )}

      {/* =====================================================
          WELCOME SECTION
      ===================================================== */}

      <section className="dashboard-welcome">

        <div className="dashboard-welcome-left">

          <h1>
            Welcome Rahul 👋
          </h1>

          <p>
            Student Course Enrollment System
          </p>

        </div>

        <div className="dashboard-welcome-right">

          <button
            type="button"
            className="dashboard-refresh-btn"
            onClick={loadDashboardData}
            disabled={loading}
          >
            🔄 {loading ? "Loading..." : "Refresh"}
          </button>

        </div>

      </section>

      {/* =====================================================
          DASHBOARD STATISTICS
      ===================================================== */}

      <section className="dashboard-stats">

        {/* ===================================================
            STUDENTS
        =================================================== */}

        <article
          className="dashboard-stat-card dashboard-student-card"
          onClick={() => navigate("/students")}
          onKeyDown={(event) =>
            handleCardKeyDown(event, "/students")
          }
          role="button"
          tabIndex={0}
        >

          <div className="dashboard-stat-icon">
            👨‍🎓
          </div>

          <h3>
            Students
          </h3>

          <div className="dashboard-stat-number">

            {loading
              ? "..."
              : students.length}

          </div>

          <div className="dashboard-stat-description">
            Total Students
          </div>

        </article>

        {/* ===================================================
            COURSES
        =================================================== */}

        <article
          className="dashboard-stat-card dashboard-course-card"
          onClick={() => navigate("/courses")}
          onKeyDown={(event) =>
            handleCardKeyDown(event, "/courses")
          }
          role="button"
          tabIndex={0}
        >

          <div className="dashboard-stat-icon">
            📚
          </div>

          <h3>
            Courses
          </h3>

          <div className="dashboard-stat-number">

            {loading
              ? "..."
              : courses.length}

          </div>

          <div className="dashboard-stat-description">
            Total Courses
          </div>

        </article>

        {/* ===================================================
            ENROLLMENTS
        =================================================== */}

        <article
          className="dashboard-stat-card dashboard-enrollment-card"
          onClick={() => navigate("/enrollments")}
          onKeyDown={(event) =>
            handleCardKeyDown(event, "/enrollments")
          }
          role="button"
          tabIndex={0}
        >

          <div className="dashboard-stat-icon">
            📝
          </div>

          <h3>
            Enrollments
          </h3>

          <div className="dashboard-stat-number">

            {loading
              ? "..."
              : enrollments.length}

          </div>

          <div className="dashboard-stat-description">
            Total Enrollments
          </div>

        </article>

        {/* ===================================================
            TOTAL RECORDS
        =================================================== */}

        <article
          className="dashboard-stat-card dashboard-total-card"
        >

          <div className="dashboard-stat-icon">
            📊
          </div>

          <h3>
            Total Records
          </h3>

          <div className="dashboard-stat-number">

            {loading
              ? "..."
              : totalRecords}

          </div>

          <div className="dashboard-stat-description">
            Students + Courses + Enrollments
          </div>

        </article>

      </section>

      {/* =====================================================
          LATEST STATISTICS
      ===================================================== */}

      <section className="latest-statistics">

        <h2>
          Latest Statistics
        </h2>

        <div className="latest-statistics-grid">

          {/* =================================================
              LATEST STUDENT
          ================================================= */}

          <article
            className="latest-card"
            onClick={() => navigate("/students")}
            onKeyDown={(event) =>
              handleCardKeyDown(event, "/students")
            }
            role="button"
            tabIndex={0}
          >

            <div className="latest-card-icon">
              👨‍🎓
            </div>

            <div className="latest-card-content">

              <span className="latest-card-label">
                Latest Student
              </span>

              {loading ? (
                <strong>
                  Loading...
                </strong>
              ) : latestStudent ? (
                <>
                  <strong>
                    {latestStudentName}
                  </strong>

                  <span>
                    {latestStudentEmail}
                  </span>
                </>
              ) : (
                <strong>
                  No students found
                </strong>
              )}

            </div>

          </article>

          {/* =================================================
              LATEST COURSE
          ================================================= */}

          <article
            className="latest-card"
            onClick={() => navigate("/courses")}
            onKeyDown={(event) =>
              handleCardKeyDown(event, "/courses")
            }
            role="button"
            tabIndex={0}
          >

            <div className="latest-card-icon">
              📚
            </div>

            <div className="latest-card-content">

              <span className="latest-card-label">
                Latest Course
              </span>

              {loading ? (
                <strong>
                  Loading...
                </strong>
              ) : latestCourse ? (
                <>
                  <strong>
                    {latestCourseName}
                  </strong>

                  <span>
                    {latestCourseDuration}
                  </span>

                  <span>
                    Instructor: {latestCourseInstructor}
                  </span>
                </>
              ) : (
                <strong>
                  No courses found
                </strong>
              )}

            </div>

          </article>

          {/* =================================================
              LATEST ENROLLMENT
          ================================================= */}

          <article
            className="latest-card"
            onClick={() => navigate("/enrollments")}
            onKeyDown={(event) =>
              handleCardKeyDown(event, "/enrollments")
            }
            role="button"
            tabIndex={0}
          >

            <div className="latest-card-icon">
              📝
            </div>

            <div className="latest-card-content">

              <span className="latest-card-label">
                Latest Enrollment
              </span>

              {loading ? (
                <strong>
                  Loading...
                </strong>
              ) : latestEnrollment ? (
                <>
                  <strong>
                    {latestEnrollmentStudent}
                  </strong>

                  <span>
                    Course: {latestEnrollmentCourse}
                  </span>

                  <span>
                    Date: {latestEnrollmentDate}
                  </span>
                </>
              ) : (
                <strong>
                  No enrollments found
                </strong>
              )}

            </div>

          </article>

        </div>

      </section>

      {/* =====================================================
          RECENT ACTIVITIES
      ===================================================== */}

      <section className="recent-activities">

        <h2>
          Recent Activities
        </h2>

        <div className="recent-activities-list">

          {/* =================================================
              RECENT STUDENT
          ================================================= */}

          <div
            className="activity-item"
            onClick={() => navigate("/students")}
            onKeyDown={(event) =>
              handleCardKeyDown(event, "/students")
            }
            role="button"
            tabIndex={0}
          >

            <div className="activity-icon student-activity-icon">
              👨‍🎓
            </div>

            <div className="activity-content">

              <strong>
                {loading
                  ? "Loading student..."
                  : latestStudent
                    ? `Recently Added Student: ${latestStudentName}`
                    : "No students available"}
              </strong>

              <span>
                {loading
                  ? "Please wait..."
                  : latestStudent
                    ? latestStudentEmail
                    : "Add a student to see recent activity"}
              </span>

            </div>

            {!loading && latestStudent && (
              <span className="activity-status">
                Student
              </span>
            )}

          </div>

          {/* =================================================
              RECENT COURSE
          ================================================= */}

          <div
            className="activity-item"
            onClick={() => navigate("/courses")}
            onKeyDown={(event) =>
              handleCardKeyDown(event, "/courses")
            }
            role="button"
            tabIndex={0}
          >

            <div className="activity-icon course-activity-icon">
              📚
            </div>

            <div className="activity-content">

              <strong>
                {loading
                  ? "Loading course..."
                  : latestCourse
                    ? `Recently Added Course: ${latestCourseName}`
                    : "No courses available"}
              </strong>

              <span>
                {loading
                  ? "Please wait..."
                  : latestCourse
                    ? `${latestCourseDuration} • Instructor: ${latestCourseInstructor}`
                    : "Add a course to see recent activity"}
              </span>

            </div>

            {!loading && latestCourse && (
              <span className="activity-status">
                Course
              </span>
            )}

          </div>

          {/* =================================================
              RECENT ENROLLMENT
          ================================================= */}

          <div
            className="activity-item"
            onClick={() => navigate("/enrollments")}
            onKeyDown={(event) =>
              handleCardKeyDown(event, "/enrollments")
            }
            role="button"
            tabIndex={0}
          >

            <div className="activity-icon enrollment-activity-icon">
              📝
            </div>

            <div className="activity-content">

              <strong>
                {loading
                  ? "Loading enrollment..."
                  : latestEnrollment
                    ? `Recent Enrollment: ${latestEnrollmentStudent}`
                    : "No enrollments available"}
              </strong>

              <span>
                {loading
                  ? "Please wait..."
                  : latestEnrollment
                    ? `Course: ${latestEnrollmentCourse} • Date: ${latestEnrollmentDate}`
                    : "Create an enrollment to see recent activity"}
              </span>

            </div>

            {!loading && latestEnrollment && (
              <span className="activity-status">
                Enrollment
              </span>
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="dashboard-quick-actions">

        <h2>
          Quick Actions
        </h2>

        <div className="dashboard-quick-actions-buttons">

          {/* ADD STUDENT */}

          <button
            type="button"
            className="dashboard-quick-action-button"
            onClick={() => navigate("/students/add")}
          >
            ➕ Add Student
          </button>

          {/* ADD COURSE */}

          <button
            type="button"
            className="dashboard-quick-action-button"
            onClick={() => navigate("/courses")}
          >
            📚 Add Course
          </button>

          {/* NEW ENROLLMENT */}

          <button
            type="button"
            className="dashboard-quick-action-button"
            onClick={() => navigate("/enrollments")}
          >
            📝 New Enrollment
          </button>

        </div>

      </section>

    </main>
  );
}

export default Dashboard;