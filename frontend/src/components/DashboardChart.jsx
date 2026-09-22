import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import "../styles/DashboardChart.css";

function DashboardChart({ students, courses, enrollments }) {

  const data = [
    {
      name: "Students",
      total: students,
    },
    {
      name: "Courses",
      total: courses,
    },
    {
      name: "Enrollments",
      total: enrollments,
    },
  ];

  return (
    <div className="chart-container">

      <h2>📊 Dashboard Statistics</h2>

      <div
        style={{
          width: "100%",
          overflowX: "auto",
        }}
      >

        <BarChart
          width={700}
          height={320}
          data={data}
        >

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="total"
            fill="#2563eb"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>

      </div>

    </div>
  );
}

export default DashboardChart;