import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";

const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref, callback]);
};

const SearchIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="3"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const Header = () => {
  const { handleCategorySearch } =
    useContext(GlobalContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const toggleSearchButtonRef = useRef(null);

  const handleCategoryClick = () => {
    handleCategorySearch(searchTerm);
    navigate(`/${searchTerm.replace(/\s+/g, "-").toLowerCase()}`);
  };

  const handleHomeClick = () => {
    handleCategorySearch("");
    navigate(`/`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCategoryClick();
    }
  };

  useOutsideClick(searchInputRef, () => setSearchOpen(false));
  useOutsideClick(toggleSearchButtonRef, () => setSearchOpen(true));

  return (
    <div className="bg-[#1e2020] p-4 flex items-center justify-between border-2 border-y-yellow-500 border-x-[#1e2020] w-full">
      <div className="basis-1/3 md:basis-1/4 flex items-center">
        <div
          className="bg-[url('https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXZrdDRyMm5jODVlM2dsdWNiaTVnampncDU2eW4zamMycDB3dXIzYyZlcD12MV9pbnRlcm5fZ2lmX2J5X2lkJmN0PWc/04Y7m4gkurv2XjOzxv/giphy.gif')] w-16 h-16 md:w-24 md:h-24 bg-cover rounded-md border-2 border-yellow-500 cursor-pointer bg-center"
          onClick={handleHomeClick}
        />
      </div>
      <div
        className={`flex items-center justify-center p-2 basis-2/3 md:basis-3/4 ${
          searchOpen ? "flex" : "hidden"
        } md:flex`}
      >
        <input
          ref={searchInputRef}
          className="w-full p-2 md:p-4 rounded-md border-2 border-gray-300 outline-none focus:border-gray-500 text-xl"
          type="search"
          placeholder="Tìm Kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="ml-2 p-2 md:p-4 bg-[#dba902] text-black rounded-lg font-bold hover:bg-[#b68d02] transition ease-in-out"
          onClick={handleCategoryClick}
        >
          <SearchIcon className="w-6 h-6 text-black cursor-pointer" />
        </button>
      </div>
      <div
        id="toggleSearchButton"
        ref={toggleSearchButtonRef}
        className={`toggle-search-button p-2 ${
          searchOpen ? "hidden" : "block"
        } md:hidden`}
      >
        <SearchIcon className="w-6 h-6 text-white cursor-pointer" />
      </div>
    </div>
  );
};

export default Header;
