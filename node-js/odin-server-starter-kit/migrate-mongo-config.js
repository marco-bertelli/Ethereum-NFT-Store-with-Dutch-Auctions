// In this file you can configure migrate-mongo
const dotenv = require('dotenv');
const path = require('path');
const mongodbUri = require('mongodb-uri');

dotenv.config({
  path: path.join(__dirname, '.env')
});

module.exports = {
  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url: process.env.MONGODB_URI || `mongodb://localhost/${process.env.APP_NAME}-dev`,

    // TODO Change this to your database name:
    databaseName: mongodbUri.parse(
      process.env.MONGODB_URI || `mongodb://localhost/${process.env.APP_NAME}-dev`
    ).database,

    options: {
      useNewUrlParser: true // removes a deprecation warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    }
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: 'migrations',

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: 'migrationsChangelog'
};
