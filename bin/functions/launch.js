module.exports = {
    'launch': (fs, OSname, electron, mclc, args, request, host, importSettings, importPacks, consoleW, mainWindow) => {
        let launchable = true;
        if(launchable){
        //console.log(args);
        if(launchable === false) return console.error('Allready Executed \n Ignore this'); 
        let settings = importSettings(fs, OSname);
        let packs = importPacks(fs, OSname);
        
        console.log("Settings: " + settings);
        console.log(settings);
        console.log(args);
        
        //Data Validation
        if(settings === undefined) return dialog.showErrorBox('Du hast keinen Account angegeben!', 'Da wir jetzt erst eine settings.json erstellt haben, \nSolltest du vorher doch lieber in den einstellungen deinen account angeben!');
        if(settings.email === undefined) return dialog.showErrorBox('Da fehlt noch was!', 'Deine Account daten sind unvollständig.\nGehe in die Einstellungen um das zu ändern (Email)');
        if(settings.password === undefined) return dialog.showErrorBox('Da fehlt noch was!', 'Deine Account daten sind unvollständig.\nGehe in die Einstellungen um das zu ändern (Password)');
        
        let packName = args[0];
    
        //console.log(packName);
        //Option definition
        if(!packs[packName]){  packs[packName] = { version:'download' }; }else{ packs[packName].version = args[3];}
        let opts;
        //console.log(args);
        if(packs[packName].version === args[3]){
        //console.log(settings);
        //console.log('not installing');
            opts = {
                authorization: mclc.Authenticator.getAuth(settings.email, settings.password),
                clientPackage: null,
                root: "C:/Users/"+OSname+"/Documents/.slpmods/modpacks/"+args[0],
                os: "windows",
                version: {
                    number: args[1],
                    type: "release"
                },
                forge:"C:/Users/"+OSname+"/Documents/.slpmods/modpacks/"+args[0]+"/bin/forge.jar",
                memory: {
                    max: settings.max,
                    min: settings.min
                }
            }    
        }else if(args[3] == "vanilla"){
            let opts = {
                clientPackage: null,
                // For production launchers, I recommend not passing 
                // the getAuth function through the authorization field and instead
                // handling authentication outside before you initialize
                // MCLC so you can handle auth based errors and validation!
                authorization: Authenticator.getAuth("username", "password"),
                root: "./minecraft",
                os: "windows",
                version: {
                  number: args[1],
                  type: "release"
                }
            }
        }else{
            console.log('installing');
            
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
                });
            });

            opts = {
                authorization: mclc.Authenticator.getAuth(settings.email, settings.password),
                clientPackage: args[2],
                root: "C:/Users/"+OSname+"/Documents/.slpmods/modpacks/"+args[0],
                os: "windows",
                version: {
                    number: args[1],
                    type: "release"
                },
                forge:"C:/Users/"+OSname+"/Documents/.slpmods/modpacks/"+args[0]+"/bin/forge.jar",
                memory: {
                    max: settings.max,
                    min: settings.min
                }
            }
            packs[packName].version = args[3];
            packs[packName].key = "none";
        }
        
        consoleW = new electron.BrowserWindow({
            frame:false, 
            show:false, 
            width:1300, 
            height:700, 
            backgroundColor:"#2f3640",
            webPreferences: {
                nodeIntegration: true
            }
        });
    
        consoleW.loadFile('bin/views/console.html');
    
        const launcher = new mclc.Client();
            console.log("Launch")
            //console.log(args);
            //console.log(settings);
            launcher.launch(opts);
            mainWindow.webContents.send('launched','true');
            launchable = "false";
    
            setTimeout(() => {
                fs.writeFile(`C:/Users/${OSname}/Documents/.slpmods/packs.json`, JSON.stringify(packs), (err) => {
                    if (err) console.log(err);
                    console.log("runs");
                });
            },2000);
    
            if(settings.console == 'true'){
                consoleW.show();
            }
                 
            launcher.on('close',() => {
                launchable = "true";
                consoleW.webContents.send('console-output', 'Minecraft terminated');    
                mainWindow.webContents.send('MinecraftClosed');    
            });
            launcher.on('debug', (e) => {
                console.log(e)
                consoleW.webContents.send('console-output', e);    
        
            });
            launcher.on('data', (e) => {
                console.log(e.toString('utf-8'))
                consoleW.webContents.send('console-output', e.toString('utf-8'));    
        
            });
            launcher.on('error', (e) => {
                console.log(e.toString('utf-8'))
                consoleW.webContents.send('console-output', e.toString('utf-8'));    
        
            });
        }else{ 
            return dialog.showErrorBox('Das Spiel Läuft schon!', 'Das Spiel ist schon gestartet.\nSchließe dein Spiel um ein neues zu starten!');
        }
    }
}