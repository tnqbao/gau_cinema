import React, { useEffect, useState, useContext, useCallback } from "react";
import { GlobalContext } from "../context/GlobalContext";

const CategoriesSelectMenu = ({ option, setSelectedOption }) => {
  const { DOMAIN_API, getDataAPI, handleMenuSelect } =
    useContext(GlobalContext);
  const [items, setItems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let apiEndpoint = `${DOMAIN_API}/v1/api/`;
    if (option === "Thể Loại") {
      apiEndpoint += "the-loai";
    } else if (option === "Quốc Gia") {
      apiEndpoint += "quoc-gia";
    }

    getDataAPI(apiEndpoint, (data) => {
      if (Array.isArray(data.data.items)) {
        setItems(data.data.items);
      } else {
        console.error("Expected data to be an array", data);
      }
    });
  }, [getDataAPI, DOMAIN_API, option]);

  const handleDocumentClick = useCallback(
    (e) => {
      const itemList = document.getElementById("item-list");
      const button = document.getElementById(
        `${option.toLowerCase().replace(/\s+/g, "-")}-button`
      );

      if (button && button.contains(e.target)) {
        setMenuOpen((prev) => !prev);
      } else if (itemList && !itemList.contains(e.target)) {
        setMenuOpen(false);
      }
    },
    [option]
  );

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [handleDocumentClick]);

  return (
    <div className="relative">
      <div
        id="item-list"
        className={`absolute bg-[#202020] shadow-lg rounded-lg p-4 left-0 z-10 text-black ${
          menuOpen ? "" : "hidden"
        }`}
      >
        <div className="flex flex-wrap gap-4 justify-start">
          {items.map((item) => (
            item.name !== "Phim 18+" && (
              <div
                key={item._id}
                className="w-36 h-10 flex items-center justify-center hover:bg-gray-200 hover:text-black text-black cursor-pointer bg-white rounded-md border-zinc-800 text-medium font-bold"
                onClick={() => {
                  handleMenuSelect(item.slug, option);
                  setMenuOpen(false);
                  setSelectedOption(null);
                }}
              >
                {item.name}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSelectMenu;
