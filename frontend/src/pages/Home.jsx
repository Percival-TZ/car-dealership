import { useEffect, useState } from "react";
import axios from "axios";

import CarCard from "../components/CarCard";

function Home() {

    const [cars, setCars] = useState([]);

    useEffect(() => {

        const fetchCars = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:3000/api/cars"
                );

                setCars(response.data.cars);

            } catch (error) {

                console.log(error);

            }
        };

        fetchCars();

    }, []);

    return (

        <div>

            <h1>Car Dealership</h1>

            {cars.map((car) => (

                <CarCard
                    key={car._id}
                    car={car}
                />

            ))}

        </div>

    );
}

export default Home;