const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Post = require("./models/Post");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fs = require("fs");

const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

const salt = bcrypt.genSaltSync(10);
const secret = "fjodn78gdb76bfs87sbwh8dcd8f04fjwfd";

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect("mongodb://127.0.0.1:27017/mern-blog")
  .then(() => console.log("Server is working"))
  .catch(() => console.log("No connection to server"));

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("Wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { title, summary, content } = req.body;

  const postDoc = await Post.create({
    title,
    summary,
    content,
    cover: newPath,
  });

  res.json(postDoc);
});

app.listen(4000);
