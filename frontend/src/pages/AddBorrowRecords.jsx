import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import api from "../axios/axios";

function AddBorrowRecord() {

    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);

    const [record, setRecord] = useState({
        bookId: "",
        userId: "",
        borrowDate: "",
        dueDate: ""
    });


    // Fetch books and users
    useEffect(() => {

        api.get("/books")
            .then((response) => {

                setBooks(response.data);

            })
            .catch((error) => {

                console.error(
                    "Error fetching books:",
                    error
                );

            });


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


    const handleChange = (e) => {

        setRecord({
            ...record,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        // Validate dates
        if (record.borrowDate && record.dueDate) {
            const borrowDate = new Date(record.borrowDate);
            const dueDate = new Date(record.dueDate);

            if (borrowDate > dueDate) {
                alert("Due date cannot be before the borrow date.");
                return;
            }
        }


        const selectedBook = books.find(
            (book) => book.bookId === Number(record.bookId)
        );


        const selectedUser = users.find(
            (user) => user.userId === Number(record.userId)
        );


        // Safety check
        if (!selectedBook) {

            alert("Please select a valid book.");

            return;
        }

        if (!selectedUser) {

            alert("Please select a valid user.");

            return;
        }

        // Check available copies
        if (
            selectedBook.availableCopies === null ||
            selectedBook.availableCopies === undefined ||
            selectedBook.availableCopies <= 0
        ) {

            alert("No copies of this book are available.");

            return;
        }

        const borrowRecord = {

            bookId: Number(record.bookId),

            bookTitle: selectedBook.bookTitle,

            userId: Number(record.userId),

            userName: selectedUser.userName,

            borrowDate: record.borrowDate,

            dueDate: record.dueDate
        };


        try {

            await api.post(
                "/borrow-records",
                borrowRecord
            );


            alert(
                "Borrow request created successfully!"
            );


            navigate("/borrow-records");


        } catch (error) {

            console.error(
                "Connection Error:",
                error
            );


            const errorMessage =
                error.response?.data ||
                "Error connecting to backend.";


            alert(
                "Failed to borrow book: " +
                errorMessage
            );

        }

    };


    return (

        <div className="page">

            <div className="page-header">

                <div>

                    <h1>Borrow Book</h1>

                    <p>
                        Create a new book borrowing record.
                    </p>

                </div>

            </div>


            <div className="form-card">

                <form onSubmit={handleSubmit}>


                    <div className="form-grid">


                        {/* BOOK */}

                        <div className="form-group">

                            <label>Book</label>

                            <select
                                name="bookId"
                                value={record.bookId}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Book
                                </option>


                                {books.map((book) => (

                                    <option
                                        key={book.bookId}
                                        value={book.bookId}
                                    >

                                        {book.bookTitle}

                                        {" "}

                                        (
                                        {book.availableCopies ?? 0}
                                        {" available"}
                                        )

                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* USER */}

                        <div className="form-group">

                            <label>User</label>

                            <select
                                name="userId"
                                value={record.userId}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select User
                                </option>


                                {users.map((user) => (

                                    <option
                                        key={user.userId}
                                        value={user.userId}
                                    >

                                        {user.userName}

                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* BORROW DATE */}

                        <div className="form-group">

                            <label>Borrow Date</label>

                            <input
                                type="date"
                                name="borrowDate"
                                value={record.borrowDate}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* DUE DATE */}

                        <div className="form-group">

                            <label>Due Date</label>

                            <input
                                type="date"
                                name="dueDate"
                                value={record.dueDate}
                                onChange={handleChange}
                                required
                            />

                        </div>


                    </div>


                    <div className="form-buttons">


                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate("/borrow-records")
                            }
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="primary-button"
                        >

                            Borrow Book

                        </button>


                    </div>


                </form>

            </div>

        </div>

    );

}

export default AddBorrowRecord;