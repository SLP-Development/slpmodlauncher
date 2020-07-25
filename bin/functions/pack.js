module.exports = {
    'importPacks': (fs,OSname) => {
        if(fs.existsSync(`C:/Users/${OSname}/Documents/.slpmods`)){
            if(fs.existsSync(`C:/Users/${OSname}/Documents/.slpmods`)){
            }else{
                fs.mkdirSync(`C:/Users/${OSname}/Documents/.slpmods/modspacks`);
            }
            if(fs.existsSync(`C:/Users/${OSname}/Documents/.slpmods/packs.json`)){   
                return JSON.parse(fs.readFileSync('C:/Users/'+OSname+'/Documents/.slpmods/packs.json', "utf8"));
            }else{
                fs.writeFileSync(`C:/Users/${OSname}/Documents/.slpmods/packs.json`,JSON.stringify({packs:"first_run"}));
                return undefined;
            }
        }else{
            fs.mkdirSync(`C:/Users/${OSname}/Documents/.slpmods`);
            return undefined;
        }
    }
}