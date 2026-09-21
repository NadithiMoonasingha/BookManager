import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import api from "../axios/axios";

function SignUp() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        userName: "",
        userEmail: "",
        userPassword: "",
        confirmPassword: "",
        userRole: ""
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");

        if (user.userPassword !== user.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (user.userPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (!user.userRole) {
            setError("Please select a user role.");
            return;
        }

        setLoading(true);

        try {

            await api.post("/auth/signup", {
                userName: user.userName,
                userEmail: user.userEmail,
                userPassword: user.userPassword,
                userRole: user.userRole
            });

            setMessage(
                "Account created successfully. You can now sign in."
            );

            setUser({
                userName: "",
                userEmail: "",
                userPassword: "",
                confirmPassword: "",
                userRole: ""
            });

            setTimeout(() => {
                navigate("/signin");
            }, 1500);

        } catch (error) {

            console.error(
                "Sign up error:",
                error
            );

            setError(
                typeof error.response?.data === "string"
                    ? error.response.data
                    : error.response?.data?.message ||
                      "Unable to create account."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <h1>
                        Create Account
                    </h1>

                    <p>
                        Sign up to access the Book Manager.
                    </p>

                </div>

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="userName"
                            value={user.userName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="userEmail"
                            value={user.userEmail}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="userPassword"
                            value={user.userPassword}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={user.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Account Type
                        </label>

                        <select
                            name="userRole"
                            value={user.userRole}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Account Type
                            </option>

                            <option value="MEMBER">
                                Member
                            </option>

                            <option value="LIBRARIAN">
                                Librarian
                            </option>

                        </select>

                    </div>

                    <button
                        type="submit"
                        className="primary-button auth-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Sign Up"}

                    </button>

                </form>

                <div className="auth-footer">

                    <p>
                        Already have an account?{" "}

                        <Link to="/signin">
                            Sign In
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default SignUp;