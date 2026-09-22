import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { addStudent, updateStudent } from "../api/studentApi";

import "../styles/AddStudent.css";

function AddStudent() {

  const navigate = useNavigate();
  const location = useLocation();
  const editingStudent = location.state?.student;
  const isEditing = Boolean(editingStudent?.id);

  const [formData, setFormData] = useState({
    name: editingStudent?.name || "",
    email: editingStudent?.email || "",
    course: editingStudent?.course || "",
    phone: editingStudent?.phone || "",
    address: editingStudent?.address || "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSuccess("");
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.course ||
      !formData.phone ||
      !formData.address
    ) {

      setError("Please fill all fields.");

      return;

    }

    try {

      setLoading(true);

      if (isEditing) {
        await updateStudent({ id: editingStudent.id, ...formData });
      } else {
        await addStudent(formData);
      }

      setSuccess(isEditing ? "Student updated successfully!" : "Student added successfully!");

      setFormData({
        name: "",
        email: "",
        course: "",
        phone: "",
        address: "",
      });

      setTimeout(() => {
        navigate("/students");
      }, 1200);

    } catch (err) {

      console.error("Add student error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to add student. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="add-student-page">

      <div className="add-student-header">

        <div>

          <h1>👨‍🎓 {isEditing ? "Edit Student" : "Add Student"}</h1>

          <p>
            {isEditing ? "Update the student's details below." : "Register a new student in the enrollment system."}
          </p>

        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/students")}
        >
          ← Back to Students
        </button>

      </div>

      <div className="add-student-card">

        <div className="form-title">

          <div className="form-icon">
            👨‍🎓
          </div>

          <div>
            <h2>{isEditing ? "Update Student Information" : "Student Information"}</h2>

            <p>
              Enter the student's details below.
            </p>
          </div>

        </div>

        {success && (

          <div className="success-message">
            ✅ {success}
          </div>

        )}

        {error && (

          <div className="error-message">
            ❌ {error}
          </div>

        )}

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">

              <label>
                Student Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter student name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>
                Course
              </label>

              <input
                type="text"
                name="course"
                placeholder="e.g. Java, Python, C++"
                value={formData.course}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>

            <div className="form-group full-width">

              <label>
                Address
              </label>

              <textarea
                name="address"
                placeholder="Enter student address"
                rows="4"
                value={formData.address}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/students")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-student-btn"
              disabled={loading}
            >

              {loading
                ? "Saving..."
                : isEditing ? "💾 Update Student" : "➕ Add Student"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default AddStudent;
