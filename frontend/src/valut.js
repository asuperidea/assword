import { APIgetEntries, APIcreateEntry } from './api.js';
import { deriveAuthKey, decryptEntry } from './crypto.js';

async function createEntry(title, password, masterPassword){
    const jwt = sessionStorage.getItem("jwt");
    const salt = sessionStorage.getItem("salt");
    try {
        const response = await APIcreateEntry(jwt, salt, title, password, masterPassword);
        return response;
    }catch (error) {
        console.log("CATCHING ERROR FROM VALUT.JS");
    }
}

async function getEntries(){
    const jwt = sessionStorage.getItem("jwt");

    try {
        const response = await APIgetEntries(jwt);
        return response;
    }catch (error) {
        console.log("CATCHING ERROR FROM VALUT.JS");
    }
}

function displayEntries(entries){
    const area = document.getElementById("passwordArea");
    for (let i=0; i< entries.length; i++){
        const childDiv = document.createElement("div");

        const decryptedContent = decryptEntry()

        childDiv.insertAdjacentHTML('beforeend', `
            <h2>${entries[i].title}</h2>
            <p>${entries[i].content}</p>`);
        childDiv.id=`passwordDiv${i}`;
        area.appendChild(childDiv);
    }
}

async function runEntries(){
    const entries = await getEntries();
    displayEntries(entries);
}
async function runNewEntries(){
    const title = document.getElementById("entryTitle").value;
    const content = document.getElementById("entryContent").value;
    const master = document.getElementById("masterPassword").value;
    
    const response = createEntry(title, content, master);
}
runEntries();

const button = document.getElementById("newEntryButton");
button.addEventListener("click", runNewEntries);