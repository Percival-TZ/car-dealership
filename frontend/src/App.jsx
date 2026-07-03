import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CarDetails from "./pages/CarDetails.jsx";
import Favorites from "./pages/Favourates.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/cars/:id" element={<CarDetails />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/my-orders" element={<MyOrders />} />
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