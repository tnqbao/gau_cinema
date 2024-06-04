import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onCategorySelect }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState('Trang Chủ');
  const categoryList = [
    "Phim Mới",
    "Phim Lẻ",
    "Phim Bộ",
    "Hoạt Hình",
    "TV Show",
    "Thuyết Minh",
    "Phim Vietsub",
    "Lồng Tiếng",
    "Phim Sắp Chiếu",
  ];

  const handleCategoryClick = (category) => {
    onCategorySelect(category);
    setCategory(category);
    navigate(`/${category.replace(/\s+/g, "-").toLowerCase()}`);
    setMenuOpen(false); 
  };

  return (
    <div className="relative flex gap-5 justify-between items-center bg-[#202020] w-full ">
      <ul className={`hidden md:flex items-center gap-5 ${menuOpen ? "flex" : "hidden"}`}>
        {categoryList.map((cate) => (
          <li key={cate}>
            <div
              className={"ml-5 block px-5 py-3 cursor-pointer text-center border-y-slate-500 text-xl hover:bg-slate-800 target:bg-slate-400 " + (cate===category ? "bg-[#dba902] text-black" : "text-cyan-50")}
              onClick={() => handleCategoryClick(cate)}
            >
              {cate}
            </div>
          </li>
        ))}
      </ul>
      {/* Toggle button */}
      <button
        className="md:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {}
        {menuOpen ? "Close" : "Menu"}
      </button>
    </div>
  );
};

export default Navbar;

