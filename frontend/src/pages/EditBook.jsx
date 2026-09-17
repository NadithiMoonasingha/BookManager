import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../axios/axios";


function EditBook() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [book, setBook] = useState({

        bookTitle: "",
        authorName: "",
        isbn: "",
        category: "",
        language: "",
        country: "",
        publication: "",
        publicationDate: "",
        description: "",
        totalCopies: "",
        availableCopies: ""

    });


    useEffect(() => {

        api.get(`/books/${id}`)

            .then((response) => {

                const data = response.data;

                setBook({

                    ...data,

                    publicationDate:
                        data.publicationDate || ""

                });

            })

            .catch((error) => {

                console.error(
                    "Error fetching book:",
                    error
                );

            });

    }, [id]);


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setBook({

            ...book,
            [name]: value

        });

    };


    const handleSubmit = async (event) => {

        event.preventDefault();


        try {

            await api.put(`/books/${id}`, {

                ...book,

                totalCopies:
                    Number(book.totalCopies),

                availableCopies:
                    Number(book.availableCopies)

            });


            alert(
                "Book updated successfully!"
            );


            navigate("/books");

        }

        catch (error) {

            console.error(
                "Error updating book:",
                error
            );


            const errorMessage =
                error.response?.data ||
                "Failed to update the book.";


            alert(errorMessage);

        }

    };


    return (

        <div className="page">


            <div className="page-header">

                <div>

                    <h1>Edit Book</h1>

                    <p>
                        Update the book information.
                    </p>

                </div>

            </div>


            <div className="form-container">


                <form
                    className="book-form"
                    onSubmit={handleSubmit}
                >


                    <div className="form-grid">


                        {/* TITLE */}

                        <div className="form-group">

                            <label>
                                Book Title
                            </label>

                            <input
                                type="text"
                                name="bookTitle"
                                value={book.bookTitle}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* AUTHOR */}

                        <div className="form-group">

                            <label>
                                Author
                            </label>

                            <input
                                type="text"
                                name="authorName"
                                value={book.authorName}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* ISBN */}

                        <div className="form-group">

                            <label>
                                ISBN
                            </label>

                            <input
                                type="text"
                                name="isbn"
                                value={book.isbn}
                                onChange={handleChange}
                            />

                        </div>


                        {/* CATEGORY */}

                        <div className="form-group">

                            <label>
                                Category
                            </label>

                            <select
                                name="category"
                                value={book.category}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option value="Fiction">
                                    Fiction
                                </option>

                                <option value="Science Fiction">
                                    Science Fiction
                                </option>

                                <option value="Fantasy">
                                    Fantasy
                                </option>

                                <option value="Mystery">
                                    Mystery
                                </option>

                                <option value="Thriller">
                                    Thriller
                                </option>

                                <option value="Romance">
                                    Romance
                                </option>

                                <option value="Biography">
                                    Biography
                                </option>

                                <option value="History">
                                    History
                                </option>

                                <option value="Science">
                                    Science
                                </option>

                                <option value="Technology">
                                    Technology
                                </option>

                                <option value="Education">
                                    Education
                                </option>

                                <option value="Children">
                                    Children
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* LANGUAGE */}

                        <div className="form-group">

                            <label>
                                Language
                            </label>

                            <select
                                name="language"
                                value={book.language}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select Language
                                </option>

                                <option value="English">
                                    English
                                </option>

                                <option value="Sinhala">
                                    Sinhala
                                </option>

                                <option value="Tamil">
                                    Tamil
                                </option>

                                <option value="Hindi">
                                    Hindi
                                </option>

                                <option value="Chinese">
                                    Chinese
                                </option>

                                <option value="Japanese">
                                    Japanese
                                </option>

                                <option value="Korean">
                                    Korean
                                </option>

                                <option value="French">
                                    French
                                </option>

                                <option value="Spanish">
                                    Spanish
                                </option>

                                <option value="German">
                                    German
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* COUNTRY */}

                        <div className="form-group">

                            <label>
                                Country
                            </label>

                            <input
                                type="text"
                                name="country"
                                value={book.country}
                                onChange={handleChange}
                            />

                        </div>


                        {/* PUBLICATION */}

                        <div className="form-group">

                            <label>
                                Publication
                            </label>

                            <input
                                type="text"
                                name="publication"
                                value={book.publication}
                                onChange={handleChange}
                            />

                        </div>


                        {/* PUBLICATION DATE */}

                        <div className="form-group">

                            <label>
                                Publication Date
                            </label>

                            <input
                                type="date"
                                name="publicationDate"
                                value={
                                    book.publicationDate || ""
                                }
                                onChange={handleChange}
                            />

                        </div>


                        {/* TOTAL COPIES */}

                        <div className="form-group">

                            <label>
                                Total Copies
                            </label>

                            <input
                                type="number"
                                name="totalCopies"
                                value={book.totalCopies}
                                onChange={handleChange}
                                placeholder="Total Copies"
                                min="0"
                                required
                            />

                        </div>


                        {/* AVAILABLE COPIES */}

                        <div className="form-group">

                            <label>
                                Available Copies
                            </label>

                            <input
                                type="number"
                                name="availableCopies"
                                value={book.availableCopies}
                                onChange={handleChange}
                                placeholder="Available Copies"
                                min="0"
                                required
                            />

                        </div>


                    </div>


                    {/* DESCRIPTION */}

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={
                                book.description || ""
                            }
                            onChange={handleChange}
                            rows="5"
                        />

                    </div>


                    {/* BUTTONS */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate("/books")
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Update Book
                        </button>

                    </div>


                </form>

            </div>

        </div>

    );

}


export default EditBook;