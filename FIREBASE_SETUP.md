# Firebase Setup Instructions

## Issue: Google Sign-In Not Enabled

If you're seeing the error "Firebase: Error (auth/operation-not-allowed)", you need to enable Google Sign-In in your Firebase Console.

### Steps to Fix:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `SkillSwap` (or your project name)
3. **Navigate to Authentication**:
   - Click "Authentication" in the left sidebar
   - Click "Sign-in method" tab

4. **Enable Google Sign-In**:
   - Find "Google" in the list of providers
   - Click on it
   - Toggle "Enable" switch to ON
   - Add your project support email (required)
   - Click "Save"

5. **Enable Email/Password Sign-In** (if using manual registration):
   - Find "Email/Password" in the list
   - Toggle it to ON
   - Click "Save"

### Verification:
- Refresh your SkillSwap app
- Try signing in with Google or registering with email
- The error should be gone!

## Additional Firebase Setup

### Enable Firestore Database (if not done):
1. Go to "Firestore Database" in Firebase Console
2. Click "Create database"
3. Choose production mode
4. Select your region
5. Click "Enable"

### Security Rules (Production):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Environment Variables Check

Make sure your `.env` file has all required keys:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
```
