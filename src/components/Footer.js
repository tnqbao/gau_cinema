import React from "react";

const Footer = () => {
  return (
    <div className="bg-[#1e2020] p-4 flex flex-wrap items-center justify-between w-full mt-8 z-40">
      <div className="basis-1/2">  * </div>
      <div className="basis-1/2 max-w-[1400px] mx-auto p-4 md:px-9 text-right space-y-4">
        <span className="font-black text-2xl animate-pulse duration-1000 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-700">
          XEM PHIM VUI VẺ =))
        </span>
        <p className="font-bold text-foreground/60 text-white">
          (v0.0.3) Bản cập nhật thứ 0.0.3
        </p>
      </div>
      <div className="flex justify-center">
        <p></p>
        <p></p>
      <div className="text-secondary-foreground/40 text-sm text-white text-center">
          Trang web này được tạo ra và phát triển với mục đích học tập và nghiên
          cứu, mọi hình ảnh và nội dung trên trang web đều được sử dụng với mục đích
          phi lợi nhuận, xin lưu ý!
          <br />
        </div>
      </div>
    </div>
  );
};

export default Footer;
