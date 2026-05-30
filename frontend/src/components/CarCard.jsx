function CarCard({ car }) {

    return (

        <div
            style={{
                border: "1px solid gray",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "10px"
            }}
        >

            <h2>{car.title}</h2>

            <p>Brand: {car.brand}</p>

            <p>Year: {car.year}</p>

            <p>Price: {car.price}</p>

        </div>

    );
}

export default CarCard;