import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getStudents,
  getCourses,
  getEnrollments,
} from "../api/dashboardApi";

import "../styles/GlobalSearch.css";

function GlobalSearch() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showResults, setShowResults] = useState(false);


  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);

        const [
          studentsResponse,
          coursesResponse,
          enrollmentsResponse,
        ] = await Promise.all([
          getStudents(),
          getCourses(),
          getEnrollments(),
        ]);

        setStudents(
          Array.isArray(studentsResponse.data)
            ? studentsResponse.data
            : []
        );

        setCourses(
          Array.isArray(coursesResponse.data)
            ? coursesResponse.data
            : []
        );

        setEnrollments(
          Array.isArray(enrollmentsResponse.data)
            ? enrollmentsResponse.data
            : []
        );

      } catch (error) {

        console.error(
          "Global search loading error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    loadData();

  }, []);


  // =========================
  // SEARCH
  // =========================

  const keyword = search
    .toLowerCase()
    .trim();


  const studentResults = keyword
    ? students.filter((student) =>
        student.name
          ?.toLowerCase()
          .includes(keyword) ||

        student.email
          ?.toLowerCase()
          .includes(keyword) ||

        student.course
          ?.toLowerCase()
          .includes(keyword) ||

        student.phone
          ?.includes(keyword) ||

        student.address
          ?.toLowerCase()
          .includes(keyword)
      )
    : [];


  const courseResults = keyword
    ? courses.filter((course) =>
        course.courseName
          ?.toLowerCase()
          .includes(keyword) ||

        course.duration
          ?.toLowerCase()
          .includes(keyword) ||

        course.instructor
          ?.toLowerCase()
          .includes(keyword)
      )
    : [];


  const enrollmentResults = keyword
    ? enrollments.filter((enrollment) => {

        const studentName =
          enrollment.student?.name || "";

        const courseName =
          enrollment.course?.courseName || "";

        const enrollmentDate =
          enrollment.enrollmentDate || "";

        return (
          studentName
            .toLowerCase()
            .includes(keyword) ||

          courseName
            .toLowerCase()
            .includes(keyword) ||

          enrollmentDate
            .toLowerCase()
            .includes(keyword)
        );

      })
    : [];


  const totalResults =
    studentResults.length +
    courseResults.length +
    enrollmentResults.length;


  // =========================
  // NAVIGATION
  // =========================

  const openStudents = () => {

    setShowResults(false);

    navigate("/students");

  };


  const openCourses = () => {

    setShowResults(false);

    navigate("/courses");

  };


  const openEnrollments = () => {

    setShowResults(false);

    navigate("/enrollments");

  };


  // =========================
  // RENDER
  // =========================

  return (

    <div className="global-search">

      <div className="global-search-box">

        <span className="search-icon">
          🔍
        </span>

        <input
          type="text"
          placeholder="Search Students, Courses..."
          value={search}
          onChange={(e) => {

            setSearch(e.target.value);

            setShowResults(
              e.target.value.trim().length > 0
            );

          }}
          onFocus={() => {

            if (search.trim()) {
              setShowResults(true);
            }

          }}
        />

        {search && (

          <button
            className="clear-search"
            onClick={() => {

              setSearch("");

              setShowResults(false);

            }}
          >
            ✕
          </button>

        )}

      </div>


      {/* =========================
          SEARCH RESULTS
      ========================= */}

      {showResults && (

        <div className="search-results">

          {loading ? (

            <div className="search-loading">

              Loading...

            </div>

          ) : totalResults === 0 ? (

            <div className="no-search-results">

              <div>
                🔎
              </div>

              <strong>
                No results found
              </strong>

              <p>
                Try another student, course or enrollment.
              </p>

            </div>

          ) : (

            <>

              {/* STUDENTS */}

              {studentResults.length > 0 && (

                <div className="search-section">

                  <div className="search-section-title">

                    👨‍🎓 Students

                    <span>
                      {studentResults.length}
                    </span>

                  </div>


                  {studentResults
                    .slice(0, 5)
                    .map((student) => (

                      <div
                        className="search-result-item"
                        key={`student-${student.id}`}
                        onClick={openStudents}
                      >

                        <div className="result-icon student-result">
                          👨‍🎓
                        </div>

                        <div className="result-content">

                          <strong>
                            {student.name}
                          </strong>

                          <small>
                            {student.email}
                          </small>

                        </div>

                        <span className="result-type">
                          Student
                        </span>

                      </div>

                    ))}

                </div>

              )}


              {/* COURSES */}

              {courseResults.length > 0 && (

                <div className="search-section">

                  <div className="search-section-title">

                    📚 Courses

                    <span>
                      {courseResults.length}
                    </span>

                  </div>


                  {courseResults
                    .slice(0, 5)
                    .map((course) => (

                      <div
                        className="search-result-item"
                        key={`course-${course.id}`}
                        onClick={openCourses}
                      >

                        <div className="result-icon course-result">
                          📚
                        </div>

                        <div className="result-content">

                          <strong>
                            {course.courseName}
                          </strong>

                          <small>
                            {course.duration} • {course.instructor}
                          </small>

                        </div>

                        <span className="result-type">
                          Course
                        </span>

                      </div>

                    ))}

                </div>

              )}


              {/* ENROLLMENTS */}

              {enrollmentResults.length > 0 && (

                <div className="search-section">

                  <div className="search-section-title">

                    📝 Enrollments

                    <span>
                      {enrollmentResults.length}
                    </span>

                  </div>


                  {enrollmentResults
                    .slice(0, 5)
                    .map((enrollment) => (

                      <div
                        className="search-result-item"
                        key={`enrollment-${enrollment.id}`}
                        onClick={openEnrollments}
                      >

                        <div className="result-icon enrollment-result">
                          📝
                        </div>

                        <div className="result-content">

                          <strong>
                            {enrollment.student?.name}
                          </strong>

                          <small>
                            {enrollment.course?.courseName}
                            {" • "}
                            {enrollment.enrollmentDate}
                          </small>

                        </div>

                        <span className="result-type">
                          Enrollment
                        </span>

                      </div>

                    ))}

                </div>

              )}

            </>

          )}

        </div>

      )}

    </div>

  );

}

export default GlobalSearch;