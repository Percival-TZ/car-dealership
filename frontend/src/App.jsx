import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login.jsx";
import Favorites from "./pages/Favourates.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Home from "./pages/Home.jsx";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/favorites" element={<Favorites />} />

                <Route
    path="/admin"
    element={
        <ProtectedAdminRoute>
            <AdminDashboard />
        </ProtectedAdminRoute>
    }
/>
            </Routes>

        </BrowserRouter>
    );
}

export default App;