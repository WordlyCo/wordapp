# Word App

Instructions on how to run the app.

1. npm install
2. npm run ios (or android, web)
3. profit!

Make sure your system has these installed

- node with at least version v20.15.0

Check your node version by typing `node --version` in the terminal.

## Project structure

The app logic is divided into several directories.

- navigation (global navigations setup, such as tabs)
- screens (actual pages of the app)
- context (context for auth, etc)
- hooks (standard hooks, backend calls, etc)
- components (commonly used components)

## NOTE

Navigation is laid out as follows

Tabs are defined here, and this navigation requires authentication

- navigation/AppStack.tsx

These are stacks, and they define screens for login page, register, etc

- navigation/AuthStack.tsx

## Navigation

This app uses expo-router for file-based navigation. The routing structure is as follows:

### App Structure

- `app/` - Root directory for all routes
  - `_layout.tsx` - Root layout with providers and initialization
  - `index.tsx` - Root route that redirects based on auth state
  - `(auth)/` - Group for authentication screens
    - `_layout.tsx` - Auth layout
    - `index.tsx` - Login/register screen
  - `(app)/` - Group for authenticated app screens
    - `_layout.tsx` - Tab navigation layout for the main app
    - `home/index.tsx` - Home tab screen
    - `store/` - Store section
      - `_layout.tsx` - Store layout
      - `index.tsx` - Store main screen
      - `lists/` - Word lists screens
        - `_layout.tsx` - Lists layout
        - `index.tsx` - All word lists
        - `[id]/index.tsx` - Dynamic route for list details
    - `progress/index.tsx` - Progress tracking
    - `bank/index.tsx` - Word bank with user's saved lists
    - `profile/index.tsx` - User profile

### File-Based Routing

The app uses expo-router's file-based routing system where:

- Files in the `app/` directory correspond to routes
- Group folders like `(auth)` and `(app)` organize routes without affecting URLs
- Dynamic routes use bracket notation like `[id]`
- Layout files (`_layout.tsx`) define shared UI for child routes

### Running the App

```bash
npm start
```

or

```bash
yarn start
```
