import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ onCategorySearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    onCategorySearch(searchTerm);
    navigate(`/${searchTerm.replace(/\s+/g, "-").toLowerCase()}`);
  };

  return (
    <div className="bg-[#1e2020] p-4 flex items-center justify-between border-2 border-y-yellow-500 border-x-[#1e2020] w-full">
      <div className="bg-[url('https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXZrdDRyMm5jODVlM2dsdWNiaTVnampncDU2eW4zamMycDB3dXIzYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/04Y7m4gkurv2XjOzxv/giphy.gif')] w-16 h-16 md:w-24 md:h-24 bg-cover rounded-md border-2 border-yellow-500 cursor-pointer bg-center" />
      <div className="flex flex-grow items-center justify-center p-2">
        <input
          className="w-full p-2 md:p-4 rounded-md border-2 border-gray-300 outline-none focus:border-gray-500 text-lg"
          type="search"
          placeholder="Tìm Kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="ml-2 p-2 md:p-4 bg-[#dba902] text-black rounded-lg font-bold hover:bg-[#b68d02] transition ease-in-out"
          onClick={handleCategoryClick}
        >
          Tìm
        </button>
      </div>
      <div className="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="3"
          stroke="currentColor"
          class="w-6 h-6 text-white cursor-pointe"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Header;
