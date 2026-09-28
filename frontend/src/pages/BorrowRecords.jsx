import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import api from "../axios/axios";

const isOverdue = (record) => {
    if (record.status !== "BORROWED" || !record.dueDate) {
        return false;
    }

    const today = new Date();
    const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const dueDate = new Date(record.dueDate + "T00:00:00");

    return dueDate < todayDate;
};

function BorrowRecords() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [returningId, setReturningId] = useState(null);
    const [message, setMessage] = useState("");

    // Get the currently logged-in user's role
    const userRole = localStorage.getItem("userRole");

    const fetchRecords = () => {
        setLoading(true);

        api.get("/borrow-records")
            .then((response) => {
                // Sort by borrow date - newest first
                const sortedRecords = [...response.data].sort((a, b) => {
                    if (!a.borrowDate) return 1;
                    if (!b.borrowDate) return -1;

                    return (
                        new Date(b.borrowDate) -
                        new Date(a.borrowDate)
                    );
                });

                setRecords(sortedRecords);
                setLoading(false);
            })
            .catch((error) => {
                console.error(
                    "Error fetching borrow records:",
                    error
                );

                if (error.response?.status === 401) {
                    setError("Please sign in again.");
                } else if (error.response?.status === 403) {
                    setError(
                        "You do not have permission to view these borrow records."
                    );
                } else {
                    setError(
                        "Unable to connect to the backend."
                    );
                }

                setLoading(false);
            });
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleReturnRequest = async (recordId) => {
        const confirmed = window.confirm(
            "Are you sure you want to request the return of this book?"
        );

        if (!confirmed) return;

        setReturningId(recordId);
        setMessage("");
        setError("");

        try {
            await api.post(
                `/borrow-records/${recordId}/return`
            );

            setMessage(
                "Return request submitted. Waiting for librarian verification."
            );

            fetchRecords();
        } catch (error) {
            console.error(
                "Return request error:",
                error
            );

            if (error.response?.status === 401) {
                setError("Please sign in again.");
            } else if (error.response?.status === 403) {
                setError(
                    "You do not have permission to request a return."
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    "Unable to submit return request."
                );
            }
        } finally {
            setReturningId(null);
        }
    };

    return (
        <div className="page">

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>
                        Borrow Records
                    </h1>

                    <p>
                        View book borrowing, return requests,
                        and their verification status.
                    </p>
                </div>

                {/* Only Members can add borrow requests */}
                {userRole === "MEMBER" && (
                    <Link
                        to="/add-borrow-record"
                        className="primary-button"
                    >
                        + Add Borrow
                    </Link>
                )}
            </div>

            {/* Success Message */}
            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="table-container">
                {loading ? (
                    <p className="loading-text">
                        Loading borrow records...
                    </p>
                ) : records.length === 0 ? (
                    <div className="empty-state">
                        <h3>
                            No Borrow Records
                        </h3>

                        <p>
                            No borrowing or return
                            records are available.
                        </p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    Record ID
                                </th>

                                <th>
                                    Book
                                </th>

                                <th>
                                    User
                                </th>

                                <th>
                                    Borrow Date
                                </th>

                                <th>
                                    Due Date
                                </th>

                                <th>
                                    Return Date
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {records.map((record) => (
                                <tr
                                    key={record.recordId}
                                >
                                    <td>
                                        {record.recordId}
                                    </td>

                                    <td>
                                        <strong>
                                            {record.bookTitle ||
                                                `Book #${record.bookId}`}
                                        </strong>
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
                                        {record.returnDate || "-"}
                                    </td>

                                    <td>
                                        {record.status ===
                                        "PENDING_BORROW" ? (
                                            <span className="status pending">
                                                VERIFICATION PENDING
                                            </span>
                                        ) : record.status ===
                                          "BORROWED" &&
                                          isOverdue(record) ? (
                                            <span className="status overdue">
                                                OVERDUE
                                            </span>
                                        ) : record.status ===
                                          "BORROWED" ? (
                                            <span className="status borrowed">
                                                BORROWED
                                            </span>
                                        ) : record.status ===
                                          "PENDING_RETURN" ? (
                                            <span className="status return-pending">
                                                RETURN VERIFICATION PENDING
                                            </span>
                                        ) : record.status ===
                                          "RETURNED" ? (
                                            <span className="status returned">
                                                COMPLETED
                                            </span>
                                        ) : (
                                            <span className="status">
                                                {record.status}
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        {/* Only Members can request returns */}
                                        {userRole === "MEMBER" &&
                                        record.status ===
                                            "BORROWED" ? (
                                            <button
                                                className="secondary-button return-button"
                                                onClick={() =>
                                                    handleReturnRequest(
                                                        record.recordId
                                                    )
                                                }
                                                disabled={
                                                    returningId ===
                                                    record.recordId
                                                }
                                            >
                                                {returningId ===
                                                record.recordId
                                                    ? "Requesting..."
                                                    : "Request Return"}
                                            </button>
                                        ) : record.status ===
                                          "PENDING_RETURN" &&
                                          userRole === "MEMBER" ? (
                                            <span className="action-pending">
                                                Awaiting Verification
                                            </span>
                                        ) : record.status ===
                                          "RETURNED" ? (
                                            <span className="action-completed">
                                                Completed
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default BorrowRecords;