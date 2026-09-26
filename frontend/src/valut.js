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
    for (let i=0; i<entries.length; i++){
        const childDiv = document.createElement("div");
        const decryptedContent = await decryptEntry(encryptionKey, entries[i].content, entries[i].iv);
        console.log(decryptedContent);
        childDiv.insertAdjacentHTML('beforeend', `
            <h2 class="semi fs-3">${entries[i].title}</h2>
            <button type="button" class="txt-btn toggle-password">Show</button>
            <p class="password-content" hidden>${decryptedContent}</p>`);
        childDiv.id=`passwordDiv${i}`;
        childDiv.classList.add("password");
        childDiv.querySelector(".toggle-password").addEventListener("click", (event) => {
            const content = childDiv.querySelector(".password-content");
            content.hidden = !content.hidden;
            event.currentTarget.textContent = content.hidden ? "Show" : "Hide";
        });
        passArea.appendChild(childDiv);
    }
    if (entries.length == 0){
        passArea.insertAdjacentHTML('beforeend',`
            <p class='coral light fs-6 text-center'>You Dont Have Any Passwords</p>`);
    }
} catch (error) {
    console.log("CATCHING ERROR FROM VALUT.JS");
    area.innerHTML='';
    area.insertAdjacentHTML('beforeend', `
        <h2 class="lightclr mt-5 text-center bold">Session Expired!</h2>
        <p class="reg text-center lightclr">Your Session Has Expired. Please <button class="textbtn toLogIn">Log In Again</button></p>`);
}

document.getElementById("startNewPassword").addEventListener("click", async() => {
    showView("newEntry");
});

document.getElementById("newEntryButton").addEventListener("click", async() => {
    const untitle = document.getElementById("title").value;
    const uncontent = document.getElementById("content").value;
    const unuser = document.getElementById("username").value;
    const unwebsite = document.getElementById("website").value;
    const jwt = sessionStorage.getItem("jwt");
    const area = document.getElementById("newEntryErrorBox");
    const fields = {
        password: uncontent,
        title: untitle,
        username: unuser,
        website: unwebsite
    };

    try {
        evalContent(untitle);
        const encrypted = await encryptEntry(encryptionKey, fields);
        await APIcreateEntry(jwt, encrypted);
        showView("valut");
        window.location.reload();
    }catch (error) {
        console.log("CATCHING ERROR FROM VALUT.JS");
        area.innerHTML = '';
        area.insertAdjacentHTML('beforeend', `
            <h2 class='semi coral'>Error!</h2>
            <p class='reg coral'>An error occured while processing your password. Make sure every required(*) box is filled out.</p>`
        )};
});

function evalContent(content) {
    if (content.length <= 0) {
        console.log("THROWING ERROR FROM VALUT.JS");
        throw new Error();
    } else {
        return true;
    }
}