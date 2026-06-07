import { Link } from "react-router-dom";

function Navbar() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (
        <nav>

            <Link to="/">Home</Link>

            {" | "}

            {user ? (
                <>
                    <Link to="/favorites">
                        Favorites
                    </Link>

                    {" | "}

                    <span>
                        {user.username}
                    </span>

                    {" | "}

                    <button
                        onClick={() => {

                            localStorage.removeItem(
                                "token"
                            );

                            localStorage.removeItem(
                                "user"
                            );

                            window.location.reload();

                        }}
                    >
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login">
                        Login
                    </Link>

                    {" | "}

                    <Link to="/register">
                        Register
                    </Link>
                </>
            )}

        </nav>
    );
}

export default Navbar;