import { APIgetEntries, APIcreateEntry } from './api.js';
import { deriveEncryptionKey, decryptEntry, encryptEntry } from './crypto.js';
import { encryptionKey } from "./shared.js";
import { showView } from "./app.js";

const jwt = sessionStorage.getItem("jwt");
const area = document.getElementById("valutErrorBox");
const passArea = document.getElementById("passwordsBox");
area.replaceChildren();

try {
    const entries = await APIgetEntries(jwt);
    for (let i=0; i< entries.length; i++){
        const childDiv = document.createElement("div");
        const decryptedContent = await decryptEntry(encryptionKey, entries[i].content, entries[i].iv);

        childDiv.insertAdjacentHTML('beforeend', `
            <h2>${entries[i].title}</h2>
            <p>${decryptedContent}</p>`);
        childDiv.id=`passwordDiv${i}`;
        passArea.appendChild(childDiv);
    }
    if (entries.length == 0){
        passArea.insertAdjacentHTML('beforeend',`
            <p class='text-center'>You Dont Have Any Passwords</p>`);
    }
} catch (error) {
    console.log("CATCHING ERROR FROM VALUT.JS");
    area.innerHTML='';
    area.insertAdjacentHTML('beforeend', `
        <h2Session Expired!</h2>
        <p class="reg text-center">Your Session Has Expired. Please <button class="txt-btn underline-slide" id="toLogIn">Log In Again</button></p>`);
}

document.getElementById("startNewPassword").addEventListener("click", async() => {
    showView("newEntry");
});

document.getElementById("newEntryButton").addEventListener("click", async() => {
    const title = document.getElementById("title").value;
    const unencrypted = document.getElementById("content").value;
    const jwt = sessionStorage.getItem("jwt");
    const area = document.getElementById("newEntryErrorBox");

    const encrypted = await encryptEntry(encryptionKey, unencrypted);

    try {
        evalContent(title);
        evalContent(evalContent);
        await APIcreateEntry(jwt, title, encrypted);
        showView("valut");
        window.location.reload();
    }catch (error) {
        console.log("CATCHING ERROR FROM VALUT.JS");
        area.innerHTML = '';
        area.append
    }
});

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




function evalContent(content) {
    if (content.length <= 0) {
        console.log("THROWING ERROR FROM SIGNUP.JS");
        throw new Error();
    } else {
        return true;
    }
}