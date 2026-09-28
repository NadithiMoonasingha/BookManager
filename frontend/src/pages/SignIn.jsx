import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../axios/axios";
import Icon from "../components/Icons";

function SignIn() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userEmail: "",
        userPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/login",
                formData
            );

            const data = response.data;

            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("userName", data.userName);
            localStorage.setItem("userEmail", data.userEmail);
            localStorage.setItem("userRole", data.userRole);

            navigate("/Sign in");

        } catch (error) {

            if (error.response?.data) {
                setError(error.response.data);
            } else {
                setError("Unable to sign in. Please try again.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-decoration auth-decoration-top"></div>
            <div className="auth-decoration auth-decoration-bottom"></div>

            <div className="auth-card">

                {/* Header */}
                <div className="auth-header">

                    <h1>Sign In</h1>

                    <p>
                        Sign in to your Book Manager account
                    </p>

                </div>

                {/* Error */}
                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Email</label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                <Icon name="email" size={21} />
                            </span>

                            <input
                                type="email"
                                name="userEmail"
                                value={formData.userEmail}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                <Icon name="lock" size={21} />
                            </span>

                            <input
                                type="password"
                                name="userPassword"
                                value={formData.userPassword}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />

                        </div>

                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        className="signin-button"
                        disabled={loading}
                    >
                        {loading ? (
                            "Signing In..."
                        ) : (
                            <>
                                Sign In
                            </>
                        )}
                    </button>

                </form>

                {/* Divider */}
                <div className="auth-divider">
                    <span></span>
                    <p>OR</p>
                    <span></span>
                </div>

                {/* Sign Up */}
                <div className="auth-footer">

                    <p>Don't have an account?</p>

                    <Link
                        to="/signup"
                        className="signup-button"
                    >
                        Sign Up
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default SignIn;