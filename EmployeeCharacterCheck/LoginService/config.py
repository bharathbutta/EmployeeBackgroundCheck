import pyodbc

def connection():
    server = 'server_Name'
    database = 'Database_Name'
    username = 'Username'
    password = 'password'
    driver= 'Driver_Name'

    connString = 'DRIVER='+driver+';SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password
    conn = pyodbc.connect(connString)
    return conn
