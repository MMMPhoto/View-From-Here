import React, { useCallback, useEffect, useRef, useState } from "react";
import { getAllPics, savePic } from "../utils/api";
import SearchFooter from "../components/searchFooter";
import "./home.css";
import "./searchFooter.css";
import MapWrapper from "../components/MapWrapper";

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
      {/* <section className="py-5">
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <h2>Engaging Background Images</h2>
              <p className="lead">
                The background images used in this template are sourced from
                Unsplash and are open source and free to use.
              </p>
              <p className="mb-0">
                I can't tell you how many people say they were turned off from
                science because of a science teacher that completely sucked out
                all the inspiration and enthusiasm they had for the course.
              </p>
            </div>
          </div>
        </div>
      </section> */}
      {/* <SearchFooter /> */}
    </>
  );
};

export default Home;
