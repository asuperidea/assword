import { APIgetEntries, APIcreateEntry } from './api.js';
import { deriveAuthKey } from './crypto.js';

async function getEntries(){
    const jwt = sessionStorage.getItem("jwt");
    const response = await APIgetEntries(jwt);
    return response;
}

async function createEntry(title, password, masterPassword){
    const jwt = sessionStorage.getItem("jwt");
    const salt = sessionStorage.getItem("salt");
    try {
        const response = APIcreateEntry(jwt, salt, title, password, masterPassword);
        
    }catch (error) {
        
    }
}

getEntries();