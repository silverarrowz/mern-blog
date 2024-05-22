const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Post = require("./models/Post");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

const fs = require("fs");
const path = require("path");

const salt = bcrypt.genSaltSync(10);
const secret = "fjodn78gdb76bfs87sbwh8dcd8f04fjwfd";

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

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
        avatar: userDoc.avatar,
        about: userDoc.about,
      });
    });
  } else {
    res.status(400).json("Wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json("Unauthorized");

    const userDoc = await User.findById(info.id);
    if (!userDoc) return res.status(404).json("User not found");

    res.json({
      id: userDoc._id,
      username: userDoc.username,
      about: userDoc.about,
      avatar: userDoc.avatar,
    });
  });
});

// Get another user's profile

app.get("/profile/:id", async (req, res) => {
  const { id } = req.params;

  const userDoc = await User.findById(id);
  if (!userDoc) return res.status(404).json("User not found");

  res.json({
    id: userDoc._id,
    username: userDoc.username,
    about: userDoc.about,
    avatar: userDoc.avatar,
  });
});

// Update profile

app.put("/profile", uploadMiddleware.single("file"), (req, res) => {
  let newPath = null;
  if (req.file) {
    console.log(req.file);

    const { originalname, path: filePath } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = filePath + "." + ext;

    fs.renameSync(filePath, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { username, about } = req.body;

    const userDoc = await User.findById(info.id);

    if (JSON.stringify(userDoc.id) !== JSON.stringify(info.id)) {
      return res.status(400).json("Access denied");
    }

    userDoc.username = username;
    userDoc.about = about;
    userDoc.avatar = newPath ? newPath : userDoc.avatar;
    console.log(req.body);
    console.log(username, about);
    const updatedUser = await userDoc.save();

    res.json({
      id: userDoc._id,
      username: userDoc.username,
      about: userDoc.about,
      avatar: userDoc.avatar,
    });
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

// Creating post

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path: filePath } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = filePath + "." + ext;

  fs.renameSync(filePath, newPath);

  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });

    res.json(postDoc);
  });
});

// Updating post

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path: filePath } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = filePath + "." + ext;

    fs.renameSync(filePath, newPath);
  }

  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });
    res.json(postDoc);
  });
});

// Get all posts

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

// Get a selected post

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", [
    "username",
    "avatar",
  ]);

  res.json(postDoc);
});

// Delete post

app.delete("/post/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const postDoc = await Post.findById(id);

    await Post.deleteOne(postDoc);

    res.status(200).send("Post deleted successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.listen(4000);
