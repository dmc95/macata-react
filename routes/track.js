const express = require("express");
const isArtist = require("../middlewares/isArtist");
const cloudinary = require('cloudinary').v2;
const router = express.Router();

router.post("/track/publish", isArtist, (req, res) => {
  try {
    // console.log(req.fields);
    // console.log(req.files.track.path);
    // console.log(req.files.image.path);

    const { 
      title, 
      category } 
      = req.fields;

      //publier un nouveau titre
      const newTrack = new Track({
        track_category: category,
        track_name: title,
        author: req.artist,
      });

      // envoi du titre vers cloudinary
      const resultTrack = await cloudinary.uploader.upload(req.files.track.filepath,{
        folder: `/macata/track/${newTrack._id}`,
      })

      // envoi de l'image vers cloudinary
		const resultImage = await cloudinary.uploader.upload(req.files.picture.path, {
			folder: `/macata/imageTrack/${newTrack._id}`,
		});
      
    //Ajouter resultImage à image et resultTrack à track
		newTrack.track_image = resultImage;
		newTrack.path = resultTrack;
		//sauvegarder le titre
		await newTrack.save();
		res.json(newTrack);

      
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
