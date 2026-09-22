import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

function App() {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    if (showSplash) return <SplashScreen />;

    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                {/* Default page after splash */}
                <Route path="/" element={<Navigate to="/signin" replace />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/books" element={<Books />} />
                <Route path="/add-book" element={<AddBook />} />
                <Route path="/edit-book/:id" element={<EditBook />} />
                <Route path="/users" element={<Users />} />
                <Route path="/add-user" element={<AddUser />} />
                <Route path="/edit-user/:id" element={<EditUser />} />
                <Route path="/borrow-records" element={<BorrowRecords />} />
                <Route path="/add-borrow-record" element={<AddBorrowRecords />} />
                <Route path="/librarian-verification" element={<LibrarianVerification />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;