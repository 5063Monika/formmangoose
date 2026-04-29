import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/formDB")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  age: Number,
  gender: String,
  hobbies: [String],
  country: String,
  state: String,
  message: String,
  date: String,
  file: String,
  accept: Boolean
});

const User = mongoose.model("User", userSchema);

// POST API
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("BODY:", req.body);

    // ✅ SAFE hobbies handling
    let hobbies = req.body.hobbies;

    if (typeof hobbies === "string") {
      try {
        // try JSON parse first
        hobbies = JSON.parse(hobbies);
      } catch {
        // fallback: comma string
        hobbies = hobbies.split(",");
      }
    }

    const newUser = new User({
      ...req.body,
      hobbies,
      file: req.file ? req.file.filename : ""
    });

    await newUser.save();

    res.json({ message: "Data saved successfully ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// server start
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});