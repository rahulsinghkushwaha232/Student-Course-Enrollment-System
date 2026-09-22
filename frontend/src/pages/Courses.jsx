import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "../styles/Courses.css";


function Courses() {

  const navigate = useNavigate();


  /* =========================================================
     STATE
  ========================================================= */

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const itemsPerPage = 5;


  /* =========================================================
     LOAD COURSES
  ========================================================= */

  const loadCourses = async () => {

    try {

      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/courses");

      setCourses(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        "Course loading error:",
        error
      );

      setErrorMessage(
        "Unable to load courses. Please check whether the backend is running."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {

    loadCourses();

  }, []);


  /* =========================================================
     SEARCH + SORT
  ========================================================= */

  const filteredCourses = useMemo(() => {

    let result = [...courses];

    const keyword = search
      .toLowerCase()
      .trim();


    /* =========================
       SEARCH
    ========================= */

    if (keyword) {

      result = result.filter((course) => {

        const courseName =
          course.courseName ||
          course.name ||
          "";

        const duration =
          course.duration ||
          course.courseDuration ||
          "";

        const description =
          course.description ||
          "";

        return (
          String(courseName)
            .toLowerCase()
            .includes(keyword) ||

          String(duration)
            .toLowerCase()
            .includes(keyword) ||

          String(description)
            .toLowerCase()
            .includes(keyword)
        );

      });

    }


    /* =========================
       SORT
    ========================= */

    result.sort((a, b) => {

      let valueA = a[sortBy];
      let valueB = b[sortBy];


      if (sortBy === "courseName") {

        valueA =
          a.courseName ||
          a.name ||
          "";

        valueB =
          b.courseName ||
          b.name ||
          "";

      }


      if (sortBy === "duration") {

        valueA =
          a.duration ||
          a.courseDuration ||
          "";

        valueB =
          b.duration ||
          b.courseDuration ||
          "";

      }


      if (typeof valueA === "string") {

        valueA =
          valueA.toLowerCase();

      }


      if (typeof valueB === "string") {

        valueB =
          valueB.toLowerCase();

      }


      if (valueA < valueB) {

        return sortOrder === "asc"
          ? -1
          : 1;

      }


      if (valueA > valueB) {

        return sortOrder === "asc"
          ? 1
          : -1;

      }


      return 0;

    });


    return result;

  }, [
    courses,
    search,
    sortBy,
    sortOrder,
  ]);


  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.ceil(
    filteredCourses.length / itemsPerPage
  );


  const startIndex =
    (currentPage - 1) *
    itemsPerPage;


  const currentCourses =
    filteredCourses.slice(
      startIndex,
      startIndex + itemsPerPage
    );


  /* =========================================================
     SORT HANDLER
  ========================================================= */

  const handleSort = (field) => {

    if (sortBy === field) {

      setSortOrder(
        sortOrder === "asc"
          ? "desc"
          : "asc"
      );

    } else {

      setSortBy(field);
      setSortOrder("asc");

    }

    setCurrentPage(1);

  };


  /* =========================================================
     DELETE COURSE
  ========================================================= */

  const confirmDelete = async () => {

    if (!deleteId) {
      return;
    }


    try {

      setDeleteLoading(true);

      setErrorMessage("");
      setSuccessMessage("");


      await api.delete(
        `/courses/${deleteId}`
      );


      setDeleteId(null);


      setSuccessMessage(
        "Course deleted successfully!"
      );


      await loadCourses();


      setCurrentPage(1);


      setTimeout(() => {

        setSuccessMessage("");

      }, 3000);


    } catch (error) {

      console.error(
        "Delete course error:",
        error
      );


      setErrorMessage(
        "Unable to delete course. Please try again."
      );

    } finally {

      setDeleteLoading(false);

    }

  };


  /* =========================================================
     PAGE CHANGE
  ========================================================= */

  const changePage = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {

      return;

    }

    setCurrentPage(page);

  };


  /* =========================================================
     RESET FILTERS
  ========================================================= */

  const resetFilters = () => {

    setSearch("");

    setSortBy("id");

    setSortOrder("asc");

    setCurrentPage(1);

  };


  /* =========================================================
     SAFE COURSE VALUES
  ========================================================= */

  const getCourseName = (course) => {

    return (
      course.courseName ||
      course.name ||
      "Unknown Course"
    );

  };


  const getDuration = (course) => {

    return (
      course.duration ||
      course.courseDuration ||
      "Not specified"
    );

  };


  const getDescription = (course) => {

    return (
      course.description ||
      "No description available"
    );

  };


  /* =========================================================
     UI
  ========================================================= */

  return (

    <main className="courses-page">


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="courses-header">

        <div>

          <h1>
            📚 Courses
          </h1>

          <p>
            Manage all available courses
          </p>

        </div>


        {/* ADD COURSE */}

        <button
          type="button"
          className="add-course-btn"
          onClick={() =>
            navigate("/courses/add")
          }
        >
          ➕ Add Course
        </button>

      </section>



      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {successMessage && (

        <div className="course-success-message">

          <span>
            ✅ {successMessage}
          </span>

        </div>

      )}



      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {errorMessage && (

        <div className="course-error-message">

          <span>
            ❌ {errorMessage}
          </span>

          <button
            type="button"
            onClick={loadCourses}
          >
            🔄 Retry
          </button>

        </div>

      )}



      {/* =====================================================
          COURSE CONTROLS
      ===================================================== */}

      <section className="course-controls">


        {/* SEARCH */}

        <div className="course-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search course name, duration, description..."
            value={search}
            onChange={(event) => {

              setSearch(
                event.target.value
              );

              setCurrentPage(1);

            }}
          />

        </div>


        {/* RESET */}

        <button
          type="button"
          className="course-reset-btn"
          onClick={resetFilters}
        >
          🔄 Reset
        </button>

      </section>



      {/* =====================================================
          COURSE SUMMARY
      ===================================================== */}

      <section className="course-summary">

        <div className="course-summary-card">

          <div className="course-summary-icon">
            📚
          </div>

          <div>

            <span>
              Total Courses
            </span>

            <strong>
              {loading ? "..." : courses.length}
            </strong>

          </div>

        </div>


        <div className="course-summary-card">

          <div className="course-summary-icon">
            🔎
          </div>

          <div>

            <span>
              Showing
            </span>

            <strong>
              {loading
                ? "..."
                : filteredCourses.length}
            </strong>

          </div>

        </div>


        <div className="course-summary-card">

          <div className="course-summary-icon">
            📄
          </div>

          <div>

            <span>
              Current Page
            </span>

            <strong>
              {loading
                ? "..."
                : totalPages === 0
                  ? 0
                  : currentPage}
            </strong>

          </div>

        </div>

      </section>



      {/* =====================================================
          COURSE TABLE CARD
      ===================================================== */}

      <section className="courses-table-card">


        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (

          <div className="courses-loading">

            <div className="course-spinner"></div>

            <p>
              Loading courses...
            </p>

          </div>

        ) : currentCourses.length === 0 ? (


          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="courses-empty">

            <div className="courses-empty-icon">
              📚
            </div>

            <h2>
              No Courses Found
            </h2>

            <p>

              {search
                ? "Try changing your search."
                : "No courses have been added yet."}

            </p>


            {!search && (

              <button
                type="button"
                className="add-course-btn"
                onClick={() =>
                  navigate("/courses/add")
                }
              >
                ➕ Add First Course
              </button>

            )}

          </div>


        ) : (

          <>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="courses-table-wrapper">

              <table>

                <thead>

                  <tr>

                    <th>
                      #
                    </th>


                    <th
                      className="sortable"
                      onClick={() =>
                        handleSort("courseName")
                      }
                    >

                      Course Name{" "}

                      {sortBy === "courseName"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}

                    </th>


                    <th
                      className="sortable"
                      onClick={() =>
                        handleSort("duration")
                      }
                    >

                      Duration{" "}

                      {sortBy === "duration"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}

                    </th>


                    <th>
                      Description
                    </th>


                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {currentCourses.map(
                    (course, index) => (

                      <tr
                        key={course.id}
                      >


                        {/* NUMBER */}

                        <td>

                          {startIndex +
                            index +
                            1}

                        </td>


                        {/* COURSE NAME */}

                        <td>

                          <div className="course-name-cell">

                            <span className="course-avatar">
                              📚
                            </span>

                            <strong>
                              {getCourseName(course)}
                            </strong>

                          </div>

                        </td>


                        {/* DURATION */}

                        <td>

                          <span className="duration-badge">

                            {getDuration(course)}

                          </span>

                        </td>


                        {/* DESCRIPTION */}

                        <td className="course-description-cell">

                          {getDescription(course)}

                        </td>


                        {/* ACTION */}

                        <td>

                          <button
                            type="button"
                            className="course-delete-btn"
                            title="Delete Course"
                            onClick={() =>
                              setDeleteId(
                                course.id
                              )
                            }
                          >
                            🗑️
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>



            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPages > 1 && (

              <div className="course-pagination">


                {/* PREVIOUS */}

                <button
                  type="button"
                  onClick={() =>
                    changePage(
                      currentPage - 1
                    )
                  }
                  disabled={
                    currentPage === 1
                  }
                >
                  ←
                </button>


                {/* PAGE NUMBERS */}

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => (

                    <button
                      type="button"
                      key={index + 1}
                      className={
                        currentPage ===
                        index + 1
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        changePage(
                          index + 1
                        )
                      }
                    >
                      {index + 1}
                    </button>

                  )
                )}


                {/* NEXT */}

                <button
                  type="button"
                  onClick={() =>
                    changePage(
                      currentPage + 1
                    )
                  }
                  disabled={
                    currentPage ===
                    totalPages
                  }
                >
                  →
                </button>

              </div>

            )}

          </>

        )}

      </section>



      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deleteId && (

        <div className="course-modal-overlay">

          <div className="course-delete-modal">


            <div className="course-modal-icon">
              ⚠️
            </div>


            <h2>
              Delete Course?
            </h2>


            <p>
              Are you sure you want to
              delete this course?
            </p>


            <div className="course-modal-actions">


              {/* CANCEL */}

              <button
                type="button"
                className="course-cancel-btn"
                onClick={() =>
                  setDeleteId(null)
                }
                disabled={deleteLoading}
              >
                Cancel
              </button>


              {/* DELETE */}

              <button
                type="button"
                className="course-confirm-delete-btn"
                onClick={confirmDelete}
                disabled={deleteLoading}
              >

                {deleteLoading
                  ? "Deleting..."
                  : "Delete"}

              </button>

            </div>

          </div>

        </div>

      )}

    </main>

  );

}


export default Courses;