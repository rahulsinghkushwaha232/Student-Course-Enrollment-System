import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "../styles/AddCourse.css";


function AddCourse() {

  const navigate = useNavigate();


  /* =========================================================
     STATE
  ========================================================= */

  const [courseName, setCourseName] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");


  /* =========================================================
     SUBMIT COURSE
  ========================================================= */

  const handleSubmit = async (event) => {

    event.preventDefault();

    setErrorMessage("");


    /* =========================
       VALIDATION
    ========================= */

    if (!courseName.trim()) {

      setErrorMessage(
        "Please enter course name."
      );

      return;

    }


    if (!duration.trim()) {

      setErrorMessage(
        "Please enter course duration."
      );

      return;

    }


    try {

      setLoading(true);


      /* =========================
         API REQUEST
      ========================= */

      await api.post("/courses", {

        courseName: courseName.trim(),

        duration: duration.trim(),

        description: description.trim(),

      });


      /* =========================
         SUCCESS
      ========================= */

      navigate("/courses");


    } catch (error) {

      console.error(
        "Add course error:",
        error
      );


      setErrorMessage(
        "Unable to add course. Please check whether the backend is running."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================================================
     CANCEL
  ========================================================= */

  const handleCancel = () => {

    navigate("/courses");

  };


  /* =========================================================
     UI
  ========================================================= */

  return (

    <div className="add-course-page">


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="add-course-header">

        <div>

          <h1>
            ➕ Add Course
          </h1>

          <p>
            Add a new course to the system
          </p>

        </div>


        <button
          type="button"
          className="back-course-btn"
          onClick={handleCancel}
        >
          ← Back to Courses
        </button>

      </div>



      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {errorMessage && (

        <div className="add-course-error">

          ❌ {errorMessage}

        </div>

      )}



      {/* =====================================================
          FORM CARD
      ===================================================== */}

      <div className="add-course-card">


        <form
          className="add-course-form"
          onSubmit={handleSubmit}
        >


          {/* =================================================
              COURSE NAME
          ================================================= */}

          <div className="form-group">

            <label htmlFor="courseName">

              Course Name
              <span>*</span>

            </label>


            <input
              id="courseName"
              type="text"
              placeholder="Enter course name"
              value={courseName}
              onChange={(event) =>
                setCourseName(
                  event.target.value
                )
              }
            />

          </div>



          {/* =================================================
              DURATION
          ================================================= */}

          <div className="form-group">

            <label htmlFor="duration">

              Duration
              <span>*</span>

            </label>


            <input
              id="duration"
              type="text"
              placeholder="Example: 6 Months"
              value={duration}
              onChange={(event) =>
                setDuration(
                  event.target.value
                )
              }
            />

          </div>



          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="form-group">

            <label htmlFor="description">

              Description

            </label>


            <textarea
              id="description"
              rows="5"
              placeholder="Enter course description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
            />

          </div>



          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="add-course-actions">


            <button
              type="button"
              className="cancel-course-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="save-course-btn"
              disabled={loading}
            >

              {loading
                ? "Saving..."
                : "💾 Save Course"}

            </button>


          </div>


        </form>

      </div>


    </div>

  );

}


export default AddCourse;