// components/Pagination.js

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Görüntülenecek maksimum sayfa numarası
    let startPage = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxVisible + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="d-flex align-items-center justify-content-center gap-1 gap-md-2 my-4 flex-wrap overflow-auto">
      {/* Önceki Sayfa */}
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        <i className="bi bi-arrow-bar-left"></i>
      </button>

      {/* Başlangıç Noktası ve ... */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            className="btn btn-light btn-sm"
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          {pageNumbers[0] > 2 && <span className="px-1">...</span>}
        </>
      )}

      {/* Sayfa Numara Düğmeleri */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`btn btn-sm ${
            page === currentPage ? "btn-primary" : "btn-light"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Son Sayfa ve ... */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-1">...</span>
          )}
          <button
            className="btn btn-light btn-sm"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Sonraki Sayfa */}
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        <i className="bi bi-arrow-bar-right"></i>
      </button>
    </div>
  );
}
