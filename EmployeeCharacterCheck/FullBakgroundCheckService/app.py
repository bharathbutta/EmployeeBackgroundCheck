from flask import Flask, request, jsonify
from config import connection
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

#consider it as middlerware
@app.route('/fullbackgroundcheck/backgroundCheck', methods=['POST', 'PUT'])
def backgroundCheck():
    court_api_points = request.json['court_api_points']
    news_api_points = request.json['news_api_points']
    empName = request.json['Name']
    address = request.json['Address']
    dob = request.json['Dob']
    user_id = ['userId']

    #check if employee data is already present in database and if yes then check for feedback points
    conn = connection()
    cursor = conn.cursor()
    select_query = "SELECT empId, feedbackPoints from dbo.EmployeeData WHERE empName =? and address =? and dob =?"
    cursor.execute(select_query, (empName, address, dob))
    data = cursor.fetchone()

    print(data)

    if data is None:
        #if employee data not present
        print("inserting into db")
        feedback_points = 0
        total_points = court_api_points + news_api_points + feedback_points
        insert_query = "INSERT INTO dbo.EmployeeData(empName, address, dob, courtapiPoints, newsapiPoints, finalPercentage, feedbackPoints) VALUES(?, ?, ?, ?, ?, ?, ?)"
        cursor.execute(insert_query, (empName, address, dob, court_api_points, news_api_points, total_points, feedback_points))
        cursor.commit()

        query = "INSERT INTO UserEmployee(userId, empId, feedbackGiven) VALUES(?,?,?)"
        cursor.execute(query,(user_id, emp_id, 0))


        cursor.commit()

    else:
        print("updating the db")
        emp_id = data[0]
        feedback_points = data[1]
        total_points = court_api_points + news_api_points + feedback_points
        #update if employee data is already present
        update_query = "UPDATE dbo.EmployeeData SET courtapiPoints=?, newsapiPoints=?, finalPercentage=?, feedbackPoints=? WHERE empId=?" 
        cursor.execute(update_query, (court_api_points, news_api_points, total_points, feedback_points, emp_id))
        cursor.commit()

    conn.close()

    result = {
        "total percent": total_points
    }

    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug = True, port=5001)