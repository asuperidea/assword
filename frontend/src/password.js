import { APIdeleteEntry, APIchangeEntry } from './api.js';
import { decryptEntry, encryptEntry } from './crypto.js';
import { encryptionKey } from "./shared.js";
import { showView } from "./app.js";

const jwt = sessionStorage.getItem("jwt");
const errorArea = document.getElementById("passwordErrorArea");
const passArea = document.getElementById("passwordArea");
const buttonRow = document.getElementById("passwordButtonRow");
let entryId, entryIv, title, website, username, password

errorArea.replaceChildren();

export async function displayPassword(cipher, iv, id){
    entryId = id;
    entryIv = iv;
    try{
        const decrypted = await decryptEntry(encryptionKey, cipher, iv);
        title = decrypted.title;
        website = decrypted.website;
        username = decrypted.username;
        password = decrypted.password;
        passArea.replaceChildren();
        passArea.insertAdjacentHTML('beforeend',`
            <p class="fs-2 med lightclr passwordText text-center">${title}</p>
            <p class="fs-4 reg lightclr passwordText">${website}</p>
            <p class="fs-4 reg lightclr passwordText">${username}</p>
            <div class="showPass passwordText" role="button" tabindex="0">
                <p class="fs-4 reg lightclr d-block" id="staredPass">${'&bull;'.repeat(decrypted.password?.length ?? 0)}</p>
                <p class="fs-4 reg lightclr d-none" id="realPass">${password}</p>
            </div>`);

        passArea.querySelectorAll(".showPass").forEach(button => {
            button.addEventListener("click", () => {
                const starred = button.querySelector("#staredPass");
                const real = button.querySelector("#realPass");

                if (!starred || !real) return;

                const showRealPassword = real.classList.contains("d-none");
                starred.classList.toggle("d-none", showRealPassword);
                real.classList.toggle("d-none", !showRealPassword);
            });
        });
    }
    catch(error){
        console.log(error);
    }
}

document.getElementById("deleteEntryButton").addEventListener("click", async() => {
    try {
        const response = await APIdeleteEntry(jwt, entryId, entryIv);
        console.log(response);
        showView("valut");
        passArea.replaceChildren();
        window.location.reload();
    }
    catch(error){
        console.log(error);
    }
})

document.getElementById("changeEntryButton").addEventListener("click", async() => {
    buttonRow.style.display = "none";
    passArea.replaceChildren();
    passArea.insertAdjacentHTML("beforeend", `
    <div class="changePassInputs d-flex flex-column align-items-center">
        <input class="basicinput" value='${title}' placeholder="Password Title" id="changePassTitle">
        <input class="basicinput" value='${website}' placeholder="Website" id="changePassWebsite">
        <input class="basicinput" value='${username}' placeholder="Username or Email" id="changePassUser">
        <input class="basicinput" value='${password}' placeholder="Password" id="changePassword">
    </div>
    <div class="d-flex flex-row justify-content-between" style="width: 70%;">
        <button class="basicbtn mt-auto mb-3" id="saveNewEntryButton">Save New Password</button>
        <button class="toValut redbtn mt-auto mb-3">Discard Changes</button>
    </div>`);
    document.querySelectorAll(".toValut").forEach(button => {
        button.addEventListener("click", () => {
            showView("valut")
            passArea.replaceChildren();
            window.location.reload();
        });
    });
})

document.addEventListener("click", async (event) => {
    const saveButton = event.target.closest("#saveNewEntryButton");
    if (!saveButton){
        return;
    };

    try{
        const fields = {
            title: document.getElementById("changePassTitle").value,
            website: document.getElementById("changePassWebsite").value,
            username: document.getElementById("changePassUser").value,
            password: document.getElementById("changePassword").value
        };
        const encryptedContent = await encryptEntry(encryptionKey, fields);
        await APIchangeEntry(jwt, encryptedContent, entryId);
        passArea.replaceChildren();
        showView("valut");
        window.location.reload();
    } catch (error){
        errorArea.replaceChildren();
        errorArea.insertAdjacentHTML("beforeend", `
            <h1 class="coral fs-1 med">Error!</h1>
            <p class="coral fs-3 reg">Your password change failed, try logging out and back in.</p>`)
    }
});