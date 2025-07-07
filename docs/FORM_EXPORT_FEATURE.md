# Form Configuration Export Feature

## Overview

This feature allows users to export form configurations to JSON files after saving them. The exported JSON files can be used for backup, sharing, or importing into other systems.

## Features

### 1. Export Individual Form Configuration
- **Location**: Form configuration details view
- **Button**: "Export JSON" button in the form details header
- **Action**: Exports the selected form configuration as a JSON file

### 2. Export Single Form from List
- **Location**: Form configuration list
- **Button**: "Export" button in each form item
- **Action**: Exports that specific form configuration as a JSON file

### 3. Export All Form Configurations
- **Location**: Header of the form configuration screen
- **Button**: "Export All" button
- **Action**: Exports all form configurations in a single JSON file with metadata

### 4. Export After Save
- **Location**: Form editor save confirmation
- **Button**: "Export JSON" button in the success alert
- **Action**: Exports the newly saved form configuration

## Usage Examples

### Individual Form Export
When you select a form and click "Export JSON", the system will:
1. Generate a JSON file with the complete form configuration
2. For web: Automatically download the file to your Downloads folder
3. For mobile: Save to the app's document directory and show the location

### Export All Forms
When you click "Export All":
1. Shows a confirmation dialog with the number of forms to export
2. Creates a single JSON file containing all form configurations
3. Includes export metadata (date, count, version info)

### After Save Export
After updating a form configuration:
1. Shows success message with two options: "OK" or "Export JSON"
2. Clicking "Export JSON" immediately exports the updated form

## File Structure

### Individual Form Export
```json
{
  "id": "form-123",
  "title": "Customer Survey",
  "description": "Customer satisfaction survey form",
  "name": "customer-survey",
  "version": 1,
  "fields": [
    {
      "name": "name",
      "label": "Full Name",
      "type": "text",
      "required": true
    }
    // ... more fields
  ],
  "settings": {
    "allowOffline": true,
    "requireAuth": false,
    "maxFileSize": 5242880
  },
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### Multiple Forms Export
```json
{
  "exportInfo": {
    "exportDate": "2025-01-01T00:00:00.000Z",
    "totalForms": 3,
    "exportedBy": "React Native Dynamic Form App",
    "version": "1.0.0"
  },
  "formConfigurations": [
    {
      // Form 1 data
    },
    {
      // Form 2 data
    }
    // ... more forms
  ]
}
```

## File Naming Convention

### Individual Forms
- Pattern: `form-config-{form-title}-{timestamp}.json`
- Example: `form-config-customer-survey-1704067200000.json`

### Multiple Forms
- Pattern: `form-configs-export-{timestamp}.json`
- Example: `form-configs-export-1704067200000.json`

### Custom Names
Users can optionally provide custom file names through the export functions.

## Platform-Specific Behavior

### Web Browser
- Files are automatically downloaded to the browser's default download folder
- Uses the browser's native download mechanism
- Shows success notification after download

### Mobile (iOS/Android)
- Files are saved to the app's document directory
- Shows the full file path in the success message
- Provides option to view file location details
- Files can be accessed through device file managers

## Error Handling

The export feature includes comprehensive error handling:

1. **No Forms Available**: Shows appropriate message when trying to export empty lists
2. **File System Errors**: Handles permission issues and disk space problems
3. **Network Issues**: Manages offline scenarios gracefully
4. **Invalid Data**: Validates form configuration data before export

## Integration

The export functionality is integrated into:

1. **FormConfigurationScreen**: Main screen with all export options
2. **Form Editor**: Post-save export option
3. **File System Utilities**: Cross-platform file handling
4. **UI Components**: Consistent button styling and placement

## Future Enhancements

Potential future improvements:
1. Import functionality for JSON files
2. Export to other formats (CSV, XML)
3. Batch export with custom filters
4. Cloud storage integration
5. Email sharing capabilities

## Technical Implementation

The export feature uses:
- **expo-file-system**: For mobile file operations
- **Browser APIs**: For web file downloads
- **React Native Alerts**: For user confirmations
- **TypeScript**: For type safety
- **Error Boundaries**: For graceful error handling

## Usage Tips

1. **Regular Backups**: Use "Export All" regularly to backup all form configurations
2. **Version Control**: Export after major changes for version tracking
3. **Sharing**: Export specific forms to share with team members
4. **Migration**: Use exports when moving between environments
5. **Debugging**: Export problematic forms for troubleshooting
