# 🚀 Sprint 5: Data Sync Logic + iOS Build with Expo

## 🎯 Objectives
- Set up background sync every 30 seconds
- Compare `updatedAt` timestamps to resolve conflicts
- Configure and build app for iOS using EAS

---

## 🔧 Detailed Tasks
### 1. Background sync logic
- Every 30s, check if device is online
- If online, iterate through pending forms
- Compare `updatedAt` between local and mock server:
  - If local is newer → upload
  - If server is newer → replace local and notify user

### 2. User notifications
- Show toast or popup if server data overwrites local
- Show total number of forms successfully synced

### 3. iOS Build
- Configure `app.config.ts` (name, slug, icon, orientation)
- Use `eas build -p ios --profile preview`
- Prepare for TestFlight or App Store deployment

---

## 🧠 Prompt for AI Agent
```
1. Set an interval (every 30 seconds) to check network status using NetInfo.
2. If online, loop through locally stored forms with status "pending".
3. For each form, call a mock `/sync` API and compare updatedAt timestamps:
   - If local form is newer, upload it.
   - If server version is newer, replace local version and notify user.
4. After sync, mark forms as "synced" locally.
5. Configure app.config.ts for iOS build using Expo.
6. Use EAS Build to generate a preview build for iOS.

Use TypeScript and Expo (React Native).
```
