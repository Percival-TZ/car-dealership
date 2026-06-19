import { Link } from "react-router-dom";

function Navbar() {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">AutoDealer</Link>

            <div className="nav-links">
                <Link to="/">Home</Link>

                {user && user.role === "client" && (
                    <>
                        <Link to="/my-orders">My Orders</Link>
                        <Link to="/favorites">Favorites</Link>
                    </>
                )}

                {user && user.role === "admin" && (
                    <Link to="/admin">Admin Dashboard</Link>
                )}

                {user ? (
                    <>
                        <span className="nav-username">{user.username}</span>
                        <button className="nav-logout-btn" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
