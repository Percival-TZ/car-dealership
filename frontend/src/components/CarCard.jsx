function CarCard({ car }) {
    return (
        <div className="car-card">

            <h2>{car.title}</h2>

            <p>
                <strong>Brand:</strong> {car.brand}
            </p>

            <p>
                <strong>Year:</strong> {car.year}
            </p>

            <p>
                <strong>Price:</strong> TZS {car.price}
            </p>

        </div>
    );
}

export default CarCard;