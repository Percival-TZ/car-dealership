import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(formData);
            alert("Registration successful! Please log in.");
            navigate("/login");
        } catch (err) {
            setError(
                err.response?.data?.message || "Registration failed. Try again."
            );
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p className="auth-subtitle">Join us to browse and order cars</p>

                {error && <p className="auth-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label className="auth-label" htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        className="auth-input"
                        type="text"
                        name="username"
                        placeholder="Your name"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <label className="auth-label" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        className="auth-input"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label className="auth-label" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        className="auth-input"
                        type="password"
                        name="password"
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={6}
                        required
                    />

                    <button className="auth-button" type="submit">
                        Register
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login" className="auth-link">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
