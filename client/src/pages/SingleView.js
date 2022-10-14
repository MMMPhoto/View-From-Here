import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { GrFavorite } from "react-icons/gr";
import MapWrapper from "../components/MapWrapper";
import "./SingleView.css";
import Auth from "../utils/auth";
import { getOnePic, savePic } from "../utils/api";
import { savePicIds, getSavedPicIds } from "../utils/localStorage";

const SingleView = () => {
  const { pictureId } = useParams();
  const [pictureData, setPictureData] = useState([{}]);
  const [savedPicIds, setSavedPicIds] = useState(getSavedPicIds());
  const [picUrl, setPicUrl] = useState("");
  const [tags, setPicTags] = useState([]);

  // Set state for saved photo
  const [isSavedPhoto, setSavedPhoto] = useState(false);

  // Map Container Styling
  const containerStyle = {
    width: "60vh",
    height: "60vh",
  };

  useEffect(() => {
    const getPicData = async () => {
      try {
        const response = await getOnePic(pictureId);
        const jsonData = await response.json();
        let jsonArray = [];
        jsonArray.push(jsonData);
        setPictureData(jsonArray);
        setPicTags(jsonData.tags);
        // Call API to set photo URL
        const url = `https://res.cloudinary.com/dwuqez3pg/image/upload/c_scale,w_2000/v1665696442/${jsonData.public_id}.jpg`;
        setPicUrl(url);
      } catch (error) {
        console.log("error", error);
      }
    };
    getPicData();
  }, []);

  // Handle save photo
  const handleSavePhoto = async (picId) => {
    // const picToSave = pictureData.find(
    //   (picture) => pictureData[0].id === picId
    // );

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await savePic(picId, token);

      if (!response.ok) {
        console.log(response);
        throw new Error("Yo shit sux, playa!");
      }

      // If the pic successfully saves to the user's account, save pic id to state
      setSavedPicIds([...savedPicIds, picId]);
    } catch (err) {
      console.error(err);
    }
  };

  // setSavedPhoto(true);
  return (
    <div className="d-flex flex-column align-items-center p-4">
      <div className="d-flex flex-row justify-content-center align-items-center">
        <h3>
          <GrFavorite onClick={() => handleSavePhoto(pictureData[0].id)} />
        </h3>
        {isSavedPhoto ? <p className="ms-3 mb-0">Photo saved!</p> : <></>}
      </div>
      <div>
        <p>Tags: {tags.map((tag, index) => (
          <span key={index}>{tag} </span>
        ))}</p>
      </div>
      <img className="single-pic p-4" src={picUrl} />
      <div>
        {pictureData[0].lat ? (
          <MapWrapper markers={pictureData} containerStyle={containerStyle} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default SingleView;
