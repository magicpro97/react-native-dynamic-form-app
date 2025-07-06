# 🧾 Sprint 2: Dynamic Form Builder + Advanced Inputs

## 🎯 Objectives
- Render dynamic form from JSON configuration
- Support input types: text, radio, checkbox
- Add support for signature and photo input

---

## 🔧 Detailed Tasks
### 1. Build Dynamic Form Renderer
- Parse JSON config and render appropriate inputs:
  - Text fields
  - Select (radio/dropdown)
  - Checkboxes

### 2. Signature Input
- Use `react-native-signature-canvas` to capture user signature
- Store signature as base64

### 3. Photo Input
- Use `expo-camera` or `expo-image-picker` to take or select a photo
- Attach image data to form submission

### 4. Manage form state
- Use Context or useReducer to manage form state

---

## 🧠 Prompt for AI Agent
```
You are a React Native expert.

In the FormScreen, do the following:

1. Read JSON config from /assets/form.json.
2. Based on field types, render corresponding inputs: TextInput, Checkbox, RadioButton.
3. For fields of type "signature", integrate `react-native-signature-canvas` and store as base64.
4. For fields of type "photo", use `expo-image-picker` to capture/select image.
5. Manage all form field states using useReducer or React context.

Use TypeScript and clean reusable component structure.
```
