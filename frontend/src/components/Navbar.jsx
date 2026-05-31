import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link> |{" "}
            <Link to="/login">Login</Link> |{" "}
            <Link to="/register">Register</Link> |{" "}
            <Link to="/favorites">Favorites</Link> |{" "}
            <Link to="/admin">Admin</Link>
        </nav>
    );
}

export default Navbar;