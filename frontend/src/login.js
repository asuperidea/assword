import { APIloginStart, APIloginValidate } from './api.js';
import { deriveAuthKey, deriveEncryptionKey } from './crypto.js';
import { showView } from "./app.js";
import { setEncryptionKey } from "./shared.js";

document.getElementById("startLogIn").addEventListener("click", async() => {
    const email = document.getElementById("login-email").value;
    const master = document.getElementById("login-password").value;
    const area = document.getElementById("logInErrorBox");

    try {
        if (email.length==0 || master.length==0){
            throw new error();
        }

        const salt = await APIloginStart(email);
        const authKey = deriveAuthKey(master, salt);
        sessionStorage.setItem("salt", salt);
        sessionStorage.setItem("email", email);
        
        const jwt = await APIloginValidate(email, authKey);
        sessionStorage.setItem("jwt", jwt);

        showView("valut");
        setEncryptionKey(deriveEncryptionKey(master, salt));
        window.location.reload()
    } catch(error){
        area.innerHTML="";
        area.insertAdjacentHTML('beforeend', `
            <h2 class="bold fs-5">Log In Error!</h2>
            <p class="reg text-center">We couldn't validate your login. Check for typos and try again. If you don't have an account sign up!</p>`);
    }

});

async function loginStart(email) {
    try {
        const salt = await APIloginStart(email);
        if (salt != sessionStorage.getItem("salt")) {
            sessionStorage.setItem("salt", salt);
        }
        return salt;
    } 
    catch (error) {
        console.log("CATCHING ERROR FROM LOGIN.JS");
        throw new Error(`Response status: ${response.status}`);
    }
}

async function loginValidate(email, salt, password) {
    try {
        const authKey = deriveAuthKey(password, salt);
        const response = await APIloginValidate(email, authKey);
        return response; 
    } 
    catch (error) {
        console.log("CATCHING ERROR FROM LOGIN.JS");
        throw new Error(`Response status: ${response.status}`);
    }
}

export async function runLogin() {
    sessionStorage.clear();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const area = document.getElementById('area');

    try {
        const salt = await loginStart(email);
        const jwt = await loginValidate(email, salt, password);

        sessionStorage.setItem("jwt", jwt);

        area.innerHTML = '';
        area.insertAdjacentHTML('beforeend', `
            <div style="width=100%; height: 4rem; background-color: rgb(0,255,0, 50)">
                <h2>Login Success</h2>
            </div>
        `);
        window.location.href = "vault";
    } 
    catch (error) {
        console.log("CATCHING ERROR FROM LOGIN.JS");

        area.innerHTML = '';
        area.insertAdjacentHTML('beforeend', `
            <div style="width=100%; height: 4rem; background-color: rgb(255,0,0, 50)">
                <h2>Login Failed</h2>

            </div>
        `);
    }
}