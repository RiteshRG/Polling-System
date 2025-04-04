import pyodbc

# Database connection details
server = "quick-poll-app-cclab.database.windows.net"
database = "quick_poll"
username = "student"
password = "5*Admin2004"

# Connection string using ODBC Driver 18 for SQL Server
conn_str = f'DRIVER={{ODBC Driver 18 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}'

try:
    # Establish connection
    conn = pyodbc.connect(conn_str)
    print(" Connection Successful!")

    # Close connection after test
    # conn.close()

except Exception as e:
    print(f" Connection Failed: {e}")
