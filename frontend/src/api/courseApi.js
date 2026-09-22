import api from "../services/api";


// =====================================================
// GET ALL COURSES
// =====================================================

export const getCourses = () => {

  return api.get("/courses");

};


// =====================================================
// GET COURSE BY ID
// =====================================================

export const getCourseById = (id) => {

  return api.get(`/courses/${id}`);

};


// =====================================================
// ADD COURSE
// =====================================================

export const addCourse = (courseData) => {

  return api.post("/courses", courseData);

};


// =====================================================
// UPDATE COURSE
// =====================================================

export const updateCourse = (id, courseData) => {

  return api.put(
    `/courses/${id}`,
    courseData
  );

};


// =====================================================
// DELETE COURSE
// =====================================================

export const deleteCourse = (id) => {

  return api.delete(`/courses/${id}`);

};