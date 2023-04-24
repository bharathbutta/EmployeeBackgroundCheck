/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";


const Navbar = () => {

 const onClickLogout = () =>{
    Cookies.remove('jwt_token')
    window.location.href = "/login";
  }

  return (
    <nav>
      <div className="nav-logo-container">
        <h2>Employee Character Check</h2>
      </div>
      <div className="navbar-links-container">
        {/* <Link to = {"/login"}> */}

        <button onClick ={onClickLogout}className="logoutButton">Logout</button>
        {/* </Link> */}
      </div>
      <div class="hamburger-menu">
    <input id="menu__toggle" type="checkbox" />
    <label class="menu__btn" for="menu__toggle">
      <span></span>
    </label>

    <ul class="menu__box">
      <Link to ={"/home"} class="menu__item">
      {/* <li><a >Home</a></li> */}
      Home
      </Link>
      <Link  to ={"/Feedback"} class="menu__item">
      {/* <li><a class="menu__item">Feedback</a></li> */}
      Feedback
      </Link>
      <Link class="menu__item">
      {/* <li><a class="menu__item">Team</a></li> */}
      Team
      </Link>
      {/* <li><a class="menu__item" href="#">Contact</a></li> */}
      
    </ul>
  </div>
    </nav>
  );
};

export default Navbar;
