import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../axios/axios";
import Icon from "../components/Icons";

function SignUp() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userName: "",
        userEmail: "",
        userPassword: "",
        confirmPassword: "",
        userRole: "MEMBER",
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

        if (formData.userPassword !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {

            await api.post("/auth/signup", {
                userName: formData.userName,
                userEmail: formData.userEmail,
                userPassword: formData.userPassword,
                userRole: formData.userRole,
            });

            navigate("/signin");

        } catch (error) {

            if (error.response?.data) {
                setError(error.response.data);
            } else {
                setError("Unable to create account. Please try again.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-decoration auth-decoration-top"></div>
            <div className="auth-decoration auth-decoration-bottom"></div>

            <div className="auth-card signup-card">

                {/* Header */}
                <div className="auth-header">

                    <h1>Sign Up</h1>

                    <p>
                        Create your Book Manager account
                    </p>

                </div>

                {/* Error */}
                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="form-group">

                        <label>Name</label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                <Icon name="user" size={21} />
                            </span>

                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                            />

                        </div>

                    </div>

                    {/* Email */}
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

                    {/* Role */}
                    <div className="form-group">

                        <label>Role</label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                <Icon name="users" size={21} />
                            </span>

                            <select
                                name="userRole"
                                value={formData.userRole}
                                onChange={handleChange}
                                required
                            >
                                <option value="MEMBER">Member</option>
                                <option value="LIBRARIAN">Librarian</option>
                            </select>

                        </div>

                    </div>

                    {/* Password */}
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

                    {/* Confirm Password */}
                    <div className="form-group">

                        <label>Confirm Password</label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                <Icon name="lock" size={21} />
                            </span>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                            />

                        </div>

                    </div>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        className="signin-button signup-submit-button"
                        disabled={loading}
                    >
                        {loading ? (
                            "Creating Account..."
                        ) : (
                            <>
                                Create Account
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

                {/* Sign In */}
                <div className="auth-footer">

                    <p>Already have an account?</p>

                    <Link
                        to="/signin"
                        className="signup-button"
                    >
                        Sign In
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default SignUp;