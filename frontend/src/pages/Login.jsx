import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
    loginUser,
    saveLoginData
} from "../services/authService";


// =========================================================
// LOGIN PAGE
// =========================================================

function Login() {

    const navigate =
        useNavigate();


    // =========================================================
    // STATE
    // =========================================================

    const [email, setEmail] =
        useState("");


    const [password, setPassword] =
        useState("");


    const [error, setError] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    // =========================================================
    // LOGIN HANDLER
    // =========================================================

    const handleLogin = async (e) => {

        e.preventDefault();


        // -----------------------------------------------------
        // RESET ERROR
        // -----------------------------------------------------

        setError("");


        // -----------------------------------------------------
        // START LOADING
        // -----------------------------------------------------

        setLoading(true);


        try {


            // =================================================
            // CALL BACKEND LOGIN API
            // =================================================

            const data =
                await loginUser(
                    email,
                    password
                );


            console.log(
                "Login Response:",
                data
            );


            // =================================================
            // CHECK RESPONSE
            // =================================================

            if (
                !data ||
                !data.token
            ) {

                setError(
                    "Login failed. JWT token not received."
                );

                return;

            }


            // =================================================
            // SAVE TOKEN + ROLE
            // =================================================

            saveLoginData(
                data
            );


            // =================================================
            // GET ROLE
            // =================================================

            const role =
                data.role;


            console.log(
                "Logged in Role:",
                role
            );


            // =================================================
            // ROLE BASED REDIRECTION
            // =================================================

            if (
                role === "ADMIN"
            ) {

                navigate("/");

            }

            else if (
                role === "STUDENT"
            ) {

                navigate("/");

            }

            else {

                navigate("/");

            }


        }

        catch (error) {


            // =================================================
            // DEBUG ERROR
            // =================================================

            console.error(
                "Login Error:",
                error
            );


            // =================================================
            // 401 UNAUTHORIZED
            // =================================================

            if (
                error.response &&
                error.response.status === 401
            ) {

                setError(
                    "Invalid email or password."
                );

            }


            // =================================================
            // 403 FORBIDDEN
            // =================================================

            else if (
                error.response &&
                error.response.status === 403
            ) {

                setError(
                    "Access denied. Please check your account permissions."
                );

            }


            // =================================================
            // 400 BAD REQUEST
            // =================================================

            else if (
                error.response &&
                error.response.status === 400
            ) {

                setError(
                    "Invalid login request."
                );

            }


            // =================================================
            // BACKEND NOT RUNNING
            // =================================================

            else if (
                error.code === "ERR_NETWORK"
            ) {

                setError(
                    "Unable to connect to server. Please start Spring Boot."
                );

            }


            // =================================================
            // OTHER ERROR
            // =================================================

            else {

                setError(
                    "Login failed. Please try again."
                );

            }

        }

        finally {

            // -------------------------------------------------
            // STOP LOADING
            // -------------------------------------------------

            setLoading(false);

        }

    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="login-page">


            <div className="login-card">


                {/* =================================================
                    TITLE
                ================================================= */}

                <h1>
                    🔐 Login
                </h1>


                <p>
                    Student Course Enrollment System
                </p>


                {/* =================================================
                    ERROR MESSAGE
                ================================================= */}

                {error && (

                    <div className="login-error">

                        {error}

                    </div>

                )}


                {/* =================================================
                    LOGIN FORM
                ================================================= */}

                <form
                    onSubmit={
                        handleLogin
                    }
                >


                    {/* =================================================
                        EMAIL
                    ================================================= */}

                    <div className="form-group">

                        <label>
                            Email
                        </label>


                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={
                                (e) =>
                                    setEmail(
                                        e.target.value
                                    )
                            }
                            required
                        />

                    </div>


                    {/* =================================================
                        PASSWORD
                    ================================================= */}

                    <div className="form-group">

                        <label>
                            Password
                        </label>


                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={
                                (e) =>
                                    setPassword(
                                        e.target.value
                                    )
                            }
                            required
                        />

                    </div>


                    {/* =================================================
                        LOGIN BUTTON
                    ================================================= */}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>


                </form>


                {/* =================================================
                    REGISTER LINK
                ================================================= */}

                <p className="register-link">

                    Don't have an account?{" "}


                    <Link
                        to="/register"
                    >

                        Register

                    </Link>

                </p>


            </div>

        </div>

    );

}


export default Login;