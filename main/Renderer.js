import { ipcMain, dialog } from 'electron';

import Logger from './Logger'

export default class Renderer {
  constructor(server, mainWindow, overlay) {
    this._server = server;
    this._mainWindow = mainWindow;
    this._overlay = overlay;

    this.listenForMessages();
  }

  sendMessageMain(message) {
    this._mainWindow.webContents.send(message)
  }

  sendMessageMainData(message, data) {
    this._mainWindow.webContents.send(message, data)
  }

  sendMessageOverlay(message, data) {
    this._overlay.webContents.send(message, data)
  }

  listenForMessages() {
    ipcMain.on("getSoftwares", (event) => {
      event.sender.send('softwares', this._server.softwares);
    });

    ipcMain.on("getConfig", (event) => {
      if(this._server.config.config == {}) {
        console.log("----- Config not ready yet -----");
        this._server.config.readConfig((message, config) => this._server.onConfig(message, config))
      } else {
        event.sender.send('config', this._server.config.config);
      }
    });

    ipcMain.on("getNodes", (event) => {
      event.sender.send('nodes', this._server.nodes);
    });

    ipcMain.on("getProjects", (event) => {
      let projects = this._server._projects;
      let projList = []
      for(let p in projects) {
        projList.push(p);
      }
      let project = this._server._project;
      event.sender.send("projects", {projects: projList, project: project});
    });

    ipcMain.on("getProject", (event) => {
      this._server.project.formatForRender();
    });

    ipcMain.on("setProject", (event, data) => {
      this._server._project = data;
      this._server.project.formatForRender();
    });

    ipcMain.on("setPathType", (event, data) => {
      this._server.project.pathType = data;
      this._server.project.formatForRender();
    });

    ipcMain.on("setPathSubType", (event, data) => {
      this._server.project.pathSubType = data;
      this._server.project.formatForRender();
    });

    ipcMain.on("dimension", (event, data) => {
      this._server.project.setDimension(data);
    });

    ipcMain.on("setAssetId", (event, data) => {
      this._server.setAssetIdValue(data.sid, data.type, data.value);
    });

    ipcMain.on("selectDirectory", (event, data) => {
      dialog.showOpenDialog(this._mainWindow, { properties: ['openDirectory'] }, (dir) => {
        if(dir.length > 0) {
          event.sender.send('selectedDirectory', dir[0]);
        }
      });
    });

    ipcMain.on("selectSoftwarePath", (event, data) => {
      dialog.showOpenDialog(this._mainWindow, { properties: ['openFile'], filters: [{name: "Executables", extensions: ["exe"]}] }, (files) => {
        if(files.length > 0) {
          data.path = files[0]
          event.sender.send('selectedSoftwarePath', data);
        }
      });
    });

    ipcMain.on("selectFile", (event, data) => {
      dialog.showOpenDialog(this._mainWindow, { properties: ['openFile'], filters: data.extensions }, (files) => {
        if(files.length > 0) {
          event.sender.send(data.response, files[0]);
        }
      });
    });

    ipcMain.on("setConfig", (event, data) => {
      console.log("----- set config -----", data);
      this._server.setConfig(data)
    });

    ipcMain.on("execTask", (event, data) => {
      console.log("----- exec task -----", data);
      // socket.emit("execTask", data);
      this._server.execTask(data);
    });

    ipcMain.on("checkSotfwareSaved", (event) => {
      console.log("----- check is software is saved -----");
      // socket.emit("checkSotfwareSaved");
    });

    ipcMain.on("saveComment", (event, data) => {
      console.log("----- save comment -----", data);
      this._server._assetIds[data.sid].saveComment(data.comment);
    });

    ipcMain.on("saveTag", (event, data) => {
      this._server._assetIds[data.sid].saveTag(data.tag);
    });

    ipcMain.on("deleteTag", (event, data) => {
      this._server._assetIds[data.sid].deleteTag(data.tag);
    });

    ipcMain.on("refresh", (event) => {
      console.log("----- refresh browser -----");
      // socket.emit("refresh");
    });

    ipcMain.on("overlaySoftware", (event, data) => {
      // overlaySoftware = data;
      // overlay.webContents.send('software', data);
    });

    ipcMain.on("getSceneName", (event, data) => {
      // socket.emit("getSceneName", data);
    });
  }
}
