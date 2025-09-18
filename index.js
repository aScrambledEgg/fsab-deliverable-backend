
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-5PBRh4uMZjYCMY5Njxh5F1foQv5uuRw",
  authDomain: "bootcamp-fsab.firebaseapp.com",
  projectId: "bootcamp-fsab",
  storageBucket: "bootcamp-fsab.firebasestorage.app",
  messagingSenderId: "449583448479",
  appId: "1:449583448479:web:1b19a6e4921a2e0ee73daa",
  measurementId: "G-WK8T41VS0C"
};

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { readFileSync } from "fs"; // ✅ Add this

dotenv.config();

// Load service account
const serviceAccount = JSON.parse(
  readFileSync("./util/serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();


const serviceAccount = JSON.parse(
  readFileSync("./util/serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.urlencoded({ extended: false }));

// ------------------------
// Root test route
// ------------------------
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ------------------------
// Get current wins
// ------------------------
app.get("/wins", async (req, res) => {
  try {
    const statsRef = db.collection("wins").doc("stats");
    const docSnap = await statsRef.get();

    if (!docSnap.exists) {
      // Initialize document if missing
      await statsRef.set({ X: 0, O: 0 });
      return res.json({ X: 0, O: 0 });
    }

    res.json(docSnap.data());
  } catch (err) {
    console.error("Error fetching wins:", err);
    res.status(500).send("Error fetching wins");
  }
});

// ------------------------
// Add a new win
// ------------------------
app.post("/wins", async (req, res) => {
  const { player } = req.body;

  if (!["X", "O"].includes(player)) {
    return res.status(400).send("Invalid player. Must be 'X' or 'O'.");
  }

  try {
    const statsRef = db.collection("wins").doc("stats");
    await statsRef.update({
      [player]: admin.firestore.FieldValue.increment(1),
    });

    const updatedSnap = await statsRef.get();
    res.json(updatedSnap.data());
  } catch (err) {
    console.error("Error updating win:", err);
    res.status(500).send("Error updating win");
  }
});

// ------------------------
// Reset all wins
// ------------------------
app.post("/wins/reset", async (req, res) => {
  try {
    const statsRef = db.collection("wins").doc("stats");
    await statsRef.set({ X: 0, O: 0 });
    res.status(200).send("Scores reset successfully");
  } catch (err) {
    console.error("Error resetting wins:", err);
    res.status(500).send("Error resetting wins");
  }
});

// ------------------------
// Start server
// ------------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
