import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getStudents,
  deleteStudent,
} from "../api/studentApi";

import "../styles/Students.css";

function Students() {

  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const itemsPerPage = 5;


  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  const loadStudents = async () => {

    try {

      setLoading(true);
      setErrorMessage("");

      const response = await getStudents();

      setStudents(response.data || []);

    } catch (error) {

      console.error("Student loading error:", error);

      setErrorMessage(
        "Unable to load students. Please check whether the backend is running."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadStudents();

  }, []);


  // =====================================================
  // COURSE LIST
  // =====================================================

  const courses = useMemo(() => {

    const courseList = students
      .map((student) => student.course)
      .filter(Boolean);

    return ["All", ...new Set(courseList)];

  }, [students]);


  // =====================================================
  // SEARCH + FILTER + SORT
  // =====================================================

  const filteredStudents = useMemo(() => {

    let result = [...students];

    const keyword = search
      .toLowerCase()
      .trim();


    // SEARCH

    if (keyword) {

      result = result.filter((student) =>

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
          ?.toLowerCase()
          .includes(keyword) ||

        student.address
          ?.toLowerCase()
          .includes(keyword)

      );

    }


    // COURSE FILTER

    if (courseFilter !== "All") {

      result = result.filter(
        (student) =>
          student.course === courseFilter
      );

    }


    // SORT

    result.sort((a, b) => {

      let valueA = a[sortBy];
      let valueB = b[sortBy];


      if (typeof valueA === "string") {

        valueA = valueA.toLowerCase();

      }

      if (typeof valueB === "string") {

        valueB = valueB.toLowerCase();

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
    students,
    search,
    courseFilter,
    sortBy,
    sortOrder,
  ]);


  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(
    filteredStudents.length / itemsPerPage
  );


  const startIndex =
    (currentPage - 1) * itemsPerPage;


  const currentStudents =
    filteredStudents.slice(
      startIndex,
      startIndex + itemsPerPage
    );


  // =====================================================
  // SORT HANDLER
  // =====================================================

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


  // =====================================================
  // DELETE
  // =====================================================

  const confirmDelete = async () => {

    if (!deleteId) {
      return;
    }


    try {

      setDeleteLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await deleteStudent(deleteId);

      setDeleteId(null);

      setSuccessMessage(
        "Student deleted successfully!"
      );

      await loadStudents();

      setCurrentPage(1);


      setTimeout(() => {

        setSuccessMessage("");

      }, 3000);


    } catch (error) {

      console.error(
        "Delete student error:",
        error
      );

      setErrorMessage(
        "Unable to delete student. Please try again."
      );

    } finally {

      setDeleteLoading(false);

    }

  };


  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const changePage = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {

      return;

    }

    setCurrentPage(page);

  };


  // =====================================================
  // RESET
  // =====================================================

  const resetFilters = () => {

    setSearch("");
    setCourseFilter("All");
    setSortBy("id");
    setSortOrder("asc");
    setCurrentPage(1);

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="students-page">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="students-header">

        <div>

          <h1>
            👨‍🎓 Students
          </h1>

          <p>
            Manage all registered students
          </p>

        </div>


        {/* ADD STUDENT */}

        <button
          className="add-student-btn"
          onClick={() =>
            navigate("/students/add")
          }
        >
          ➕ Add Student
        </button>

      </div>


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {successMessage && (

        <div className="success-message">

          ✅ {successMessage}

        </div>

      )}


      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {errorMessage && (

        <div className="error-message">

          ❌ {errorMessage}

        </div>

      )}


      {/* =================================================
          CONTROLS
      ================================================= */}

      <div className="student-controls">


        {/* SEARCH */}

        <div className="student-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search name, email, course, phone..."
            value={search}
            onChange={(e) => {

              setSearch(e.target.value);
              setCurrentPage(1);

            }}
          />

        </div>


        {/* COURSE FILTER */}

        <select
          value={courseFilter}
          onChange={(e) => {

            setCourseFilter(e.target.value);
            setCurrentPage(1);

          }}
        >

          {courses.map((course) => (

            <option
              key={course}
              value={course}
            >

              {course === "All"
                ? "All Courses"
                : course}

            </option>

          ))}

        </select>


        {/* RESET */}

        <button
          className="reset-btn"
          onClick={resetFilters}
        >
          Reset
        </button>

      </div>


      {/* =================================================
          TABLE CARD
      ================================================= */}

      <div className="students-table-card">


        {/* LOADING */}

        {loading ? (

          <div className="students-loading">

            <div className="spinner"></div>

            <p>
              Loading students...
            </p>

          </div>

        ) : currentStudents.length === 0 ? (


          /* EMPTY STATE */

          <div className="students-empty">

            <div className="empty-icon">
              👨‍🎓
            </div>

            <h2>
              No Students Found
            </h2>

            <p>
              {search || courseFilter !== "All"
                ? "Try changing your search or filter."
                : "No students have been added yet."}
            </p>


            {!search &&
              courseFilter === "All" && (

                <button
                  className="add-student-btn"
                  onClick={() =>
                    navigate("/students/add")
                  }
                >
                  ➕ Add First Student
                </button>

              )}

          </div>


        ) : (

          <>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>

                    <th>
                      #
                    </th>


                    <th
                      onClick={() =>
                        handleSort("name")
                      }
                      className="sortable"
                    >
                      Name{" "}
                      {sortBy === "name"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </th>


                    <th
                      onClick={() =>
                        handleSort("email")
                      }
                      className="sortable"
                    >
                      Email{" "}
                      {sortBy === "email"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </th>


                    <th
                      onClick={() =>
                        handleSort("course")
                      }
                      className="sortable"
                    >
                      Course{" "}
                      {sortBy === "course"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </th>


                    <th>
                      Phone
                    </th>


                    <th>
                      Address
                    </th>


                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {currentStudents.map(
                    (student, index) => (

                      <tr
                        key={student.id}
                      >


                        {/* NUMBER */}

                        <td>
                          {startIndex +
                            index +
                            1}
                        </td>


                        {/* NAME */}

                        <td>

                          <div className="student-name">

                            <span className="student-avatar">
                              👤
                            </span>

                            <strong>
                              {student.name}
                            </strong>

                          </div>

                        </td>


                        {/* EMAIL */}

                        <td>
                          {student.email}
                        </td>


                        {/* COURSE */}

                        <td>

                          <span className="course-badge">

                            {student.course}

                          </span>

                        </td>


                        {/* PHONE */}

                        <td>
                          {student.phone}
                        </td>


                        {/* ADDRESS */}

                        <td>
                          {student.address}
                        </td>


                        {/* ACTION */}

                        <td>

                          <button
                            type="button"
                            className="student-edit-btn"
                            title="Edit Student"
                            onClick={() =>
                              navigate("/students/edit", { state: { student } })
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            title="Delete Student"
                            onClick={() =>
                              setDeleteId(
                                student.id
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

              <div className="pagination">


                {/* PREVIOUS */}

                <button
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

      </div>


      {/* =================================================
          DELETE CONFIRMATION MODAL
      ================================================= */}

      {deleteId && (

        <div className="modal-overlay">

          <div className="delete-modal">


            <div className="modal-icon">
              ⚠️
            </div>


            <h2>
              Delete Student?
            </h2>


            <p>
              Are you sure you want to
              delete this student?
            </p>


            <div className="modal-actions">


              {/* CANCEL */}

              <button
                className="cancel-btn"
                onClick={() =>
                  setDeleteId(null)
                }
                disabled={deleteLoading}
              >
                Cancel
              </button>


              {/* DELETE */}

              <button
                className="confirm-delete-btn"
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

    </div>

  );

}

export default Students;
