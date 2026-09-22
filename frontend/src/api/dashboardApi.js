import axios from "axios";

const API = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8080" : "");

export const getStudents = () => {
  return axios.get(`${API}/students`);
};

export const getCourses = () => {
  return axios.get(`${API}/courses`);
};

export const getEnrollments = () => {
  return axios.get(`${API}/enrollments`);
};
