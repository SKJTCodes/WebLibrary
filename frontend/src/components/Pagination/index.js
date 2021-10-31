import React from "react";
// Styles
import { Wrapper, Content } from "./Pagination.styles";

const Pagination = ({ curPage, totalPages, setPage, total }) => {
  let pages = Array.from(
    { length: totalPages < total ? totalPages : total },
    (_, i) => i + 1
  );
  const range = (total - 1) / 2;

  if (curPage > totalPages - range) {
    pages = Array.from(
      { length: totalPages < total ? totalPages : total },
      (_, i) => totalPages - i
    );
  } else if (curPage > range) {
    const before = Array.from({ length: range + 1 }, (_, i) => curPage - i);
    let after = Array.from({ length: range + 1 }, (_, i) => curPage + i);
    after = after.splice(1, after.length - 1);
    pages = [...before, ...after];
  }

  pages.sort((a, b) => {
    return a - b;
  });

  return (
    <Wrapper>
      <Content>
        {curPage > 1 && <div onClick={() => setPage(1)}>&laquo;</div>}
        {pages.map((pageNum) => {
          return (
            <div
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={pageNum === curPage ? "active" : ""}
            >
              {pageNum}
            </div>
          );
        })}
        {curPage < totalPages && (
          <div onClick={() => setPage(totalPages)}>&raquo;</div>
        )}
      </Content>
    </Wrapper>
  );
};

export default Pagination;
