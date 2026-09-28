import { Link } from "react-router-dom";
import "../App.css";

function Navbar() {
    return (
        <nav className="navbar">

            <div className="logo">
                <div className="logo-text">
                    <span className="logo-title">Book</span>
                    <span className="logo-manager">Manager</span>
                </div>
            </div>

            <div className="navbar-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/books">Books</Link>
                <Link to="/users">Users</Link>
                <Link to="/borrow-records">Borrow Records</Link>
                <Link to="/librarian-verification"> Librarian Verification</Link>
            </div>

        </nav>
    );
}

export default Navbar;