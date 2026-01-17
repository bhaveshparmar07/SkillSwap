# SkillSwap - Firestore Security Rules Update Guide

## 🔴 Current Issue: "Missing or insufficient permissions"

Your Firestore security rules are currently blocking ALL access. This is why you see the error.

## ✅ Solution: Update Firestore Security Rules

### Step 1: Go to Firestore Rules
1. Open Firebase Console: https://console.firebase.google.com
2. Select your `bskillhouse` project
3. Click **Firestore Database** in left sidebar
4. Click **Rules** tab (you're already here in screenshot #3!)

### Step 2: Replace the Current Rules

**Current Rules (BLOCKING EVERYTHING):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;  // ❌ This blocks everything!
    }
  }
}
```

**New Rules (COPY THIS):**
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - users can read all, write only their own
    match /users/{userId} {
      // Anyone authenticated can read user profiles (to see tutors)
      allow read: if request.auth != null;
      
      // Users can only write to their own document
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Sessions collection - for booking tutoring sessions
    match /sessions/{sessionId} {
      // Authenticated users can read sessions they're involved in
      allow read: if request.auth != null && (
        resource.data.tutorId == request.auth.uid ||
        resource.data.studentId == request.auth.uid
      );
      
      // Authenticated users can create sessions
      allow create: if request.auth != null;
      
      // Only participants can update/delete sessions
      allow update, delete: if request.auth != null && (
        resource.data.tutorId == request.auth.uid ||
        resource.data.studentId == request.auth.uid
      );
    }
    
    // Resources collection - for marketplace items
    match /resources/{resourceId} {
      // Anyone authenticated can read resources
      allow read: if request.auth != null;
      
      // Users can create resources
      allow create: if request.auth != null;
      
      // Only the resource owner can update/delete
      allow update, delete: if request.auth != null && 
        resource.data.tutorId == request.auth.uid;
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      // Anyone authenticated can read reviews
      allow read: if request.auth != null;
      
      // Users can create reviews
      allow create: if request.auth != null;
      
      // Only the reviewer can update/delete their review
      allow update, delete: if request.auth != null && 
        resource.data.reviewerId == request.auth.uid;
    }
  }
}
```

### Step 3: Publish Rules
1. Click **Publish** button in Firebase Console
2. Wait for "Rules published successfully" message

### Step 4: Test Your App
1. Refresh SkillSwap in browser
2. Try logging in again
3. The "insufficient permissions" error should be GONE! ✅

## 📋 What These Rules Do:

- ✅ **Users can read all profiles** - Needed for "Find Help" to show tutors
- ✅ **Users can only edit their own profile** - Security!
- ✅ **Sessions, resources, reviews** - Proper access control
- ✅ **All requires authentication** - Users must be logged in

## 🔥 Enable Google Sign-In (If Not Done)

While you're in Firebase Console:
1. Go to **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add your email as support email
4. Click **Save**

## ✅ Once Done:
- Login will work
- Profile will work
- Find Help will show users with skills
- ChatBot will work
- All features ready!

I've also created `firestore.rules` file in your project for reference.
