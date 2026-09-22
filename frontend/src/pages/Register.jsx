import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";


function Register() {

    const navigate = useNavigate();


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [role, setRole] =
        useState("STUDENT");

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // =========================================================
    // REGISTER
    // =========================================================

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // -----------------------------------------------------
        // PASSWORD CHECK
        // -----------------------------------------------------

        if (password !== confirmPassword) {

            setError(
                "Passwords do not match"
            );

            return;
        }


        // -----------------------------------------------------
        // PASSWORD LENGTH
        // -----------------------------------------------------

        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters"
            );

            return;
        }


        setLoading(true);


        try {

            // -------------------------------------------------
            // API REQUEST
            // -------------------------------------------------

            await axios.post(
                `${API_BASE_URL}/auth/register`,
                {
                    email: email,
                    password: password,
                    role: role
                }
            );


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            setSuccess(
                "Registration successful! Redirecting to login..."
            );


            // -------------------------------------------------
            // REDIRECT TO LOGIN
            // -------------------------------------------------

            setTimeout(() => {

                navigate("/login");

            }, 1500);


        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );


            if (
                error.response &&
                error.response.status === 409
            ) {

                setError(
                    "Email already registered"
                );

            } else if (
                error.response &&
                error.response.data
            ) {

                setError(
                    typeof error.response.data === "string"
                        ? error.response.data
                        : "Registration failed"
                );

            } else {

                setError(
                    "Unable to connect to server. Please make sure Spring Boot is running."
                );
            }


        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="register-page">

            <div className="register-card">


                {/* =================================================
                    HEADER
                ================================================= */}

                <h1>
                    📝 Register
                </h1>


                <p>
                    Student Course Enrollment System
                </p>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="register-error">

                        {error}

                    </div>

                )}


                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (

                    <div className="register-success">

                        {success}

                    </div>

                )}


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleRegister}
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
                            onChange={(e) =>
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
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    {/* =================================================
                        CONFIRM PASSWORD
                    ================================================= */}

                    <div className="form-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    {/* =================================================
                        ROLE
                    ================================================= */}

                    <div className="form-group">

                        <label>
                            Register As
                        </label>

                        <select
                            value={role}
                            onChange={(e) =>
                                setRole(
                                    e.target.value
                                )
                            }
                        >

                            <option value="STUDENT">
                                Student
                            </option>

                            <option value="ADMIN">
                                Admin
                            </option>

                        </select>

                    </div>


                    {/* =================================================
                        REGISTER BUTTON
                    ================================================= */}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Registering..."
                            : "Register"
                        }

                    </button>


                </form>


                {/* =================================================
                    LOGIN LINK
                ================================================= */}

                <p className="login-link">

                    Already have an account?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>


            </div>

        </div>

    );

}


export default Register;