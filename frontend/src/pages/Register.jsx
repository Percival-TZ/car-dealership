import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [emailFailed, setEmailFailed] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await registerUser(formData);
            const msg = res?.message || "";
            if (msg.toLowerCase().includes("log in")) {
                window.location.href = "/login";
            } else {
                if (res?.emailFailed) setEmailFailed(true);
                setSuccess(true);
            }
        } catch (err) {
            const serverMsg = err.response?.data?.message || "";
            if (serverMsg.toLowerCase().includes("account created")) {
                setEmailFailed(true);
                setSuccess(true);
            } else {
                setError(serverMsg || "Registration failed. Try again.");
            }
        }
    };

    if (success) {
        return (
            <div className="auth-page-centered">
                <div className="auth-card">
                    <div className={`verify-icon ${emailFailed ? "verify-icon--error" : "verify-icon--success"}`}>
                        {emailFailed ? "⚠" : "✉"}
                    </div>
                    <h1>{emailFailed ? "Account Created" : "Check your email"}</h1>
                    <p className="auth-subtitle">
                        {emailFailed
                            ? "Your account was created but we couldn't send the verification email. Go to Sign In and use the \"Resend Verification Email\" option."
                            : <>We sent a verification link to <strong>{formData.email}</strong>. Click the link in that email to activate your account.</>
                        }
                    </p>
                    <p className="auth-footer" style={{ marginTop: "24px" }}>
                        <Link to="/login" className="auth-link">Go to Sign In</Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page-centered">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p className="auth-subtitle">
                    Join us to browse and order cars
                </p>

                {error && <p className="auth-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label className="auth-label" htmlFor="username">Username</label>
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

                    <label className="auth-label" htmlFor="email">Email</label>
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

                    <label className="auth-label" htmlFor="password">Password</label>
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
                        Create Account
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login" className="auth-link">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
