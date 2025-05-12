const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true

    };

    await mongoose.connect('mongodb+srv://4midable:q9Qw1yD29bM7iTVE@cluster0.7janzi6.mongodb.net/', options);
    console.log('💾 Connexion à MongoDB réussie!');
    
    mongoose.connection.on('error', err => {
      console.error('❌ Erreur de connexion MongoDB:', err);
    });
    

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB déconnecté');
    });
    
  } catch (error) {
    console.error('❌ Échec de connexion à MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;