import React, { useEffect, useState } from "react";
import { getAllPics } from "../../utils/api";
import "./home.css";
import "../../components/searchFooter/searchFooter.css";
import MapWrapper from "../../components/MapWrapper";

const Home = (props) => {
  // Set marker state
  const [markers, setMarkers] = useState("");

  // Map Container Styling
  const containerStyle = {
    width: "100vw",
    height: "100vh",
  };

  // Load all pictures on page load
  useEffect(() => {
    const fetchPicData = async () => {
      try {
        const response = await getAllPics();
        const jsonData = await response.json();
        setMarkers(jsonData);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchPicData();
  }, []);

  return (
    <>
      <div id="map" className="">
        <MapWrapper markers={markers} containerStyle={containerStyle} />
      </div>
    </>
  );
};

export default Home;
