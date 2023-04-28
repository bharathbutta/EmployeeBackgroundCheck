import React from 'react'
import Navbar from './Navbar'
import Cookies from 'js-cookie'
import BannerBackground from "../Assets/home-banner-background.png";
import Employeepng from "../Assets/Internship-amico.png";
import AboutBackground from "../Assets/about-background.png";
import { render } from "react-dom";


import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";






function Example(props) {
  
  return (
    <div style={{ marginBottom: 80 }}>
      {/* <hr style={{ border: "2px solid #ddd" }} /> */}
      <div style={{ marginTop: 25, display: "flex" }}>
        <div style={{ width: "30%", paddingRight: 40 }}>{props.children}</div>
        <div style={{ width: "70%" }}>
          <h3 className="h5"></h3>
          <p>{props.description}</p>
        </div>
      </div>
    </div>
  );
}

const Backgroundcheck = () => {
  const percentage = JSON.parse(localStorage.getItem('totalPer'));
  console.log(percentage)

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    window.location.href = "/login";
  }

  return (
    
    <div >
      <Navbar></Navbar>

        <div >

              <div className="backgroundcheck-container">
        <img src={AboutBackground} alt="" />
      </div>
      <h2 className='bglabel'>Background Check</h2>
      <div style={{ padding: "40px 40px 40px 40px" }}>
    <Example>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          textColor: "black",
          pathColor: "#5995fd",
          trailColor: "grey"
        })}
      />
      </Example>
        </div>
    
    {/* <div class="ui-widgets">
            <div class="ui-values">85%</div>
            <div class="ui-labels">Safe</div>
        </div> */}
        <div className="backgroundcheckpng">
            <img src={Employeepng} alt="" />
          </div>
        </div>
    </div>
  )
}

export default Backgroundcheck
