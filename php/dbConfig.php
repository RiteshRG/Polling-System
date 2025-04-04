<?php
phpinfo();
$serverName = "quick-poll-app-cclab.database.windows.net"; 
$database = "quick_poll";
$username = "student";
$password = "5*Admin2004";

// Connection options
$connectionOptions = array(
    "Database" => $database,
    "Uid" => $username,
    "PWD" => $password,
    "Encrypt" => 1, 
    "TrustServerCertificate" => 0 
);

$conn = sqlsrv_connect($serverName, $connectionOptions);

// Check connection
if ($conn) {
    //echo "Connection Successful!";
} else {
    echo "Connection Failed: ";
    die(print_r(sqlsrv_errors(), true));
}
?>
