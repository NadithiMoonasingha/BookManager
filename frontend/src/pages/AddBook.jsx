import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios";
import "../App.css";


function AddBook() {

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


    const handleChange = (e) => {

        setBook({
            ...book,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const totalCopies = Number(book.totalCopies);
        const availableCopies = Number(book.availableCopies);

        // Validation
        if (availableCopies > totalCopies) {
            alert(
                "Available copies cannot be greater than total copies."
            );
            return;
        }

        if (totalCopies < 0 || availableCopies < 0) {
            alert(
                "Copies cannot be negative."
            );
            return;
        }

        try {

            await api.post("/books", {
                ...book,
                totalCopies: totalCopies,
                availableCopies: availableCopies
            });

            alert("Book added successfully!");

            navigate("/books");

        } catch (error) {

            console.error("Error:", error);

            const errorMessage =
                error.response?.data?.message ||
                "Error connecting to backend.";

            alert(
                "Failed to add book.\n\n" +
                errorMessage
            );
        }
    };

    return (

        <div className="form-card">

            <form onSubmit={handleSubmit}>


                <div className="form-grid">


                    <div className="form-group">

                        <label>
                            Book Title
                        </label>

                        <input
                            type="text"
                            name="bookTitle"
                            value={book.bookTitle}
                            onChange={handleChange}
                            placeholder="Book Title"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Author Name
                        </label>

                        <input
                            type="text"
                            name="authorName"
                            value={book.authorName}
                            onChange={handleChange}
                            placeholder="Author Name"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            ISBN
                        </label>

                        <input
                            type="text"
                            name="isbn"
                            value={book.isbn}
                            onChange={handleChange}
                            placeholder="ISBN"
                        />

                    </div>


                    <div className="form-group">
                        <label>Category</label>

                        <select
                            name="category"
                            value={book.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>

                            <option value="Fiction">Fiction</option>
                            <option value="Science Fiction">Science Fiction</option>
                            <option value="Fantasy">Fantasy</option>
                            <option value="Mystery">Mystery</option>
                            <option value="Thriller">Thriller</option>
                            <option value="Romance">Romance</option>
                            <option value="Biography">Biography</option>
                            <option value="History">History</option>
                            <option value="Science">Science</option>
                            <option value="Technology">Technology</option>
                            <option value="Education">Education</option>
                            <option value="Children">Children</option>
                            <option value="Other">Other</option>

                        </select>
                    </div>


                    <div className="form-group">
                        <label>Language</label>

                        <select
                            name="language"
                            value={book.language}
                            onChange={handleChange}
                        >
                            <option value="">Select Language</option>

                            <option value="English">English</option>
                            <option value="Sinhala">Sinhala</option>
                            <option value="Tamil">Tamil</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Thai">Thai</option>
                            <option value="Korean">Korean</option>
                            <option value="French">French</option>
                            <option value="Spanish">Spanish</option>
                            <option value="German">German</option>
                            <option value="Russian">Russian</option>
                            <option value="Other">Other</option>

                        </select>
                    </div>


                    <div className="form-group">

                        <label>
                            Country
                        </label>

                        <input
                            type="text"
                            name="country"
                            value={book.country}
                            onChange={handleChange}
                            placeholder="Country"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Publication
                        </label>

                        <input
                            type="text"
                            name="publication"
                            value={book.publication}
                            onChange={handleChange}
                            placeholder="Publication"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Publication Date
                        </label>

                        <input
                            type="date"
                            name="publicationDate"
                            value={book.publicationDate}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group full-width">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={book.description}
                            onChange={handleChange}
                            placeholder="Description"
                        />

                    </div>


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


                <div className="form-buttons">


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

                        Add Book

                    </button>


                </div>


            </form>

        </div>

    );

}

export default AddBook;