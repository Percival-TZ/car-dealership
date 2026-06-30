import { useEffect, useState } from "react";
import api from "../services/Api";
import CarCard from "../components/CarCard";

function Home() {
    const [search, setSearch] = useState("");
    const [cars, setCars] = useState([]);
    const [activeCondition, setActiveCondition] = useState("all");
    const [activeBrand, setActiveBrand] = useState("all");
    const [slideIndex, setSlideIndex] = useState(0);

    const heroImages = [
        "/hero/ford-mustang.jpeg",
        "/hero/lambo-gallardo.jpeg",
        "/hero/lambo-gallardo-p45.jpeg",
        "/hero/range-rover.jpeg",
        "/hero/toyota-supra.jpeg",
    ];

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await api.get("/cars?limit=1000");
                setCars(response.data.cars);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCars();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setSlideIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const brands = [...new Set(cars.map((c) => c.brand))];

    const filteredCars = cars.filter((car) => {
        const matchesSearch = car.title.toLowerCase().includes(search.toLowerCase());
        const matchesCondition = activeCondition === "all" || car.condition === activeCondition;
        const matchesBrand = activeBrand === "all" || car.brand === activeBrand;
        return matchesSearch && matchesCondition && matchesBrand;
    });

    const scrollToInventory = () => {
        document.getElementById("inventory")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            {/* Hero */}
            <section className="hero">
                {/* Slideshow background */}
                {heroImages.map((src, i) => (
                    <div
                        key={i}
                        className={`hero-slide ${i === slideIndex ? "active" : ""}`}
                        style={{ backgroundImage: `url(${src})` }}
                    />
                ))}
                <div className="hero-overlay" />

                <div className="hero-content">
                    <p className="hero-tagline">Premium Car Dealership</p>
                    <h1>Find the car that fits your life.</h1>
                    <p className="hero-subtitle">
                        Certified vehicles, transparent pricing, and hassle-free ordering.
                    </p>

                    <div className="hero-search">
                        <span className="hero-search-icon">&#128269;</span>
                        <input
                            type="text"
                            placeholder="Search by car name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="hero-cta-group">
                        <button className="hero-cta-primary" onClick={scrollToInventory}>
                            Browse Inventory
                        </button>
                        <button className="hero-cta-secondary" onClick={scrollToInventory}>
                            View All Cars
                        </button>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <div className="filter-section" id="inventory">
                <div className="filter-row">
                    <span className="filter-label">Condition</span>
                    {["all", "new", "used"].map((val) => (
                        <button
                            key={val}
                            className={`filter-chip ${activeCondition === val ? "active" : ""}`}
                            onClick={() => setActiveCondition(val)}
                        >
                            {val === "all" ? "All" : val.charAt(0).toUpperCase() + val.slice(1)}
                        </button>
                    ))}
                </div>

                {brands.length > 1 && (
                    <div className="filter-row">
                        <span className="filter-label">Brand</span>
                        <button
                            className={`filter-chip ${activeBrand === "all" ? "active" : ""}`}
                            onClick={() => setActiveBrand("all")}
                        >
                            All
                        </button>
                        {brands.map((brand) => (
                            <button
                                key={brand}
                                className={`filter-chip ${activeBrand === brand ? "active" : ""}`}
                                onClick={() => setActiveBrand(brand)}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <p className="results-count">{filteredCars.length} result(s)</p>

            {/* Inventory grid */}
            <div className="inventory-section">
                {filteredCars.length === 0 ? (
                    <div className="empty-state">
                        <p>No cars match your filters.</p>
                    </div>
                ) : (
                    <div className="car-grid">
                        {filteredCars.map((car) => (
                            <CarCard key={car._id} car={car} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Home;
