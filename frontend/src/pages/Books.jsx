import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../axios/axios";

function Books() {

    const [books, setBooks] = useState([]);

    const navigate = useNavigate();


    useEffect(() => {

        fetchBooks();

    }, []);

    const fetchBooks = () => {

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

    };

    const deleteBook = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this book?"
        );


        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`/books/${id}`);


            setBooks((currentBooks) =>
                currentBooks.filter(
                    (book) =>
                        book.bookId !== id
                )
            );


            alert("Book deleted successfully!");

        }

        catch (error) {

            console.error(
                "Error deleting book:",
                error
            );

            alert(
                "Failed to delete the book."
            );

        }

    };


    const editBook = (id) => {

        navigate(`/edit-book/${id}`);

    };


    return (

        <div className="page">


            {/* Page Header */}

            <div className="page-header">

                <div>

                    <h1>Books</h1>

                    <p>
                        Manage books in the library
                    </p>

                </div>


                <Link
                    to="/add-book"
                    className="primary-button"
                >

                    + Add Book

                </Link>

            </div>



            {/* Books Table */}

            <div className="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Title</th>

                            <th>Author</th>

                            <th>ISBN</th>

                            <th>Category</th>

                            <th>Language</th>

                            <th>Country</th>

                            <th>Total Copies</th>

                            <th>Available</th>

                            <th>Actions</th>

                        </tr>

                    </thead>



                    <tbody>


                        {books.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="10"
                                    className="empty-table"
                                >

                                    No books found.

                                </td>

                            </tr>

                        ) : (

                            books.map((book) => (

                                <tr
                                    key={book.bookId}
                                >


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


                                    <td>

                                        {book.language || "-"}

                                    </td>


                                    <td>

                                        {book.country || "-"}

                                    </td>


                                    <td className="number-cell">

                                        {book.totalCopies ?? 0}

                                    </td>


                                    <td className="number-cell">

                                        {book.availableCopies ?? 0}

                                    </td>


                                    <td>

                                        <div className="table-actions">


                                            {/* EDIT */}

                                            <button

                                                className="edit-button"

                                                onClick={() =>
                                                    editBook(
                                                        book.bookId
                                                    )
                                                }

                                            >

                                                Edit

                                            </button>



                                            {/* DELETE */}

                                            <button

                                                className="delete-button"

                                                onClick={() =>
                                                    deleteBook(
                                                        book.bookId
                                                    )
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


export default Books;