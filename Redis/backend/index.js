import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;
import connectDB from "./lib/db.js";

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(PORT, () => {
    connectDB();
    console.log(`server is running on port http://localhost:${PORT}`);
})