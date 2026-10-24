import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
  AuthProvider as FirebaseAuthProvider
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export type OAuthProviderId =
  | 'google'
  | 'facebook'
  | 'apple'
  | 'microsoft'
  | 'twitter'
  | 'yahoo'
  | 'github';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with the dedicated database ID as mandated by Firebase rules
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({ display: 'popup' });

export const appleProvider = new OAuthProvider('apple.com');

export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({ prompt: 'select_account' });

export const twitterProvider = new TwitterAuthProvider();

export const yahooProvider = new OAuthProvider('yahoo.com');
yahooProvider.setCustomParameters({ prompt: 'select_account' });

export const githubProvider = new GithubAuthProvider();
githubProvider.setCustomParameters({ allow_signup: 'true' });

export function getFirebaseOAuthProvider(providerId: OAuthProviderId): FirebaseAuthProvider {
  switch (providerId) {
    case 'google':
      return googleProvider;
    case 'facebook':
      return facebookProvider;
    case 'apple':
      return appleProvider;
    case 'microsoft':
      return microsoftProvider;
    case 'twitter':
      return twitterProvider;
    case 'yahoo':
      return yahooProvider;
    case 'github':
      return githubProvider;
    default:
      return googleProvider;
  }
}

// Mandatory connection test on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();
