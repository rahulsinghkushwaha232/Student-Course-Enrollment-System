import axios from "axios";


// =========================================================
// AXIOS API CONFIGURATION
// =========================================================

const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",

    headers: {
        "Content-Type": "application/json",
    },

});


// =========================================================
// REQUEST INTERCEPTOR
// JWT TOKEN AUTOMATICALLY SEND KAREGA
// =========================================================

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;
    },


    (error) => {

        return Promise.reject(error);

    }

);


export default api;