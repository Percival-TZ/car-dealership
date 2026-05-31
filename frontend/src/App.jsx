import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login.jsx";
import Favorites from "./pages/Favourates.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Home from "./pages/Home.jsx";

function App() {
    return (
        <>
            <Login />
            <Favorites />
            <Register />
            <AdminDashboard />
            <Home />
        </>
    );
}

export default App;