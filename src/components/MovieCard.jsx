import { Link } from "react-router-dom";

export default function MovieCard({ movie, onToggleFavorite, isFavorite }) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <div className="card h-100 shadow-sm rounded">
      <Link to={`/movie/${movie.id}`}>
        <img src={imageUrl} className="card-img-top" alt={movie.title} />
      </Link>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{movie.title}</h5>
        <span className="mb-2 fst-italic">
          <b>Rating: </b>
          {movie.vote_average !== undefined && movie.vote_average !== null
            ? Number(movie.vote_average).toFixed(1)
            : "N/A"}
        </span>

        {onToggleFavorite && (
          <button
            className={`btn btn-sm mt-auto ${
              isFavorite ? "btn-danger" : "btn-warning"
            }`}
            onClick={() => onToggleFavorite(movie.id)}
          >
            {isFavorite ? "Remove Favorite" : "Add Favorite"}
          </button>
        )}
      </div>
    </div>
  );
}
