import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import ListFilm from "./ListFilm";

const Home = () => {
  const [films, setFilms] = useState([]);
  const [seoData, setSeoData] = useState({
    titleHead: "",
    descriptionHead: "",
    og_image: [],
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get("https://ophim1.com/v1/api/home");
        const { data } = response.data;

        setFilms(data);
        const { seoOnPage } = data;
        if (seoOnPage) {
          setSeoData({
            titleHead: seoOnPage.titleHead,
            descriptionHead: seoOnPage.descriptionHead,
            og_image: seoOnPage.og_image,
          });
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <>
      <Helmet>
        <title>{"Cú Phim" - seoData.titleHead}</title>
        <meta name="description" content={seoData.descriptionHead} />
        <meta property="og:type" content="website" />
        {seoData.og_image.map((image, index) => (
          <meta property="og:image" content={image} key={index} />
        ))}
      </Helmet>
      <ListFilm films = {films}></ListFilm>
    </>
  );
};

export default Home;
