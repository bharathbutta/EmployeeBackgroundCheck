import React from "react";
import AboutBackground from "../Assets/about-background.png";
import AboutBackgroundImage from "../Assets/Visual data-pana.png";
import Navbar from "./Navbar";
import Cookies from "js-cookie";
import { useNavigate, Link } from 'react-router-dom'
import httpClients from "../Login/httpClients";
import Swal from 'sweetalert2'
import Loader from "../Assets/Pulse-0.6s-50px.gif"

const Information = () => {
const[loaderstatus, setloaderstatus]=React.useState(false)
  const navigate = useNavigate();

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    window.location.href = "/login";
  }


  let employeeData=JSON.parse(localStorage.getItem('empDetails'))
  let uploadedDocType=JSON.parse(localStorage.getItem('selectedDocType'))
  console.log("user",employeeData)

  const backgroundCheckAPICall=async()=>{
    setloaderstatus(true)
    try{
      const bgData = await httpClients.post("http://127.0.0.1:5001/fullbackgroundcheck/backgroundCheck", {
      court_api_points : JSON.parse(localStorage.getItem('courtPoints')),
      news_api_points : JSON.parse(localStorage.getItem('newsPoints')),
    Name : employeeData.Name,
    Address: uploadedDocType==='Aadhar' ? employeeData.Address : '',
    Dob: employeeData.Dob,
    userId:JSON.parse(localStorage.getItem('userId'))

  });

  localStorage.setItem('totalPer',JSON.stringify(bgData.data['total percent']))
  setloaderstatus(false)
  navigate("/backgroundcheck")
}catch{
  setloaderstatus(false)
  Swal.fire(
    'Sorry!! There was a error communicate with API Please try after sometime.'
  )
}
  
   
    
  //console.log("courtdata",courtData.data.courtapi_points)
}

  return (
    <div >
    <Navbar />
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        <img
          className="about-section-image"
          src={AboutBackgroundImage}
          alt=""
        />
      </div>
      <div className="about-section-text-container">
        {/* <p className="primary-subheading">Display</p> */}
        <h1 className="employe-heading">Person Information</h1>
        {/* <p className="primary-text">
          Optical Character Recognition (OCR) is the process that converts an
          image of text into a machine-readable text format. For example, if you
          scan a form or a receipt, your computer saves the scan as an image
          file
        </p> */}
        {uploadedDocType==='Aadhar' && (<ul className="numb" >
          <li>Name: {employeeData.Name}</li>
          <li>Aadhar Number: {employeeData.Aadhar_number}</li>
          <li>Address:{employeeData.Address}</li>
          <li>Dob: {employeeData.Dob}</li>
          <li>Gender: {employeeData.Gender}</li>
        </ul>)}
        {uploadedDocType==='Pan'  && (<ul className="numb" >
          <li>Name: {employeeData.Name}</li>
          <li>Pan Number: {employeeData.Pan_number}</li>
          <li>Father Name:{employeeData.Father_Name}</li>
          <li>Dob: {employeeData.Dob}</li>
        </ul>)}
        {/* <p className="primary-text">
          Non tincidunt magna non et elit. Dolor turpis molestie dui magnis
          facilisis at fringilla quam.
        </p> */}
        <div  className="about-buttons-container" >
          {/* <Link  Style="text-decoration: none" to ={"/backgroundcheck"}> */}
          {!loaderstatus ? (<button className="secondary-button" onClick={backgroundCheckAPICall}>Background Check</button>
          )
             :(<img

              src={Loader}

              alt="Loading.."

            />)}
          {/* </Link> */}
            {/* <Link   Style="text-decoration: none" to ={"/quickcheck"}>
            <button className="secondary-button"Style="margin-left:50px">Quick Check</button>
            </Link> */}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Information;
