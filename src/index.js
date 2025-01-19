import express from 'express';
import Users from './model/user.model.js';
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

    // Default values
    isbook = true;
    amount = 5400;
    hotelName = "luxury hotel";

    // Validate fields
    if ([name, email, age, number, identity, hotelName, amount].some(item => item === undefined || item === '')) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Save user data in the database
        const user = await Users.create({
            name,
            email,
            hotelName,
            age,
            number,
            identification: identity,
            isBook: isbook,
            amount,
        });

        await user.save();  // Ensure the data is saved

        if (!user) {
            return res.status(500).json({ message: "Something went wrong while saving your data." });
        }

        // Send the confirmation email
        const isSend = await sendMail(name, email, hotelName, isbook, amount);

        // If email was sent successfully, return the confirmation page
        if (isSend) {
            return res.sendFile(path.join(__dirname, 'public', 'confirmation.html'));
        } else {
            return res.status(500).json({ message: "Failed to send confirmation email." });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: "An error occurred while processing your booking." });
    }
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running at port ${process.env.PORT || 3000}`);
});
