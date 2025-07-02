require('dotenv').config();
const Merchant = require('./src/models/Merchant');
const { connectPostgres, syncDb } = require('./src/db/sequelize');

(async () => {
  try {
    await connectPostgres();
    await syncDb();

    const credentials = Merchant.generateCredentials();

    const merchant = await Merchant.create({
      companyName: 'Test Corp',
      email: 'test@example.com',
      appId: credentials.appId,
      appSecret: credentials.appSecret,
      isActive: true,
    });

    console.log('Marchand créé avec succès :');
    console.log({
      companyName: merchant.companyName,
      email: merchant.email,
      appId: merchant.appId,
      appSecret: merchant.appSecret,
    });

    process.exit();
  } catch (err) {
    console.error('Erreur lors de la création du marchand :', err);
    process.exit(1);
  }
})();
