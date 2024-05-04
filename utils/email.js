const nodemailer = require('nodemailer');

// Function mengirim email
const sendEmail = async (option) => {
    // Membuat transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Mendefinisikan opsi-opsi email
    const emailOptions = {
        from: 'Taskify suppport<support@taskify.com>',
        to: option.email,
        subject: option.subject,
        text: option.message,
    }

    await transporter.sendMail(emailOptions);
}

module.exports = sendEmail;