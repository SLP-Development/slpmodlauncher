let { ipcRenderer } = require("electron");
let request = require("request");
var path = process.cwd();
const fs = require('fs');
let OSname = require("os").userInfo().username;
//let lang  = require('./langHanlder.js');

//HtmlToJs Definition
let body = document.getElementById('modLayout');
let title = document.getElementById('modHeader');
let btn_launch = document.getElementById('launch');
let btn_key = document.getElementById('key');
let modbody = document.getElementById('modLayout');
let vanillaKey = document.getElementById('vanilla');

let type = "modpack";

let selected;
let pack_list = JSON.parse(fs.readFileSync('C:/Users/'+OSname+'/Documents/.slpmods/display.json', "utf8"));

console.log(pack_list);

ipcRenderer.on("reload", () => { document.location.reload(); });

// Vanilla Tech
let vSelected = "";

vanillaKey.addEventListener('click',() => {
    type = "vanilla";
    let modTitleTag = document.createElement("h2");
    let modTitle = document.createTextNode("Minecraft Vanilla");
    let versions = [];

    request({
        method:'GET',
        uri:"https://launchermeta.mojang.com/mc/game/version_manifest.json",
        json:true
    }, function load(error, response, body) {
        if(error) throw error;
        body.versions.forEach(e => {
            if(e.type == "release"){
                //console.log(e.id);
                versions.push(e.id);
            }
        });

        console.log(versions)
        modTitleTag.appendChild(modTitle);
        modbody.innerHTML = "<h2>Minecraft Vanilla</h2><p>Es wird Empfohlen mindestens 2GB Ram zu zuweisen</p><select id=\"vanillaDropdown\"></select>";

        let dropdown = document.getElementById("vanillaDropdown");  
        console.log(dropdown.value)


        btn_launch.addEventListener('click', (e) => { ipcRenderer.send('launch',["vanilla", dropdown.value]);});

        versions.forEach(e => {
            let optionText = document.createTextNode("Minecraft " + e);
            let option = document.createElement("option");

            option.value = e;
            option.appendChild(optionText);
            dropdown.appendChild(option);
        })
    });

    let dropdown = document.getElementById("vanillaDropdown");
    console.log("Version: " + dropdown.value);
    btn_launch.addEventListener('click', (e) => { ipcRenderer.send('launch',["vanilla", vSelected]);});
})

//Button Controller
selected = (pack_list.length - 1);
for(let i = 0; i < pack_list.length; i++){
    /**
     * =========================================================
     * Use this if Item Creation fails
     * =========================================================
     * 
     * console.log(body.length);
     * console.log(i);
     * console.log(selected);
     * console.log(i + ": " +  body[i].name);
     * 
     */
    
    //Definition of the specific mod Item
    let modItem = document.createElement("li");
    let modIcon = document.createElement("img");
    let modTitleTag = document.createElement("h2");
    let modTitle = document.createTextNode(pack_list[i].name);
    let ul_modslist = document.getElementById('modList');



    modItem.addEventListener('click', () => {
        type = "modpack";
        selected = modItem.dataset.mp_id;
        modbody.innerHTML = "<h2>"+pack_list[selected].name+"</h2>"+"<small style=\"color: grey;\">Pack Version: "+pack_list[selected].packVersion+"</small><br><small style=\"color: grey;\">Empfohlener Ram: "+pack_list[selected].recommended+"</small><br>"+pack_list[selected].launcherBody;
        console.log(selected);
    });

    modTitleTag.style.color = 'white';
    modIcon.src = pack_list[i].imageLink;
    modIcon.width = 50;
    modIcon.height = 50;

    modTitleTag.appendChild(modTitle);
    modItem.appendChild(modIcon);
    modItem.appendChild(modTitleTag);
    ul_modslist.appendChild(modItem);
    modItem.classList.add('modItem');
    modItem.setAttribute("id","mp");
    modItem.dataset.mp_id = i;

    //console.log(body[selected].launcherBody);

    //console.log(modbody)
    modbody.innerHTML = "<h2>"+pack_list[selected].name+"</h2>"+"<small style=\"color: grey;\">Pack Version: "+pack_list[selected].packVersion+"</small><br><small style=\"color: grey;\">Empfohlener Ram: "+pack_list[selected].recommended+"</small><br>"+pack_list[selected].launcherBody;   
}

ipcRenderer.on('launched', () => { btn_launch.disabled = true; btn_launch.innerHTML = "Startet"})     
ipcRenderer.on('MinecraftClosed', () => { btn_launch.disabled = false; btn_launch.innerHTML = "Launch"})     
//Launches the Instance
if(type = "vanilla"){
    console.log("vanilla run");
}else{
    btn_launch.addEventListener('click', (e) => { ipcRenderer.send('launch',[pack_list[selected].name, pack_list[selected].gameVersion, pack_list[selected].packLink, pack_list[selected].packVersion]);});
}
//btn_key.addEventListener('click', (e) => { ipcRenderer.send('inputCode',"true"); });  
