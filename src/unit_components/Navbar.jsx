import React, { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
import CategoriesSelectMenu from "./CategoriesSelectMenu";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const { handleMenuSelect, category } = useContext(GlobalContext);
  const menuElementList = [
    "Phim Mới",
    "Phim Lẻ",
    "Phim Bộ",
    "Hoạt Hình",
    "Sắp Chiếu",
    "Thuyết Minh",
    "Vietsub",
    "TV Show",
    "Thể Loại",
    "Quốc Gia"
  ];

  const handleDocumentClick = (e) => {
    const topMenu = document.getElementById("top-menu");
    const toggleTopMenuIcon = document.getElementById("toggleTopMenuIcon");

    if (toggleTopMenuIcon && toggleTopMenuIcon.contains(e.target)) {
      setMenuOpen((prev) => !prev);
    } else if (topMenu && !topMenu.contains(e.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <>
      <div className="relative">
        <div
          className={`bg-[#202020] text-white flex items-center justify-between border-2 border-[#1e2020]`}
        >
          <ul
            id="top-menu"
            className={`lg:flex items-center gap-y-3 gap-x-1 flex-wrap list-none ml-5 ${
              menuOpen ? "flex" : "hidden"
            }`}
          >
            {menuElementList.map((e) => (
              <li key={e} className="top-menu-icon">
                {(e !== "Thể Loại" && e !== "Quốc Gia") ? (
                  <div
                    className={
                      "ml-5 block p-5 cursor-pointer text-center border-y-slate-500 text-base hover:bg-[#2c3f3b] relative after:absolute after:bottom-0 after:left-0 after:bg-slate-700 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 " +
                      (category === e
                        ? "bg-[#dba902] text-black"
                        : "text-cyan-50")
                    }
                    onClick={() => {
                      handleMenuSelect(e);
                      setMenuOpen(false);
                    }}
                  >
                    {e}
                  </div>
                ) : (
                  <div
                    id={`${e.toLowerCase().replace(/\s+/g, '-')}-button`}
                    className="text-slate-200 text-base font-medium ml-5 flex gap-3 p-7 cursor-pointer text-center border-y-slate-500 hover:bg-[#2c3f3b] relative after:absolute after:bottom-0 after:left-0 after:bg-slate-700 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                    onClick={() => setSelectedOption(e)}
                  >
                    {e}
                    <svg
                      className="self-end w-6 h-6 hover:text-stone-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div
            id="toggleTopMenuIcon"
            className="lg:hidden p-5 hover:bg-[#2c3f3b]"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
                className="w-6 h-6 text-white cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
                className="w-6 h-6 text-white cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
      {selectedOption && (
        <CategoriesSelectMenu option={selectedOption} setSelectedOption={setSelectedOption} />
      )}
    </>
  );
};

export default Navbar;
