import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { getImageUrl } from "../services/Api";

function Favorites() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
            return;
        }
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const res = await api.get("/users/favorites");
            setFavorites(res.data);
        } catch {
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (carId) => {
        try {
            await api.delete(`/users/favorites/${carId}`);
            setFavorites(favorites.filter((car) => car._id !== carId));
        } catch {
            alert("Failed to remove from favorites.");
        }
    };

    if (loading) return <div className="container"><p>Loading...</p></div>;

    return (
        <div className="container">
            <h1>My Favorites</h1>

            {favorites.length === 0 ? (
                <div className="empty-state">
                    <p>You have no favorite cars yet.</p>
                    <Link to="/" className="auth-link">Browse available cars</Link>
                </div>
            ) : (
                <div className="car-grid">
                    {favorites.map((car) => (
                        <div key={car._id} className="car-card">
                            {car.images && car.images.length > 0 && (
                                <img
                                    src={getImageUrl(car.images[0])}
                                    alt={car.title}
                                    className="car-card-img"
                                />
                            )}
                            <h2>{car.title}</h2>
                            <span className={`condition-badge ${car.condition}`}>
                                {car.condition === "new" ? "New" : "Used"}
                            </span>
                            <p><strong>Brand:</strong> {car.brand}</p>
                            <p><strong>Year:</strong> {car.year}</p>
                            <p><strong>Price:</strong> TZS {car.price.toLocaleString()}</p>

                            <div className="card-actions">
                                <Link to={`/cars/${car._id}`} className="view-btn">
                                    View Details
                                </Link>
                                <button
                                    className="remove-btn"
                                    onClick={() => removeFavorite(car._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favorites;
