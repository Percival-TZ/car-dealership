import { Link } from "react-router-dom";
import { getImageUrl } from "../services/Api";

function CarCard({ car }) {
    return (
        <Link to={`/cars/${car._id}`} className="car-card">
            <div className="car-card-image-wrapper">
                {car.images && car.images.length > 0 ? (
                    <img
                        src={getImageUrl(car.images[0])}
                        alt={car.title}
                        className="car-card-img"
                    />
                ) : (
                    <div className="car-card-no-image">No Image</div>
                )}
                <span className={`car-card-badge ${car.condition}`}>
                    {car.condition === "new" ? "New" : "Used"}
                </span>
            </div>

            <div className="car-card-body">
                <p className="car-card-subtitle">
                    {car.brand} &middot; {car.year}
                </p>
                <h3 className="car-card-title">{car.title}</h3>
                <div className="car-card-footer">
                    <span className="car-card-price">
                        TZS {car.price.toLocaleString()}
                    </span>
                    <span className={`car-card-stock ${car.quantity > 0 ? "stock-in" : "stock-out"}`}>
                        {car.quantity > 0 ? `${car.quantity} in stock` : "Sold out"}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default CarCard;
