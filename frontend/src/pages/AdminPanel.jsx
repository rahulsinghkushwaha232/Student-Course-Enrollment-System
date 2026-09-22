import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/AdminPanel.css";

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8080" : "");

function AdminPanel() {

  const navigate = useNavigate();

  const [role, setRole] = useState("");

  const [users, setUsers] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(false);

  const [error, setError] = useState("");


  // =========================================================
  // CHECK ADMIN ROLE
  // =========================================================

  useEffect(() => {

    const userRole =
      localStorage.getItem("userRole");

    setRole(userRole || "");

    if (userRole !== "ADMIN") {

      navigate("/");

      return;

    }

  }, [navigate]);


  // =========================================================
  // LOAD USERS
  // =========================================================

  useEffect(() => {

    if (role !== "ADMIN") {
      return;
    }

    fetchUsers();

  }, [role]);


  // =========================================================
  // FETCH USERS FROM BACKEND
  // =========================================================

  const fetchUsers = async () => {

    try {

      setLoadingUsers(true);

      setError("");


      const token =
        localStorage.getItem("token");


      const response = await fetch(
        `${API_BASE_URL}/users`,
        {
          method: "GET",

          headers: {
            "Authorization":
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );


      if (!response.ok) {

        throw new Error(
          `Failed to load users. Status: ${response.status}`
        );

      }


      const data =
        await response.json();


      setUsers(data);


    } catch (error) {

      console.error(
        "Error loading users:",
        error
      );

      setError(
        error.message ||
        "Unable to load users."
      );


    } finally {

      setLoadingUsers(false);

    }

  };


  // =========================================================
  // ACCESS DENIED
  // =========================================================

  if (role !== "ADMIN") {

    return (

      <div className="admin-access-denied">

        <div className="admin-denied-card">

          <div className="admin-denied-icon">
            🔒
          </div>

          <h1>
            Access Denied
          </h1>

          <p>
            Only administrators can access
            the Admin Panel.
          </p>

          <button
            onClick={() =>
              navigate("/")
            }
          >
            Back to Dashboard
          </button>

        </div>

      </div>

    );

  }


  // =========================================================
  // ADMIN PANEL
  // =========================================================

  return (

    <div className="admin-panel">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="admin-panel-header">

        <div>

          <h1>
            👑 Admin Panel
          </h1>

          <p>
            Manage your Student Course Enrollment System
          </p>

        </div>

        <div className="admin-badge">
          ADMIN
        </div>

      </div>



      {/* =====================================================
          ADMIN CARDS
      ===================================================== */}

      <div className="admin-card-grid">


        {/* ===================================================
            USER MANAGEMENT
        =================================================== */}

        <div className="admin-card">

          <div className="admin-card-icon">
            👥
          </div>

          <h2>
            User Management
          </h2>

          <p>
            Manage students, administrators and
            user accounts.
          </p>

          <button
            onClick={() => {

              document
                .getElementById("user-management")
                ?.scrollIntoView({
                  behavior: "smooth",
                });

            }}
          >
            Manage Users
          </button>

        </div>



        {/* ===================================================
            STUDENTS
        =================================================== */}

        <div className="admin-card">

          <div className="admin-card-icon">
            👨‍🎓
          </div>

          <h2>
            Students
          </h2>

          <p>
            View and manage student records.
          </p>

          <button
            onClick={() =>
              navigate("/students")
            }
          >
            Manage Students
          </button>

        </div>



        {/* ===================================================
            COURSES
        =================================================== */}

        <div className="admin-card">

          <div className="admin-card-icon">
            📚
          </div>

          <h2>
            Courses
          </h2>

          <p>
            Add, update and manage courses.
          </p>

          <button
            onClick={() =>
              navigate("/courses")
            }
          >
            Manage Courses
          </button>

        </div>



        {/* ===================================================
            ENROLLMENTS
        =================================================== */}

        <div className="admin-card">

          <div className="admin-card-icon">
            📝
          </div>

          <h2>
            Enrollments
          </h2>

          <p>
            Manage student course enrollments.
          </p>

          <button
            onClick={() =>
              navigate("/enrollments")
            }
          >
            Manage Enrollments
          </button>

        </div>


      </div>



      {/* =====================================================
          USER MANAGEMENT TABLE
      ===================================================== */}

      <div
        id="user-management"
        className="admin-users-section"
      >

        <div className="admin-users-header">

          <div>

            <h2>
              👥 User Management
            </h2>

            <p>
              View all registered users and their roles.
            </p>

          </div>


          <button
            className="refresh-users-button"
            onClick={fetchUsers}
            disabled={loadingUsers}
          >

            {loadingUsers
              ? "Loading..."
              : "🔄 Refresh"}

          </button>

        </div>



        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="admin-error">

            ❌ {error}

          </div>

        )}



        {/* =================================================
            LOADING
        ================================================= */}

        {loadingUsers && (

          <div className="admin-loading">

            Loading users...

          </div>

        )}



        {/* =================================================
            USERS TABLE
        ================================================= */}

        {!loadingUsers &&
          !error &&
          users.length > 0 && (

            <div className="admin-table-wrapper">

              <table className="admin-users-table">

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Role
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {users.map((user) => (

                    <tr
                      key={user.id}
                    >

                      <td>
                        {user.id}
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>

                        <span
                          className={
                            user.role === "ADMIN"
                              ? "role-badge admin-role"
                              : "role-badge student-role"
                          }
                        >

                          {user.role === "ADMIN"
                            ? "👑 ADMIN"
                            : "🎓 STUDENT"}

                        </span>

                      </td>

                      <td>

                        <span className="status-badge">

                          🟢 Active

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}



        {/* =================================================
            NO USERS
        ================================================= */}

        {!loadingUsers &&
          !error &&
          users.length === 0 && (

            <div className="admin-no-users">

              👤 No users found.

            </div>

          )}

      </div>



      {/* =====================================================
          SECURITY INFORMATION
      ===================================================== */}

      <div className="admin-security-card">

        <div className="security-icon">
          🛡️
        </div>

        <div>

          <h2>
            Security
          </h2>

          <p>
            You are logged in with administrator
            privileges. Admin-only APIs are protected
            using Spring Security and JWT authentication.
          </p>

        </div>

      </div>


    </div>

  );

}


export default AdminPanel;
