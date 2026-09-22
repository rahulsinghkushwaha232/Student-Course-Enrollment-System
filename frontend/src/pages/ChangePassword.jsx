import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { changePassword } from "../services/authService";

import "../styles/ChangePassword.css";


function ChangePassword() {

    const navigate = useNavigate();


    // =========================================================
    // FORM STATE
    // =========================================================

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });


    // =========================================================
    // MESSAGE STATE
    // =========================================================

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

    };


    // =========================================================
    // HANDLE SUBMIT
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        setMessage("");

        setError("");


        // =====================================================
        // VALIDATION
        // =====================================================

        if (
            !formData.currentPassword ||
            !formData.newPassword ||
            !formData.confirmPassword
        ) {

            setError(
                "Please fill all password fields."
            );

            return;
        }


        if (formData.newPassword.length < 6) {

            setError(
                "New password must contain at least 6 characters."
            );

            return;
        }


        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {

            setError(
                "New password and confirm password do not match."
            );

            return;
        }


        // =====================================================
        // API REQUEST
        // =====================================================

        try {

            setLoading(true);


            const response =
                await changePassword(formData);


            setMessage(
                response?.message ||
                "Password changed successfully."
            );


            // =================================================
            // CLEAR FORM
            // =================================================

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });


            // =================================================
            // REDIRECT AFTER SUCCESS
            // =================================================

            setTimeout(() => {

                navigate("/profile");

            }, 1500);


        } catch (error) {

            console.error(
                "Change password error:",
                error
            );


            setError(
                error?.message ||
                "Unable to change password."
            );


        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="change-password-page">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="change-password-header">

                <h1>
                    Change Password
                </h1>

                <p>
                    Update your account password securely.
                </p>

            </div>


            {/* =================================================
                PASSWORD CARD
            ================================================= */}

            <div className="change-password-card">


                <div className="password-icon">
                    🔐
                </div>


                <h2>
                    Update Password
                </h2>


                <p className="password-description">
                    Enter your current password and choose
                    a new password for your account.
                </p>


                {/* =================================================
                    SUCCESS MESSAGE
                ================================================= */}

                {message && (

                    <div className="success-message">

                        ✅ {message}

                    </div>

                )}


                {/* =================================================
                    ERROR MESSAGE
                ================================================= */}

                {error && (

                    <div className="error-message">

                        ❌ {error}

                    </div>

                )}


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="change-password-form"
                >


                    {/* =============================================
                        CURRENT PASSWORD
                    ============================================= */}

                    <div className="form-group">

                        <label>
                            Current Password
                        </label>

                        <input
                            type="password"
                            name="currentPassword"
                            value={
                                formData.currentPassword
                            }
                            onChange={handleChange}
                            placeholder="Enter current password"
                            autoComplete="current-password"
                        />

                    </div>


                    {/* =============================================
                        NEW PASSWORD
                    ============================================= */}

                    <div className="form-group">

                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            name="newPassword"
                            value={
                                formData.newPassword
                            }
                            onChange={handleChange}
                            placeholder="Enter new password"
                            autoComplete="new-password"
                        />

                    </div>


                    {/* =============================================
                        CONFIRM PASSWORD
                    ============================================= */}

                    <div className="form-group">

                        <label>
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={
                                formData.confirmPassword
                            }
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                        />

                    </div>


                    {/* =============================================
                        BUTTONS
                    ============================================= */}

                    <div className="password-buttons">


                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate("/profile")
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="change-password-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Changing Password..."
                                : "Change Password"
                            }

                        </button>


                    </div>


                </form>


            </div>

        </div>

    );

}


export default ChangePassword;