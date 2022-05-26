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
const User = require('../Models/User');

//======================================================//
//Route signup user
router.post('/user/signup', async (req, res) => {
	//destructuring
	const { email, username, password } = req.fields;
	try {
		//recherche de l'email dans la bdd
		const user = await User.findOne({ email: email });
		//si l'adresse mail existe on n'autorise pas l'inscription
		if (user) {
			res.status(409).json({ message: 'this email already has an account' });
		} else {
			if (email && username && password) {
				//encryptage du mot de passe
				const salt = uid2(16);
				const hash = SHA256(password + salt).toString(encBase64);
				//Génération du token
				const token = uid2(16);
				//Créer un nouvel utilisateur
				const newUser = new User({
					account: {
						username: username,
					},
					password: password,
					email: email,
					token: token,
					hash: hash,
					salt: salt,
				});
				//Sauvegarder l'utilisateur
				await newUser.save();
				//Envoi de la réponse au client
				res.status(200).json({
					_id: newUser._id,
					email: newUser.email,
					token: newUser.token,
					account: newUser.account,
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
//Route login user
router.post('/user/login', async (req, res) => {
	try {
		//Destructuring:
		const { email, password } = req.fields;
		//recherche de l'email dans la base de donnée:
		const user = await User.findOne({ email: email });
		if (user) {
			console.log(user);
			//Si l'utilisateur existe:
			if (
				//Verifier que le mot de passe est le bon:
				SHA256(password + user.salt).toString(encBase64) === user.hash
			) {
				res.status(200).json({
					_id: user.id,
					token: user.token,
					account: user.account,
				});
			} else {
				res.status(400).json({ error: 'unauthorized' });
			}
		} else {
			res.status(400).json({ message: 'user not found' });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

//=========================================================================//
//Route update user
router.put("/user/update/:id", async (req, res)=>{
	//const userToModify = await User.findById(req.params.id);
	try{
	  // Vérifier que l'utilisateur existe
	  const userToModify = await User.findOneAndUpdate(req.params.id);
	  console.log(userToModify);
	  // Modifier les valeurs de l'utilisateur
	  // Si l'utilisateur est trouvé, on peut effectué les modifications
	  if (userToModify) {
	  if (req.fields.username) {
		userToModify.account.username = req.fields.username;
	  }else{
		return res.json({message:"username not modify"})
	  }
	  if (req.fields.password) {
		const salt = uid2(16);
		const hash = SHA256(req.fields.password + salt).toString(encBase64);
		userToModify.salt = salt;
		userToModify.hash = hash;
	  }else{
		return res.json({message:"password not modify"})
	  }
		await userToModify.save();
		return res.json(userToModify)
		//res.status(200).json("userToModify succesfully")
	  }else{
		return res.status(404).json({message:"user not found"})
	  }
	}
	catch (error) {
	  console.log(error.message);
	  res.status(400).json({message: error.message});
	}
  })
  
  //===================================================================//
  // Route permettant d'afficher un utilisateur
  router.get("/user/account/:id", async (req, res)=>{
	const accountById = await User.findById(req.params.id)
	try {
	  if (accountById) {
		 res.json(accountById)
		 console.log(accountById);
	  } else {
		return res.json({message:"user not found"})
	  }
	} catch (error) {
	  res.status(400).json({message: error.message});
	}
  })
  
  //====================================================================//
  // Route permettant de supprimer son compte en tant qu'utilisateur
  router.delete("/user/deleteAccount/:id", async (req,res)=>{
	 await User.findOneAndDelete(req.params.id);
	 res.json({ message: "account deleted"});
  })
//Export du router
module.exports = router;
