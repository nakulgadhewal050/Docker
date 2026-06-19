import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;
import connectDB from "./lib/db.js";
import dns from "dns";
import User from "./model/userModel.js";
import Redis from "ioredis";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/create", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });
  return res.status(201).json(user);
});

app.get("/user", async (req, res) => {
  const user = await User.find({});

  return res.status(201).json(user);
});

app.get("/redis", async (req, res) => {
  const cachedData = await redis.get("user:all");
  if (cachedData) {
    return res.json(JSON.parse(cachedData));
  }

  const user = await User.find({});
  await redis.set("user:all", JSON.stringify(user), "EX", 10);

  return res.json(user);
});

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(`otp:${email}`, otp, "EX", 300);

  return res.json({ otp });
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const Cachedotp = await redis.get(`otp:${email}`);
  if (!Cachedotp) {
    return res.status(400).json({ error: "OTP expired or not found" });
  }

  if (Cachedotp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  if(Cachedotp === otp){
    await redis.del(`otp:${email}`);
  }

  return res.json({ message: "OTP verified successfully" });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`server is running on port http://localhost:${PORT}`);
});
