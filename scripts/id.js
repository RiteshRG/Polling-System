const regUsername = document.querySelector('.js-register-username');
const regEmail = document.querySelector('.js-register-email');
const regpassword = document.querySelector('.js-register-pass');
const regBtn = document.querySelector('.js-register-btn');
const regForm = document.querySelector('#registerForm');

const logEmailOrName = document.querySelector('.loginEmailOrName');
const logPassword =  document.querySelector('.loginPassword');
const logForm = document.querySelector('#loginForm');

export const registerForm = {
    regForm,
    regUsername,
    regEmail,
    regpassword,
    regBtn
}

export const loginForm = {
    logEmailOrName,
    logPassword,
    logForm
}