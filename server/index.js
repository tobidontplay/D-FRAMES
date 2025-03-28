// This file is used to ensure proper bundling with Vercel
const app = require('./server.js');

// Export the Express app for Vercel serverless functions
module.exports = app;
