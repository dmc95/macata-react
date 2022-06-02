const User = require("../Models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    //console.log(req.headers);
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "");
      //console.log(token);
      //Si le token existe, on cherche le user dans la BDD
      const user = await User.findOne({ token: token }).select("account _id email");
      console.log(user);
      if (user) {
        //Ajout d'une clé user à l'objet req contenant les infos de user
        req.user = user;
        return next();
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = isAuthenticated;
