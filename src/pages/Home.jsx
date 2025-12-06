import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { movieApi } from "../api/movieApi";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page")) || 1;
    setPage(pageParam);
  }, [searchParams]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieApi.get("/movie/popular", {
          params: { page },
        });
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load movies.");
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);

    if (newPage === 1) {
      setSearchParams({});
    } else {
      setSearchParams({ page: newPage });
    }
  };

  const handleToggleFavorite = (movie) => {
    const isFav = favorites.some((fav) => fav.id === movie.id);
    let newFavorites;

    if (isFav) {
      newFavorites = favorites.filter((fav) => fav.id !== movie.id);
    } else {
      newFavorites = [
        ...favorites,
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
        },
      ];
    }

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));

    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Popular Movies</h2>
      <hr className="border border-2 border-warning opacity-50" />
      <div className="row">
        {movies.map((movie) => (
          <div key={movie.id} className="col-md-3 mb-4">
            <MovieCard
              movie={movie}
              onToggleFavorite={() => handleToggleFavorite(movie)}
              isFavorite={favorites.some((fav) => fav.id === movie.id)}
            />
          </div>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
