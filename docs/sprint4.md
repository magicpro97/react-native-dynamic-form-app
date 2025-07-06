# 🎨 Sprint 4: iPad-Optimized Responsive UI/UX (Portrait & Landscape)

## 🎯 Objectives
- Create responsive layout for iPad (portrait and landscape)
- Improve touch-friendly data input layout
- Highlight required fields and risk levels

---

## 🔧 Detailed Tasks
### 1. Responsive layout
- Use `useWindowDimensions()` or `expo-screen-orientation`
- Adjust layout based on screen size and orientation
- Use `FlatList`, `ScrollView`, or grid layout as needed

### 2. Input experience optimization
- Large, easy-to-tap input fields
- Use `KeyboardAvoidingView` to prevent input being hidden
- Show icons or color to indicate required fields

### 3. Risk level indicators
- Display colored labels/icons for risk levels: Low (green), Medium (orange), High (red)
- Add small indicators near fields with validation errors

---

## 🧠 Prompt for AI Agent
```
Improve the input form UI to:

- Support both portrait and landscape mode on iPad
- Use useWindowDimensions() to switch layout dynamically
- Ensure all input elements are touch-friendly
- Apply proper spacing, font sizes, and padding
- Avoid keyboard overlap with input fields

Use React Native with TypeScript and clean components.
```
