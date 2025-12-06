import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const updateFavorites = () => {
      const storedFavorites =
        JSON.parse(localStorage.getItem("favorites")) || [];
      setFavoritesCount(storedFavorites.length);
    };

    updateFavorites();

    window.addEventListener("storage", updateFavorites);
    window.addEventListener("favoritesUpdated", updateFavorites);

    return () => {
      window.removeEventListener("storage", updateFavorites);
      window.removeEventListener("favoritesUpdated", updateFavorites);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark px-3">
      <Link className="navbar-brand" to="/">
        <i className="bi bi-code-slash text-warning"></i> Mini IMDB
      </Link>

      {/* Hamburger toggle button */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link text-warning" to="/">
              <span className="d-none d-lg-inline">
                <i className="bi bi-house-door-fill"></i>
              </span>
              <span className="d-inline d-lg-none">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-warning" to="/search">
              <span className="d-none d-lg-inline">
                <i className="bi bi-search"></i>
              </span>
              <span className="d-inline d-lg-none">Search</span>
            </Link>
          </li>
          <li className="nav-item position-relative">
            <Link className="nav-link text-warning" to="/favorites">
              <span className="d-none d-lg-inline">
                <i className="bi bi-heart-fill"></i>
                <span className="badge bg-primary position-absolute start-100 translate-middle ms-1">
                  {favoritesCount}
                </span>
              </span>
              <span className="d-inline d-lg-none">
                Favorites ({favoritesCount})
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
