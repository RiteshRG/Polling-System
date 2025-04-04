import {loginForm} from './id.js';

loginForm.logForm.addEventListener('submit', e=>{
    e.preventDefault();
    console.log("**** function runing");

    onLogin();
})

function valid(){
 if(loginForm.logEmailOrName.value === "" || loginForm.logPassword.value === ""){
    return false
 }
 return true;
}

function clear(){
    loginForm.logEmailOrName.value = "";
    loginForm.logPassword.value = "";
}

function onLogin(){
    if(valid){
        const loginData = new FormData();
        const inputValue = loginForm.logEmailOrName.value.trim();

        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) {
            loginData.append('email', inputValue);
        } else {
            loginData.append('username', inputValue);
        }

        loginData.append('password', loginForm.logPassword.value.trim());
        
        fetch('./php/login.php', {
            method: 'POST',
            body: loginData
        })
        .then(response => response.text())
        .then(result =>{
            if (result.includes("user login successfully.")) {
                clear();
                window.location.href = "home.html";
            } else {
                alert("login failed: " + result);
            }
        })
        .catch(error => {
            alert("Error: " + error.message);
        });
    }
}
