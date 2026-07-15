const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const fs = require('fs');
const path = require('path');

let serviceAccount;

try {
    // Try to load local file first for development
    const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');
    if (fs.existsSync(serviceAccountPath)) {
        serviceAccount = require(serviceAccountPath);
    } else {
        // Fallback to environment variables for Railway/Production
        if (!process.env.FIREBASE_PRIVATE_KEY) {
            console.error('FATAL ERROR: FIREBASE_PRIVATE_KEY is missing from environment variables.');
            process.exit(1);
        }
        serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Replace literal '\n' with actual newline characters so Firebase accepts it
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        };
    }
} catch (error) {
    console.error('Error loading Firebase Admin credentials:', error);
    process.exit(1);
}

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount)
    });
    console.log("✓ Firebase Admin Initialized");
}

module.exports = getAuth();
