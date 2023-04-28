import requests.packages
import re
import pytesseract
import cv2
import numpy as np
import base64
import sys

from urllib3.exceptions import InsecureRequestWarning

def extract_image_text(image):
    try:
        api_endpoint = 'http://api.ocr.space/parse/image'
        api_key = 'K81321865588957'
        language = 'eng'
        ocr_engine = 2
        response = requests.post(api_endpoint, 
        data={
            'apikey': api_key,
            'language': language,
            'OCREngine': ocr_engine,
            'base64Image': image
        })
        response_data = response.json()
        

        # Check if the API returned any errors
        if response_data['OCRExitCode'] != 1:
            
            return (response_data['ErrorMessage'])
        else:
            data = response_data['ParsedResults'][0]['ParsedText'].replace("\n"," ")
            #print(data)
            return data
    except requests.exceptions.ConnectionError as e:
        return "Network Error"

#for adhar

def aadhar_details(ocr_text):

    aadhar_detals1 = []
    adhar_number_patn = '[0-9]{4}\s[0-9]{4}\s[0-9]{4}'
    match = re.search(adhar_number_patn, ocr_text)
    if match:
        aadhar_detals1.append(match.group())
    else:
        aadhar_detals1.append(None)

    pattern1 = r"(?i)Government of India\s+se\s([A-Za-z\s.'-]+)(?=\s+g|$)"
    #pattern2 = r"(?i)GOVERNMENT OF INDIA\s*([A-Za-z\s.'-]+)(?=\s+Father|$)"
    pattern3 = r"(?i)India\s*([A-Za-z\s.'-]+)(?=\s|$)"
    #print(ocr_text)
    # Search for the first match of the name regex in the string
    match = re.findall(pattern1, ocr_text)
    #match1 = re.search(pattern2, ocr_text)
    match3 = re.search(pattern3, ocr_text)
    # If a match is found, print the name
    if match:
         print(match)
         aadhar_detals1.append(match[0])
    #elif match1:
        #aadhar_detals1.append(match1[0])
    elif match3:
        # print(type(match3))
        # aadhar_detals1.append(match3.group().split(")
         a = match3.group().split(' ')
         b = a[1]
         c = a[2]
         aadhar_detals1.append(b + ' ' + c)
    else:
        aadhar_detals1.append(None)

    dob_patn = 'DOB: \d{2}+[-/]\d{2}+[-/]\d{4}+'
    #if 'DOB' in ocr_text:
    match = re.search(dob_patn, ocr_text)
    if match:
        #print(match)
        aadhar_detals1.append(match.group().split(' ')[1])
    else:
        aadhar_detals1.append(None)
        
    GENDER = ''
    a = ocr_text.split(' ')
    if 'Male' in a or 'MALE' in a or'male' in a:
        GENDER = 'Male'
    elif 'Female' in a or 'FEMALE' in a or 'female' in a:
        GENDER = 'Female'
    else:
        GENDER = None
    aadhar_detals1.append(GENDER)
    return aadhar_detals1

    # Gender = 'male|Male|female|Female|FEMALE|MALE'
    # match = re.search(Gender, ocr_text)
    # if match:
    #     #print("buhbbbbbb:",match)

    #     aadhar_detals1.append(match.group().lower())
    # else:
    #     aadhar_detals1.append(None)


def aadhar_backDetails(ocr_text):
    # pattern1 = r'(?<=Unique ldentification Authority of India\s).*\d{6}'
    # pattern2 = r'(?<=Address:\s).*?(?=\s*help@uidai\.gov\.in)'
    # pattern3 = r'(?<=SAddress:\s).*?(?={0-9}{4})'
    #pattern3 = r"(?i)\s*([A-Za-z\s.'-]+)(?=\s|$)"
    a = ocr_text.replace('•', '')
    

    #pattern3 = r'(?<=Address:\s).*?(?=\s+[0-9])'
    pattern3 = r'(?<=Address:\s).*?[0-9]{6}+(?=\s)'


    # result = re.findall(pattern1,ocr_text)
    # result1 = re.findall(pattern2,ocr_text)
    #result2 = re.search(pattern3,a)
    result2 = re.findall(pattern3,a)
    print(result2)
    if result2:
        data = (result2[0])
        print(data)
        return data
    # elif result1:
    #     return result1[0]
    # elif result2:
    #     return result2[0]
    else:
        return None
    
        
def find_adhar_number(ocr_text):
    adhar_number_patn = '[0-9]{4}\s[0-9]{4}\s[0-9]{4}'
    match = re.search(adhar_number_patn, ocr_text)
    if match:
        return match.group()

def chech_aadhar_front_image(data):
    if(find_adhar_number(data) != None and "Address" not in data):
        return True
    else:
        return False



# for pancard
def find_pan_number(ocr_text):
    pan_number_patn = '[A-Z]{5}[0-9]{4}[A-Z]{1}'
    pan_number_patn1 = '[A-Z]{5}[0-9]{4}+\s+[A-Z]{1}'
    match = re.search(pan_number_patn, ocr_text)
    match1 = re.search(pan_number_patn1,ocr_text)
    if match:
        return match.group()
    else:
        if match1:
            
            return match1.group().replace(" ","")

def chech_pan_image(data):
    print(find_pan_number(data))
    if(find_pan_number(data)):
        return True
    else:
        return False

def find_pan_name(ocr_text):
    pattern = r"(?i)Name\s*([A-Za-z\s.'-]+)(?=\s+Permanent|$)"
    

# Extract name using regular expression
    match = re.findall(pattern, ocr_text)
    

    # If a match is found, print the name
    if match:
        return(match[0])
    
def find_pan_fatherName(ocr_text):
    pattern = r"(?i)Fathers\s+Name\s*([A-Za-z\s.'-]+)(?=\s+Date of Birth|$)"
    pattern1 = r"(?i)Father's\s+Name\s*([A-Za-z\s.'-]+)(?=\s+Date of Birth|$)"

# Extract name using regular expression
    match = re.findall(pattern, ocr_text)
    match1 = re.findall(pattern1, ocr_text)
    # If a match is found, print the name
    if match:
        return(match[0])
    else:
        if match1:
            return match1[0]
    
def find_dob(ocr_text):
    """Function to find date of birth inside the image

    Args:
    ocr_text (list): text from the ocr

    Returns:
    str: Date of birth
    """
    dob_patn = '\d{2}+[-/]\d{2}+[-/]\d{4}+'
    #yob_patn = r"(?<=Year of Birth: )\d{4}"
    DateOfBirth = ''
    #if 'DOB' in ocr_text:
    match = re.search(dob_patn, ocr_text)
    match1 = re.search(r"(?<=Year of Birth: )\d{4}", ocr_text)
    if match:
        DateOfBirth = match.group()
        return DateOfBirth
    else:
        if match1:
            return match1.group()

def pan_details(ocr_text):
    return {
        "Pan_number":find_pan_number(ocr_text),
        "Name":find_pan_name(ocr_text),
        "Father_Name":find_pan_fatherName(ocr_text),
        "Dob":find_dob(ocr_text)
    }

def chech_aadhar_back_image(data):
    if(find_adhar_number(data) != None and "Address" in data):
        return True
    else:
        return False
    

def check_file_format(base64_text):
    return 'png' in base64_text or 'jpg' in base64_text or 'jpeg'
