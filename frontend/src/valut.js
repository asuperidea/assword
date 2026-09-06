import { APIgetEntries, APIcreateEntry } from './api.js';
import { deriveEncryptionKey, decryptEntry, encryptEntry } from './crypto.js';

async function createEntry(title, content, masterPassword){
    const jwt = sessionStorage.getItem("jwt");
    const salt = sessionStorage.getItem("salt");
    const key = deriveEncryptionKey(masterPassword, salt);
    const encrypted = await encryptEntry(key ,content);
    try {
        const response = await APIcreateEntry(jwt, title, encrypted);
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

export async function runEntries(){
    const key = deriveEncryptionKey(masterPassword, sessionStorage.getItem("salt"));
    const entries = await getEntries();
    displayEntries(entries);
}
export async function runNewEntries(){
    const title = document.getElementById("entryTitle").value;
    const content = document.getElementById("entryContent").value;
    const master = document.getElementById("masterPassword").value;
    
    const response = createEntry(title, content, master);
}