const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const encBase64 = require("crypto-js/enc-base64");
const uid = require("uid2");

const app = express()
app.use(formidable());

