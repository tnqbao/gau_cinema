import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { category, setCategory, handleCategorySelect } =
    useContext(GlobalContext);

  const categoryList = [
    "Trang Chủ",
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

  const handleCategoryClick = (selectedCategory) => {
    handleCategorySelect(selectedCategory);
    navigate(
      selectedCategory === "Trang Chủ"
        ? "/"
        : `/${selectedCategory.replace(/\s+/g, "-").toLowerCase()}`
    );
    setCategory(selectedCategory === "Trang Chủ" ? "" : selectedCategory);
    setMenuOpen(false);
    const topMenu = document.getElementById("top-menu");
    if (topMenu) {
      topMenu.classList.add("hidden");
    }
  };

  const handleDocumentClick = (e) => {
    const topMenu = document.getElementById("top-menu");
    const toggleTopMenuIcon = document.getElementById("toggleTopMenuIcon");

    if (toggleTopMenuIcon && toggleTopMenuIcon.contains(e.target)) {
      if (topMenu) {
        topMenu.classList.toggle("hidden");
      }
    } else if (topMenu && !topMenu.contains(e.target)) {
      topMenu.classList.add("hidden");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    const topMenu = document.getElementById("top-menu");
    if (topMenu) {
      topMenu.classList.add("hidden");
    }
  }, []);

  return (
    <div className="relative flex gap-5 justify-between items-center bg-[#202020] w-full">
      <ul
        id="top-menu"
        className={`lg:flex items-center gap-y-3 gap-x-1 flex-wrap ${
          menuOpen ? "flex" : "hidden"
        }`}
      >
        {categoryList.map((cate) => (
          <li key={cate} className="top-menu-icon p-1">
            <div
              className={
                "ml-5 block px-5 py-3 cursor-pointer text-center border-y-slate-500 text-xl hover:bg-[#2c3f3b] relative after:absolute after:bottom-0 after:left-0 after:bg-slate-700 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 " +
                (cate === category ? "bg-[#dba902] text-black" : "text-cyan-50")
              }
              onClick={() => handleCategoryClick(cate)}
            >
              {cate}
            </div>
          </li>
        ))}
      </ul>
      <div id="toggleTopMenuIcon" className="lg:hidden p-5 hover:bg-[#2c3f3b]">
        <i className="fa fa-bars text-white" />
      </div>
    </div>
  );
};

export default Navbar;
