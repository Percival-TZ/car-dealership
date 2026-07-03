import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import api from "../services/Api";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [showResend, setShowResend] = useState(false);
    const [resendMsg, setResendMsg] = useState("");
    const [resendLoading, setResendLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
        setShowResend(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(formData);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.role === "admin") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/";
            }
        } catch (err) {
            const code = err.response?.data?.code;
            const msg = err.response?.data?.message || "Login failed. Check your credentials.";
            setError(msg);
            if (code === "EMAIL_NOT_VERIFIED") {
                setShowResend(true);
            }
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        setResendMsg("");
        try {
            await api.post("/auth/resend-verification", { email: formData.email });
            setResendMsg("Verification email sent! Check your inbox.");
        } catch {
            setResendMsg("Failed to resend. Please try again.");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="auth-page-centered">
            <div className="auth-card">
                <h1>Sign In</h1>
                <p className="auth-subtitle">Enter your credentials to continue</p>

                {error && <p className="auth-error">{error}</p>}

                {showResend && (
                    <div className="auth-verify-box">
                        <p>Haven&apos;t received the verification email?</p>
                        {resendMsg ? (
                            <p className="auth-verify-sent">{resendMsg}</p>
                        ) : (
                            <button
                                className="auth-resend-btn"
                                onClick={handleResend}
                                disabled={resendLoading}
                            >
                                {resendLoading ? "Sending..." : "Resend Verification Email"}
                            </button>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button className="auth-button" type="submit">
                        Sign In
                    </button>
                </form>

                <p className="auth-footer">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="auth-link">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
