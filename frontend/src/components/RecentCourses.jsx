import { useEffect, useState } from "react";
import { getCourses } from "../api/dashboardApi";

import "../styles/RecentCourses.css";

function RecentCourses() {

  const [courses, setCourses] = useState([]);

  useEffect(() => {

    loadCourses();

  }, []);

  const loadCourses = async () => {

    try {

      const response = await getCourses();

      setCourses(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="recent-courses">

      <h2>📚 Recent Courses</h2>

      <table>

        <thead>

          <tr>

            <th>ID</th>

            <th>Course</th>

            <th>Duration</th>

            <th>Instructor</th>

          </tr>

        </thead>

        <tbody>

          {courses.map((course) => (

            <tr key={course.id}>

              <td>{course.id}</td>

              <td>{course.courseName}</td>

              <td>{course.duration}</td>

              <td>{course.instructor}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default RecentCourses;