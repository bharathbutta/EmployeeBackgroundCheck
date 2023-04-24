from flask import Flask, request, jsonify, session
from feedbackCalculation import feedbackCalculate
from flask import Flask, request, jsonify
from flask_session import Session
from flask_bcrypt import Bcrypt
from config import connection
from flask_cors import CORS

app = Flask(__name__)
bcrypt = Bcrypt(app)
server_session = Session(app)
CORS(app, supports_credentials=True)


@app.route('/loginService/employeeList', methods=['POST'])
def employeeList():
    user_id = request.json['userId']
    #get employee ids from UserEmployee table for whom the user has not given feedback yet
    conn = connection()
    cursor = conn.cursor()
    
    #query to get data(empId, empName) of employees for whom user wants to give feedback
    select_query = "SELECT empId, empName FROM dbo.EmployeeData WHERE empId in(\
        SELECT empId FROM dbo.UserEmployee WHERE userId =? and feedbackGiven =?)"
    cursor.execute(select_query, (user_id, 0))
    rows = cursor.fetchall()

    #from above take empIds and search for their names in EmployeeData table

    #print(data)
    empList = []
    for row in rows:
        empList.append(row)

    print(empList)

    #convert to dictionary
    result = dict(empList)
    array = [{'empId' : i, 'empName' : result[i]} for i in result]
    return(jsonify(array))



@app.route('/loginService/feedback', methods=['POST'])
def feedback():
    user_id = request.json['userId']
    emp_id = request.json['empId']
    feedback1 = request.json['feedback1']
    feedback2 = request.json['feedback2']
    feedback3 = request.json['feedback3']
    
    response = feedbackCalculate(user_id, emp_id, feedback1, feedback2, feedback3)

    result = {
        'message': response
    }
    return jsonify(result)

# Register User
@app.route("/loginService/register", methods=['POST'])
def register_user():
    username = request.json["username"]
    email = request.json["email"]
    password = request.json["password"]

    conn = connection()
    cursor = conn.cursor()
    select_query = "SELECT * FROM dbo.UserLogin WHERE username=? or email=?"
    cursor.execute(select_query, (username, email))
    data = cursor.fetchone()

    if(data is not None):
        conn.close()
        return jsonify({"error": "User already exists"})
       

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    insert_query = "INSERT INTO dbo.UserLogin(username, email, password) VALUES(?, ?, ?)"
    cursor.execute(insert_query, (username, email, hashed_password))
    #data = cursor.fetchone()
    cursor.commit()
    conn.close()

    #session["user_id"] = query['id']
    return jsonify({
       "message": "success"
    })


@app.route("/loginService/login", methods=['POST'])
def loginPage():
    username = request.json["username"]
    password = request.json["password"]

    conn = connection()
    cursor = conn.cursor()
    select_query = "SELECT * FROM dbo.UserLogin WHERE username=?"
    cursor.execute(select_query, (username))
    user = cursor.fetchone()
    conn.close()

    print(user)

    if user is None:
        return jsonify({"error": "username wrong"})

    user_id = user[0]
    username = user[1]
    user_password = user[3]

    if not bcrypt.check_password_hash(user_password, password):
        return jsonify({"error": "password wrong"})
        
    return jsonify({
        "id": user_id,
        "username:": username
    })

if __name__ == '__main__':
    app.run(debug = True, port=5002)


