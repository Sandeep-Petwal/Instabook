# Google Authentication Integration Guide

## Frontend Steps

### Step 1: Install Dependencies

Install the Google authentication library:

```bash
npm i @react-oauth/google
```

### Step 2: Setup OAuth Provider

Wrap your app with the GoogleOAuthProvider:

```jsx
import { GoogleOAuthProvider } from "@react-oauth/google";

<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
  <App />
</GoogleOAuthProvider>;
```

### Step 3: Implement Login Button

```jsx
import { GoogleLogin } from "@react-oauth/google";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const GoogleLoginButton = () => {
  const handleSuccess = async (response) => {
    const idToken = response.credential;
    try {
      const res = await fetch(`${SERVER_URL}/api/user/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (res.ok) {
        // login the user
        localStorage.setItem("token", data.token);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const handleError = (error) => {
    console.error("Login Failed:", error);
  };

  return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />;
};

export default GoogleLoginButton;
```

### Step 4: Use Login Button

Implement the GoogleLoginButton component where you want to show the login button in your application.

## Backend Steps

### Step 1: Install Google Auth Library

```bash
npm i google-auth-library
```

### Step 2: Create a Route

Create a route for Google authentication: `api/auth/google`

### Step 3: Implement Authentication Controller

```javascript
exports.googleAuth = async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    let user = await Users.findOne({
      where: { [Op.or]: [{ googleId: payload.sub }, { email: payload.email }] },
    });

    if (!user) {
      user = await Users.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        username:
          payload.name.replace(/\s+/g, "_") +
          "_" +
          Math.floor(Date.now() / 1000),
        profile_img: payload.picture,
      });
    }

    const { user_id, name, username } = user;
    const token = jwt.sign(
      { user_id, name, email: user.email, username, session_id },
      secret,
      { expiresIn: "1d" }
    );

    return res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};
```


## How It Works: Overview

1. **Frontend Initiates Login**: The user clicks "Continue with Google," triggering the Google OAuth process.
2. **Google Authorization**: Google asks the user to grant your application access to their email and profile information.
3. **Google Returns Tokens**: After a successful login, Google sends a token (usually an id_token) that represents the user's authenticated session.
4. **Frontend Sends Token to Backend**: The frontend sends the id_token to your backend for verification.
5. **Backend Verifies Token**: The backend uses Google's libraries to validate the id_token and extract user information securely.
6. **Account Creation/Login**: Based on the id_token data, the backend creates a new user account or logs the user in.
7. **Session Handling**: The backend creates a session (or generates a JWT) to maintain the user's login state.

## Key Terms and Their Roles

1. **Client ID**
   - A unique identifier for your app, assigned by Google when you register your application in the Google Cloud Console.
   - Purpose: Ensures the tokens issued by Google are valid for your app only.
   - Example: "1234567890-abc123.apps.googleusercontent.com"

2. **Client Secret**
   - A secret key associated with your app in Google Cloud.
   - Purpose: Used for server-to-server communication (e.g., exchanging tokens), not required for frontend interactions.

3. **Access Token**
   - A token issued by Google that allows your app to access Google APIs on behalf of the user.
   - Example Use: Fetching additional user details or accessing Google services like Gmail or Drive.
   - Not suitable for authentication (verifying a user's identity).

4. **ID Token**
   - A JWT (JSON Web Token) that contains claims about the authenticated user, such as:
     - User's email
     - User's Google ID (sub)
     - Name and profile picture
   - Purpose: Used to verify the user's identity.
   - Example Structure:
     - Header: Metadata about the token (e.g., signing algorithm).
     - Payload: User information (email, Google ID, etc.).
     - Signature: A cryptographic hash ensuring token integrity.

5. **Google OAuth**
   - A secure protocol allowing apps to request access to user data without requiring passwords.
   - Purpose: Allows apps to authenticate users and access their data (with permission).

6. **Google OAuth Scopes**
   - Define the level of access the app requests.
   - Example:
     - email: Access the user's email address.
     - profile: Access basic profile information like name and photo.
     - openid: Grants permission to authenticate the user.

7. **JWT (JSON Web Token)**
   - A compact, URL-safe token format used for transferring information securely.
   - Purpose: Used by your app to store session data in a stateless manner.
   - Contains three parts:
     - Header: Token metadata.
     - Payload: Data like user ID, email, etc.
     - Signature: Ensures token validity.