# 🔁 Sprint 3: Offline Form Storage and Mock Submit

## 🎯 Objectives
- Save submitted form data locally (offline)
- Show success message after form submission
- Create a screen to list unsynced forms

---

## 🔧 Detailed Tasks
### 1. Store form data locally
- Use MMKV (preferred for performance) or SQLite
- Each form stored with JSON data, timestamp, and status = "pending"

### 2. Form submission
- On submit button:
  - Validate input using config
  - Call mock API `/submit-form` (simulate 1–2s delay)
  - Show success screen
  - Save form to local DB

### 3. Offline queue screen
- List all forms not yet synced
- Allow viewing or deleting unsynced forms

---

## 🧠 Prompt for AI Agent
```
In the React Native app, after a form is submitted:

1. Validate form data using rules from form.json.
2. Call a mock submit API (simulate delay).
3. Save the form data with timestamp and status "pending" to MMKV or SQLite.
4. Navigate the user to a success screen.
5. Create a new screen (OfflineQueueScreen) to list unsynced forms.

Use TypeScript and follow a clean folder structure.
```
