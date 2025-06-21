import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const app = express();

// Use memoryStorage for serverless environments like Vercel
// This avoids writing files to a read-only filesystem.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

app.post(
  '/send-email',
  upload.single('attachment'),    
  async (req, res) => {
    const { name, to, from_phone, message } = req.body;
    
    if (!to || !name || !from_phone || !message) return res.status(400).json({ error: 'Please Enter All Required Fields' });
    const body = "Email ID: " + to + "\n" + "Name: " + name + "\n" +"ph: " + from_phone +"\n"+"message: " + message;

    // Build mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `APPLICATION - ${name}`,
      text: body,
      attachments: []
    };

    if (req.file) {
      mailOptions.attachments.push({
        filename: req.file.originalname,
        // Use the file buffer from memory instead of a file path
        content: req.file.buffer
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Sending failed' });
    }
  }
);

app.get('/job/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'jobs.html'));
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Vercel handles the server logic, so we export the app instance.
// Do NOT call app.listen()
export default app;
