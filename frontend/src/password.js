import { APIdeleteEntry } from './api.js';
import { decryptEntry, encryptEntry } from './crypto.js';
import { encryptionKey } from "./shared.js";
import { showView } from "./app.js";

const jwt = sessionStorage.getItem("jwt");
const errorArea = document.getElementById("passwordErrorArea");
const passArea = document.getElementById("passwordArea");
errorArea.replaceChildren();
let entryId

export async function displayPassword(cipher, iv, id){
    entryId = id;
    try{
        const decrypted = await decryptEntry(encryptionKey, cipher, iv);
        passArea.innerHTML='';
        passArea.innerHTML=('beforeend',`
            <p class="fs-2 med lightclr">${decrypted.title}</p>
            <p class="fs-4 reg lightclr">${decrypted.website}</p>
            <p class="fs-4 reg lightclr">${decrypted.username}</p>
            <div class="showPass" role="button" tabindex="0">
                <p class="fs-4 reg lightclr d-block" id="staredPass">${'&bull;'.repeat(decrypted.password?.length ?? 0)}</p>
                <p class="fs-4 reg lightclr d-none" id="realPass">${decrypted.password}</p>
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
        APIdeleteEntry()
    }
}