import { useEffect, useState } from "react";
import { getStudents } from "../api/dashboardApi";
import "../styles/RecentStudents.css";

function RecentStudents() {

  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="recent-students">

      <h2>👨‍🎓 Recent Students</h2>

      <table>

        <thead>

          <tr>

            <th>ID</th>

            <th>Name</th>

            <th>Email</th>

            <th>Course</th>

            <th>Phone</th>

          </tr>

        </thead>

        <tbody>

          {students.map((student) => (

            <tr key={student.id}>

              <td>{student.id}</td>

              <td>{student.name}</td>

              <td>{student.email}</td>

              <td>{student.course}</td>

              <td>{student.phone}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default RecentStudents;