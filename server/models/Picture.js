const { Schema, model } = require("mongoose");

const picSchema = new Schema(
  {
    image: {
      type: String,
      // required: true,
    },
    title: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    tags: [
      {
      type: String,
      },
    ],    
    createdAt: {
      type: Date,
    },
    // offsetTime: {
    //   type: Number,
    // }
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

const Picture = model("Picture", picSchema);

module.exports = Picture;
