import admin from 'firebase-admin';

class Firebase {
  public admin: admin.app.App;
  constructor() {
    this.admin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        privateKey: Buffer.from(process.env.FIREBASE_ADMIN_PRIVATE_KEY as string, 'base64').toString('binary'),
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      }),
    });
  }
}

export default new Firebase();
