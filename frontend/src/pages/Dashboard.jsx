import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../axios/axios";

function Dashboard() {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [borrowRecords, setBorrowRecords] = useState([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {

    Promise.all([
        api.get("/books"),
        api.get("/users"),
        api.get("/borrow-records")
    ])
        .then(([booksResponse, usersResponse, recordsResponse]) => {

            setBooks(booksResponse.data);
            setUsers(usersResponse.data);
            setBorrowRecords(recordsResponse.data);

            setLoading(false);

        })
        .catch((error) => {

            console.error(
                "Error fetching dashboard data:",
                error
            );

            setLoading(false);

        });

}, []);

    const totalTitles = books.length;
    const totalUsers = users.length;

    const totalCopies = books.reduce(
        (total, book) => total + (book.totalCopies || 0),
        0
    );

    const availableCopies = books.reduce(
        (total, book) => total + (book.availableCopies || 0),
        0
    );

    const borrowedCopies = totalCopies - availableCopies;

    const today = new Date()
        .toISOString()
        .split("T")[0];

    const overdueBooks = borrowRecords.filter(
        (record) =>
            record.status === "BORROWED" &&
            record.dueDate &&
            record.dueDate < today
    ).length;

    return (
        <div className="dashboard">

            {/* Dashboard Header */}
            <div className="dashboard-header">
                <h1>Dashboard</h1>

                <p className="dashboard-subtitle">
                    Welcome to the Book Manager
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <h3>Total Titles</h3>
                    <p className="number">
                        {loading ? "..." : totalTitles}
                    </p>
                </div>

                <div className="dashboard-card">
                    <h3>Total Users</h3>
                    <p className="number">
                        {loading ? "..." : totalUsers}
                    </p>
                </div>

                <div className="dashboard-card">
                    <h3>Total Copies</h3>
                    <p className="number">
                        {loading ? "..." : totalCopies}
                    </p>
                </div>

                <div className="dashboard-card">
                    <h3>Available Copies</h3>
                    <p className="number">
                        {loading ? "..." : availableCopies}
                    </p>
                </div>

                <div className="dashboard-card">
                    <h3>Borrowed Copies</h3>
                    <p className="number">
                        {loading ? "..." : borrowedCopies}
                    </p>
                </div>

                <div className="dashboard-card overdue-card">
                    <h3>Overdue Books</h3>

                    <p className="number">
                        {loading ? "..." : overdueBooks}
                    </p>
                </div>

            </div>


            {/* Recent Books */}
            <div className="dashboard-section">

                <div className="section-header">

                    <h2>Recent Books</h2>

                    <Link to="/books">
                        View All
                    </Link>

                </div>


                {loading ? (

                    <p>Loading books...</p>

                ) : books.length === 0 ? (

                    <div className="empty-state">

                        <h2>No Books Yet</h2>

                        <p>
                            There are currently no books in the library.
                        </p>

                        <Link
                            to="/add-book"
                            className="primary-button"
                        >
                            + Add Book
                        </Link>

                    </div>

                ) : (

                    <div className="table-container">

                        <table className="books-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>ISBN</th>
                                    <th>Category</th>
                                    <th>Available</th>
                                </tr>
                            </thead>


                            <tbody>

                                {books.slice(0, 5).map((book) => (

                                    <tr key={book.bookId}>

                                        <td>
                                            {book.bookId}
                                        </td>

                                        <td className="book-title">
                                            {book.bookTitle}
                                        </td>

                                        <td>
                                            {book.authorName}
                                        </td>

                                        <td>
                                            {book.isbn || "-"}
                                        </td>

                                        <td>
                                            {book.category || "-"}
                                        </td>

                                        <td className="number-cell">
                                            {book.availableCopies ?? 0}
                                            {" / "}
                                            {book.totalCopies ?? 0}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* Recent Borrow Records */}
            <div className="dashboard-section">

                <div className="section-header">

                    <h2>Recent Borrow Records</h2>

                    <div className="section-actions">

                        <Link to="/borrow-records">
                            View All
                        </Link>

                    </div>

                </div>

                {loading ? (

                    <p>Loading borrow records...</p>

                ) : borrowRecords.length === 0 ? (

                    <div className="empty-state">

                        <h2>No Borrow Records Yet</h2>

                        <p>
                            There are currently no borrow records.
                        </p>

                        <Link
                            to="/add-borrow-record"
                            className="primary-button"
                        >
                            + Add Borrow Record
                        </Link>

                    </div>

                ) : (







                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>
                                    <th>Book</th>
                                    <th>User</th>
                                    <th>Borrow Date</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>

                            </thead>


                            <tbody>

                                {borrowRecords
                                    .slice(0, 5)
                                    .map((record) => (

                                        <tr key={record.recordId}>

                                            <td>
                                                {record.bookTitle ||
                                                    `Book #${record.bookId}`}
                                            </td>

                                            <td>
                                                {record.userName ||
                                                    `User #${record.userId}`}
                                            </td>

                                            <td>
                                                {record.borrowDate || "-"}
                                            </td>

                                            <td>
                                                {record.dueDate || "-"}
                                            </td>

                                            <td>
                                                {(() => {

                                                    const today = new Date()
                                                        .toISOString()
                                                        .split("T")[0];

                                                    const isOverdue =
                                                        record.status === "BORROWED" &&
                                                        record.dueDate &&
                                                        record.dueDate < today;

                                                    return (
                                                        <span
                                                            className={
                                                                record.status === "RETURNED"
                                                                    ? "status returned"
                                                                    : isOverdue
                                                                    ? "status overdue"
                                                                    : "status borrowed"
                                                            }
                                                        >
                                                            {record.status === "RETURNED"
                                                                ? "RETURNED"
                                                                : isOverdue
                                                                ? "OVERDUE"
                                                                : "BORROWED"}
                                                        </span>
                                                    );

                                                })()}
                                            </td>

                                        </tr>

                                    ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Dashboard;