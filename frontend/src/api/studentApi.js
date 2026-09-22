import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:8080" : "")}/students`;


// =====================================================
// GET STUDENTS
// =====================================================

export const getStudents = () => {

    const token = localStorage.getItem("token");

    return axios.get(API_URL, {

        headers: {

            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json"

        }

    });

};


// =====================================================
// ADD STUDENT
// =====================================================

export const addStudent = (student) => {

    const token = localStorage.getItem("token");

    return axios.post(
        API_URL,
        student,
        {

            headers: {

                Authorization: `Bearer ${token}`,

                "Content-Type": "application/json"

            }

        }
    );

};


// =====================================================
// DELETE STUDENT
// =====================================================

export const deleteStudent = (id) => {

    const token = localStorage.getItem("token");

    return axios.delete(
        `${API_URL}/${id}`,
        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }
    );

};

export const updateStudent = (student) => {

    const token = localStorage.getItem("token");

    return axios.put(API_URL, student, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

};
