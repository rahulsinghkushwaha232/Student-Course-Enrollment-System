import axios from "axios";


// =========================================================
// AXIOS API CONFIGURATION
// =========================================================

const api = axios.create({

    // Development uses the local Spring Boot server. In production the React
    // build is served by Spring Boot, so API calls must stay on the same host.
    baseURL: import.meta.env.VITE_API_URL ||
        (import.meta.env.DEV ? "http://localhost:8080" : ""),

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
