import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  Info,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import "../styles/Sidebar.css";


function Sidebar() {

  const navigate = useNavigate();


  // =========================================================
  // GET LOGGED-IN USER ROLE
  // =========================================================

  const userRole =
    localStorage.getItem("userRole") || "STUDENT";


  const isAdmin =
    userRole === "ADMIN";


  // =========================================================
  // MAIN MENU
  // =========================================================

  const menuItems = [

    {
      title: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={20} />,
    },

    {
      title: "Students",
      path: "/students",
      icon: <Users size={20} />,
    },

    {
      title: "Courses",
      path: "/courses",
      icon: <BookOpen size={20} />,
    },

    {
      title: "Enrollments",
      path: "/enrollments",
      icon: <ClipboardList size={20} />,
    },

  ];


  // =========================================================
  // SYSTEM MENU
  // =========================================================

  const systemItems = [

    {
      title: "About",
      path: "/about",
      icon: <Info size={20} />,
    },

    {
      title: "Settings",
      path: "/settings",
      icon: <Settings size={20} />,
    },

  ];


  // =========================================================
  // ADMIN MENU
  // =========================================================

  const adminItems = [

    {
      title: "Admin Panel",
      path: "/admin",
      icon: <ShieldCheck size={20} />,
    },

  ];


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    // Remove JWT
    localStorage.removeItem("token");

    // Remove role
    localStorage.removeItem("userRole");

    // Remove any saved user information
    localStorage.removeItem("userEmail");

    // Go to login page
    navigate("/login");

  };


  // =========================================================
  // SIDEBAR
  // =========================================================

  return (

    <aside className="sidebar">


      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="sidebar-logo">

        <div className="logo-icon">
          🎓
        </div>

        <div className="logo-text">

          <h2>
            StudentsSys
          </h2>

          <span>
            Enrollment System
          </span>

        </div>

      </div>


      {/* =====================================================
          MAIN MENU
      ===================================================== */}

      <div className="sidebar-section">

        <p className="sidebar-title">
          MAIN MENU
        </p>


        <nav className="sidebar-nav">

          {menuItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >

              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span>
                {item.title}
              </span>

            </NavLink>

          ))}

        </nav>

      </div>


      {/* =====================================================
          ADMIN MENU
          ONLY ADMIN CAN SEE THIS
      ===================================================== */}

      {isAdmin && (

        <div className="sidebar-section">

          <p className="sidebar-title">
            ADMINISTRATION
          </p>


          <nav className="sidebar-nav">

            {adminItems.map((item) => (

              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >

                <span className="sidebar-icon">
                  {item.icon}
                </span>

                <span>
                  {item.title}
                </span>

              </NavLink>

            ))}

          </nav>

        </div>

      )}


      {/* =====================================================
          SYSTEM
      ===================================================== */}

      <div className="sidebar-section system-section">

        <p className="sidebar-title">
          SYSTEM
        </p>


        <nav className="sidebar-nav">

          {systemItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >

              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span>
                {item.title}
              </span>

            </NavLink>

          ))}

        </nav>

      </div>


      {/* =====================================================
          LOGOUT
          ONLY LOGOUT AT BOTTOM
      ===================================================== */}

      <div className="sidebar-bottom">

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >

          <LogOut size={20} />

          <span>
            Logout
          </span>

        </button>

      </div>


    </aside>

  );

}


export default Sidebar;