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
    <div className="bg-[#1d1717] p-6 flex items-center justify-evenly border-2 border-yellow-500 ">
      <div className=" bg-[url('https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXZrdDRyMm5jODVlM2dsdWNiaTVnampncDU2eW4zamMycDB3dXIzYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/04Y7m4gkurv2XjOzxv/giphy.gif')] w-auto h-auto p-12 rounded-3xl bg-cover basis-1/12 rounded-md border-2 border-yellow-500 cursor-pointer" />
      <div className="flex rounded-md border-2 border-yellow-500 justify-evenly items-center basis-4/6 p-4">
        <input
          className=" ml-6 p-4 rounded-md border-2 border-gray-300 outline-none focus:border-gray-500 text-lg basis-3/4"
          type="search"
          placeholder="Tìm Kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="basis-1/4 ml-3 p-4 bg-[#dba902] text-black rounded-lg font-bold hover:bg-[#b68d02] transition ease-in-out"
          onClick={handleCategoryClick}
        >
          Tìm
        </button>
      </div>
      <div>Add Later</div>
    </div>
  );
};

export default Header;
