# Authentication Setup Guide

## Google OAuth Configuration

To set up Google OAuth authentication, you need to:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/apis/credentials

2. **Create OAuth 2.0 Client ID**:
   - Select your project or create a new one
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)

3. **Copy Credentials**:
   - Copy the Client ID and Client Secret

4. **Create Environment File**:
   Create a `.env.local` file in your project root with:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_here
   ```

## Features Implemented

✅ **Google OAuth Authentication**  
✅ **Protected Portfolio Route**  
✅ **User Profile Display**  
✅ **Automatic Redirects**  
✅ **Session Management**  
✅ **Responsive Navbar**  

## How It Works

1. **Unauthenticated Users**:
   - See "Login" button in navbar
   - Cannot access portfolio page
   - Redirected to login when trying to access protected routes

2. **Authenticated Users**:
   - See their Google profile picture and name in navbar
   - Can access portfolio page
   - Portfolio shows coin count in navbar
   - User dropdown menu with sign out option

3. **Authentication Flow**:
   - User clicks login → Google OAuth popup
   - After successful login → redirected to portfolio
   - Session persists across page refreshes
   - Automatic logout when session expires

## Testing

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click "Login" to test Google OAuth
4. Try accessing `/portfolio` without authentication
5. After login, verify you can access portfolio and see user info in navbar
