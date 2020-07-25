module.exports = {
    'importSettings': (fs, OSname) => {
        if(fs.existsSync(`C:/Users/${OSname}/Documents/.slpmods`)){
            if(fs.existsSync(`C:/Users/${OSname}/Documents/.slpmods`)){
            }else{
                fs.mkdirSync(`C:/Users/${OSname}/Documents/.slpmods/modspacks`);
            }
            if(fs.existsSync(`C:/Users/${OSname}/Documents/.slpmods/settings.json`)){   
                return JSON.parse(fs.readFileSync('C:/Users/'+OSname+'/Documents/.slpmods/settings.json', "utf8"));
            }else{
                fs.writeFileSync(`C:/Users/${OSname}/Documents/.slpmods/settings.json`,JSON.stringify({lang:"en",email:'undefined', password:'undefined', min:512, max:4096, enableUpdate:'true', console:'false'}));
               return undefined;
            }
        }else{
            fs.mkdirSync(`C:/Users/${OSname}/Documents/.slpmods`);
            return undefined;
        }
    }
}