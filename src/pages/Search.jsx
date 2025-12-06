import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { movieApi } from "../api/movieApi";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";

export default function Search() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;

  // URL parametrelerinden query ve page'i al
  useEffect(() => {
    setQuery(q);
    setCurrentPage(pageFromUrl);
  }, [q, pageFromUrl]);

  useEffect(() => {
    if (!query) {
      setMovies([]);
      setTotalPages(1);
      return;
    }

    const fetchSearch = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await movieApi.get("/search/movie", {
          params: { query, page: currentPage },
        });

        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (err) {
        console.error(err);
        setError("Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query, currentPage]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // Enter tuşu ile aramayı tetikle
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      setSearchParams({ q: query, page: 1 });
    }
  };

  // Sayfa değiştirildiğinde URL ve state güncellensin
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ q: query, page });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Search Movies</h2>

      <div className="input-group mb-4 shadow-sm">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search for a movie..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
      </div>

      {loading && (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
      {movies.length === 0 && query && !loading && (
        <div className="alert alert-warning">No results found</div>
      )}

      <div className="row">
        {movies.map((movie) => (
          <div key={movie.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
