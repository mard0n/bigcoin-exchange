import React, { FC } from 'react';

interface PaginationProps {
  numberOfPages: number;
  currentPageNumber: number;
  handlePageClick: (pageNumber: number) => void;
  handlePreviousClick: (pageNumber: number) => void;
  handleNextClick: (pageNumber: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  numberOfPages,
  currentPageNumber,
  handlePageClick,
  handlePreviousClick,
  handleNextClick,
}) => {
  return (
    <>
      <button type="button">Previous</button>
      {currentPageNumber - 4 > 1 && (
        <button
          type="button"
          className="first-page"
          onClick={() => handlePreviousClick(1)}
        >
          1
        </button>
      )}
      {currentPageNumber - 4 > 1 && <span className="other-pages">...</span>}
      {[...new Array(numberOfPages)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          ((pageNumber <= currentPageNumber &&
            pageNumber >= currentPageNumber - 4) ||
            (pageNumber >= currentPageNumber &&
              pageNumber <= currentPageNumber + 4)) && (
            // eslint-disable-next-line react/jsx-indent
            <button
              key={pageNumber}
              type="button"
              style={{
                color: pageNumber === currentPageNumber ? 'blue' : 'initial',
                margin: '0 5px',
              }}
              className="pages"
              onClick={() => handlePageClick(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        );
      })}
      {numberOfPages - 4 > currentPageNumber && (
        <span className="other-pages">...</span>
      )}
      {numberOfPages - 4 > currentPageNumber && (
        <button
          type="button"
          className="last-page"
          onClick={() => handleNextClick(numberOfPages)}
        >
          {numberOfPages}
        </button>
      )}
      <button type="button">Next</button>
    </>
  );
};

export default Pagination;
