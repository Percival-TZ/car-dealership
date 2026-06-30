import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [menuOpen, setMenuOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="nav-brand">
                    Auto<span className="nav-brand-accent">Dealer</span>
                </Link>

                <div className="navbar-center">
                    {user && user.role === "client" && (
                        <>
                            <Link to="/my-orders">My Orders</Link>
                            <Link to="/favorites">Favorites</Link>
                        </>
                    )}
                    {user && user.role === "admin" && (
                        <Link to="/admin">Dashboard</Link>
                    )}
                </div>

                <div className="navbar-actions">
                    <Link to="/" className="nav-home-link">Home</Link>

                    {user ? (
                        <>
                            <span className="nav-username">{user.username}</span>
                            <button className="nav-logout-btn" onClick={logout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-signin-btn">
                            Sign In
                        </Link>
                    )}

                    {user && (
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <span />
                            <span />
                            <span />
                        </button>
                    )}
                </div>
            </div>

            {user && menuOpen && (
                <div className="mobile-overlay" onClick={closeMenu} />
            )}

            {user && (
                <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
                    <div className="mobile-drawer-header">
                        <span className="nav-brand">
                            Auto<span className="nav-brand-accent">Dealer</span>
                        </span>
                        <button className="mobile-drawer-close" onClick={closeMenu}>
                            &#10005;
                        </button>
                    </div>

                    <div className="mobile-drawer-nav">
                        {user.role === "client" && (
                            <>
                                <Link to="/my-orders" onClick={closeMenu}>My Orders</Link>
                                <Link to="/favorites" onClick={closeMenu}>Favorites</Link>
                            </>
                        )}

                        {user.role === "admin" && (
                            <Link to="/admin" onClick={closeMenu}>Dashboard</Link>
                        )}

                        <div className="mobile-drawer-divider" />

                        <button onClick={() => { closeMenu(); logout(); }}>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
