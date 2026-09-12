import { deriveAuthKey, generateSalt } from './crypto.js';
import { APIsignup } from './api.js';

function evalPassword(password) {
    if (password.length < 10 || password.length > 100) {
        console.log("THROWING ERROR FROM SIGNUP.JS");
        throw new Error();
    } else {
        return {"accept": true, "reason": null};
    }
}

document.getElementById("startSignUp").addEventListener("click", async() => {
    console.log("started");
    const area = document.getElementById("signUpErrorBox");
    const email = document.getElementById("signup-email").value;
    const master = document.getElementById("signup-password").value;
    const salt = generateSalt();
    const authKey = await deriveAuthKey(master, salt);
    try{
        console.log("testing word");
        console.log(evalPassword(master));
    } catch(error) {
        console.log("CATCHING ERROR FROM SIGNUP.JS");
        area.innerHTML='';
        area.insertAdjacentHTML('beforeend', `
            <h2 class="bold fs-5">Password Issue!</h2>
            <p class="reg">Your password must be between 10 and 100 characters!</p>`)
        return "error";
    }
    try {
        console.log("calling api");
        await APIsignup(email, salt, authKey);
        area.innerHTML='';
        area.insertAdjacentHTML('beforeend', `
            <h2 class="bold fs-5">Sign Up Successful!</h2>
            <button class="txt-btn underline-slide" id="toLogIn">Log In</button>`)
    } catch(error) {
        area.innerHTML='';
        area.insertAdjacentHTML('beforeend', `
            <h2 class="bold fs-5">Sign Up Error!</h2>
            <p class="reg">An error occured during your signup process. The email you used may already be in use.</p>`)
    }
});