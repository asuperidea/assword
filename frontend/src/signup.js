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
        return passwordEval.reason;
    }

    const salt = generateSalt();
    const authKey = deriveAuthKey(masterPassword, salt);

    const response = APIsignup(email, salt, authKey);
    return response
}

function startSignUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = signUp(password, email);
    return response;
}

const button = document.getElementById("startSignUp");
button.addEventListener("click", startSignUp);