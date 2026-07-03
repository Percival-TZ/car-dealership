import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/Api";

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setStatus("error");
            setMessage("No verification token found in the link.");
            return;
        }

        api.get(`/auth/verify-email?token=${token}`)
            .then((res) => {
                setStatus("success");
                setMessage(res.data.message);
            })
            .catch((err) => {
                setStatus("error");
                setMessage(
                    err.response?.data?.message || "Verification failed. The link may have expired."
                );
            });
    }, []);

    return (
        <div className="auth-page-centered">
            <div className="auth-card">
                {status === "loading" && (
                    <>
                        <h1>Verifying...</h1>
                        <p className="auth-subtitle">Please wait while we verify your email.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="verify-icon verify-icon--success">&#10003;</div>
                        <h1>Email Verified!</h1>
                        <p className="auth-subtitle">{message}</p>
                        <Link to="/login" className="auth-button" style={{ display: "block", textAlign: "center", marginTop: "24px" }}>
                            Go to Sign In
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="verify-icon verify-icon--error">&#10005;</div>
                        <h1>Verification Failed</h1>
                        <p className="auth-subtitle">{message}</p>
                        <p className="auth-footer" style={{ marginTop: "20px" }}>
                            Need a new link?{" "}
                            <Link to="/login" className="auth-link">Go to Sign In</Link>
                            {" "}and use the resend option.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;
