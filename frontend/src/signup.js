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
    document.cookie = "username="+document.getElementById('signup-url').value;
    const salt = generateSalt();
    const authKey = await deriveAuthKey(master, salt);
    try{
        console.log("testing word");
        console.log(evalPassword(master));
    } catch(error) {
        console.log("CATCHING ERROR FROM SIGNUP.JS");
        area.innerHTML='';
        area.insertAdjacentHTML('beforeend', `
            <h2 class="bold fs-5 lightclr">Password Issue!</h2>
            <p class="reg lightclr">Your password must be between 10 and 100 characters!</p>`)
        return "error";
    }
    try {
        console.log("calling api");
        await APIsignup(email, salt, authKey);
        area.innerHTML='';
        area.insertAdjacentHTML('beforeend', `
            <h2 class="bold fs-5 lightclr">Sign Up Successful!</h2>
            <button class="txt-btn lightclr underline-slide toLogIn">Log In</button>`)
    } catch(error) {
        area.innerHTML='';
        area.insertAdjacentHTML('beforeend', `
            <h2 class="bold fs-5 lightclr">Sign Up Error!</h2>
            <p class="reg lightclr">An error occured during your signup process. The username you used may already be in use.</p>`)
    }
});