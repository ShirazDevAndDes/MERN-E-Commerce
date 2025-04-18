import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "react-router-dom";

type ProductsPaginationType = {
  totalPages: number;
  changePage: (page: number, type?: string) => void;
};

export default function ProductsPagination({
  totalPages,
  changePage,
}: ProductsPaginationType) {
  const pageNumbers: number[] = [];

  for (var i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const [params] = useSearchParams();

  let page = parseInt(params.get("page")) || 1;

  return (
    <div className="btn-group" role="group" aria-label="First group">
      <button
        type="button"
        className="btn btn-outline-secondary"
        disabled={page <= 1 ? true : false}
        onClick={() => changePage(page || 1, "prev")}
      >
        <FontAwesomeIcon icon={faAnglesLeft} />
      </button>
      {pageNumbers.map((value) => {
        return (
          <button
            key={value}
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => changePage(value)}
          >
            {value}
          </button>
        );
      })}

      <button
        type="button"
        className="btn btn-outline-secondary"
        disabled={page >= totalPages ? true : false}
        onClick={() => changePage(page || totalPages, "next")}
      >
        <FontAwesomeIcon icon={faAnglesRight} />
      </button>
    </div>
  );
}
