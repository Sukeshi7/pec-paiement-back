const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,        
    pass: process.env.SMTP_PASSWORD,     
  },
});

async function sendActivationEmail(email, activationLink) {
  try {
    await transporter.sendMail({
      from: `"Plateforme Paiement" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Activez votre compte marchand',
      html: `
        <h2>Bienvenue sur notre plateforme de paiement !</h2>
        <p>Merci de vous être inscrit. Pour activer votre compte marchand, cliquez sur le lien ci-dessous :</p>
        <p>
          <a href="${activationLink}" style="padding: 10px 20px; background-color: #0d6efd; color: white; text-decoration: none; border-radius: 5px;">
            Activer mon compte
          </a>
        </p>
        <p>Ou copiez/collez ce lien dans votre navigateur :<br/>
        <code>${activationLink}</code></p>
        <p>Ce lien est valide pendant 24 heures.</p>
        <hr/>
        <small>Si vous n’êtes pas à l’origine de cette inscription, ignorez simplement cet email.</small>
      `,
    });
    console.log(`Email d'activation envoyé à ${email}`);
  } catch (error) {
    console.error('Erreur lors de l’envoi de l’email :', error);
  }
}

module.exports = sendActivationEmail;
