const express = require('express');
const formidable = require('express-formidable');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const encBase64 = require('crypto-js/enc-base64');
const uid = require('uid2');

const app = express();
app.use(formidable());

//Import des routes
const userRoutes = require('./routes/user');
const artistRoutes = require('./routes/artist');
const trackRoutes = require('./routes/track')
//utilisation des routes
app.use(userRoutes);
app.use(artistRoutes);
app.use(trackRoutes);


//connection à la Bdd
mongoose.connect("mongodb://localhost/macata", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	//useCreateIndex: true,
});

//Configuration cloudinary
cloudinary.config({ 
    cloud_name: 'dbzfaosnn', 
    api_key: '639558478356169', 
    api_secret: '8wZoqKBwI-EFLlu_ibz-DD0BG6o',
    secure: true
  });
//Accès aux variables d'environnement
//require('dotenv').config();

app.all('*', (req, res) => {
	res.status(404).json({ message: "Cette page n'existe pas" });
});

app.listen(3002, () => {
	console.log('server started');
});
