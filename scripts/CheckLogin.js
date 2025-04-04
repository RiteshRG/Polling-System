window.onload = function() {
    fetch('./php/auth_check.php')
    .then(response => response.json())
    .then(data => {
        if (data.status === "logged_in") {
            window.location.href = "home.html"; 
        }
    })
    .catch(error => console.error("Error checking login status:", error));
};