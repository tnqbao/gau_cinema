import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onCategorySelect }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    onCategorySelect(category);
    navigate(`/${category.replace(/\s+/g, '-').toLowerCase()}`);
  };

  return (
    <div className="bg-[#1d1717] p-5 flex items-center justify-evenly border-2 border-yellow-500">
      <div
        className="border border-[#dba902] cursor-pointer p-4 ml-6 bg-[#dba902] rounded transition ease-in-out hover:bg-[#186e5c] flex-1 font-bold text-center"
        onClick={() => handleCategoryClick("Phim Mới")}
      >
        Phim Mới
      </div>
      <div
        className="border border-[#dba902] cursor-pointer p-4 ml-6 bg-[#dba902] rounded transition ease-in-out hover:bg-[#186e5c] flex-1 font-bold text-center"
        onClick={() => handleCategoryClick("Phim Lẻ")}
      >
        Phim Lẻ
      </div>
      <div
        className="border border-[#dba902] cursor-pointer p-4 ml-6 bg-[#dba902] rounded transition ease-in-out hover:bg-[#186e5c] flex-1 font-bold text-center"
        onClick={() => handleCategoryClick("Phim Bộ")}
      >
        Phim Bộ
      </div>
      <div
        className="border border-[#dba902] cursor-pointer p-4 ml-6 bg-[#dba902] rounded transition ease-in-out hover:bg-[#186e5c] flex-1 font-bold text-center"
        onClick={() => handleCategoryClick("Hoạt Hình")}
      >
        Hoạt Hình
      </div>
    </div>
  );
};

export default Navbar;
