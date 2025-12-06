import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { movieApi } from "../api/movieApi";

const FAVORITES_KEY = "favorites";

const getFavorites = () =>
  JSON.parse(localStorage.getItem(FAVORITES_KEY)) ?? [];
const saveFavorites = (favorites) =>
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

export default function MovieDetail() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = getFavorites();
    setIsFavorite(favorites.some((fav) => fav.id === +id));
  }, [id]);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      try {
        const { data } = await movieApi.get(`/movie/${id}`);
        setMovie(data);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  const toggleFavorite = useCallback(() => {
    const favorites = getFavorites();

    if (isFavorite) {
      const updated = favorites.filter((fav) => fav.id !== +id);
      saveFavorites(updated);
      setIsFavorite(false);
    } else if (movie) {
      const updated = [
        ...favorites,
        { id: +id, title: movie.title, poster_path: movie.poster_path },
      ];
      saveFavorites(updated);
      setIsFavorite(true);
    }

    window.dispatchEvent(new Event("favoritesUpdated"));
  }, [id, isFavorite, movie]);

  if (loading)
    return <div className="container mt-4 text-center">Loading...</div>;
  if (error)
    return (
      <div className="container mt-4 text-danger text-center">{error}</div>
    );
  if (!movie)
    return (
      <div className="container mt-4 text-center">No movie data available.</div>
    );

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <div className="container mt-4">
      <div className="card mb-4 shadow-sm">
        <div className="row flex-column flex-md-row g-0">
          <div className="col-md-4 text-center p-3">
            <img
              src={posterUrl}
              className="img-fluid rounded shadow-sm"
              alt={movie.title}
            />
          </div>

          <div className="col-md-8">
            <div className="card-body p-3 p-md-4">
              <h2 className="card-title">{movie.title}</h2>
              <p className="card-text mb-2 d-flex flex-wrap gap-2">
                <span className="badge bg-warning text-dark">
                  Rating:{" "}
                  <em>
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  </em>
                </span>
                <span className="badge bg-info text-dark">
                  Genres: {movie.genres?.map((g) => g.name).join(", ") ?? "N/A"}
                </span>
              </p>
              <p className="card-text">
                {movie.overview ?? "No description available."}
              </p>
              <button
                className={`btn ${
                  isFavorite ? "btn-danger" : "btn-success"
                } mt-2`}
                onClick={toggleFavorite}
              >
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
