import { useEffect, useState } from "react";
import api from "../axios/axios";
import "../App.css";

function LibrarianVerification() {

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifyingId, setVerifyingId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // Load pending records
    const fetchPendingRecords = () => {

        setLoading(true);
        setError("");

        api.get("/borrow-records/pending")

            .then((response) => {

                setRecords(response.data);
                setLoading(false);

            })

            .catch((error) => {

                console.error(
                    "Error:",
                    error
                );

                setError(
                    "Unable to connect to the backend."
                );

                setLoading(false);

            });
    };


    useEffect(() => {

        fetchPendingRecords();

    }, []);


    // Verify a record
    const handleVerify = async (recordId) => {

        setVerifyingId(recordId);
        setMessage("");
        setError("");


        try {

            await api.put(
                `/borrow-records/${recordId}/verify`
            );


            setMessage(
                "Request verified successfully."
            );


            // Remove the verified record
            // from the pending list
            setRecords((currentRecords) =>
                currentRecords.filter(
                    (record) =>
                        record.recordId !== recordId
                )
            );

        }

        catch (error) {

            console.error(
                "Verification error:",
                error
            );


            setError(
                error.response?.data ||
                "Verification failed."
            );

        }

        finally {

            setVerifyingId(null);

        }

    };


    return (

        <div className="page">

            {/* Page Header */}

            <div className="page-header">

                <div>

                    <div>

                        <h1>
                            Pending Verification
                        </h1>

                        <p>
                            Review and verify pending book borrowing
                            and return requests
                        </p>

                    </div>

                </div>

            </div>


            {/* Messages */}

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


            {/* Table */}

            <div className="table-container">

                {loading ? (

                    <p className="loading-text">

                        Loading pending requests...

                    </p>

                ) : records.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No Pending Requests
                        </h3>

                        <p>

                            There are currently no borrowing
                            or return requests waiting
                            for verification.

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
                                    Request Type
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

                                        {record.status ===
                                        "PENDING_BORROW" ? (

                                            <span className="status pending">

                                                Borrow Request

                                            </span>

                                        ) : (

                                            <span className="status return-pending">

                                                Return Request

                                            </span>

                                        )}

                                    </td>


                                    <td>

                                        <button

                                            className="primary-button verify-button"

                                            onClick={() =>
                                                handleVerify(
                                                    record.recordId
                                                )
                                            }

                                            disabled={
                                                verifyingId ===
                                                record.recordId
                                            }

                                        >

                                            {verifyingId ===
                                            record.recordId

                                                ? "Verifying..."

                                                : "Verify"}

                                        </button>

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


export default LibrarianVerification;