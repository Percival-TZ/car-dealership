import { useEffect, useState } from "react";
import api from "../services/Api";

import CarCard from "../components/CarCard";

function Home() {

    const [search, setSearch] = useState("");
    const [cars, setCars] = useState([]);

    useEffect(() => {

        const fetchCars = async () => {

            try {

                const response = await api.get("/cars");

                setCars(response.data.cars);

            } catch (error) {

                console.log(error);

            }
        };

        fetchCars();

    }, []);

    const filteredCars = cars.filter((car) =>
    car.title.toLowerCase().includes(search.toLowerCase())
);

    return (
    <div className="container">

        <h1>Available Cars</h1>

        <br />
        
        <input
    type="text"
    placeholder="Search cars..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
/>

        <div className="car-grid">

            {filteredCars.map((car) => (

                <CarCard
                    key={car._id}
                    car={car}
                />

            ))}

        </div>

    </div>
);
}

export default Home;