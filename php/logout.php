<?php
session_start();

// Unset all session variables
$_SESSION = [];

// Destroy the session
session_unset();
session_destroy();

// Clear all cookies related to your site
$cookieParams = ['user_id', 'username', 'email', 'PHPSESSID'];
foreach ($cookieParams as $cookie) {
    setcookie($cookie, "", time() - 3600, "/");
}

// Ensure JavaScript-side storage is cleared
echo "<script>
    localStorage.clear();
    sessionStorage.clear();
</script>";

// Redirect to login page
header("Location: index.html");
exit;
?>
