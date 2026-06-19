import { Link } from "react-router-dom";

function CarCard({ car }) {
    return (
        <div className="car-card">
            <div className="car-card-header">
                <h2>{car.title}</h2>
                <span className={`condition-badge ${car.condition}`}>
                    {car.condition === "new" ? "New" : "Used"}
                </span>
            </div>

            <p><strong>Brand:</strong> {car.brand}</p>
            <p><strong>Year:</strong> {car.year}</p>
            <p><strong>Price:</strong> TZS {car.price.toLocaleString()}</p>

            <Link to={`/cars/${car._id}`} className="view-details-btn">
                View Details &amp; Order
            </Link>
        </div>
    );
}

export default CarCard;
