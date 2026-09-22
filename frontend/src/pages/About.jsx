import {
  Info,
  Target,
  Code2,
  Server,
  Database,
  ShieldCheck,
  Users,
  BookOpen,
  ClipboardList,
  UserCircle,
  CheckCircle,
} from "lucide-react";

import "../styles/About.css";

function About() {
  return (
    <div className="about-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="about-header">

        <div className="about-title-section">

          <div className="about-title-icon">
            <Info size={27} />
          </div>

          <div>
            <h1>About Project</h1>

            <p>
              Learn more about the Student Course Enrollment System.
            </p>
          </div>

        </div>

      </div>


      {/* =====================================================
          PROJECT OVERVIEW
      ===================================================== */}

      <div className="about-card about-overview-card">

        <div className="about-card-header">

          <div className="about-card-icon">
            <BookOpen size={21} />
          </div>

          <div>
            <h2>Project Overview</h2>

            <p>
              Student Course Enrollment System
            </p>
          </div>

        </div>


        <p className="about-description">
          The Student Course Enrollment System is a web-based application
          designed to manage students, courses, and course enrollments
          efficiently. The system provides a centralized platform where
          administrators and students can manage academic information
          through a simple and professional interface.
        </p>

      </div>


      {/* =====================================================
          PROJECT OBJECTIVE
      ===================================================== */}

      <div className="about-card">

        <div className="about-card-header">

          <div className="about-card-icon">
            <Target size={21} />
          </div>

          <div>
            <h2>Project Objective</h2>

            <p>
              Purpose of developing this system
            </p>
          </div>

        </div>


        <div className="objective-content">

          <p>
            The main objective of this project is to simplify student
            and course management by providing a secure, organized,
            and user-friendly enrollment system.
          </p>

          <ul>
            <li>Manage student information efficiently.</li>
            <li>Create and manage available courses.</li>
            <li>Manage student course enrollments.</li>
            <li>Provide secure user authentication.</li>
            <li>Maintain academic information in a centralized database.</li>
          </ul>

        </div>

      </div>


      {/* =====================================================
          TECHNOLOGY STACK
      ===================================================== */}

      <div className="about-card">

        <div className="about-card-header">

          <div className="about-card-icon">
            <Code2 size={21} />
          </div>

          <div>
            <h2>Technology Stack</h2>

            <p>
              Technologies used to build this project
            </p>
          </div>

        </div>


        <div className="technology-grid">

          {/* React */}
          <div className="technology-item">

            <div className="technology-icon">
              <Code2 size={22} />
            </div>

            <div>
              <strong>React</strong>
              <span>Frontend</span>
            </div>

          </div>


          {/* Spring Boot */}
          <div className="technology-item">

            <div className="technology-icon">
              <Server size={22} />
            </div>

            <div>
              <strong>Spring Boot</strong>
              <span>Backend</span>
            </div>

          </div>


          {/* MySQL */}
          <div className="technology-item">

            <div className="technology-icon">
              <Database size={22} />
            </div>

            <div>
              <strong>MySQL</strong>
              <span>Database</span>
            </div>

          </div>


          {/* Spring Security */}
          <div className="technology-item">

            <div className="technology-icon">
              <ShieldCheck size={22} />
            </div>

            <div>
              <strong>Spring Security</strong>
              <span>Authentication & Security</span>
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          SYSTEM FEATURES
      ===================================================== */}

      <div className="about-card">

        <div className="about-card-header">

          <div className="about-card-icon">
            <CheckCircle size={21} />
          </div>

          <div>
            <h2>System Features</h2>

            <p>
              Main features available in the application
            </p>
          </div>

        </div>


        <div className="features-grid">

          {/* Student Management */}
          <div className="feature-item">

            <Users size={21} />

            <div>
              <strong>Student Management</strong>

              <span>
                Add, view, update, and manage student information.
              </span>
            </div>

          </div>


          {/* Course Management */}
          <div className="feature-item">

            <BookOpen size={21} />

            <div>
              <strong>Course Management</strong>

              <span>
                Create and manage courses available to students.
              </span>
            </div>

          </div>


          {/* Enrollment Management */}
          <div className="feature-item">

            <ClipboardList size={21} />

            <div>
              <strong>Enrollment Management</strong>

              <span>
                Manage student enrollment in different courses.
              </span>
            </div>

          </div>


          {/* User Profile */}
          <div className="feature-item">

            <UserCircle size={21} />

            <div>
              <strong>Profile Management</strong>

              <span>
                Manage profile information and account settings.
              </span>
            </div>

          </div>


          {/* Security */}
          <div className="feature-item">

            <ShieldCheck size={21} />

            <div>
              <strong>Secure Authentication</strong>

              <span>
                JWT-based authentication with Spring Security.
              </span>
            </div>

          </div>


          {/* Dashboard */}
          <div className="feature-item">

            <Target size={21} />

            <div>
              <strong>Professional Dashboard</strong>

              <span>
                View important student, course, and enrollment statistics.
              </span>
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          ARCHITECTURE
      ===================================================== */}

      <div className="about-card">

        <div className="about-card-header">

          <div className="about-card-icon">
            <Server size={21} />
          </div>

          <div>
            <h2>Application Architecture</h2>

            <p>
              High-level technology architecture
            </p>
          </div>

        </div>


        <div className="architecture-flow">

          <div className="architecture-box">
            <Code2 size={23} />
            <strong>React</strong>
            <span>Frontend</span>
          </div>


          <div className="architecture-arrow">
            →
          </div>


          <div className="architecture-box">
            <Server size={23} />
            <strong>Spring Boot</strong>
            <span>REST API</span>
          </div>


          <div className="architecture-arrow">
            →
          </div>


          <div className="architecture-box">
            <Database size={23} />
            <strong>MySQL</strong>
            <span>Database</span>
          </div>

        </div>

      </div>


      {/* =====================================================
          PROJECT STATUS
      ===================================================== */}

      <div className="about-card about-status-card">

        <div className="project-status">

          <div>

            <span className="status-label">
              Project Status
            </span>

            <h2>
              Active Development
            </h2>

            <p>
              Student Course Enrollment System is actively being
              developed and enhanced with new features.
            </p>

          </div>


          <div className="project-status-badge">

            <span className="status-dot"></span>

            Active

          </div>

        </div>

      </div>


      {/* =====================================================
          DEVELOPER
      ===================================================== */}

      <div className="about-card developer-card">

        <div className="developer-content">

          <div className="developer-avatar">
            👨‍💻
          </div>

          <div>

            <span className="developer-label">
              Developed By
            </span>

            <h2>
              Rahul Singh Kushwaha
            </h2>

            <p>
              B.Tech Computer Science & Engineering
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default About;