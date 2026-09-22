import { useEffect, useState } from "react";

import Toast from "../components/Toast";

import "../styles/Course.css";

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8080" : "");

function Course() {

  // =========================================================
  // FORM STATES
  // =========================================================

  const [courseName, setCourseName] = useState("");

  const [instructor, setInstructor] = useState("");

  const [duration, setDuration] = useState("");

  const [fee, setFee] = useState("");


  // =========================================================
  // COURSE LIST
  // =========================================================

  const [courses, setCourses] = useState([]);


  // =========================================================
  // EDIT STATE
  // =========================================================

  const [editId, setEditId] = useState(null);


  // =========================================================
  // LOADING STATES
  // =========================================================

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);


  // =========================================================
  // TOAST
  // =========================================================

  const [toast, setToast] = useState(null);


  const showToast = (message, type = "success") => {

    setToast({
      message,
      type,
    });

  };


  // =========================================================
  // API HEADERS
  // =========================================================

  const getHeaders = () => {

    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
    };


    if (token) {

      headers.Authorization = `Bearer ${token}`;

    }


    return headers;

  };


  // =========================================================
  // LOAD ALL COURSES
  // =========================================================

  const loadCourses = async () => {

    setLoading(true);


    try {

      const response = await fetch(
        `${API_BASE_URL}/courses`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );


      if (!response.ok) {

        throw new Error(
          `Failed to load courses. Status: ${response.status}`
        );

      }


      const data = await response.json();


      setCourses(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Load courses error:",
        error
      );


      showToast(
        "Failed to load courses from server.",
        "error"
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // LOAD COURSES WHEN PAGE OPENS
  // =========================================================

  useEffect(() => {

    loadCourses();

  }, []);


  // =========================================================
  // CLEAR FORM
  // =========================================================

  const clearForm = () => {

    setCourseName("");

    setInstructor("");

    setDuration("");

    setFee("");

    setEditId(null);

  };


  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {

    if (!courseName.trim()) {

      showToast(
        "Please enter course name.",
        "warning"
      );

      return false;

    }


    if (!instructor.trim()) {

      showToast(
        "Please enter instructor name.",
        "warning"
      );

      return false;

    }


    if (!duration.trim()) {

      showToast(
        "Please enter course duration.",
        "warning"
      );

      return false;

    }


    if (fee === "" || fee === null) {

      showToast(
        "Please enter course fee.",
        "warning"
      );

      return false;

    }


    const feeValue = Number(fee);


    if (Number.isNaN(feeValue)) {

      showToast(
        "Course fee must be a valid number.",
        "warning"
      );

      return false;

    }


    if (feeValue < 0) {

      showToast(
        "Course fee cannot be negative.",
        "warning"
      );

      return false;

    }


    return true;

  };


  // =========================================================
  // SAVE COURSE
  // =========================================================

  const handleSave = async () => {

    if (!validateForm()) {

      return;

    }


    setSaving(true);


    try {

      const newCourse = {

        courseName: courseName.trim(),

        instructor: instructor.trim(),

        duration: duration.trim(),

        fee: Number(fee),

      };


      const response = await fetch(
        `${API_BASE_URL}/courses`,
        {
          method: "POST",

          headers: getHeaders(),

          body: JSON.stringify(newCourse),

        }
      );


      if (!response.ok) {

        let errorMessage =
          `Failed to save course. Status: ${response.status}`;


        try {

          const errorData =
            await response.json();

          if (errorData.message) {

            errorMessage =
              errorData.message;

          }

        } catch {

          // Ignore JSON parsing error

        }


        throw new Error(errorMessage);

      }


      await response.json();


      showToast(
        "Course saved successfully!",
        "success"
      );


      clearForm();


      await loadCourses();

    } catch (error) {

      console.error(
        "Save course error:",
        error
      );


      showToast(
        error.message ||
          "Failed to save course.",
        "error"
      );

    } finally {

      setSaving(false);

    }

  };


  // =========================================================
  // EDIT COURSE
  // =========================================================

  const handleEdit = (course) => {

    setCourseName(
      course.courseName || ""
    );


    setInstructor(
      course.instructor || ""
    );


    setDuration(
      course.duration || ""
    );


    setFee(
      course.fee !== null &&
      course.fee !== undefined
        ? String(course.fee)
        : ""
    );


    setEditId(course.id);

  };


  // =========================================================
  // UPDATE COURSE
  // =========================================================

  const handleUpdate = async () => {

    if (!validateForm()) {

      return;

    }


    if (!editId) {

      showToast(
        "Course ID is missing.",
        "error"
      );

      return;

    }


    setSaving(true);


    try {

      const updatedCourse = {

        courseName: courseName.trim(),

        instructor: instructor.trim(),

        duration: duration.trim(),

        fee: Number(fee),

      };


      const response = await fetch(
        `${API_BASE_URL}/courses/${editId}`,
        {
          method: "PUT",

          headers: getHeaders(),

          body: JSON.stringify(
            updatedCourse
          ),

        }
      );


      if (!response.ok) {

        let errorMessage =
          `Failed to update course. Status: ${response.status}`;


        try {

          const errorData =
            await response.json();

          if (errorData.message) {

            errorMessage =
              errorData.message;

          }

        } catch {

          // Ignore JSON parsing error

        }


        throw new Error(errorMessage);

      }


      showToast(
        "Course updated successfully!",
        "success"
      );


      clearForm();


      await loadCourses();

    } catch (error) {

      console.error(
        "Update course error:",
        error
      );


      showToast(
        error.message ||
          "Failed to update course.",
        "error"
      );

    } finally {

      setSaving(false);

    }

  };


  // =========================================================
  // DELETE COURSE
  // =========================================================

  const handleDelete = async (id) => {

    if (!id) {

      showToast(
        "Course ID is missing.",
        "error"
      );

      return;

    }


    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this course?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      const response = await fetch(
        `${API_BASE_URL}/courses/${id}`,
        {
          method: "DELETE",

          headers: getHeaders(),

        }
      );


      if (!response.ok) {

        let errorMessage =
          `Failed to delete course. Status: ${response.status}`;


        try {

          const errorData =
            await response.json();

          if (errorData.message) {

            errorMessage =
              errorData.message;

          }

        } catch {

          // Ignore JSON parsing error

        }


        throw new Error(errorMessage);

      }


      showToast(
        "Course deleted successfully!",
        "success"
      );


      if (editId === id) {

        clearForm();

      }


      await loadCourses();

    } catch (error) {

      console.error(
        "Delete course error:",
        error
      );


      showToast(
        error.message ||
          "Failed to delete course.",
        "error"
      );

    }

  };


  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancelEdit = () => {

    clearForm();

  };


  // =========================================================
  // =========================================================
  // RETURN UI (Stripe / Modern EdTech Style)
  // =========================================================

  return (
    <div className="course-page-container">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <div className="course-header-modern">
        <div>
          <h1>📚 Course Management</h1>
          <p>Create, organize and manage all curriculum courses</p>
        </div>
        <div className="course-stats-pill">
          <span>{courses.length}</span> Active Courses
        </div>
      </div>

      {/* =====================================================
          COURSE FORM CARD
      ===================================================== */}
      <div className="course-form-card">
        <h2>
          {editId ? "✏️ Update Course Details" : "➕ Add New Course"}
        </h2>

        <form
          className="course-grid-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (editId) {
              handleUpdate();
            } else {
              handleSave();
            }
          }}
        >
          {/* COURSE NAME */}
          <div className="course-form-group">
            <label>Course Name</label>
            <input
              type="text"
              placeholder="e.g. Full Stack Java Masterclass"
              value={courseName}
              onChange={(event) => setCourseName(event.target.value)}
              disabled={saving}
            />
          </div>

          {/* INSTRUCTOR */}
          <div className="course-form-group">
            <label>Instructor Name</label>
            <input
              type="text"
              placeholder="e.g. Dr. Rahul Sir"
              value={instructor}
              onChange={(event) => setInstructor(event.target.value)}
              disabled={saving}
            />
          </div>

          {/* DURATION */}
          <div className="course-form-group">
            <label>Duration</label>
            <input
              type="text"
              placeholder="e.g. 6 Months / 12 Weeks"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              disabled={saving}
            />
          </div>

          {/* COURSE FEE */}
          <div className="course-form-group">
            <label>Course Fee (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 9999"
              value={fee}
              onChange={(event) => setFee(event.target.value)}
              disabled={saving}
            />
          </div>

          {/* FORM ACTIONS */}
          <div className="course-form-actions">
            <button
              type="submit"
              className="course-primary-btn"
              disabled={saving}
            >
              {saving
                ? editId
                  ? "Updating..."
                  : "Saving..."
                : editId
                ? "Update Course"
                : "Save Course"}
            </button>

            {editId && (
              <button
                type="button"
                className="course-cancel-btn"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* =====================================================
          COURSE LIST TABLE CARD
      ===================================================== */}
      <div className="course-table-card">
        <div className="course-table-header">
          <h2>📋 Available Courses</h2>
          <span className="course-table-count">Showing {courses.length} entries</span>
        </div>

        {loading ? (
          <div className="course-loading-state">
            <div className="course-spinner" />
            <p>Loading course directory...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="course-empty-state">
            <div className="course-empty-icon">📚</div>
            <h3>No Courses Created Yet</h3>
            <p>Use the form above to add your first course to the system.</p>
          </div>
        ) : (
          <div className="course-table-scroll">
            <table className="course-modern-table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Instructor</th>
                  <th>Duration</th>
                  <th>Course Fee</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <div className="course-name-cell">
                        <div className="course-icon-badge">🎓</div>
                        <div>
                          <strong>{course.courseName}</strong>
                          <small>ID: #{course.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="course-instructor-pill">
                        👨‍🏫 {course.instructor}
                      </span>
                    </td>
                    <td>
                      <span className="course-duration-pill">
                        ⏱️ {course.duration}
                      </span>
                    </td>
                    <td>
                      <strong className="course-fee-tag">
                        ₹{Number(course.fee ?? 0).toLocaleString("en-IN")}
                      </strong>
                    </td>
                    <td>
                      <div className="course-action-buttons">
                        <button
                          className="course-action-edit"
                          type="button"
                          onClick={() => handleEdit(course)}
                          title="Edit Course"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="course-action-delete"
                          type="button"
                          onClick={() => handleDelete(course.id)}
                          title="Delete Course"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Course;
