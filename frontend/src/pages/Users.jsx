import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../axios/axios";

function Users() {

    const [users, setUsers] = useState([]);

    const navigate = useNavigate();


    // Get all users
    useEffect(() => {

        api.get("/users")

            .then((response) => {

                setUsers(response.data);

            })

            .catch((error) => {

                console.error(
                    "Error fetching users:",
                    error
                );

            });

    }, []);


    // Delete user
    const deleteUser = (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );


        if (!confirmDelete) {
            return;
        }


        api.delete(`/users/${id}`)

            .then(() => {

                setUsers((currentUsers) =>
                    currentUsers.filter(
                        (user) => user.userId !== id
                    )
                );


                alert("User deleted successfully!");

            })

            .catch((error) => {

                console.error(
                    "Error deleting user:",
                    error
                );

                alert("Failed to delete user.");

            });

    };


    return (

        <div className="page">


            {/* Page Header */}

            <div className="page-header">

                <div>

                    <h1>Users</h1>

                    <p>
                        Manage library users
                    </p>

                </div>


                <Link
                    to="/add-user"
                    className="primary-button"
                >
                    + Add User
                </Link>

            </div>


            {/* Users Table */}

            <div className="table-container">


                <table className="users-table">


                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Name</th>

                            <th>Email</th>

                            <th>Role</th>

                            <th>Actions</th>

                        </tr>

                    </thead>


                    <tbody>


                        {users.length === 0 ? (


                            <tr>

                                <td
                                    colSpan="5"
                                    className="empty-table"
                                >

                                    No users found

                                </td>

                            </tr>


                        ) : (


                            users.map((user) => (


                                <tr key={user.userId}>


                                    <td>
                                        {user.userId}
                                    </td>


                                    <td className="book-title">
                                        {user.userName}
                                    </td>


                                    <td>
                                        {user.userEmail}
                                    </td>


                                    <td>
                                        {user.userRole || "-"}
                                    </td>


                                    <td>


                                        <div className="table-actions">


                                            <button
                                                className="edit-button"

                                                onClick={() =>
                                                    navigate(
                                                        `/edit-user/${user.userId}`
                                                    )
                                                }
                                            >

                                                Edit

                                            </button>


                                            <button
                                                className="delete-button"

                                                onClick={() =>
                                                    deleteUser(user.userId)
                                                }
                                            >

                                                Delete

                                            </button>


                                        </div>


                                    </td>


                                </tr>


                            ))


                        )}


                    </tbody>


                </table>


            </div>


        </div>

    );

}


export default Users;