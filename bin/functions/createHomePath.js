module.exports = {
    'createHomePath' : (fs, OSname) => {
        if(fs.existsSync(`C:/Users/${OSname}/Documents/.slpmods`)){
            if(fs.existsSync(`C:/Users/${OSname}/Documents/.slpmods/modpacks`)){
            }else{
                fs.mkdirSync(`C:/Users/${OSname}/Documents/.slpmods/modpacks`);
            }
            if(fs.existsSync(`C:/Users/${OSname}/Documents/.slpmods/settings.json`)){   
            }else{
                fs.writeFileSync(`C:/Users/${OSname}/Documents/.slpmods/settings.json`,JSON.stringify({lang:"en",email:'undefined', password:'undefined', min:512, max:4096, enableUpdate:'true', console:'false'}));
            }
        }else{
            console.log("Creating root folder");
            fs.mkdirSync(`C:/Users/${OSname}/Documents/.slpmods`);
            console.log("Creating modpack folder");
            fs.mkdirSync(`C:/Users/${OSname}/Documents/.slpmods/modpacks`);
            console.log("Creating settings file");
            fs.writeFileSync(`C:/Users/${OSname}/Documents/.slpmods/settings.json`,JSON.stringify({lang:"en",email:'undefined', password:'undefined', min:512, max:4096, enableUpdate:'true', console:'false'}));
        }
    }
}