import { User, Picture } from "../models";

module.exports = {
  getAllPics(req, res) {
    Picture.find({})
      .select("-__v")
      .then((dbPictureData) => res.json(dbPictureData))
      .catch((err) => {
        console.error({ message: err });
        return res.status(500).json(err);
      });
  },
  getPicById({ params }, res) {
    Picture.findOne({ _id: params.id })
      .select("-__v")
      .then((dbPictureData) => {
        if (!dbPictureData) {
          res.status(404).json({ message: "No picture found with that id." });
          return;
        }
        res.json(dbPictureData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(404);
      });
  },
  createNewPic({ body }, res) {
    Picture.create(body)
      .then((dbPictureData) => {
        return Picture.findOneandUpdate(
          { userName: body.userName },
          { $push: { Picture: dbPictureData } },
          { new: true }
        );
      })
      .then((dbPictureData) => {
        if (!dbPictureData) {
          res.status(404).json({ message: "No picture found with that id." });
          return;
        }
        res.json(dbPictureData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(404);
      });
  },
  updatePic({ params: body }, res) {
    Picture.findByIdAndUpdate({ _id: params.id }.body, { new: true })
      .then((dbPictureData) => {
        if (!dbPictureData) {
          res.status(404).json({ message: "No picture found with that id." });
          return;
        }
        res.json(dbPictureData);
      })
      .catch((err) => {
        console.log((err) => {
          console.log(err);
          res.sendStatus(404);
        });
      });
  },
  deletePic({ params }, res) {
    Picture.findOneAndDelete({ _id: params.id }, { new: true })
      .then((dbPictureData) => {
        if (!dbPictureData) {
          res.status(404).json({ message: "No picture found with that id." });
          return;
        }
        res.json({ message: "Picture deleted" });
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(404);
      });
  },
};