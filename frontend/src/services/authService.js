import api from "./api";

const API_BASE_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:8080" : "");


// =========================================================
// LOGIN
// =========================================================

export const loginUser = async (email, password) => {

    const response = await api.post(
        "/auth/login",
        {
            email,
            password,
        }
    );

    return response.data;
};


// =========================================================
// REGISTER
// =========================================================

export const registerUser = async (
    email,
    password,
    role
) => {

    const response = await api.post(
        "/auth/register",
        {
            email,
            password,
            role,
        }
    );

    return response.data;
};


// =========================================================
// SAVE JWT TOKEN
// =========================================================

export const saveToken = (token) => {

    if (token) {

        localStorage.setItem(
            "token",
            token
        );

    }

};


// =========================================================
// GET JWT TOKEN
// =========================================================

export const getToken = () => {

    return localStorage.getItem(
        "token"
    );

};


// =========================================================
// SAVE USER ROLE
// =========================================================

export const saveUserRole = (role) => {

    if (role) {

        localStorage.setItem(
            "userRole",
            role
        );

    }

};


// =========================================================
// GET USER ROLE
// =========================================================

export const getUserRole = () => {

    return localStorage.getItem(
        "userRole"
    );

};


// =========================================================
// SAVE LOGIN DATA
// =========================================================
// Login response me token + role dono aaye
// to dono localStorage me save honge.

export const saveLoginData = (data) => {

    if (!data) {
        return;
    }


    // -----------------------------------------------------
    // SAVE TOKEN
    // -----------------------------------------------------

    if (data.token) {
        saveToken(data.token);
    }


    // -----------------------------------------------------
    // SAVE ROLE
    // -----------------------------------------------------

    if (data.role) {
        saveUserRole(data.role);
    }


    // -----------------------------------------------------
    // SAVE EMAIL & USER ID
    // -----------------------------------------------------

    if (data.email) {
        localStorage.setItem("userEmail", data.email);

        if (data.name && data.name.trim() && data.name.trim().toLowerCase() !== "user") {
            localStorage.setItem("userName", data.name.trim());
        } else {
            let prefix = data.email.split("@")[0].replace(/\d+$/, "").replace(/[._\-+]/g, " ");
            if (!prefix.includes(" ")) {
                prefix = prefix.replace(/(rahul)(singh)?(kushwaha)?/i, (m, p1, p2, p3) => [p1, p2, p3].filter(Boolean).join(" "));
            }
            const cleanName = prefix.replace(/\b\w/g, (c) => c.toUpperCase()).trim() || "Student";
            localStorage.setItem("userName", cleanName);
        }
    }

    if (data.userId) {
        localStorage.setItem("userId", String(data.userId));
    }

};


// =========================================================
// LOGOUT
// =========================================================

export const logoutUser = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");

};


// =========================================================
// CHECK LOGIN
// =========================================================

export const isLoggedIn = () => {

    const token =
        getToken();

    return !!token;

};


// =========================================================
// CHECK ADMIN
// =========================================================

export const isAdmin = () => {

    return (
        getUserRole() === "ADMIN"
    );

};


// =========================================================
// CHECK STUDENT
// =========================================================

export const isStudent = () => {

    return (
        getUserRole() === "STUDENT"
    );

};
// =========================================================
// CHANGE PASSWORD
// =========================================================

export const changePassword = async (passwordData) => {

    const token =
        localStorage.getItem("token");


    const response =
        await fetch(
            `${API_BASE_URL}/profile/change-password`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify(
                    passwordData
                )
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data?.message ||
            "Unable to change password."
        );

    }


    return data;
};
