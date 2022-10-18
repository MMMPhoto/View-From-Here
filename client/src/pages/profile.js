import React, { useState, useEffect } from "react";
import { Container, CardGroup, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";
import { getCurrentUser, deleteSavedPic, uploadNewPic } from "../utils/api";

const Profile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [savedPics, setSavedPics] = useState([{}]);
  const [newLoad, setnewLoad] = useState(true);
  const [newDeletedPic, setNewDeletedPic] = useState(false);

  // Image Upload State
  const [image, setImage] = useState();
  const [status, setStatus] = useState('');

  // Get Logged in User's Data
  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) {
          return false;
        }
        const response = await getCurrentUser(token);
        if (!response.ok) {
          throw new Error("something went wrong!");
        }
        const user = await response.json();
        setUserData(user);
        setSavedPics(user.savedPics);
        setNewDeletedPic(false);
        setnewLoad(false);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [newLoad, newDeletedPic]);

  // Delete Pic from User's Saved Pics
  const handleDeletePic = async (picId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }
    try {
      const response = await deleteSavedPic(picId, token);
      if (!response.ok) {
        throw new Error("something went wrong!");
      }
      const updatedUser = await response.json();
      setUserData(updatedUser);
      setNewDeletedPic(true);
     } catch (err) {
      console.error(err);
    };
  };

  // Submit function for image Upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Loading...');
    let formData = new FormData();
    formData.append('userFile', image.data);
    const response = await uploadNewPic(formData);
    const uploadedImage = await response.json();
    setImage(uploadedImage);
    if (response) {
      setStatus(response.statusText)
    };
  };

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setStatus('File Chosen');
    setImage(img);
  };

  // if data isn't here yet, say so
  if (!userData) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="container rounded bg-white mt-5 mb-5">
        <div className="row">
          <div className="col-md-3 border-right">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
              <img
                alt="avatar"
                className="rounded-circle mt-5"
                width="150px"
                src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
              />
              <span className="font-weight-bold">{userData.userName}</span>
              <span className="text-black-50">{userData.email}</span>
              <span></span>
            </div>
          </div>
          <div className="col-md-5 border-right">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-right">Your saved photos:</h4>
              </div>
              <Container>
                <h2>
                  {savedPics.length
                    ? `Viewing ${savedPics.length} saved ${
                        savedPics.length === 1 ? "pic" : "pics"
                      }:`
                    : "You have no saved photos!"}
                </h2>
                <CardGroup>
                  {savedPics.map((pic, index) => {
                    return (
                      <Card key={index} border="dark">
                        {pic ? (
                          <Card.Img
                            src={`https://res.cloudinary.com/dwuqez3pg/image/upload/c_scale,w_150/v1665696442/${pic.public_id}.jpg`}
                            alt={`The cover for ${pic.title}`}
                            variant="top"
                            onClick={() => navigate(`/single-view/${pic.id}`)}
                          />
                        ) : null}
                        <Card.Body>
                          <Card.Title>{pic.title}</Card.Title>
                          <p className="small">Authors: {pic.authors}</p>
                          <Card.Text>{pic.description}</Card.Text>
                          <Button
                            className="btn-block btn-danger"
                            onClick={() => handleDeletePic(pic._id)}
                          >
                            Delete this pic!
                          </Button>
                        </Card.Body>
                      </Card>
                    );
                  })}
                </CardGroup>
              </Container>
              <br></br>
              {/* Upload Photo Div */}
              <div>
                <h1>Upload to server:</h1>
                {status && <h3>{status}</h3>}
                {status === 'OK' &&
                  (<div>
                      <img alt="Uploaded file" src={`https://res.cloudinary.com/dwuqez3pg/image/upload/c_scale,w_2000/v1665696442/${image.public_id}.jpg`} onClick={() => navigate(`/single-view/${image.id}`)} width='500vw' />
                    </div>)}
                <hr></hr>
                <form onSubmit={handleSubmit}>
                  <input type='file' name='userFile' onChange={handleFileChange}></input>
                  <button type='submit'>Submit</button>
                </form>
              </div>
            </div>
            <div className="mt-5 text-center"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
