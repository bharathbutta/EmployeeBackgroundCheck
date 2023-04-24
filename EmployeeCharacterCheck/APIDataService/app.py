from flask import Flask, request, jsonify
from Utility_Methods import extract_image_text,chech_aadhar_front_image,chech_aadhar_back_image,aadhar_details,aadhar_backDetails,chech_pan_image,pan_details,check_file_format
from background_check import court_check, extract_news
from flask_cors import CORS

app = Flask(__name__)

CORS(app, supports_credentials=True)

#api for data extraction from adhar images
@app.route('/apidata/adharImgScan', methods =['POST'])
def extract_adhar_details():
    file1 = request.json['image']

    file2 = request.json['image1']

    if(not check_file_format(file1)):
        return jsonify({'error': "Please Provide Aadhar Front Image"})
    if(not check_file_format(file2)):
        return jsonify({'error': "Please Provide Aadhar Back Image"})
    front_data = extract_image_text(file1)
    

    back_data = extract_image_text(file2)
    
    print(front_data, end="\n\n")
    print(back_data)
    if(front_data == "Network Error"):
        return jsonify({'error': "Network Error"})
    if(back_data == "Network Error"):
        return jsonify({'error': "Network Error"})
    if(not chech_aadhar_front_image(front_data)):
        return jsonify({'error': "Please Provide Aadhar Front Image"})
    if(not chech_aadhar_back_image(back_data)):
        return jsonify({'error': "Please Provide Aadhar Back Image"})
    aadhar_front_details = aadhar_details(front_data)
    aadhar_back_details = aadhar_backDetails(back_data)
    details = {
        "Aadhar_number" : aadhar_front_details[0],
        "Name"   :aadhar_front_details[1],
        "Dob"   :aadhar_front_details[2],
        "Gender"   :aadhar_front_details[3],
        "Address"   :aadhar_back_details,
    }
    return jsonify({'data': details})


#api for data extraction from pan image
@app.route('/apidata/PanImgScan', methods =['POST'])
def extract_pan_details():
    file1 = request.json['image']
    pan_data = extract_image_text(file1)
    if(not check_file_format(file1)):
        return jsonify({'error': "Please Provide Pan Card Image"})
    if(pan_data == "Network Error"):
        return jsonify({'error': "Network Error"})
    if(not chech_pan_image(pan_data)):
        return jsonify({'error': "Please Provide Pan Card Image"})
    pan_details1 = pan_details(pan_data)
    
    return jsonify({'data': pan_details1})


#api for court api points
@app.route('/apidata/courtapi', methods =['POST'])
def courtapi():
    username = request.json['Name']
    result = court_check(username)
    return jsonify({"courtapi_points": result})


#api for news api points
@app.route('/apidata/newsapi', methods =['POST'])
def newaspi():
    username = request.json['Name']
    location = request.json['Address']
    result = extract_news(username, location)
    return jsonify({"newsapi_points": result})



if __name__ == '__main__':
    app.run(debug = True)