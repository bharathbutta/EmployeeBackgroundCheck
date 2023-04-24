import React from 'react'
import Navbar from './Navbar'
import Cookies from 'js-cookie';
import BannerBackground from "../Assets/wave.svg";

function Quickcheck() {

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    window.location.href = "/login";
  }

  return (
    <div>
    <Navbar/>
    <div className="quick-container">
          <img src={BannerBackground} alt="" />
        </div>
    <h2 className='bglabel'></h2>
  <div class="ui-widgets">
          <div class="ui-values">85%</div>
          <div class="ui-labels">Safe</div>
      </div>
      
  </div>

  )
}

export default Quickcheck