# 🏁 Sprint 1: Project Initialization & Login Screen

## 🎯 Objectives
- Set up a production-grade folder structure for a React Native app using Expo Router
- Implement the Login Screen (Username / Password)
- Read a sample form configuration from a JSON file

---

## 🔧 Detailed Tasks
### 1. Initialize the project
- Create a new app using Expo (TypeScript)
- Install and configure Expo Router v3
- Organize folder structure: `/src/features`, `/src/screens`, `/src/lib`, etc.

### 2. Implement Login Screen
- Simple login form with username and password
- Validate non-empty input fields
- Store mock token after login (using MMKV)
- Navigate to FormScreen after successful login

### 3. Load sample form config
- Create `/assets/form.json`
- Load and parse the JSON configuration
- Display form title and field count (no need to render form yet)

---

## 🧠 Prompt for AI Agent
```
You are a senior React Native developer.
Please complete the following tasks in a React Native project using Expo Router:

1. Initialize a new project using TypeScript.
2. Install and configure Expo Router v3.
3. Set up a clean production-ready folder structure: src/screens, src/features, src/components, src/lib, src/assets.
4. Create a login screen with a form that accepts username and password.
5. Validate that inputs are not empty. If valid, store mock token using MMKV or AsyncStorage.
6. Upon successful login, navigate to a Home screen (placeholder).
7. Create a sample JSON form config under /assets/form.json with several form fields.
8. In the HomeScreen, read the form.json and display the form title and number of fields found.

Code using clean practices, TypeScript, and functional components with comments.
```
