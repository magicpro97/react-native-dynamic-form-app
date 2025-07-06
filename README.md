# 📱 React Native Dynamic Form App

A React Native application built with Expo Router featuring dynamic form generation, user authentication, and advanced input components.

## 🚀 Features

### Sprint 1: Project Initialization & Login
- ✅ **Clean Architecture**: Production-ready folder structure
- ✅ **User Authentication**: Login screen with validation
- ✅ **Secure Storage**: MMKV for token storage
- ✅ **Navigation**: Expo Router v5 implementation
- ✅ **Form Configuration**: JSON-based form definitions

### Sprint 2: Dynamic Form Builder
- ✅ **Dynamic Form Rendering**: JSON-driven form generation
- ✅ **Multiple Input Types**:
  - Text inputs (text, email, number)
  - Radio buttons
  - Checkboxes (multiple selection)
  - Select dropdowns
  - Signature capture
  - Photo picker (camera/gallery)
- ✅ **Form Validation**: Field-level validation with error display
- ✅ **State Management**: React Context + useReducer
- ✅ **TypeScript**: Fully typed components and utilities

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Routing**: Expo Router v5
- **Language**: TypeScript
- **State Management**: React Context + useReducer
- **Storage**: MMKV
- **Signature**: react-native-signature-canvas
- **Image Picker**: expo-image-picker
- **UI Components**: React Native + custom components

## 📁 Project Structure

```
src/
├── assets/           # JSON configurations
├── components/       # Reusable UI components
│   └── form/        # Form-specific components
├── context/         # React Context providers
├── screens/         # Application screens
├── types/           # TypeScript type definitions
└── utils/           # Utility functions

app/                 # Expo Router pages
├── _layout.tsx      # Root layout
├── index.tsx        # Login page
├── home.tsx         # Home page
└── form.tsx         # Dynamic form page
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on different platforms**
   ```bash
   # Web
   npm run web
   
   # iOS (macOS required)
   npm run ios
   
   # Android
   npm run android
   ```

## 📱 Usage

### Login Flow
1. Open the app → Login screen appears
2. Enter any username and password (validation for non-empty fields)
3. Tap "Login" → Redirects to Home screen

### Dynamic Form
1. From Home screen → Tap "Open Dynamic Form"
2. Fill out the form with various input types:
   - **Text Fields**: First name, last name, email
   - **Radio Buttons**: Gender selection
   - **Checkboxes**: Multiple interests
   - **Dropdown**: Country selection
   - **Signature**: Draw signature on canvas
   - **Photo**: Take photo or select from gallery
3. Tap "Submit Form" → Form validation and submission
4. Use "Reset Form" to clear all fields

## 🔧 Configuration

### Form Configuration
Edit `src/assets/form.json` to customize form fields:

```json
{
  "title": "Your Form Title",
  "fields": [
    {
      "name": "fieldName",
      "label": "Field Label",
      "type": "text|email|radio|checkbox|select|signature|photo",
      "required": true,
      "placeholder": "Placeholder text",
      "options": [...]  // For radio, checkbox, select
    }
  ]
}
```

### Supported Field Types
- `text` - Text input
- `email` - Email input with validation
- `number` - Numeric input
- `radio` - Single selection
- `checkbox` - Multiple selection
- `select` - Dropdown selection
- `signature` - Signature canvas
- `photo` - Image picker

## 🧪 Development

### Adding New Field Types
1. Define type in `src/types/form.ts`
2. Create component in `src/components/form/`
3. Add to `DynamicField.tsx` switch statement
4. Update validation in `src/utils/formValidation.ts`

### Debugging
- **Web**: Open browser developer tools
- **Mobile**: Use Expo development client or Expo Go app
- **Logs**: Check Metro bundler output

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or issues, please create an issue in the GitHub repository.

---

Built with ❤️ using React Native and Expo
