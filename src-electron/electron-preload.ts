/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */
import { contextBridge } from 'electron';
// highlight-next-line
import { dialog } from '@electron/remote';

contextBridge.exposeInMainWorld('electronApi', {
  openFileDialog: async (title: any, folder: any, filters: any) => {
    const response = await dialog.showOpenDialog({
      title,
      filters,
      properties: ['openFile', 'multiSelections'],
    });
    return response.filePaths;
  },
});
