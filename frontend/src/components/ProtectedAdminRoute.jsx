import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedAdminRoute;