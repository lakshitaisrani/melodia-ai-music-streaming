const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('./firebase-service-account.json');

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount)
    });
    console.log("✓ Firebase Admin Initialized");
}

module.exports = getAuth();
