import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onCategorySelect }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    onCategorySelect(category);
    navigate(`/${category.replace(/\s+/g, "-").toLowerCase()}`);
  };

  return (
    <div className="flex gap-5 justify-between items-center bg-[#202020] w-full">
      <div className="hidden md:block">
        <ul className="flex items-center gap-5">
          <li>
            <div
              className="ml-5 block px-5 py-3 cursor-pointer"
              onClick={() => handleCategoryClick("Trang Chủ")}
            >
              Trang Chủ
            </div>
          </li>
          <li>
            <div
              className="block px-5 py-3 cursor-pointer"
              onClick={() => handleCategoryClick("Phim Lẻ")}
            >
              Phim Lẻ
            </div>
          </li>
          <li>
            <div
              className="block px-5 py-3 cursor-pointer"
              onClick={() => handleCategoryClick("Phim Bộ")}
            >
              Phim Bộ
            </div>
          </li>

          <li>
            <div
              className="block px-5 py-3 cursor-pointer"
              onClick={() => handleCategoryClick("Hoạt Hình")}
            >
              Hoạt Hình
            </div>
          </li>
          <li>
            <div
              className="block px-5 py-3 cursor-pointer"
              onClick={() => handleCategoryClick("Tivi Shows")}
            >
              TV Show
            </div>
          </li>
        </ul>
      </div>
      <div className="flex items-center md:hidden ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-menu"
          type="button"
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-controls="radix-:R1dja:"
          data-state="closed"
        >
          <line x1="4" x2="20" y1="12" y2="12"></line>
          <line x1="4" x2="20" y1="6" y2="6"></line>
          <line x1="4" x2="20" y1="18" y2="18"></line>
        </svg>
      </div>
    </div>
  );
};

export default Navbar;
