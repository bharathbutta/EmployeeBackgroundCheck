from flask import Flask, request, jsonify, session,render_template
# from flask_swagger_ui import get_swaggerui_blueprint
from feedbackCalculation import feedbackCalculate
from flask import Flask, request, jsonify
from flask_session import Session
from flask_bcrypt import Bcrypt
from config import connection
from flask_cors import CORS
import random
import smtplib
from email.mime.text import MIMEText
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)

# # Swagger ui code
# SWAGGER_URL = '/api/docs'  # URL for exposing Swagger UI (without trailing '/')
# API_URL = 'http://petstore.swagger.io/v2/swagger.json'  # Our API url (can of course be a local resource)

# # Call factory function to create our blueprint
# swaggerui_blueprint = get_swaggerui_blueprint(
#     SWAGGER_URL,  # Swagger UI static files will be mapped to '{SWAGGER_URL}/dist/'
#     API_URL,
#     config={  # Swagger UI config overrides
#         'app_name': "Test application"
#     },
#     # oauth_config={  # OAuth config. See https://github.com/swagger-api/swagger-ui#oauth2-configuration .
#     #    'clientId': "your-client-id",
#     #    'clientSecret': "your-client-secret-if-required",
#     #    'realm': "your-realms",
#     #    'appName': "your-app-name",
#     #    'scopeSeparator': " ",
#     #    'additionalQueryStringParams': {'test': "hello"}
#     # }
# )

# app.register_blueprint(swaggerui_blueprint)

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

@app.route('/otpverification', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # Generate a random verification code
        code = random.randint(100000, 999999)
        
        # Get the email address from the form
        email = request.json['email']

        conn = connection()
        cursor = conn.cursor()

        insert_query = "INSERT INTO dbo.Users_OTP(email, otp) VALUES(?, ?)"
        cursor.execute(insert_query, (email, code))
        #data = cursor.fetchone()
        cursor.commit()
        conn.close()
        
        # Send an email with the verification code
        msg = MIMEText("Your verification code is: " + str(code))
        msg['Subject'] = "Email Verification"
        msg['From'] = "sampleemailforusing123@gmail.com"
        msg['To'] = email
        
        # Send the email using SMTP
        smtp = smtplib.SMTP('smtp.gmail.com', 587)
        smtp.starttls()
        smtp.login('sampleemailforusing123@gmail.com', 'ksezppqjjfzcqoeh')
        smtp.sendmail('sampleemailforusing123@gmail.com', email, msg.as_string())
        smtp.quit()
        print(code)
        # Store the verification code and email address in session
        # session['code'] = code
        # session['email'] = email
        # print(session ,"signup")
        #return redirect('/verify')
        return jsonify({"success":"Otp sent Successfully"})
    
    #return render_template('signup.html')

@app.route('/verify', methods=['GET', 'POST'])
def verify():
    if request.method == 'POST':
        # Get the verification code from the form
        code = request.json['code']
        


        conn = connection()
        cursor = conn.cursor()
        select_query = "SELECT * FROM dbo.Users_OTP WHERE OTP=?"
        cursor.execute(select_query, (code))
        data = cursor.fetchone()
        conn.close()
        # a=data.split(',')
        e = []
        for row in data:
            print(row)  
            e.append(row)
        print(e[2],"otp")

        if(str (e[2]) == code):
        
            
            return jsonify({"sucess": "OTP verfied"})
        else:
        # print(code)
        # # Get the stored verification code and email address from session
        # stored_code = session.get('code')
        # print(stored_code, "storedcode")
        # print(session)
        # email = session.get('email')
        
        # # Check if the verification code is correct
        # if str(stored_code) == code:
        #     # Code is correct, registration is successful
            return jsonify({"error":"Invalid Verification Code"})
        # else:
        #     # Code is incorrect, show an error message
        #     error = "Invalid Verification Code"
        #     return jsonify({"error":error})
            
    
    return render_template('verify.html')

if __name__ == '__main__':
    app.run(debug = True, port=5002)


