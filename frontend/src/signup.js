import { deriveAuthKey, generateSalt } from './crypto.js';
import { APIsignup } from './api.js';

function evalPassword(password) {
    if (password.length < 10 || password.length > 100) {
        return {"accept": false, "reason": "Password Must be more then 10 characters, less then 100"};
    } else {
        return {"accept": true, "reason": null};
    }
}

async function signUp(masterPassword, email) {
    const passwordEval = evalPassword(masterPassword);
    if (!passwordEval.accept) {
        console.log("THROWING ERROR FROM SIGNUP.JS");
        throw new Error('Response status: Password must be more then ten characters, less then 100');
    }

    const salt = generateSalt();
    const authKey = deriveAuthKey(masterPassword, salt);

    const response = await APIsignup(email, salt, authKey);
    return response;
}

async function runSignUp() {
    sessionStorage.clear();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const area = document.getElementById('area');

    try {
        const response = await signUp(password, email);

        area.innerHTML = '';
        area.insertAdjacentHTML('beforeend', `
            <div style="width=100%; height: 4rem; background-color: rgb(0,255,0, 50)">
                <h2>Login Successful</h2>
                <a href="login.html"><button>Log In</button></a>
            </div>
        `);
        return response;
    } catch (error) {
        console.log("CATCHING ERROR FROM SIGNUP.JS");
        area.innerHTML = '';
        area.insertAdjacentHTML('beforeend', `
            <div style="width=100%; height: 4rem; background-color: rgb(255,0,0, 50)">
                <h2>Login Failed</h2>
            </div>
        `);
    }
}

const button = document.getElementById("startSignUp");
button.addEventListener("click", runSignUp);