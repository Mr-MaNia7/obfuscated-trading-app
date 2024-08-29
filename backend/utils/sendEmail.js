const nodemailer = require("nodemailer");

const HOST = 'mail.privateemail.com';
const NO_REPLY_EMAIL = 'no-reply@cryptoever.gold';
const USER = 'no-reply@cryptoever.gold'
const PASSWORD = 'ASDasd!@#123';
const PORT = 465;

const sendEmail = async (data) => {
    const { email, subject, title, text, code } = data;
    const HTML_CONTENT = `
        <!DOCTYPE html>
        <html>
            <body>
                <div style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                    max-width: 800px;
                    margin: 20px auto;
                    padding: 20px;
                    color: #000;"
                >
                    <h3 style="color: #000;">
                        <img src="cid:logo_img" alt="cryptoEver" style="width: 40px; margin-right: 10px;" />
                        Greetings,
                    </h3>
                    <h2 style="text-align: center; color: #000;"><strong>${title}</strong></h2>
                    <p style="color: #000;">${text}</p>
                    <h1 style="text-align: center; font-weight: 800; color: #000;">${code}</h1>
                    <p style="color: #000;"><strong>Kindly note:</strong> Please be aware of phishing sites and always make sure you are visiting the official CryptoEver website when entering sensitive data</p>
                    <p style="margin-top: 60px; text-align: center; color: #000; font-size: 12px;">
                        © 2023 CryptoEver. All rights reserved.
                    </p>
                </div>
            </body>
        </html>
    `;

    try {
        const transporter = nodemailer.createTransport({
            host: HOST,
            auth: {
                user: USER,
                pass: PASSWORD
            },
            port: PORT,
        });

        let mailOptions = {
            from: NO_REPLY_EMAIL,
            to: email,
            subject: subject,
            html: HTML_CONTENT,
            attachments: [{
                filename: 'logo.png',
                path:  process.cwd() + '/static/images/logo.png', // path contains the filename, do not just give path of folder where images are reciding.
                cid: 'logo_img' // give any unique name to the image and make sure, you do not repeat the same string in given attachment array of object.
            }]
        };

        await transporter.sendMail(mailOptions);

        // console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;