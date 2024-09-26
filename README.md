# GAS Drive Service Utils

This npm package, gas-drive-service-utils, provides utility functions designed for Google Apps Script projects that utilize Node.js build setups like gas-webpack-plugin and gas-rollup-build. It is especially useful for managing files and folders in Google Drive, including shared drives.

## Features
- Retrieve details of folders by ID with support for shared drives.
- Search recursively for folders containing specified name fragments.
- Determine a folder's ID from a given path within a shared folder context.


## Installation

### Using npm
Install the package via npm to use within your Node.js based Google Apps Script project:

```bash
npm install gas-drive-service-utils
```

### Enable the Advanced Drive Service
Modify your appsscript.json to include the Google Drive API service:

```json
{
  "timeZone": "America/New_York",
  "dependencies": {
    "enabledAdvancedServices": [{
      "userSymbol": "Drive",
      "serviceId": "drive",
      "version": "v3"
    }]
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
```

## Usage
Import DriveServiceUtils in your project to access its methods:

```javascript
import DriveServiceUtils from "gas-drive-service-utils";

// Example usage:
async function checkFolder() {
  const folderDetails = await DriveServiceUtils.getFolderById('folder-id');
  console.log(folderDetails);
  
  const foundFolder = await DriveServiceUtils.findFolderContainingString('parent-folder-id', 'partial-folder-name');
  console.log(foundFolder);
  
  const folderId = DriveServiceUtils.getFolderIdByPath('path/to/folder', 'parent-folder-id');
  console.log(folderId);
}
```

## Contributing
Contributions are welcome! Please fork this repository and submit pull requests with any enhancements.

## Issues
Report issues and suggestions [here](https://github.com/NathanielBrewer/gas-drive-service-utils/issues).

## License
See the [LICENSE](./LICENSE) file for license rights and limitations.