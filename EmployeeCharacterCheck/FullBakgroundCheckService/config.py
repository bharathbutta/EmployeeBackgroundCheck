import pyodbc

def connection():
    server = 'userinfostorage.database.windows.net'
    database = 'DatastoreDB'
    username = 'Admin1'
    password = 'Technothon@2023'
    driver= '{ODBC Driver 17 for SQL Server}'

    connString = 'DRIVER='+driver+';SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password
    conn = pyodbc.connect(connString)
    return conn
