//Import du package express
const express = require('express');
//Appel de la fonction Router() issue du package express
const router = express.Router();

//Création des constantes uid2, cryptoJs
const uid2 = require('uid2');
const SHA256 = require('crypto-js/sha256');
const encBase64 = require('crypto-js/enc-base64');

//Import cloudinary
const cloudinary = require('cloudinary').v2;

//import des models
const Artist = require('../Models/Artist');

//======================================================//
//Route signup artist
router.post('/artist/signup', async (req, res) => {
	//destructuring
	const { email, artistName, password } = req.fields;
	try {
		//recherche de l'email dans la bdd
		const artist = await Artist.findOne({ email: email });
		//si l'adresse mail existe on n'autorise pas l'inscription
		if (artist) {
			res.status(409).json({ message: 'this email already has an account' });
		} else {
			if (email && artistName && password) {
				//encryptage du mot de passe
				const salt = uid2(16);
				const hash = SHA256(password + salt).toString(encBase64);
				//Génération du token
				const token = uid2(16);
				//Créer un nouvel artist
				const newArtist = new Artist({
					account: {
						artistName: artistName,
					},
					password: password,
					email: email,
					token: token,
					hash: hash,
					salt: salt,
				});
				//Sauvegarder l'utilisateur
				await newArtist.save();
				//Envoi de la réponse au client
				res.status(200).json({
					_id: newArtist._id,
					email: newArtist.email,
					token: newArtist.token,
					account: newArtist.account,
				});
			} else {
				res.status(400).json({ message: 'Missing parameters' });
			}
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

//===========================================================//
//Route login artist
router.post('/artist/login', async (req, res) => {
	try {
		//Destructuring:
		const { email, password } = req.fields;
		//recherche de l'email dans la base de donnée:
		const artist = await Artist.findOne({ email: email });
		if (artist) {
			console.log(artist);
			//Si l'utilisateur existe:
			if (
				//Verifier que le mot de passe est le bon:
				SHA256(password + artist.salt).toString(encBase64) === artist.hash
			) {
				res.status(200).json({
					_id: artist.id,
					token: artist.token,
					account: artist.account,
				});
			} else {
				res.status(400).json({ error: 'unauthorized' });
			}
		} else {
			res.status(400).json({ message: 'artist not found' });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

//=========================================================================//
//Route update artist
router.put("/artist/update/:id", async (req, res)=>{
	
	try{
	  // Vérifier que l'artiste existe
	  const artistToModify = await Artist.findOneAndUpdate(req.params.id);
	  console.log(artistToModify);
	  // Modifier les valeurs de l'artiste
	  // Si l'utilisateur est trouvé, on peut effectué les modifications
	  if (artistToModify) {
	  if (req.fields.artistName) {
		artistToModify.account.artistName = req.fields.artistName;
	  }else{
		return res.json({message:"artistName not modify"})
	  }
	  if (req.fields.password) {
		const salt = uid2(16);
		const hash = SHA256(req.fields.password + salt).toString(encBase64);
		artistToModify.salt = salt;
		artistToModify.hash = hash;
	  }else{
		return res.json({message:"password not modify"})
	  }
		await artistToModify.save();
		return res.json(artistToModify)
		//res.status(200).json("artistToModify succesfully")
	  }else{
		return res.status(404).json({message:"artist not found"})
	  }
	}
	catch (error) {
	  console.log(error.message);
	  res.status(400).json({message: error.message});
	}
  })
  
  //===================================================================//
  // Route permettant d'afficher un artiste
  router.get("/artist/account/:id", async (req, res)=>{
	const accountArtistById = await Artist.findById(req.params.id)
	try {
	  if (accountArtistById) {
		 res.json(accountArtistById)
		 console.log(accountArtistById);
	  } else {
		return res.json({message:"artist not found"})
	  }
	} catch (error) {
	  res.status(400).json({message: error.message});
	}
  })
  
  //====================================================================//
  // Route permettant de supprimer son compte en tant qu'utilisateur
  router.delete("/artist/deleteAccount/:id", async (req,res)=>{
	 await Artist.findOneAndDelete(req.params.id);
	 res.json({ message: "account deleted"});
  })







//Export du router
module.exports = router;