import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Toast from "../components/Toast";

import "../styles/Dashboard.css";


function Home() {

  const navigate = useNavigate();


  /* =========================================================
     STATE
  ========================================================= */

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [toast, setToast] = useState(null);


  /* =========================================================
     LOAD DASHBOARD DATA
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
         STUDENTS DATA
      ===================================================== */

      const studentData =
        Array.isArray(studentsResponse.data)
          ? studentsResponse.data
          : [];


      /* =====================================================
         COURSES DATA
      ===================================================== */

      const courseData =
        Array.isArray(coursesResponse.data)
          ? coursesResponse.data
          : [];


      /* =====================================================
         ENROLLMENTS DATA
      ===================================================== */

      const enrollmentData =
        Array.isArray(enrollmentsResponse.data)
          ? enrollmentsResponse.data
          : [];


      /* =====================================================
         SET DATA
      ===================================================== */

      setStudents(studentData);

      setCourses(courseData);

      setEnrollments(enrollmentData);


      /* =====================================================
         SUCCESS TOAST
      ===================================================== */

      setToast({
        message: "Dashboard data loaded successfully!",
        type: "success",
      });


    } catch (error) {

      console.error(
        "Failed to load dashboard data:",
        error
      );


      setError(true);

      setStudents([]);

      setCourses([]);

      setEnrollments([]);


      /* =====================================================
         ERROR TOAST
      ===================================================== */

      setToast({
        message: "Unable to load dashboard data.",
        type: "error",
      });


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

    <>

      {/* =====================================================
          TOAST NOTIFICATION
      ===================================================== */}

      {toast && (

        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />

      )}


      <main className="dashboard-page">


        {/* =====================================================
            ERROR STATE
        ===================================================== */}

        {error && (

          <div className="dashboard-error">

            <div>

              <strong>
                ⚠️ Unable to load dashboard data
              </strong>

              <p>
                Please make sure the Spring Boot backend
                and MySQL database are running.
              </p>

            </div>


            <button
              type="button"
              onClick={loadDashboardData}
              disabled={loading}
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

              {loading
                ? "⏳ Loading..."
                : "🔄 Refresh"}

            </button>

          </div>


        </section>



        {/* =====================================================
            DASHBOARD STATISTICS
        ===================================================== */}

        <section className="dashboard-stats">


          {/* =================================================
              STUDENTS CARD
          ================================================= */}

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

              {loading
                ? "Loading students..."
                : students.length === 0
                  ? "No students available"
                  : "Total Students"}

            </div>

          </article>



          {/* =================================================
              COURSES CARD
          ================================================= */}

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

              {loading
                ? "Loading courses..."
                : courses.length === 0
                  ? "No courses available"
                  : "Total Courses"}

            </div>

          </article>



          {/* =================================================
              ENROLLMENTS CARD
          ================================================= */}

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

              {loading
                ? "Loading enrollments..."
                : enrollments.length === 0
                  ? "No enrollments available"
                  : "Total Enrollments"}

            </div>

          </article>



          {/* =================================================
              TOTAL RECORDS CARD
          ================================================= */}

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

              {loading
                ? "Calculating..."
                : totalRecords === 0
                  ? "No records available"
                  : "Students + Courses + Enrollments"}

            </div>

          </article>


        </section>



        {/* =====================================================
            GLOBAL EMPTY STATE
        ===================================================== */}

        {!loading &&
         !error &&
         students.length === 0 &&
         courses.length === 0 &&
         enrollments.length === 0 && (

          <section className="dashboard-empty-state">

            <div className="dashboard-empty-icon">
              📭
            </div>


            <h2>
              No Data Available
            </h2>


            <p>
              Your database currently does not contain
              any students, courses, or enrollments.
            </p>


            <div className="dashboard-empty-actions">

              <button
                type="button"
                onClick={() => navigate("/students")}
              >
                👨‍🎓 Manage Students
              </button>


              <button
                type="button"
                onClick={() => navigate("/courses")}
              >
                📚 Manage Courses
              </button>


              <button
                type="button"
                onClick={() => navigate("/enrollments")}
              >
                📝 Manage Enrollments
              </button>

            </div>

          </section>

        )}



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

                  <>

                    <strong>
                      Loading...
                    </strong>

                    <span>
                      Fetching student data
                    </span>

                  </>

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

                  <>

                    <strong>
                      No students found
                    </strong>

                    <span>
                      Add a student to see latest data
                    </span>

                  </>

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

                  <>

                    <strong>
                      Loading...
                    </strong>

                    <span>
                      Fetching course data
                    </span>

                  </>

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

                  <>

                    <strong>
                      No courses found
                    </strong>

                    <span>
                      Add a course to see latest data
                    </span>

                  </>

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

                  <>

                    <strong>
                      Loading...
                    </strong>

                    <span>
                      Fetching enrollment data
                    </span>

                  </>

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

                  <>

                    <strong>
                      No enrollments found
                    </strong>

                    <span>
                      Create an enrollment to see latest data
                    </span>

                  </>

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

                      : "No student activity yet"

                  }

                </strong>


                <span>

                  {loading

                    ? "Please wait..."

                    : latestStudent

                      ? latestStudentEmail

                      : "Add a student to see recent activity"

                  }

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

                      : "No course activity yet"

                  }

                </strong>


                <span>

                  {loading

                    ? "Please wait..."

                    : latestCourse

                      ? `${latestCourseDuration} • Instructor: ${latestCourseInstructor}`

                      : "Add a course to see recent activity"

                  }

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

                      : "No enrollment activity yet"

                  }

                </strong>


                <span>

                  {loading

                    ? "Please wait..."

                    : latestEnrollment

                      ? `Course: ${latestEnrollmentCourse} • Date: ${latestEnrollmentDate}`

                      : "Create an enrollment to see recent activity"

                  }

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

    </>

  );

}


export default Home;