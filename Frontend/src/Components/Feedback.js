import React , { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Employeepng from "../Assets/Online Review-cuate.png";
import BannerBackground from "../Assets/home-banner-background.png";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import httpClients from '../Login/httpClients';
import Swal from 'sweetalert2'
import { Link } from "react-router-dom";

function Feedback() {

  const [value1, setValue1] = React.useState (0);
  const [value2, setValue2] = React.useState (0);
  const [value3, setValue3] = React.useState (0);
  const [empId,setEmpId] = React.useState('')
  const [errormsg,seterrormsg] = React.useState('')


  let existingEmpDetails = JSON.parse(localStorage.getItem('existingEmpNames'))

  // useEffect(async () => {
  //   const empList = await httpClients.post("http://127.0.0.1:5002/loginService/employeeList", {
  //     userId:4


  // });
//   console.log('res1',empList.data)
//   setRes(empList.data)
// // fetchMyAPI()
//   },[]);

  // useEffect(()=>{
  // if (res){
  //   console.log('res2',res)
  //   setEmployeeName(res)
  // }
  // },[res])
  
  // dropdown

  // const [age, setAge] = React.useState('');

  // const handleChange = (event) => {ocao
  //   setAge(event.target.value);
  // };

const feedbackSumbit =async()=>{
  const feedbackData = await httpClients.post("http://127.0.0.1:5002/loginService/feedback", {
    userId:JSON.parse(localStorage.getItem('userId')),
    empId:empId,
    feedback1:value1,
    feedback2:value2,
    feedback3:value3,
});

const empList = await httpClients.post("http://127.0.0.1:5002/loginService/employeeList", {
  userId:JSON.parse(localStorage.getItem('userId'))
});
localStorage.setItem('existingEmpNames',JSON.stringify(empList.data))
if (feedbackData.data.message=="you have already given feedback for this employee"){
  seterrormsg("you have already given feedback for this employee")
}else{
  seterrormsg("")
  success()
}


}

const success =() =>{
  Swal.fire(
    'Good job!',
    'You have successful submitted feedback!',
    'success'
  )
}



const onChangeEmpData=(event)=>{
  if (event.target.value){
    setEmpId(event.target.value)
    //localStorage.setItem('selectedEmpId',JSON.stringify(event.target.value))
  }

}

  return (
    <div>
      <Navbar />
      <div className="">
      <div className="feedback-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section2" >
        {existingEmpDetails.length>0 ? (
          <>
        <div className="select">
            <select name="slct" id="slct" onChange={onChangeEmpData}>
              <option value='' selected>Select Employee</option>
              {existingEmpDetails && existingEmpDetails.map((i)=>
                <option value={i.empId}>{i.empName}</option>
              )}
              {/* <option value='Aadhar'>{[0].empName}</option>
              <option value='Pan'>Pan Card</option> */}
            </select>
          </div>
          <h1 className="employe-heading" >Employee Feedback</h1>
          <div>
          
            <h1 className="primary-heading2">Was the employee involved in any disputes with other employee(s)?</h1>
           
              <Rating
                name="simple-controlled"
                value={value1}
                onChange={(event, newValue) => {
                  setValue1(newValue);
                }}
              />
           
          </div>
          <div>
            <h1 className="primary-heading2">Was the employee involved in any disputes with other employee(s)?</h1>
           
              <Rating
                name="simple-controlled"
                value={value2}
                onChange={(event, newValue) => {
                  setValue2(newValue);
                }}
              />
           
          </div>
          <div>
            <h1 className="primary-heading2">Was the employee involved in any disputes with other employee(s)?</h1>

              <Rating
                name="simple-controlled"
                onChange={(event, newValue) => {
                  setValue3(newValue);
                }}
              />
          </div>
          {errormsg && <p Style='color:red;'>*{errormsg}</p>}
        
          <button className={value1 && value2 && value3 && empId ? "save-btn" : "disabledBtn"} onClick={feedbackSumbit}>Submit</button>
          </>
        ):(<p>No employess found to give feedback <Link to = {"/home"}> plase check employee background.</Link></p>)}
          <div className="feedbackpng">
            <img src={Employeepng} alt="" />
          </div>
        </div>
      </div>
    </div>

  )
}

export default Feedback