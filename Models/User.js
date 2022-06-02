const mongoose = require('mongoose');

//Modèle user
const User = mongoose.model('User', {
	account: {
		username: {
			unique: true,
			required: true,
			type: String,
		},
	},
	email: {
		unique: true,
		required: true,
		type: String,
	},
	token: String,
	hash: String,
	salt: String,
	avatar: { Object },
});

module.exports = User;
