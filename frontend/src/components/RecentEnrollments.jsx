import { useEffect, useState } from "react";
import { getEnrollments } from "../api/dashboardApi";

import "../styles/RecentEnrollments.css";

function RecentEnrollments() {

  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {

    loadEnrollments();

  }, []);

  const loadEnrollments = async () => {

    try {

      const response = await getEnrollments();

      setEnrollments(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="recent-enrollments">

      <h2>📝 Recent Enrollments</h2>

      <table>

        <thead>

          <tr>

            <th>ID</th>
            <th>Student</th>
            <th>Course</th>
            <th>Date</th>

          </tr>

        </thead>

        <tbody>

          {enrollments.map((enrollment) => (

            <tr key={enrollment.id}>

              <td>{enrollment.id}</td>

              <td>{enrollment.student.name}</td>

              <td>{enrollment.course.courseName}</td>

              <td>{enrollment.enrollmentDate}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default RecentEnrollments;