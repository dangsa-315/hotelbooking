import express from 'express';
import sendMail from './utils/Transpoter.js';
import cors from 'cors';
import dotenv from 'dotenv';
import './utils/dbConnection.js';
import path from 'path';

dotenv.config();
const __dirname = path.resolve();
console.log(__dirname);

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));  // Serving static files from 'public'
app.use(cors());

// Removed view engine setup because it's unnecessary for static files.

app.post('/confirmation.html', async (req, res) => {
    let { name, email, age, number, identity, isbook, hotelName, amount } = req.body;

    // Logs incoming request data
    console.log(req.body);

    // Default values if not provided
    isbook = isbook || true;
    amount = amount || 5400;
    hotelName = hotelName || "luxury hotel";

    // Validate fields with more specific error messages
    if ([name, email, age, number, identity, hotelName, amount].some(item => item === undefined || item === '')) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (isNaN(age)) {
        return res.status(400).json({ message: "Age must be a valid number." });
    }

    try {



        // Send the confirmation email
        const isSend = await sendMail(name, email, hotelName, isbook, amount);
        if (!isSend) {
            return res.status(500).json({ message: "Failed to send confirmation email." });
        }

        // Return confirmation page if everything is successful
        return res.sendFile(path.join(__dirname, 'public', 'confirmation.html'));

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: "An error occurred while processing your booking." });
    }
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running at port ${process.env.PORT || 3000}`);
});
