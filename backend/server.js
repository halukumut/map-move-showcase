import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import stringifyObject, { stringiftObject } from './buffer.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware

app.use(cors({
  origin: ["http://localhost:5173", process.env.FRONTEND_URL]
}));

// Mail endpoint
app.post("/api/sendMail", async (req, res) => {
  try {
    const data = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: data.email,
      to: process.env.TARGET_GMAIL_USER,
      subject: `New message from ${data.name}`,
      text: stringifyObject(data),
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mail gönderilemedi" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
