const nodemailer = require('nodemailer');

module.exports = {
    sendAnEmail: async(recipient, subject, text) => {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth:{
                    user: process.env.USER,
                    pass: process.env.PASS,
                },
            });
            
            const mailOptions = {
                from: process.env.USER,
                to: recipient,
                subject,
                text,
            }
            
            const sendMail = async(transporter, mailOptions) => {
                try {
                    await transporter.sendMail(mailOptions)
                    console.log("Email has been sent");
                } catch (error) {
                    throw error
                }
            }

            await sendMail(transporter, mailOptions)
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}