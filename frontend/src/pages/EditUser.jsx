import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axios/axios";

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        userName: "",
        userEmail: "",
        userPassword: "",
        userRole: ""
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/users/${id}`)
            .then((response) => {
                const data = response.data;

                setUser({
                    userName: data.userName || "",
                    userEmail: data.userEmail || "",
                    userPassword: data.userPassword || "",
                    userRole: data.userRole || ""
                });

                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching user:", error);
                setLoading(false);
            });
    }, [id]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        api.put(`/users/${id}`, user)
            .then(() => {
                alert("User updated successfully!");

                navigate("/users");
            })
            .catch((error) => {
                console.error("Error updating user:", error);

                const errorMessage =
                    error.response?.data ||
                    "Failed to update user.";

                alert(errorMessage);
            });
    };


    if (loading) {
        return (
            <div className="page">
                <p>Loading user...</p>
            </div>
        );
    }


    return (
        <div className="page">

            {/* Page Header */}

            <div className="page-header">

                <div>
                    <h1>Edit User</h1>

                    <p>
                        Update user information.
                    </p>
                </div>

            </div>


            {/* Edit Form */}

            <div className="form-card">

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            User Name
                        </label>

                        <input
                            type="text"
                            name="userName"
                            value={user.userName}
                            onChange={handleChange}
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
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Role
                        </label>

                        <select
                            name="userRole"
                            value={user.userRole}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Role
                            </option>

                            <option value="LIBRARIAN">
                                Librarian
                            </option>

                        </select>

                    </div>


                    {/* Buttons */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate("/users")
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Update User
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditUser;