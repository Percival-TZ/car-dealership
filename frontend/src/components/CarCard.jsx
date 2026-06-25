import { Link } from "react-router-dom";
import { getImageUrl } from "../services/Api";

function CarCard({ car }) {
    return (
        <div className="car-card">
            {car.images && car.images.length > 0 && (
                <img
                    src={getImageUrl(car.images[0])}
                    alt={car.title}
                    className="car-card-img"
                />
            )}
            <div className="car-card-header">
                <h2>{car.title}</h2>
                <span className={`condition-badge ${car.condition}`}>
                    {car.condition === "new" ? "New" : "Used"}
                </span>
            </div>

            <p><strong>Brand:</strong> {car.brand}</p>
            <p><strong>Year:</strong> {car.year}</p>
            <p><strong>Price:</strong> TZS {car.price.toLocaleString()}</p>
            <p>
                <strong>In Stock:</strong>{" "}
                <span className={car.quantity > 0 ? "stock-in" : "stock-out"}>
                    {car.quantity > 0 ? `${car.quantity} available` : "Out of stock"}
                </span>
            </p>

            <Link to={`/cars/${car._id}`} className="view-details-btn">
                View Details &amp; Order
            </Link>
        </div>
    );
}

export default CarCard;
