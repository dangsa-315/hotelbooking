import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const sendMail = async (name, email, hotelName, isBook, amount) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: isBook ? 'Your hotel is booked!' : 'Your hotel booking failed',
            text: isBook
                ? `Hello ${name},\n\nWe are pleased to inform you that your booking at ${hotelName} is confirmed! The total amount is ₹${amount}.`
                : `Hello ${name},\n\nWe regret to inform you that your booking at ${hotelName} could not be processed. The total amount was ₹${amount}.`,
            html: isBook
                ? `<h1>Welcome, ${name}!</h1> <h2>Your hotel booking at ${hotelName} is confirmed.</h2><p>We look forward to your stay! The total amount is <strong>₹${amount}</strong>.</p>`
                : `<h1>Hi ${name},</h1> <h2>Unfortunately, your booking at ${hotelName} was not successful.</h2><p>Please try again later or contact our support. The total amount was <strong>₹${amount}</strong>.</p>`
        });
        console.log('Email sent successfully!');
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

export default sendMail;
