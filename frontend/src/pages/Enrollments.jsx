import { useEffect, useMemo, useState } from "react";

import {
  getEnrollments,
  addEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from "../api/enrollmentApi";

import { getStudents } from "../api/studentApi";

import api from "../services/api";

import "../styles/Enrollment.css";


function Enrollments() {

  /* =========================================================
     STATE
  ========================================================= */

  const [enrollments, setEnrollments] = useState([]);

  const [students, setStudents] = useState([]);

  const [courses, setCourses] = useState([]);

  const [studentId, setStudentId] = useState("");

  const [courseId, setCourseId] = useState("");

  const [enrollmentDate, setEnrollmentDate] = useState("");

  // PAYMENT FIELDS
  const [amountPaid, setAmountPaid] = useState("");

  const [paymentStatus, setPaymentStatus] =
    useState("PENDING");

  const [paymentId, setPaymentId] = useState("");

  const [paymentDate, setPaymentDate] = useState("");


  /* =========================================================
     SIMULATED PHONEPE PAYMENT STATE
  ========================================================= */

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [paymentEnrollment, setPaymentEnrollment] =
    useState(null);

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);


  const [editId, setEditId] = useState(null);


  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [studentsLoading, setStudentsLoading] =
    useState(true);

  const [coursesLoading, setCoursesLoading] =
    useState(true);


  const [search, setSearch] = useState("");


  const [sortBy, setSortBy] = useState("id");

  const [sortOrder, setSortOrder] =
    useState("asc");


  const [currentPage, setCurrentPage] =
    useState(1);


  const [deleteId, setDeleteId] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);


  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");


  const itemsPerPage = 5;


  /* =========================================================
     LOAD ENROLLMENTS
  ========================================================= */

  const loadEnrollments = async () => {

    try {

      setLoading(true);

      setErrorMessage("");


      const response =
        await getEnrollments();


      setEnrollments(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        "Enrollment loading error:",
        error
      );


      setErrorMessage(
        "Unable to load enrollments. Please check whether the backend is running."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================================================
     LOAD STUDENTS
  ========================================================= */

  const loadStudents = async () => {

    try {

      setStudentsLoading(true);


      const response =
        await getStudents();


      setStudents(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        "Student loading error:",
        error
      );


      setErrorMessage(
        "Unable to load students."
      );

    } finally {

      setStudentsLoading(false);

    }

  };


  /* =========================================================
     LOAD COURSES
  ========================================================= */

  const loadCourses = async () => {

    try {

      setCoursesLoading(true);


      const response =
        await api.get("/courses");


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
        "Unable to load courses."
      );

    } finally {

      setCoursesLoading(false);

    }

  };


  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {

    loadEnrollments();

    loadStudents();

    loadCourses();

  }, []);


  /* =========================================================
     CLEAR FORM
  ========================================================= */

  const clearForm = () => {

    setStudentId("");

    setCourseId("");

    setEnrollmentDate("");

    setAmountPaid("");

    setPaymentStatus("PENDING");

    setPaymentId("");

    setPaymentDate("");

    setEditId(null);

  };


  /* =========================================================
     SAVE / UPDATE
  ========================================================= */

  const handleSave = async (event) => {

    event.preventDefault();


    if (
      !studentId ||
      !courseId
    ) {

      setErrorMessage(
        "Please select a student and course."
      );

      return;

    }


    try {

      setSaving(true);

      setErrorMessage("");

      setSuccessMessage("");


      const enrollmentData = {

        studentId: Number(studentId),

        courseId: Number(courseId),

        enrollmentDate:
          enrollmentDate || null,

        amountPaid:
          amountPaid
            ? Number(amountPaid)
            : 0,

        paymentStatus:
          paymentStatus || "PENDING",

        paymentId:
          paymentId || null,

        paymentDate:
          paymentDate || null,

      };


      /* =========================
         UPDATE
      ========================= */

      if (editId) {

        await updateEnrollment(
          editId,
          enrollmentData
        );


        setSuccessMessage(
          "Enrollment updated successfully!"
        );

      }


      /* =========================
         ADD
      ========================= */

      else {

        await addEnrollment(
          enrollmentData
        );


        setSuccessMessage(
          "Student enrolled successfully!"
        );

      }


      clearForm();


      await loadEnrollments();


      setCurrentPage(1);


      setTimeout(() => {

        setSuccessMessage("");

      }, 3000);


    } catch (error) {

      console.error(
        "Enrollment save error:",
        error
      );


      console.error(
        "Backend response:",
        error?.response?.data
      );


      if (
        error?.response?.status === 404
      ) {

        setErrorMessage(
          "Student or Course not found."
        );

      } else if (
        error?.response?.status === 405
      ) {

        setErrorMessage(
          "Update API is not available in the backend."
        );

      } else {

        setErrorMessage(
          "Unable to save enrollment. Please try again."
        );

      }

    } finally {

      setSaving(false);

    }

  };


  /* =========================================================
     SIMULATED PHONEPE PAYMENT
  ========================================================= */

  const handlePayNow = (enrollment) => {

    if (!enrollment?.id) {

      setErrorMessage(
        "Invalid enrollment selected."
      );

      return;

    }


    const courseFee =
      getCourseFee(enrollment);


    if (!courseFee || courseFee <= 0) {

      setErrorMessage(
        "Course fee must be greater than ₹0."
      );

      return;

    }


    if (
      enrollment.paymentStatus === "PAID"
    ) {

      setErrorMessage(
        "This enrollment is already paid."
      );

      return;

    }


    setPaymentEnrollment(enrollment);

    setShowPaymentModal(true);

    setErrorMessage("");

    setSuccessMessage("");

  };


  /* =========================================================
     PROCESS SIMULATED PHONEPE PAYMENT
  ========================================================= */

  const processSimulatedPayment = async () => {

    if (!paymentEnrollment?.id) {

      return;

    }


    try {

      setPaymentLoading(true);

      setErrorMessage("");

      setSuccessMessage("");


      const response =
        await api.post(
          `/payments/simulate/${paymentEnrollment.id}`
        );


      if (
        response?.data?.success
      ) {

        setShowPaymentModal(false);


        setSuccessMessage(
          `Payment successful! Payment ID: ${response.data.paymentId}`
        );


        setPaymentEnrollment(null);


        await loadEnrollments();


        setCurrentPage(1);


        setTimeout(() => {

          setSuccessMessage("");

        }, 5000);

      } else {

        setErrorMessage(
          response?.data?.message ||
          "Payment simulation failed."
        );

      }


    } catch (error) {

      console.error(
        "Simulated PhonePe payment error:",
        error
      );


      console.error(
        "Payment backend response:",
        error?.response?.data
      );


      setErrorMessage(
        error?.response?.data?.message ||
        "Simulated payment failed. Please try again."
      );

    } finally {

      setPaymentLoading(false);

    }

  };


  /* =========================================================
     CLOSE PAYMENT MODAL
  ========================================================= */

  const closePaymentModal = () => {

    if (paymentLoading) {

      return;

    }


    setShowPaymentModal(false);

    setPaymentEnrollment(null);

  };


  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (enrollment) => {

    setStudentId(
      enrollment.student?.id
        ? String(enrollment.student.id)
        : ""
    );


    setCourseId(
      enrollment.course?.id
        ? String(enrollment.course.id)
        : ""
    );


    setEnrollmentDate(
      enrollment.enrollmentDate || ""
    );


    // PAYMENT DATA
    setAmountPaid(
      enrollment.amountPaid !== null &&
      enrollment.amountPaid !== undefined
        ? String(enrollment.amountPaid)
        : ""
    );


    setPaymentStatus(
      enrollment.paymentStatus ||
      "PENDING"
    );


    setPaymentId(
      enrollment.paymentId || ""
    );


    setPaymentDate(
      enrollment.paymentDate || ""
    );


    setEditId(enrollment.id);


    setErrorMessage("");

    setSuccessMessage("");


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  /* =========================================================
     DELETE
  ========================================================= */

  const confirmDelete = async () => {

    if (!deleteId) {

      return;

    }


    try {

      setDeleteLoading(true);

      setErrorMessage("");

      setSuccessMessage("");


      await deleteEnrollment(
        deleteId
      );


      setDeleteId(null);


      setSuccessMessage(
        "Enrollment deleted successfully!"
      );


      await loadEnrollments();


      setCurrentPage(1);


      if (editId === deleteId) {

        clearForm();

      }


      setTimeout(() => {

        setSuccessMessage("");

      }, 3000);


    } catch (error) {

      console.error(
        "Delete enrollment error:",
        error
      );


      setErrorMessage(
        "Unable to delete enrollment. Please try again."
      );

    } finally {

      setDeleteLoading(false);

    }

  };


  /* =========================================================
     SEARCH + SORT
  ========================================================= */

  const filteredEnrollments = useMemo(() => {

    let result = [...enrollments];


    const keyword =
      search
        .toLowerCase()
        .trim();


    /* =========================
       SEARCH
    ========================= */

    if (keyword) {

      result = result.filter(
        (enrollment) => {

          const studentName =
            enrollment.student?.name ||
            enrollment.studentName ||
            "";


          const studentEmail =
            enrollment.student?.email ||
            "";


          const courseName =
            enrollment.course?.courseName ||
            enrollment.course?.name ||
            enrollment.courseName ||
            "";


          const date =
            enrollment.enrollmentDate ||
            "";


          const status =
            enrollment.paymentStatus ||
            "";


          const payment =
            enrollment.paymentId ||
            "";


          return (

            studentName
              .toLowerCase()
              .includes(keyword)

            ||

            studentEmail
              .toLowerCase()
              .includes(keyword)

            ||

            courseName
              .toLowerCase()
              .includes(keyword)

            ||

            date
              .toLowerCase()
              .includes(keyword)

            ||

            status
              .toLowerCase()
              .includes(keyword)

            ||

            payment
              .toLowerCase()
              .includes(keyword)

          );

        }
      );

    }


    /* =========================
       SORT
    ========================= */

    result.sort((a, b) => {

      let valueA;

      let valueB;


      if (
        sortBy === "studentName"
      ) {

        valueA =
          a.student?.name ||
          a.studentName ||
          "";


        valueB =
          b.student?.name ||
          b.studentName ||
          "";

      }


      else if (
        sortBy === "courseName"
      ) {

        valueA =
          a.course?.courseName ||
          a.course?.name ||
          a.courseName ||
          "";


        valueB =
          b.course?.courseName ||
          b.course?.name ||
          b.courseName ||
          "";

      }


      else {

        valueA =
          a[sortBy];

        valueB =
          b[sortBy];

      }


      if (
        typeof valueA === "string"
      ) {

        valueA =
          valueA.toLowerCase();

      }


      if (
        typeof valueB === "string"
      ) {

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
    enrollments,
    search,
    sortBy,
    sortOrder,
  ]);


  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages =
    Math.ceil(
      filteredEnrollments.length /
      itemsPerPage
    );


  const startIndex =
    (currentPage - 1) *
    itemsPerPage;


  const currentEnrollments =
    filteredEnrollments.slice(
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
     RESET
  ========================================================= */

  const resetFilters = () => {

    setSearch("");

    setSortBy("id");

    setSortOrder("asc");

    setCurrentPage(1);

  };


  /* =========================================================
     SAFE VALUES
  ========================================================= */

  const getStudentName = (
    enrollment
  ) => {

    return (
      enrollment.student?.name ||
      enrollment.studentName ||
      "Unknown Student"
    );

  };


  const getStudentEmail = (
    enrollment
  ) => {

    return (
      enrollment.student?.email ||
      "No email available"
    );

  };


  const getCourseName = (
    enrollment
  ) => {

    return (
      enrollment.course?.courseName ||
      enrollment.course?.name ||
      enrollment.courseName ||
      "Unknown Course"
    );

  };


  /* =========================================================
     GET COURSE FEE
  ========================================================= */

  const getCourseFee = (
    enrollment
  ) => {

    const fee =
      enrollment?.course?.fee;

    if (
      fee === null ||
      fee === undefined
    ) {

      return 0;

    }

    return Number(fee);

  };


  /* =========================================================
     UI
  ========================================================= */

  return (

    <div className="enrollment">


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="enrollment-header">

        <div>

          <h1>
            🎓 Enrollment Management
          </h1>

          <p>
            Manage student course enrollments
          </p>

        </div>

      </div>


      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {successMessage && (

        <div className="enrollment-success">

          ✅ {successMessage}

        </div>

      )}


      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {errorMessage && (

        <div className="enrollment-error">

          ❌ {errorMessage}

          <button
            type="button"
            onClick={() => {

              loadEnrollments();

              loadStudents();

              loadCourses();

            }}
          >

            🔄 Retry

          </button>

        </div>

      )}


      {/* =====================================================
          ENROLLMENT FORM
      ===================================================== */}

      <div className="enrollment-form-card">

        <h2>

          {editId
            ? "✏️ Update Enrollment"
            : "➕ Enroll Student"}

        </h2>


        <form className="enrollment-form" onSubmit={handleSave}>


          {/* =========================
              STUDENT
          ========================= */}

          <div className="enrollment-form-group">

            <label>
              Student
            </label>


            <select
              value={studentId}
              onChange={(event) =>
                setStudentId(
                  event.target.value
                )
              }
              disabled={
                saving ||
                studentsLoading
              }
            >

              <option value="">

                {studentsLoading
                  ? "Loading students..."
                  : "Select Student"}

              </option>


              {students.map(
                (student) => (

                  <option
                    key={student.id}
                    value={student.id}
                  >

                    {student.name}

                    {student.email
                      ? ` — ${student.email}`
                      : ""}

                  </option>

                )
              )}

            </select>

          </div>


          {/* =========================
              COURSE
          ========================= */}

          <div className="enrollment-form-group">

            <label>
              Course
            </label>


            <select
              value={courseId}
              onChange={(event) =>
                setCourseId(
                  event.target.value
                )
              }
              disabled={
                saving ||
                coursesLoading
              }
            >

              <option value="">

                {coursesLoading
                  ? "Loading courses..."
                  : "Select Course"}

              </option>


              {courses.map(
                (course) => (

                  <option
                    key={course.id}
                    value={course.id}
                  >

                    {course.courseName ||
                      course.name}

                    {course.duration
                      ? ` — ${course.duration}`
                      : ""}

                    {course.fee !== null &&
                    course.fee !== undefined
                      ? ` — ₹${Number(course.fee).toFixed(2)}`
                      : ""}

                  </option>

                )
              )}

            </select>

          </div>


          {/* =========================
              ENROLLMENT DATE
          ========================= */}

          <div className="enrollment-form-group">

            <label>
              Enrollment Date
            </label>


            <input
              type="date"
              value={enrollmentDate}
              onChange={(event) =>
                setEnrollmentDate(
                  event.target.value
                )
              }
              disabled={saving}
            />

          </div>


          {/* =========================
              COURSE FEE
          ========================= */}

          <div className="enrollment-form-group">

            <label>
              Course Fee
            </label>


            <input
              type="number"
              value={
                courseId
                  ? getCourseFee({
                      course: courses.find(
                        (course) =>
                          String(course.id) ===
                          String(courseId)
                      ),
                    })
                  : ""
              }
              readOnly
              placeholder="Course fee"
            />

          </div>


          {/* =========================
              AMOUNT PAID
          ========================= */}

          <div className="enrollment-form-group">

            <label>
              Amount Paid
            </label>


            <input
              type="number"
              min="0"
              step="0.01"
              value={amountPaid}
              onChange={(event) =>
                setAmountPaid(
                  event.target.value
                )
              }
              placeholder="Enter amount paid"
              disabled={saving}
            />

          </div>


          {/* =========================
              PAYMENT STATUS
          ========================= */}

          <div className="enrollment-form-group">

            <label>
              Payment Status
            </label>


            <select
              value={paymentStatus}
              onChange={(event) =>
                setPaymentStatus(
                  event.target.value
                )
              }
              disabled={saving}
            >

              <option value="PENDING">
                Pending
              </option>

              <option value="PAID">
                Paid
              </option>

              <option value="FAILED">
                Failed
              </option>

              <option value="REFUNDED">
                Refunded
              </option>

            </select>

          </div>


          {/* =========================
              PAYMENT ID
          ========================= */}

          <div className="enrollment-form-group">

            <label>
              Payment ID
            </label>


            <input
              type="text"
              value={paymentId}
              onChange={(event) =>
                setPaymentId(
                  event.target.value
                )
              }
              placeholder="Payment ID"
              disabled={saving}
            />

          </div>


          {/* =========================
              PAYMENT DATE
          ========================= */}

          <div className="enrollment-form-group">

            <label>
              Payment Date
            </label>


            <input
              type="date"
              value={paymentDate}
              onChange={(event) =>
                setPaymentDate(
                  event.target.value
                )
              }
              disabled={saving}
            />

          </div>


          {/* =========================
              FORM ACTIONS
          ========================= */}

          <div className="enrollment-form-actions">

            <button
              type="submit"
              className="enrollment-save-btn"
              disabled={
                saving ||
                studentsLoading ||
                coursesLoading
              }
            >

              {saving
                ? "Saving..."
                : editId
                  ? "Update Enrollment"
                  : "Enroll Student"}

            </button>


            {editId && (

              <button
                type="button"
                className="enrollment-cancel-btn"
                onClick={clearForm}
                disabled={saving}
              >

                Cancel

              </button>

            )}

          </div>

        </form>

      </div>


      {/* =====================================================
          TABLE CARD
      ===================================================== */}

      <div className="enrollment-table-card">


        <div className="enrollment-table-header">

          <div>

            <h2>
              📋 Enrollment List
            </h2>

            <p>

              Total Enrollments:{" "}

              <strong>
                {enrollments.length}
              </strong>

            </p>

          </div>


          <button
            type="button"
            onClick={loadEnrollments}
          >

            🔄 Refresh

          </button>

        </div>


        {/* =================================================
            CONTROLS
        ================================================= */}

        <div className="enrollment-controls">


          <div className="enrollment-search">

            <span>
              🔍
            </span>


            <input
              type="text"
              placeholder="Search student, course, payment..."
              value={search}
              onChange={(event) => {

                setSearch(
                  event.target.value
                );

                setCurrentPage(1);

              }}
            />

          </div>


          <button
            type="button"
            className="enrollment-reset-btn"
            onClick={resetFilters}
          >

            Reset

          </button>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="enrollment-loading">

            <div className="enrollment-spinner"></div>

            <p>
              Loading enrollments...
            </p>

          </div>

        ) : currentEnrollments.length === 0 ? (

          /* =========================
             EMPTY
          ========================= */

          <div className="enrollment-empty">

            <div>
              🎓
            </div>

            <h2>
              No Enrollments Found
            </h2>

            <p>

              {search
                ? "Try changing your search."
                : "No students have been enrolled in any course yet."}

            </p>

          </div>

        ) : (

          /* =========================
             TABLE
          ========================= */

          <>

            <div className="enrollment-table-wrapper">

              <table>

                <thead>

                  <tr>

                    <th>
                      #
                    </th>


                    <th
                      className="sortable"
                      onClick={() =>
                        handleSort(
                          "studentName"
                        )
                      }
                    >

                      Student Name{" "}

                      {sortBy ===
                      "studentName"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}

                    </th>


                    <th
                      className="sortable"
                      onClick={() =>
                        handleSort(
                          "courseName"
                        )
                      }
                    >

                      Course Name{" "}

                      {sortBy ===
                      "courseName"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}

                    </th>


                    <th>
                      Course Fee
                    </th>


                    <th
                      className="sortable"
                      onClick={() =>
                        handleSort(
                          "enrollmentDate"
                        )
                      }
                    >

                      Enrollment Date{" "}

                      {sortBy ===
                      "enrollmentDate"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}

                    </th>


                    <th>
                      Payment Status
                    </th>


                    <th>
                      Amount Paid
                    </th>


                    <th>
                      Payment ID
                    </th>


                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {currentEnrollments.map(
                    (
                      enrollment,
                      index
                    ) => (

                      <tr
                        key={
                          enrollment.id
                        }
                      >

                        <td>

                          {startIndex +
                            index +
                            1}

                        </td>


                        {/* STUDENT */}
                        <td>
                          <div className="enrollment-student-cell">
                            <div className="enrollment-avatar">
                              👤
                            </div>
                            <div className="enrollment-student-details">
                              <strong className="enrollment-student-name">
                                {getStudentName(enrollment)}
                              </strong>
                              <span className="enrollment-student-email">
                                {getStudentEmail(enrollment)}
                              </span>
                            </div>
                          </div>
                        </td>


                        {/* COURSE */}
                        <td>
                          <span className="enrollment-course-badge">
                            📚 {getCourseName(enrollment)}
                          </span>
                        </td>


                        {/* COURSE FEE */}
                        <td>
                          <strong>₹{getCourseFee(enrollment).toFixed(2)}</strong>
                        </td>


                        {/* DATE */}
                        <td>
                          {enrollment.enrollmentDate || "—"}
                        </td>


                        {/* PAYMENT STATUS */}
                        <td>
                          <span
                            className={`payment-status payment-${(
                              enrollment.paymentStatus || "PENDING"
                            ).toLowerCase()}`}
                          >
                            {enrollment.paymentStatus || "PENDING"}
                          </span>
                        </td>


                        {/* AMOUNT PAID */}
                        <td>
                          <strong>₹{Number(enrollment.amountPaid || 0).toFixed(2)}</strong>
                        </td>


                        {/* PAYMENT ID */}
                        <td>
                          <code className="enrollment-payment-code">
                            {enrollment.paymentId || "Not paid"}
                          </code>
                        </td>


                        {/* ACTION */}
                        <td>
                          <div className="enrollment-actions">
                            {/* PAY NOW */}
                            {enrollment.paymentStatus !== "PAID" && (
                              <button
                                type="button"
                                className="enrollment-pay-btn"
                                onClick={() => handlePayNow(enrollment)}
                                disabled={paymentLoading}
                                title="Pay Now"
                              >
                                💳 Pay
                              </button>
                            )}

                            {/* EDIT */}
                            <button
                              type="button"
                              className="enrollment-edit-btn"
                              onClick={() => handleEdit(enrollment)}
                              title="Edit Enrollment"
                            >
                              ✏️
                            </button>

                            {/* DELETE */}
                            <button
                              type="button"
                              className="enrollment-delete-btn"
                              onClick={() => setDeleteId(enrollment.id)}
                              title="Delete Enrollment"
                            >
                              🗑️
                            </button>
                          </div>
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

              <div className="enrollment-pagination">

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


                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => (

                    <button
                      type="button"
                      key={
                        index + 1
                      }
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

      </div>


      {/* =====================================================
          SIMULATED PHONEPE PAYMENT MODAL
      ===================================================== */}

      {showPaymentModal &&
        paymentEnrollment && (

        <div className="phonepe-modal-overlay">

          <div className="phonepe-payment-modal">


            {/* HEADER */}

            <div className="phonepe-modal-header">

              <div className="phonepe-logo">

                <span>
                  🟣
                </span>

                <strong>
                  PhonePe
                </strong>

              </div>


              <button
                type="button"
                className="phonepe-close-btn"
                onClick={closePaymentModal}
                disabled={paymentLoading}
              >

                ×

              </button>

            </div>


            {/* PAYMENT CONTENT */}

            <div className="phonepe-modal-content">

              <div className="phonepe-demo-badge">

                DEMO PAYMENT

              </div>


              <h2>
                Complete Payment
              </h2>


              <p className="phonepe-payment-description">

                Simulated PhonePe payment for course enrollment

              </p>


              {/* STUDENT */}

              <div className="phonepe-detail-row">

                <span>
                  Student
                </span>

                <strong>
                  {getStudentName(
                    paymentEnrollment
                  )}
                </strong>

              </div>


              {/* COURSE */}

              <div className="phonepe-detail-row">

                <span>
                  Course
                </span>

                <strong>
                  {getCourseName(
                    paymentEnrollment
                  )}
                </strong>

              </div>


              {/* AMOUNT */}

              <div className="phonepe-amount-box">

                <span>
                  Amount to Pay
                </span>

                <strong>

                  ₹
                  {getCourseFee(
                    paymentEnrollment
                  ).toFixed(2)}

                </strong>

              </div>


              {/* DEMO PAYMENT OPTIONS */}

              <div className="phonepe-options">

                <div className="phonepe-option active">

                  <span>
                    📱
                  </span>

                  <div>

                    <strong>
                      PhonePe UPI
                    </strong>

                    <small>
                      Simulated payment
                    </small>

                  </div>

                  <span className="phonepe-check">
                    ✓
                  </span>

                </div>


                <div className="phonepe-option">

                  <span>
                    💳
                  </span>

                  <div>

                    <strong>
                      Card
                    </strong>

                    <small>
                      Demo option
                    </small>

                  </div>

                </div>


                <div className="phonepe-option">

                  <span>
                    🏦
                  </span>

                  <div>

                    <strong>
                      Net Banking
                    </strong>

                    <small>
                      Demo option
                    </small>

                  </div>

                </div>

              </div>


              {/* PAY BUTTON */}

              <button
                type="button"
                className="phonepe-pay-button"
                onClick={
                  processSimulatedPayment
                }
                disabled={
                  paymentLoading
                }
              >

                {paymentLoading
                  ? "Processing Payment..."
                  : `Pay ₹${getCourseFee(
                      paymentEnrollment
                    ).toFixed(2)}`}

              </button>


              <p className="phonepe-secure-text">

                🔒 This is a simulated payment for project/demo purposes.

              </p>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deleteId && (

        <div className="enrollment-modal-overlay">

          <div className="enrollment-delete-modal">

            <div className="enrollment-modal-icon">

              ⚠️

            </div>


            <h2>
              Delete Enrollment?
            </h2>


            <p>
              Are you sure you want to
              delete this enrollment?
            </p>


            <div className="enrollment-modal-actions">

              <button
                type="button"
                className="enrollment-cancel-btn"
                onClick={() =>
                  setDeleteId(null)
                }
                disabled={
                  deleteLoading
                }
              >

                Cancel

              </button>


              <button
                type="button"
                className="enrollment-confirm-delete-btn"
                onClick={confirmDelete}
                disabled={
                  deleteLoading
                }
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


export default Enrollments;