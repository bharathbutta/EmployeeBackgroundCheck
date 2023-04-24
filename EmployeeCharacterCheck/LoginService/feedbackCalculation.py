from config import connection

def feedbackCalculate(user_id, emp_id, feedback1, feedback2, feedback3):
    
    # #store data of user id and emp id in table to check user has given feedback for which employee
    # #user can give feedback to employee only once
    conn = connection()
    cursor = conn.cursor()
    query = "SELECT feedbackGiven from dbo.UserEmployee WHERE userId=? and empId=?"
    cursor.execute(query, (user_id, emp_id))
    data = cursor.fetchone()

    print(data[0])

    if data[0]==1:
        return("you have already given feedback for this employee")

    # elif(data is None):
    #     #store data of user id and emp id so we can understand user has given feedback to that employee
    #     query1 = "INSERT INTO dbo.UserEmployee(userId, empId, feedbackGiven) values(?, ?, ?)"
    #     cursor.execute(query1, (user_id, emp_id, 0))
    #     cursor.commit()
    
    #check if employee already has feedback in EmployeeData
    query2 = "SELECT * from dbo.Feedback WHERE empId=?"
    cursor.execute(query2, (emp_id))
    data1 = cursor.fetchone()

    if data1 is not None:
        avg_feedback1 = (feedback1 + data1[2])/2
        avg_feedback2 = (feedback2 + data1[3])/2
        avg_feedback3 = (feedback3 + data1[4])/2
        avg_feedback = (avg_feedback1 + avg_feedback2 + avg_feedback3)/3

        query3 = "UPDATE dbo.Feedback SET feedback1=?, feedback2=?, feedback3=?, finalFeedback=? WHERE empId=?"
        cursor.execute(query3, (avg_feedback1, avg_feedback2, avg_feedback3, avg_feedback, emp_id))
        cursor.commit()

    else:
        avg_feedback1 = feedback1
        avg_feedback2 = feedback2
        avg_feedback3 = feedback3
        avg_feedback = (feedback1 + feedback2 + feedback3)/3

        query4 = "INSERT INTO dbo.Feedback(empId, feedback1, feedback2, feedback3, finalFeedback) VALUES(?, ?, ?, ?, ?)"
        cursor.execute(query4, (emp_id, avg_feedback1, avg_feedback2, avg_feedback3, avg_feedback))
        cursor.commit()

    #to find percentile
    cursor.execute("SELECT MAX(finalFeedback) from dbo.Feedback")
    max_percentile = cursor.fetchone()

    print(max_percentile)

    emp_percentile = (100/max_percentile[0])*avg_feedback

    feedback_points = (40*emp_percentile)/100
    
    #update these feedback points and total points in EmployeeData table
    query5 = "SELECT courtapiPoints, newsapiPoints from dbo.EmployeeData WHERE empId=?"
    cursor.execute(query5, (emp_id))
    data2 = cursor.fetchone()

    courtapiPoints = data2[0]
    newsapiPoints = data2[1]

    updated_totalPoints = courtapiPoints + newsapiPoints + feedback_points

    query6 = "UPDATE dbo.EmployeeData SET finalPercentage=?, feedbackPoints=? WHERE empId=?"
    cursor.execute(query6, (updated_totalPoints, feedback_points, emp_id))
    cursor.commit()

    query7 = "UPDATE dbo.UserEmployee SET feedbackGiven=? WHERE userId=? and empId=?"
    cursor.execute(query7, (1, user_id, emp_id))
    cursor.commit()
    conn.close()

    return ("rating for employee has updated")