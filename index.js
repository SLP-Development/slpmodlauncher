const mclc = require('minecraft-launcher-core');
const {app, BrowserWindow,ipcMain, dialog} = require('electron');
const electron = require('electron');
const request = require('request');
const host = require('./bin/config/app.json');

const fs = require('fs');
let launchable = true;

const log = require('electron-log');
const {autoUpdater} = require("electron-updater");
let OSname = require("os").userInfo().username;
var path = process.cwd();

// Import / File Handling
let {createHomePath} = require("./bin/functions/createHomePath"); 
let {importSettings} = require("./bin/functions/settings"); 
let {importPacks} = require("./bin/functions/pack"); 
let {launch} = require("./bin/functions/launch");

createHomePath(fs,OSname);

//let launchable = "true";
let mainWindow, consoleW, webBrowser = null;

ipcMain.on("launch", (event, args) => {
    launch(fs, mclc.Authenticator, OSname, electron, mclc, args, request, host, importSettings, importPacks, consoleW, mainWindow);
});

function createWindow () {

    // Create the browser windows.
    mainWindow = new electron.BrowserWindow({
        frame:false, 
        show:true, 
        width:1300, 
        height:750, 
        backgroundColor:"#2f3640",
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile('bin/views/home.html');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

//Pack Grabber
request({
    method:'GET',
    uri:host.all,
    json:true
}, function load(error, response, body) {
    if(error) throw error;
    console.log(body);
    fs.writeFile(`C:/Users/${OSname}/Documents/.slpmods/display.json`, JSON.stringify(body), (err) => {
        if (err) console.log(err);
        console.log("runs");
        mainWindow.webContents.send('reload');
    });
});

/**
 * AUTOUPDATER
 * Uses github to Update The Software
 * Repo gets read from package.json
 */

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

function sendStatusToWindow(text) {
    log.info(text);
    ipcMain.on('message', function (event, text) {
        addItem(args); // we don't care process
        event.sender.send("message", text);
    })
}

// Logging to Log file at: C:\Users\<USER>\AppData\Roaming\slpmods\log.log
autoUpdater.on('checking-for-update', () => { sendStatusToWindow('Checking for update...'); });
autoUpdater.on('update-available', () => { sendStatusToWindow('Update available.'); });
autoUpdater.on('update-not-available', () => { sendStatusToWindow('Update not available.'); });
autoUpdater.on('error', (err) => { sendStatusToWindow('Error in auto-updater. ' + err); });
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', () => {
    fs.writeFileSync(`C:/Users/${OSname}/Documents/.slpmods/version.json`,JSON.stringify({read:"true"}));
    mainWindow.webContents.send("Update-Found",'true')
    
    //Looks for the Settings file if none is generated create and read it 
    let settings;

    if(fs.existsSync(`C:/Users/${OSname}/Documents/.slpmods`)){ // Validate Existencs of Folder
        if(fs.existsSync(`C:/Users/${OSname}/Documents/.slpmods/settings.json`)){ // Validate Existencs of settings.json
            settings = JSON.parse(fs.readFileSync('C:/Users/'+OSname+'/Documents/.slpmods/settings.json', "utf8"));
        }else{
            // Create Default Settings.json if not Existing
            fs.writeFileSync(`C:/Users/${OSname}/Documents/.slpmods/settings.json`,JSON.stringify({email:'undefined', password:'undefined', min:512, max:4096, enableUpdate:'true', console:'false'}));
        }
    }else{
        // Create Folder if Not Existing
        fs.mkdirSync(`C:/Users/${OSname}/Documents/.slpmods`);
    }

    if(fs.existsSync(`C:/Users/${OSname}/Documents/.slpmods`)){ // Validate Existencs of Folder
        if(fs.existsSync(`C:/Users/${OSname}/Documents/.slpmods/packs.json`)){ // Validate Existencs of settings.json
            settings = JSON.parse(fs.readFileSync('C:/Users/'+OSname+'/Documents/.slpmods/packs.json', "utf8"));
        }else{
            // Create Default Settings.json if not Existing
            fs.writeFileSync(`C:/Users/${OSname}/Documents/.slpmods/packs.json`,JSON.stringify({packs:"first_run"}));
        }
    }else{
        // Create Folder if Not Existing
        fs.mkdirSync(`C:/Users/${OSname}/Documents/.slpmods`);
    }

    //Validate the settings file
    if(settings != undefined){
        //look if the user enabled auto updating
        if(settings.enableUpdate === "true"){
            dialog.showMessageBox(dialogOpts, (response) => {
                autoUpdater.quitAndInstall();
            });
        }else{
            return;
        }
    }else{
        return;
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () =>{ 
    createWindow(); 
    autoUpdater.checkForUpdates();
});
// Quit when all windows are closed.
app.on('window-all-closed', function () { app.quit(); });
app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) { createWindow(); }
});