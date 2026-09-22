import api from "../services/api";

// Get all enrollments
export const getEnrollments = () => {
  return api.get("/enrollments");
};

// Get enrollment by ID
export const getEnrollmentById = (id) => {
  return api.get(`/enrollments/${id}`);
};

// Add enrollment
export const addEnrollment = (enrollment) => {
  return api.post("/enrollments", enrollment);
};

// Update enrollment
export const updateEnrollment = (id, enrollment) => {
  return api.put(`/enrollments/${id}`, enrollment);
};

// Delete enrollment
export const deleteEnrollment = (id) => {
  return api.delete(`/enrollments/${id}`);
};