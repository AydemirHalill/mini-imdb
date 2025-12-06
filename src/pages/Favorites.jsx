import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const removeFavorite = (id) => {
    const newFavorites = favorites.filter((movie) => movie.id !== id);
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  if (favorites.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-info p-4 shadow rounded">
          <h4 className="mb-2">No Favorites Yet!</h4>
          <p>Add some movies to your favorites to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Favorites</h2>
      <div className="row g-4">
        {favorites.map((movie) => (
          <div key={movie.id} className="col-6 col-md-4 col-lg-3">
            <MovieCard
              movie={movie}
              onToggleFavorite={removeFavorite}
              isFavorite={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
