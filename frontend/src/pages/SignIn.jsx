import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios";

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

            // Save authentication information
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("userName", data.userName);
            localStorage.setItem("userEmail", data.userEmail);
            localStorage.setItem("userRole", data.userRole);

            // Go to dashboard
            navigate("/");

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

            <div className="auth-card">

                <h1>Sign In</h1>

                <p className="auth-subtitle">
                    Sign in to your Book Manager account
                </p>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            name="userEmail"
                            value={formData.userEmail}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            name="userPassword"
                            value={formData.userPassword}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                </form>

                <p className="auth-link">

                    Don't have an account?{" "}

                    <span onClick={() => navigate("/signup")}>
                        Sign Up
                    </span>

                </p>

            </div>

        </div>
    );
}

export default SignIn;