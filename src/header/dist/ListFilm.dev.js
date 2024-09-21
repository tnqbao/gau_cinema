"use strict";

var getPageNumbers = function getPageNumbers() {
  var arr = [];

  if (totalPages <= 5) {
    // If total pages are less than or equal to 5, show all page numbers
    return Array.from({
      length: totalPages
    }, function (_, i) {
      return i + 1;
    });
  } else if (page <= 3) {
    // If the current page is less than or equal to 3, show the first 3 pages, ellipsis, and the last page
    arr = [1, 2, 3, '...', totalPages];
  } else if (page >= totalPages - 2) {
    // If the current page is in the last 3 pages, show the first page, ellipsis, and the last 3 pages
    arr = [1, '...', totalPages - 2, totalPages - 1, totalPages];
  } else {
    // For other cases, show the first page, ellipsis, current page and its neighbors, ellipsis, and the last page
    arr = [1, '...', page - 1, page, page + 1, '...', totalPages];
  } // Ensure the array always has exactly 5 elements by adjusting the ellipses as necessary


  if (arr.length > 5) {
    if (arr[1] === '...') {
      arr.splice(1, 1);
    } else {
      arr.splice(3, 1);
    }
  }

  return arr;
};
//# sourceMappingURL=ListFilm.dev.js.map
