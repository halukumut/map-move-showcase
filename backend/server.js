import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import stringifyObject from "./buffer.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (çoklu domain destekli)
const allowedOrigins = [
  "http://localhost:5173",
  "https://sancaknakliye.com",
  "https://www.sancaknakliye.com",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

// Mail endpoint
app.post("/api/sendMail", async (req, res) => {
  try {
    const data = req.body;

    if (!data.email || !data.name) {
      return res.status(400).json({ error: "Eksik bilgi gönderildi." });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Sancak Nakliye <onboarding@sancaknakliye.com>",
      to: process.env.TARGET_GMAIL_USER,
      subject: `Yeni İletişim Mesajı: ${data.name}`,
      text: stringifyObject(data),
    });

    res.json({ success: true });
    console.log("Mail gönderildi:", process.env.TARGET_GMAIL_USER);
  } catch (err) {
    console.error("MAIL ERROR:", err);
    res.status(500).json({ error: "Mail gönderilemedi" });
  }
});

// Server Start
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
