import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios";

function AddUser() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        userName: "",
        userEmail: "",
        userPassword: "",
        userRole: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            await api.post("/users", user);

            setMessage("User added successfully!");

            setTimeout(() => {
                navigate("/users");
            }, 1000);

        } catch (error) {
            console.error(error);
            setError("Unable to add user.");
        }
    };

    return (
        <div className="page-container">

            <div className="page-header">
                <div>
                    <h1>Add User</h1>
                    <p>Add a new user to the library.</p>
                </div>
            </div>

            <div className="form-card">

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>User Name</label>
                            <input
                                type="text"
                                name="userName"
                                value={user.userName}
                                onChange={handleChange}
                                placeholder="User Name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="userEmail"
                                value={user.userEmail}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="userPassword"
                                value={user.userPassword}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>User Role</label>
                            <select
                                name="userRole"
                                value={user.userRole}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="ADMIN">Admin</option>
                                <option value="LIBRARIAN">Librarian</option>
                                <option value="MEMBER">Member</option>
                                <option value="GUEST">Guest</option>
                            </select>
                        </div>

                    </div>

                    {message && (
                        <p className="success-message">
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <div className="form-buttons">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => navigate("/users")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Add User
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddUser;