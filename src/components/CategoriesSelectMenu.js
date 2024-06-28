import React, { useEffect, useState, useContext, useCallback } from "react";
import { GlobalContext } from "../context/GlobalContext";

const CategoriesSelectMenu = () => {
  const { DOMAIN_API, getDataAPI, handleMenuSelect } =
    useContext(GlobalContext);
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    getDataAPI(`${DOMAIN_API}/v1/api/the-loai`, (data) => {
      if (Array.isArray(data.data.items)) {
        setCategories(data.data.items);
      } else {
        console.error("Expected data to be an array", data);
      }
    });
  }, [getDataAPI, DOMAIN_API]);

  const handleDocumentClick = useCallback((e) => {
    const cateList = document.getElementById("cate-list");
    const cateButton = document.getElementById("cate-button");

    if (cateButton && cateButton.contains(e.target)) {
      setMenuOpen((prev) => !prev);
    } else if (cateList && !cateList.contains(e.target)) {
      setMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [handleDocumentClick]);

  return (
    <div className="relative">
      <div
        id="cate-list"
        className={`absolute bg-[#202020] shadow-lg rounded-lg p-4 left-0 z-10 text-black ${
          menuOpen ? "" : "hidden"
        }`}
      >
        <div className="flex flex-wrap gap-4 justify-start">
          {categories.map((category) => {
            return (
              category.name !== "Phim 18+" && (
                <div
                  key={category._id}
                  className="px-2 py-3 hover:bg-gray-200 hover:text-black text-black cursor-pointer bg-white rounded-md border-zinc-800 text-medium font-bold"
                  onClick={() => {
                    handleMenuSelect(category.slug);
                    setMenuOpen(false);
                  }}
                >
                  {category.name}
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSelectMenu;
