import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";

import Course from "./pages/Course";
import AddCourse from "./pages/AddCourse";

import Enrollments from "./pages/Enrollments";
import About from "./pages/About";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminPanel from "./pages/AdminPanel";

import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

/* =========================================================
   SETTINGS PAGE
========================================================= */

import Settings from "./pages/Settings";

import DashboardLayout from "./layouts/DashboardLayout";

import { ThemeProvider } from "./services/ThemeContext";

import "./App.css";


/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  return children;
}


/* =========================================================
   ADMIN ROUTE
========================================================= */

function AdminRoute({ children }) {

  const token = localStorage.getItem("token");

  const userRole = localStorage.getItem("userRole");


  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  if (userRole !== "ADMIN") {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  return children;
}


/* =========================================================
   APP
========================================================= */

function App() {

  return (

    <ThemeProvider>

      <Routes>


        {/* =====================================================
            LOGIN
            PUBLIC
        ===================================================== */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />


        {/* =====================================================
            REGISTER
            PUBLIC
        ===================================================== */}

        <Route
          path="/register"
          element={
            <Register />
          }
        />


        {/* =====================================================
            DASHBOARD
            ADMIN + STUDENT
        ===================================================== */}

        <Route
          path="/"
          element={

            <ProtectedRoute>

              <DashboardLayout>

                <Home />

              </DashboardLayout>

            </ProtectedRoute>

          }
        />


        {/* =====================================================
            STUDENTS
            ADMIN + STUDENT
        ===================================================== */}

        <Route
          path="/students"
          element={

            <ProtectedRoute>

              <DashboardLayout>

                <Students />

              </DashboardLayout>

            </ProtectedRoute>

          }
        />


        {/* =====================================================
            ADD STUDENT
            ADMIN + STUDENT
        ===================================================== */}

        <Route
          path="/students/add"
          element={

            <ProtectedRoute>

              <DashboardLayout>

                <AddStudent />

              </DashboardLayout>

            </ProtectedRoute>

          }
        />

        <Route
          path="/students/edit"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddStudent />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            COURSES
            ADMIN + STUDENT
        ===================================================== */}

        <Route
          path="/courses"
          element={

            <ProtectedRoute>

              <DashboardLayout>

                <Course />

              </DashboardLayout>

            </ProtectedRoute>

          }
        />


        {/* =====================================================
            ADD COURSE
            ADMIN + STUDENT
        ===================================================== */}

        <Route
          path="/courses/add"
          element={

            <ProtectedRoute>

              <DashboardLayout>

                <AddCourse />

              </DashboardLayout>

            </ProtectedRoute>

          }
        />


        {/* =====================================================
            ENROLLMENTS
            ADMIN + STUDENT
        ===================================================== */}

        <Route
          path="/enrollments"
          element={

            <ProtectedRoute>

              <DashboardLayout>

                <Enrollments />

              </DashboardLayout>

            </ProtectedRoute>

          }
        />


        {/* =====================================================
            PROFILE
            ADMIN + STUDENT
        ===================================================== */}

        <Route
          path="/profile"
          element={

            <ProtectedRoute>

              <DashboardLayout>

                <Profile />

              </DashboardLayout>

            </ProtectedRoute>

          }
        />


        {/* =====================================================
            CHANGE PASSWORD
            ADMIN + STUDENT
        ===================================================== */}

        <Route
          path="/change-password"
          element={

            <ProtectedRoute>

              <DashboardLayout>

                <ChangePassword />

              </DashboardLayout>

            </ProtectedRoute>

          }
        />


        {/* =====================================================
            ABOUT
            ADMIN + STUDENT
        ===================================================== */}

        <Route
          path="/about"
          element={

            <ProtectedRoute>

              <DashboardLayout>

                <About />

              </DashboardLayout>

            </ProtectedRoute>

          }
        />


        {/* =====================================================
            SETTINGS
            ADMIN + STUDENT
        ===================================================== */}

        <Route
          path="/settings"
          element={

            <ProtectedRoute>

              <DashboardLayout>

                <Settings />

              </DashboardLayout>

            </ProtectedRoute>

          }
        />


        {/* =====================================================
            ADMIN PANEL
            ADMIN ONLY
        ===================================================== */}

        <Route
          path="/admin"
          element={

            <AdminRoute>

              <DashboardLayout>

                <AdminPanel />

              </DashboardLayout>

            </AdminRoute>

          }
        />


        {/* =====================================================
            UNKNOWN URL
            REDIRECT TO DASHBOARD
        ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />


      </Routes>

    </ThemeProvider>

  );

}


export default App;
