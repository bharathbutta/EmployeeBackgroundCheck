import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiFillMessage } from "react-icons/ai";
import Loginimg from "../Assets/undraw_learning_sketching_nd4f.svg";
import httpClients from "./httpClients";

const Register = () => {
  const [username, usernamechange] = useState("");
  const [password, passwordchange] = useState("");
  const [confirmpassword, confirmpasswordchange] = useState("");
  const [email, emailchange] = useState("");
  const[code, setOtpVerfiy] = useState("");
  const [sucessMsg, setSucessMsg] = useState("");
  const [errorHandle, errorMessage] = useState("");
  const [emailVerfiySucessfully, setEmailVerfiySucessfully] = useState(false);



  const navigate = useNavigate();
  // const emailVerfication = async () => {
  //   const response =  await httpClients.post("http://127.0.0.1:5002/otpverification", {
  //                  email,
  //               });
  // };
  const verifyMail=async()=>{
    const response =  await httpClients.post("http://127.0.0.1:5002/otpverification", {
                   email,
                });
      console.log('email',response)
      if (response.data.success =='Otp sent Successfully') {
        setSucessMsg (response.data.success)
      }
  }

  const onClickVerfiyOtp = async()=> {
    const response = await httpClients.post("http://127.0.0.1:5002/verify",{
       code,
        })

        if (response.data.sucess == "OTP verfied") {
          errorMessage('OTP verfied')
          setSucessMsg ('')
          setEmailVerfiySucessfully(true)
        
        } else{
          errorMessage("Invalid Verification Code")
        }
  }

  const regUser = async () => {
    // event.preventDefault()

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
    else if (username !== '' && password !== '' && email !== '' && emailVerfiySucessfully == false) {
      //errorMsgStatus(true)
      errorMessage('Please verfiy your email')
    }

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
    const emailVerfication = await httpClients.post("http://127.0.0.1:5002/otpverification", {
      email,
    });
  };

  const onChangeUserName = (e) => {
    usernamechange(e.target.value)
    errorMessage("")
  }
  const onChangeEmail = (e) => {
    emailchange(e.target.value)
    errorMessage("")
  }
  const onChangePassword = (e) => {
    passwordchange(e.target.value)
    errorMessage("")
  }

  return (
    <div>
      <div className="container1">
        <div className="forms-container1">
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
                    onChange={onChangeUserName}
                    type="text"
                    placeholder="Username"
                  ></input>
                </div>
                <div>
                  <div className="input-field1">
                    <i>
                      <MdEmail />
                    </i>
                    <input
                      value={email}
                      onChange={onChangeEmail}
                      type="email"
                      placeholder="Email"
                    ></input>
                  <button className="verfiy-button" onClick={verifyMail}>Sent otp</button>
                  </div>
                </div>

            {  sucessMsg &&   <div>
                  <div className="input-field1">
                    <i>
                      <AiFillMessage />
                    </i>
                    <input
                      value={code}
                      onChange={(e) => setOtpVerfiy(e.target.value)}
                      type="text"
                      placeholder="OTP Verfication"
                    ></input>
                  <button className="verfiy-button" onClick ={onClickVerfiyOtp}>verfiy</button>
                  </div>
                </div>}

                <div>
                  <div className="input-field">
                    <i>
                      <FaLock />
                    </i>
                    <input
                      value={password}
                      onChange={onChangePassword}
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
              <button id="btnlogin" className="btn solid" onClick={regUser}>
                Register
              </button>{" "}
            </div>
          </div>
        </div>
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
