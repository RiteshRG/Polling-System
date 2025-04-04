import {registerForm} from './id.js';

registerForm.regForm.addEventListener('submit', e => {
    e.preventDefault();

    onRegister();
});

function valid(){
    console.log(registerForm.regUsername.value.trim());
    if(registerForm.regUsername.value.trim() === '' || registerForm.regEmail.value.trim() === '' || registerForm.regpassword.value.trim() === ''){
        return false;
    }
    if(registerForm.regUsername.value.trim().length < 3 || registerForm.regUsername.value.trim().length  > 20){
        alert("Username must be between 3 and 20 characters.");
        return false;
    }
    if(!/^[a-zA-Z\s]+$/.test(registerForm.regUsername.value.trim())){
        alert("Username can only contain letters and spaces.");
        return false;
    }
    if(registerForm.regpassword.value.trim().length  < 4){
        alert("Password must be at least 5 characters long.");
        return false;
    }
    return true
}

function clear(){
    registerForm.regUsername.value = "";
    registerForm.regEmail.value = "";
    registerForm.regpassword.value = "";
}


function onRegister(){
    if(valid()){
       const registerData = new FormData();
       registerData.append('username', registerForm.regUsername.value);
       registerData.append('email', registerForm.regEmail.value);
       registerData.append('password', registerForm.regpassword.value);

       fetch('./php/insert/insertRegister.php',{
        method: 'POST',
        body: registerData
       })
       .then(response => response.text())
       .then(result =>{
        if (result.includes("Record inserted successfully.")) {
            alert("Registration successful!");
            clear();
            window.location.href = 'login_page.html'; 
        } else {
            alert("Registration failed: " + result);
        }
       })
       .catch(error => {
        alert("Error: " + error.message);
    });
    }
}