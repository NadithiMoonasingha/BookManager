import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SplashScreen from "./pages/SplashScreen";

import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";

import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";

import BorrowRecords from "./pages/BorrowRecords";
import AddBorrowRecords from "./pages/AddBorrowRecords";

import LibrarianVerification from "./pages/LibrarianVerification";


function App() {

    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {

        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2500);

        return () => clearTimeout(timer);

    }, []);


    // Show splash screen first
    if (showSplash) {
        return <SplashScreen />;
    }

    // Show main application
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* Dashboard */}
                <Route
                    path="/"
                    element={<Dashboard />}
                />


                {/* Books */}
                <Route
                    path="/books"
                    element={<Books />}
                />

                <Route
                    path="/add-book"
                    element={<AddBook />}
                />

                <Route
                    path="/edit-book/:id"
                    element={<EditBook />}
                />


                {/* Users */}
                <Route
                    path="/users"
                    element={<Users />}
                />

                <Route
                    path="/add-user"
                    element={<AddUser />}
                />

                <Route
                    path="/edit-user/:id"
                    element={<EditUser />}
                />


                {/* Borrow Records */}
                <Route
                    path="/borrow-records"
                    element={<BorrowRecords />}
                />

                <Route
                    path="/add-borrow-record"
                    element={<AddBorrowRecords />}
                />


                {/* Librarian Verification */}
                <Route
                    path="/librarian-verification"
                    element={<LibrarianVerification />}
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;