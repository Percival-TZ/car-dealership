import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { getImageUrl } from "../services/Api";

function MyOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
            return;
        }
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/bookings/my");
            setOrders(res.data);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (id) => {
        if (!window.confirm("Cancel this order?")) return;
        try {
            await api.delete(`/bookings/${id}`);
            setOrders(orders.filter((o) => o._id !== id));
        } catch {
            alert("Failed to cancel order.");
        }
    };

    if (loading) return <div className="container"><p>Loading...</p></div>;

    return (
        <div className="user-orders">
            <div className="page-header">
                <h1>My Orders</h1>
                {orders.length > 0 && (
                    <p className="page-header-count">{orders.length} order(s)</p>
                )}
            </div>

            <div className="container">
                {orders.length === 0 ? (
                    <div className="empty-state">
                        <p>You have no orders yet.</p>
                        <Link to="/" className="auth-link">Browse available cars</Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className={`order-card border-${order.status}`}
                            >
                                <div className="order-card-content">
                                    {order.car && order.car.images && order.car.images.length > 0 && (
                                        <img
                                            src={getImageUrl(order.car.images[0])}
                                            alt={order.car.title}
                                            className="order-card-img"
                                        />
                                    )}

                                    <div className="order-card-details">
                                        <div className="order-card-header">
                                            <h2>
                                                {order.car
                                                    ? order.car.title
                                                    : "Car no longer available"}
                                            </h2>
                                            <span className={`status-badge ${order.status}`}>
                                                {order.status.charAt(0).toUpperCase() +
                                                    order.status.slice(1)}
                                            </span>
                                        </div>

                                        {order.car && (
                                            <p>
                                                <strong>Brand:</strong> {order.car.brand} &nbsp;|&nbsp;
                                                <strong>Year:</strong> {order.car.year} &nbsp;|&nbsp;
                                                <strong>Price:</strong> TZS{" "}
                                                {order.car.price.toLocaleString()}
                                            </p>
                                        )}

                                        <p>
                                            <strong>Preferred Date:</strong>{" "}
                                            {new Date(order.date).toLocaleString()}
                                        </p>

                                        {order.notes && (
                                            <p>
                                                <strong>Notes:</strong> {order.notes}
                                            </p>
                                        )}

                                        <p className="order-placed">
                                            Placed on{" "}
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>

                                        <div className="card-actions">
                                            {order.car && (
                                                <Link
                                                    to={`/cars/${order.car._id}`}
                                                    className="view-btn"
                                                >
                                                    View Car
                                                </Link>
                                            )}
                                            {order.status === "pending" && (
                                                <button
                                                    className="remove-btn"
                                                    onClick={() => cancelOrder(order._id)}
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrders;
