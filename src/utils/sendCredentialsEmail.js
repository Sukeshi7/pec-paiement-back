const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendCredentialsEmail(email, appId, appSecret) {
  await transporter.sendMail({
    from: `"Plateforme Paiement" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Vos identifiants API (appId / appSecret)",
    html: `
      <h2>Bienvenue sur notre plateforme de paiement !</h2>
      <p>Votre compte est maintenant activé </p>
      <p>Voici vos identifiants API :</p>
      <ul>
        <li><strong>APP_ID :</strong> ${appId}</li>
        <li><strong>APP_SECRET :</strong> ${appSecret}</li>
      </ul>
      <p style="color: red;"><strong> Gardez ces informations précieusement.</strong> Elles sont nécessaires pour vous connecter et sécuriser vos appels API.</p>
    `,
  });
}

module.exports = sendCredentialsEmail;
