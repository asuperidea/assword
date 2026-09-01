import { APIloginStart, APIloginValidate } from './api.js';
import { deriveAuthKey } from './crypto.js';

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

async function runLogin() {
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
        window.location.href = "vault.html";
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

const button = document.getElementById("startLogIn");
button.addEventListener("click", runLogin);