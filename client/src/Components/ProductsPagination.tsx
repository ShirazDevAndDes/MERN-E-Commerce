import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactQueryMutationType } from "../types/reactQuery";

type ProductsPaginationType = {
  totalPages: number;
  currentPage: string | number;
  changePage: ReactQueryMutationType;
};

export default function ProductsPagination({
  totalPages,
  currentPage,
  changePage,
}: ProductsPaginationType) {
  const pageNumbers: number[] = [];

  for (var i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  // console.log(currentPage);
  const lastPage = pageNumbers[pageNumbers.length - 1];
  function prevPage() {
    // console.log("Prev: ", currentPage <= 1 ? 1 : currentPage - 1);
    changePage(currentPage <= 1 ? 1 : parseInt(currentPage.toString()) - 1);
  }

  function nextPage() {
    // console.log("Next: ", currentPage >= lastPage ? lastPage : currentPage + 1);
    changePage(
      currentPage >= lastPage ? lastPage : parseInt(currentPage.toString()) + 1
    );
  }

  return (
    <div className="btn-group" role="group" aria-label="First group">
      <button
        type="button"
        className="btn btn-outline-secondary"
        disabled={currentPage <= 1 ? true : false}
        onClick={prevPage}
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
        disabled={currentPage >= lastPage ? true : false}
        onClick={nextPage}
      >
        <FontAwesomeIcon icon={faAnglesRight} />
      </button>
    </div>
  );
}
