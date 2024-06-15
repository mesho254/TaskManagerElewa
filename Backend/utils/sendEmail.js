const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			service: process.env.EMAIL_SERVICE,
			secure: Boolean(process.env.SECURE),
			auth: {
				user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
			},
		});

		await transporter.sendMail({
			from: process.env.EMAIL_FROM,
			to: email,
			subject: subject,
			text: text,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};
