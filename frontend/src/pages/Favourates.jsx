import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { getImageUrl } from "../services/Api";
import CarCard from "../components/CarCard";

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

    const removeFavorite = async (e, carId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.delete(`/users/favorites/${carId}`);
            setFavorites(favorites.filter((car) => car._id !== carId));
        } catch {
            alert("Failed to remove from favorites.");
        }
    };

    if (loading) return <div className="container"><p>Loading...</p></div>;

    return (
        <>
            <div className="page-header">
                <h1>My Favorites</h1>
                {favorites.length > 0 && (
                    <p className="page-header-count">{favorites.length} car(s)</p>
                )}
            </div>

            <div className="inventory-section" style={{ paddingTop: "1.5rem" }}>
                {favorites.length === 0 ? (
                    <div className="empty-state">
                        <p>You have no favorite cars yet.</p>
                        <Link to="/" className="auth-link">Browse available cars</Link>
                    </div>
                ) : (
                    <div className="car-grid">
                        {favorites.map((car) => (
                            <div key={car._id} className="favorite-card-wrapper">
                                <button
                                    className="favorite-remove-btn"
                                    onClick={(e) => removeFavorite(e, car._id)}
                                    title="Remove from favorites"
                                >
                                    &#10005;
                                </button>
                                <CarCard car={car} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Favorites;
