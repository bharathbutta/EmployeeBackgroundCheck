import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Loginimg from "../Assets/undraw_learning_sketching_nd4f.svg";
import httpClients from "./httpClients";

const Register = () => {
  const [username, usernamechange] = useState("");
  const [password, passwordchange] = useState("");
  const [confirmpassword, confirmpasswordchange] = useState("");
  const [email, emailchange] = useState("");
  const [errorHandle, errorMessage] = useState("");

  const navigate = useNavigate();

  const regUser = async (event) => {
    event.preventDefault()

    if (password !== confirmpassword) {
      errorMessage('Password did not match')
    }
    else if (username == '' && password == '' && email == '') {
      errorMessage('Please enter username, password and email')
      //errorMsgStatus(true)
    }
    else if (username !== '' && password == '' && email == '') {
      //errorMsgStatus(true)
      errorMessage('Please enter password and email')
    } else if (username !== '' && password !== '' && email == '') {
      //errorMsgStatus(true)
      errorMessage('Please enter email')
    }
    else if (username == '' && password !== '' && email !== '') {
      //errorMsgStatus(true)
      errorMessage('Please enter username')
    } else if (username !== '' && password == '' && email !== '') {
      //errorMsgStatus(true)
      errorMessage('Please enter password')
    } else if (username == '' && password !== '' && email == '') {
      //errorMsgStatus(true)
      errorMessage('Please enter username and email')
    } else if (username == '' && password == '' && email !== '') {
      //errorMsgStatus(true)
      errorMessage('Please enter username and password')
    }
    // else if (username == '' && password == '' && email == '' && confirmpassword !== '') {
    //   //errorMsgStatus(true)
    //   errorMessage('Please enter confirm password')
    // }

    else {
      const loginRes = await httpClients.post("http://127.0.0.1:5002/loginService/register", {
        email,
        username,
        password,
      });
      console.log('reg',loginRes)
      if (loginRes.data.message) {
        console.log("dkkdi")
        errorMessage('')
        window.location.href = "/login";
      } else {
        errorMessage(loginRes.data.error)
      }
    }
  };


  return (
    <div>
      <div className="container1">
        <form className="forms-container1" onSubmit={regUser}>
          <div className="signin-signup">
            <h1 className="title">Sign up</h1>

            <div className="card-body">
              <div>
                <div className="input-field">
                  <i>
                    <FaUser />
                  </i>
                  <input
                    value={username}
                    onChange={(e) => usernamechange(e.target.value)}
                    type="text"
                    placeholder="Username"
                  ></input>
                </div>
                <div>
                  <div className="input-field">
                    <i>
                      <MdEmail />
                    </i>
                    <input
                      value={email}
                      onChange={(e) => emailchange(e.target.value)}
                      type="email"
                      placeholder="Email"
                    ></input>
                  </div>
                </div>
                <div>
                  <div className="input-field">
                    <i>
                      <FaLock />
                    </i>
                    <input
                      value={password}
                      onChange={(e) => passwordchange(e.target.value)}
                      type="password"
                      placeholder="Password"
                    ></input>
                  </div>
                  {password && <div className="input-field">
                    <i>
                      <FaLock />
                    </i>
                    <input
                      value={confirmpassword}
                      onChange={(e) => confirmpasswordchange(e.target.value)}
                      type="password"
                      placeholder="Confirm Password"
                    ></input>
                  </div>}
                </div>
                <div>
                  {/* <div className="input-field">
                    <i>
                      <FaLock />
                    </i>
                    <input
                      value={password}
                      onChange={(e) => passwordchange(e.target.value)}
                      type="password"
                      placeholder="Confirm Password"
                    ></input>
                  </div> */}
                </div>
                {/* <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Full Name <span className="errmsg">*</span></label>
                                        <input value={name} onChange={e => namechange(e.target.value)} className="form-control"></input>
                                    </div>
                                </div> */}

                {/* <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Phone <span className="errmsg"></span></label>
                                        <input value={phone} onChange={e => phonechange(e.target.value)} className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Country <span className="errmsg">*</span></label>
                                        <select value={country} onChange={e => countrychange(e.target.value)} className="form-control">
                                            <option value="india">India</option>
                                            <option value="usa">USA</option>
                                            <option value="singapore">Singapore</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label>Address</label>
                                        <textarea value={address} onChange={e => addresschange(e.target.value)} className="form-control"></textarea>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <br></br>
                                        <input type="radio" checked={gender === 'male'} onChange={e => genderchange(e.target.value)} name="gender" value="male" className="app-check"></input>
                                        <label>Male</label>
                                        <input type="radio" checked={gender === 'female'} onChange={e => genderchange(e.target.value)} name="gender" value="female" className="app-check"></input>
                                        <label>Female</label>
                                    </div>
                                </div> */}
              </div>
            </div>
            <div>
              {errorHandle && <p Style='color:red;padding-left:14px;'>*{errorHandle}</p>}
              <button id="btnlogin" type="submit" className="btn solid">
                Register
              </button>{" "}
            </div>
          </div>
        </form>
        <div className="panels-container1">
          <div className="panel left-panel">
            <div className="content">
              <h2 className="panel-title">Background Checker</h2>
              <p>
                <b className="text-size">Existing user !! </b> Please login to
                obtain background information about a person.
              </p>
              <Link to={"/login"}>
                <button className="btn transparent" id="sign-up-btn">
                  Login
                </button>
              </Link>
            </div>
            <img id="signimg" src={Loginimg} alt="" />
          </div>
          {/* <div class="panel right-panel">
          <div class="content">
            <h3>One of us ?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              laboriosam ad deleniti.
            </p>
            <button class="btn transparent" id="sign-in-btn">
              Sign in
            </button>
            
          </div>
          <img src="img/register.svg" class="image" alt="" />
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default Register;
