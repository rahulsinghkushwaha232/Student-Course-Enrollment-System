import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  Info,
  Settings,
  LogOut,
  UserCircle,
  Search,
  ChevronDown,
  X,
  ShieldCheck,
  KeyRound,
  User,
} from "lucide-react";

import "../styles/DashboardLayout.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";


function DashboardLayout({ children }) {

  const navigate = useNavigate();


  // =========================================================
  // SEARCH STATES
  // =========================================================

  const [searchQuery, setSearchQuery] = useState("");

  const [searchData, setSearchData] = useState({
    students: [],
    courses: [],
    enrollments: [],
  });

  const [searchLoading, setSearchLoading] = useState(false);

  const searchWrapperRef = useRef(null);

  const searchInputRef = useRef(null);


  // =========================================================
  // USER STATE
  // =========================================================

  const userRole  = localStorage.getItem("userRole")  || "STUDENT";
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [profileImage, setProfileImage] = useState(localStorage.getItem("userProfileImage") || "");
  const isAdmin   = userRole === "ADMIN";

  // Smart Name Formatter: Produces a clean human name (e.g. "Rahul Singh Kushwaha")
  const formatFriendlyName = (name, email) => {
    if (name && name.trim() && name.trim().toLowerCase() !== "user") {
      return name.trim();
    }
    if (!email) return "Student";
    let prefix = email.split("@")[0] || "";
    prefix = prefix.replace(/\d+$/, "");
    prefix = prefix.replace(/([a-z])([A-Z])/g, "$1 $2");
    prefix = prefix.replace(/[._\-+]/g, " ");
    if (!prefix.includes(" ")) {
      prefix = prefix.replace(/(rahul)(singh)?(kushwaha)?/i, (m, p1, p2, p3) =>
        [p1, p2, p3].filter(Boolean).join(" ")
      );
    }
    const clean = prefix.replace(/\b\w/g, (c) => c.toUpperCase()).trim();
    return clean || "Student";
  };

  const displayName = formatFriendlyName(userName, userEmail);
  const userInitial = displayName ? displayName.charAt(0).toUpperCase() : "U";

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Sync profile data on mount
  useEffect(() => {
    // If not set or equals "User", save clean name immediately
    const existingName = localStorage.getItem("userName");
    if (!existingName || existingName.toLowerCase() === "user") {
      const calculated = formatFriendlyName("", userEmail);
      localStorage.setItem("userName", calculated);
      setUserName(calculated);
    }

    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            if (data.name && data.name.trim() && data.name.trim().toLowerCase() !== "user") {
              setUserName(data.name.trim());
              localStorage.setItem("userName", data.name.trim());
            }
            if (data.profileImage) {
              setProfileImage(data.profileImage);
              localStorage.setItem("userProfileImage", data.profileImage);
            }
          }
        })
        .catch(() => {});
    }
  }, [userEmail]);


  // =========================================================
  // CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    navigate("/login");
  };


  // =========================================================
  // LOAD SEARCH DATA
  // =========================================================

  useEffect(() => {

    const loadSearchData = async () => {

      setSearchLoading(true);

      try {

        const token = localStorage.getItem("token");

        const headers = {
          "Content-Type": "application/json",
        };


        if (token) {

          headers.Authorization = `Bearer ${token}`;

        }


        const [
          studentsResponse,
          coursesResponse,
          enrollmentsResponse,
        ] = await Promise.all([

          fetch(`${API_BASE_URL}/students`, {
            headers,
          }),

          fetch(`${API_BASE_URL}/courses`, {
            headers,
          }),

          fetch(`${API_BASE_URL}/enrollments`, {
            headers,
          }),

        ]);


        const students =
          studentsResponse.ok
            ? await studentsResponse.json()
            : [];


        const courses =
          coursesResponse.ok
            ? await coursesResponse.json()
            : [];


        const enrollments =
          enrollmentsResponse.ok
            ? await enrollmentsResponse.json()
            : [];


        setSearchData({

          students:
            Array.isArray(students)
              ? students
              : [],

          courses:
            Array.isArray(courses)
              ? courses
              : [],

          enrollments:
            Array.isArray(enrollments)
              ? enrollments
              : [],

        });

      } catch (error) {

        console.error(
          "Search data loading error:",
          error
        );


        setSearchData({

          students: [],

          courses: [],

          enrollments: [],

        });

      } finally {

        setSearchLoading(false);

      }

    };


    loadSearchData();

  }, []);


  // =========================================================
  // HELPER - CONVERT VALUE TO SEARCHABLE TEXT
  // =========================================================

  const valueToText = useCallback((value) => {

    if (
      value === null ||
      value === undefined
    ) {

      return "";

    }


    if (typeof value === "object") {

      try {

        return Object.values(value)
          .map((item) => valueToText(item))
          .join(" ");

      } catch {

        return "";

      }

    }


    return String(value);

  }, []);


  // =========================================================
  // SEARCH RESULTS
  // =========================================================

  const searchResults = useMemo(() => {

    const query = searchQuery
      .trim()
      .toLowerCase();


    if (!query) {

      return [];

    }


    const results = [];


    // =======================================================
    // STUDENTS
    // =======================================================

    searchData.students.forEach((student) => {

      const searchableText =
        Object.values(student)
          .map((value) => valueToText(value))
          .join(" ")
          .toLowerCase();


      if (
        searchableText.includes(query)
      ) {

        results.push({

          type: "student",

          label:
            student.name ||
            student.studentName ||
            student.fullName ||
            "Student",

          description:
            student.email ||
            student.phone ||
            student.contact ||
            "Student record",

          icon: "student",

          path: "/students",

        });

      }

    });


    // =======================================================
    // COURSES
    // =======================================================

    searchData.courses.forEach((course) => {

      const searchableText =
        Object.values(course)
          .map((value) => valueToText(value))
          .join(" ")
          .toLowerCase();


      if (
        searchableText.includes(query)
      ) {

        results.push({

          type: "course",

          label:
            course.name ||
            course.courseName ||
            course.title ||
            "Course",

          description:
            course.duration
              ? `${course.duration}`
              : course.instructor
              ? `Instructor: ${course.instructor}`
              : "Course record",

          icon: "course",

          path: "/courses",

        });

      }

    });


    // =======================================================
    // ENROLLMENTS
    // =======================================================

    searchData.enrollments.forEach((enrollment) => {

      const searchableText =
        Object.values(enrollment)
          .map((value) => valueToText(value))
          .join(" ")
          .toLowerCase();


      if (
        searchableText.includes(query)
      ) {

        const studentName =
          enrollment.student?.name ||
          enrollment.studentName ||
          enrollment.name ||
          "Enrollment";


        const courseName =
          enrollment.course?.name ||
          enrollment.courseName ||
          enrollment.course ||
          "";


        results.push({

          type: "enrollment",

          label: studentName,

          description:
            courseName
              ? `${courseName}`
              : "Enrollment record",

          icon: "enrollment",

          path: "/enrollments",

        });

      }

    });


    return results.slice(0, 8);

  }, [
    searchQuery,
    searchData,
    valueToText,
  ]);


  // =========================================================
  // SEARCH RESULT CLICK
  // =========================================================

  const handleSearchResultClick = (result) => {

    setSearchQuery("");

    navigate(result.path);

  };


  // =========================================================
  // ENTER KEY SEARCH
  // =========================================================

  const handleSearchKeyDown = (event) => {

    if (event.key === "Enter") {

      event.preventDefault();


      if (searchResults.length > 0) {

        handleSearchResultClick(
          searchResults[0]
        );

      }

    }


    if (event.key === "Escape") {

      setSearchQuery("");

      searchInputRef.current?.blur();

    }

  };


  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const handleClearSearch = () => {

    setSearchQuery("");

    searchInputRef.current?.focus();

  };


  // =========================================================
  // SEARCH RESULT ICON
  // =========================================================

  const getResultIcon = (type) => {

    if (type === "student") {

      return <Users size={18} />;

    }


    if (type === "course") {

      return <BookOpen size={18} />;

    }


    return <ClipboardList size={18} />;

  };


  // =========================================================
  // RETURN
  // =========================================================

  return (

    <div className="dashboard-layout">


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="dashboard-sidebar">


        {/* =================================================
            PROJECT LOGO / NAME
        ================================================= */}

        <div className="sidebar-logo">

          <div className="sidebar-logo-icon">
            🎓
          </div>


          <div className="sidebar-project-info">

            <h2 className="sidebar-project-name">
              Student Course Enrollment System
            </h2>

          </div>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="sidebar-navigation">


          {/* ================= MAIN MENU ================= */}

          <p className="sidebar-section-title">
            MAIN MENU
          </p>


          {/* =================================================
              DASHBOARD
          ================================================= */}

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >

            <span className="sidebar-link-icon">

              <LayoutDashboard size={20} />

            </span>

            <span>
              Dashboard
            </span>

          </NavLink>


          {/* =================================================
              STUDENTS
          ================================================= */}

          <NavLink
            to="/students"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >

            <span className="sidebar-link-icon">

              <Users size={20} />

            </span>

            <span>
              Students
            </span>

          </NavLink>


          {/* =================================================
              COURSES
          ================================================= */}

          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >

            <span className="sidebar-link-icon">

              <BookOpen size={20} />

            </span>

            <span>
              Courses
            </span>

          </NavLink>


          {/* =================================================
              ENROLLMENTS
          ================================================= */}

          <NavLink
            to="/enrollments"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >

            <span className="sidebar-link-icon">

              <ClipboardList size={20} />

            </span>

            <span>
              Enrollments
            </span>

          </NavLink>


          {/* ================= ADMIN ================= */}

          {isAdmin && (
            <>
              <p className="sidebar-section-title sidebar-second-section">
                ADMINISTRATION
              </p>

              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `sidebar-link sidebar-admin-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <span className="sidebar-link-icon">
                  <ShieldCheck size={20} />
                </span>
                <span>Admin Panel</span>
              </NavLink>
            </>
          )}


          {/* ================= SYSTEM ================= */}

          <p className="sidebar-section-title sidebar-second-section">
            SYSTEM
          </p>


          {/* =================================================
              PROFILE
          ================================================= */}

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="sidebar-link-icon">
              <UserCircle size={20} />
            </span>
            <span>Profile</span>
          </NavLink>


          {/* =================================================
              ABOUT
          ================================================= */}

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="sidebar-link-icon">
              <Info size={20} />
            </span>
            <span>About</span>
          </NavLink>


          {/* =================================================
              SETTINGS
          ================================================= */}

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="sidebar-link-icon">
              <Settings size={20} />
            </span>
            <span>Settings</span>
          </NavLink>


        </nav>


        {/* =================================================
            SIDEBAR FOOTER
        ================================================= */}

        <div className="sidebar-footer">

          <button
            type="button"
            className="sidebar-logout-button"
            onClick={handleLogout}
          >

            <LogOut size={20} />

            <span>
              Logout
            </span>

          </button>

        </div>


      </aside>


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <main className="dashboard-main">


        {/* =================================================
            PROFESSIONAL TOP HEADER
        ================================================= */}

        <header className="topbar">


          {/* =================================================
              SEARCH AREA
          ================================================= */}

          <div
            className="topbar-search-wrapper"
            ref={searchWrapperRef}
          >

            <div className="topbar-search">

              <Search
                size={21}
                className="topbar-search-icon"
              />


              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                onKeyDown={handleSearchKeyDown}
                placeholder="Search students, courses, enrollments..."
                aria-label="Search students, courses, enrollments"
                autoComplete="off"
              />


              {searchQuery && (

                <button
                  type="button"
                  className="topbar-search-clear"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  title="Clear search"
                >

                  <X size={17} />

                </button>

              )}

            </div>


            {/* =================================================
                SEARCH RESULTS DROPDOWN
            ================================================= */}

            {searchQuery.trim() && (

              <div className="search-results-dropdown">


                {/* =================================================
                    LOADING
                ================================================= */}

                {searchLoading ? (

                  <div className="search-result-empty">

                    <span>
                      Searching...
                    </span>

                  </div>

                ) : searchResults.length > 0 ? (

                  <>


                    {/* =================================================
                        SEARCH HEADER
                    ================================================= */}

                    <div className="search-results-header">

                      <span>
                        Search Results
                      </span>

                      <small>
                        {searchResults.length} found
                      </small>

                    </div>


                    {/* =================================================
                        SEARCH ITEMS
                    ================================================= */}

                    {searchResults.map(
                      (result, index) => (

                        <button
                          type="button"
                          className="search-result-item"
                          key={`${result.type}-${result.label}-${index}`}
                          onClick={() =>
                            handleSearchResultClick(
                              result
                            )
                          }
                        >

                          <span className="search-result-icon">

                            {getResultIcon(
                              result.type
                            )}

                          </span>


                          <span className="search-result-content">

                            <strong>
                              {result.label}
                            </strong>

                            <small>
                              {result.description}
                            </small>

                          </span>


                          <span className="search-result-type">

                            {result.type}

                          </span>

                        </button>

                      )
                    )}

                  </>

                ) : (

                  <div className="search-result-empty">

                    <Search size={20} />

                    <div>

                      <strong>
                        No results found
                      </strong>

                      <small>
                        Try another student, course or enrollment name.
                      </small>

                    </div>

                  </div>

                )}

              </div>

            )}

          </div>


          {/* =================================================
              TOP RIGHT AREA
          ================================================= */}

          <div className="topbar-right" ref={profileDropdownRef}>


            {/* =================================================
                USER PROFILE BUTTON
            ================================================= */}

            <div
              className={`topbar-user ${profileDropdownOpen ? "topbar-user-active" : ""}`}
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }
              }}
            >

              {/* USER AVATAR */}
              <div className={`topbar-user-avatar ${isAdmin ? "avatar-admin" : "avatar-student"}`}>
                {profileImage ? (
                  <img
                    src={profileImage.startsWith("http") ? profileImage : `${API_BASE_URL}${profileImage}`}
                    alt={displayName}
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>

              {/* USER INFO */}
              <div className="topbar-user-info">
                <span className="topbar-user-name">
                  {displayName}
                </span>
                <span className={`topbar-role-badge ${isAdmin ? "role-admin" : "role-student"}`}>
                  {userRole}
                </span>
              </div>

              {/* DROPDOWN ARROW */}
              <ChevronDown
                size={17}
                className={`topbar-user-arrow ${profileDropdownOpen ? "arrow-rotated" : ""}`}
              />

            </div>


            {/* =================================================
                PROFILE DROPDOWN MENU
            ================================================= */}

            {profileDropdownOpen && (
              <div className="profile-dropdown">

                <div className="profile-dropdown-header">
                  <div className={`dropdown-avatar ${isAdmin ? "avatar-admin" : "avatar-student"}`}>
                    {profileImage ? (
                      <img
                        src={profileImage.startsWith("http") ? profileImage : `${API_BASE_URL}${profileImage}`}
                        alt={displayName}
                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <span>{userInitial}</span>
                    )}
                  </div>
                  <div className="dropdown-user-details">
                    <strong className="dropdown-user-name">{displayName}</strong>
                    <span className="dropdown-user-email">{userEmail}</span>
                    <span className={`topbar-role-badge ${isAdmin ? "role-admin" : "role-student"}`}>
                      {userRole}
                    </span>
                  </div>
                </div>

                <div className="profile-dropdown-divider" />

                <button
                  type="button"
                  className="profile-dropdown-item"
                  onClick={() => { setProfileDropdownOpen(false); navigate("/profile"); }}
                >
                  <User size={17} />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  className="profile-dropdown-item"
                  onClick={() => { setProfileDropdownOpen(false); navigate("/change-password"); }}
                >
                  <KeyRound size={17} />
                  <span>Change Password</span>
                </button>

                <button
                  type="button"
                  className="profile-dropdown-item"
                  onClick={() => { setProfileDropdownOpen(false); navigate("/settings"); }}
                >
                  <Settings size={17} />
                  <span>Settings</span>
                </button>

                <div className="profile-dropdown-divider" />

                <button
                  type="button"
                  className="profile-dropdown-item profile-dropdown-logout"
                  onClick={() => { setProfileDropdownOpen(false); handleLogout(); }}
                >
                  <LogOut size={17} />
                  <span>Logout</span>
                </button>

              </div>
            )}


          </div>


        </header>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <section className="dashboard-content">

          {children}

        </section>


      </main>


    </div>

  );

}


export default DashboardLayout;
