export class DriveClientUtils {

  constructor() {}
  
  /**
   * Retrieves a folder by its ID with support for accessing folders within shared drives.
   * @param {string} id - The unique identifier for the folder.
   * @returns {Object|null} - The Drive API v3 File resource described here https://developers.google.com/drive/api/reference/rest/v3/files#File if found, otherwise null.
   */
  static async getFolderById(id) {
    var folder = Drive.Files.get(id, {supportsAllDrives: true});
    return folder ?? null;
  }

    /**
   * Recursively searches for a folder that contains a specified string within its name.
   * This function searches all folders starting from a specified parent folder ID.
   * @param {string} parentFolderId - The ID of the folder to start the search from.
   * @param {string} searchString - The string to search for within the folder names.
   * @returns {Object|null} - The first folder object (the Drive API v3 File resource described here The Drive API v3 File resource described here https://developers.google.com/drive/api/reference/rest/v3/files#File) with name containing the search string, or null if no match is found.
   */

  static async findFolderContainingString(parentFolderId, searchString) {
    var fields = 'nextPageToken, files(id, name, parents)';

    var options = {
      spaces: 'drive',
      fields: fields,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true
    };

    function searchFolders(folderId) {
      // Search for folders within the current folder that contain the searchString
      options.q = `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and name contains '${searchString}'`;
      var response = Drive.Files.list(options);
      // If a folder matching the searchString is found, return it immediately
      if (response.files && response.files.length > 0) {
        return response.files[0];
      }

      // If no matching folder is found, search deeper into each subfolder
      options.q = `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder'`;
      response = Drive.Files.list(options);
      if (response.files) {
        for (var i = 0; i < response.files.length; i++) {
          var result = searchFolders(response.files[i].id);
          if (result) return result; // Return the first match found in subfolders
        }
      }
      return null; // Return null if no matching folders are found
    }

    // Start the recursive search from the parentFolderId
    return searchFolders(parentFolderId);
  }

  /**
   * Retrieves the folder ID by navigating a path starting from a specified starting folder.
   * @param {string} path - The path (folder names separated by slashes) to the folder.
   * @param {string} parentFolderId - The ID of the root folder from which to start the path.
   * @returns {string|null} - The ID of the folder at the end of the path, or null if any part of the path is not found.
   */
  static getFolderIdByPath(path, parentFolderId) {
    path = path.replace(/^\/*|\/*$/g, '');
    const folderNames = path.split('/').filter(function(folderName) { return folderName !== ''; });
    let currentParentId = parentFolderId;
  
    for (var i = 0; i < folderNames.length; i++) {
      var folderName = folderNames[i];
  
      // List files with the given name and parent, within the shared drive
      var query = `'${currentParentId}' in parents and name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
      var response = Drive.Files.list({
        q: query,
        spaces: 'drive',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
      });
  
      if (response.files.length === 0) {
        // If no folder is found, return null
        Logger.log('Folder not found: ' + folderName);
        return null;
      }
  
      // Assume the first found folder is the correct one
      currentParentId = response.files[0].id;
    }
    return currentParentId;
  }
}
