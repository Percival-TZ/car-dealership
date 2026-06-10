import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = await loginUser(formData);

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            console.log("Logged in successfully");
            console.log(data);

            alert("Login successful!");
            console.log("About to go navigation")
            if (data.user.role === "admin") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/";
}

        } catch (error) {

            console.error(error);

            alert("Login failed");

        }
    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                <h1>Staff Login</h1>

                <p className="auth-subtitle">
                    Sign in to access the dealership dashboard
                </p>

                <form onSubmit={handleSubmit}>

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
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button className="auth-button" type="submit">
                        Login
                    </button>

                </form>

            </div>

        </div>

    );
}

export default Login;