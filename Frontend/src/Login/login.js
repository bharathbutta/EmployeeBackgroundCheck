import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaLock } from "react-icons/fa";
import Loginimg from "../Assets/log.svg";
import httpClients from "./httpClients";
import Cookies from 'js-cookie'

const Login = () => {
  const [username, usernameupdate] = useState("");
  const [password, passwordupdate] = useState("");
  const [errorHandle, errorMessage] = useState("");
  //const [showErrorMsg, errorMsgStatus] = useState(false)

  // useEffect(()=>{
  //   if (showErrorMsg){
  //     errorMessage(errorText)
  //   }
  // },[])

  // const logInUser = async () => {
  //   console.log(username, password);

  //   try {
  //     const loginRes = await httpClients.post("http://127.0.0.1:5000/login", {
  //       username,
  //       password,
  //     });

  //     console.log(loginRes);

  //     window.location.href = "/home";
  //   } catch (error) {
  //     if (error.response.status === 401) {
  //       alert("Invalid credentials");
  //     }
  //   }
  // };
  // const onSubmitSuccess = jwtToken => {
  //   console.log("sucess")
  //   // const { history } = this.props
  //   // localStorage.setItem('jwt_token', jwtToken)
  //   localStorage.setItem('jwt_token', jwtToken)
  //   // history.replace('/home')
  //   window.location.href = "/home";
  // }

  const onSubmitSuccess = async jwtToken => {
    errorMessage('')
    const empList = await httpClients.post("http://127.0.0.1:5002/loginService/employeeList", {
       userId:JSON.parse(localStorage.getItem('userId'))
   });
   localStorage.setItem('existingEmpNames',JSON.stringify(empList.data))
  //console.log(jwtToken)
    // const history  = useNavigate

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    // history.replace('/home')
    // Navigate("/home", { replace: true })
    window.location.href = "/home";
  }


  const onSubmitFailure = errorMsg => {
    //this.setState({ showSubmitError: true, errorMsg })
    errorMessage(errorMsg)
    //errorMsgStatus(true)
  }


  const submitForm = async event => {
    event.preventDefault()
    if (username == '' && password == '') {
      errorMessage('Please enter username and password')
      //errorMsgStatus(true)
    }
    else if (username !== '' && password == '') {
      //errorMsgStatus(true)
      errorMessage('Please enter password')
    } else if (username == '' && password !== '') {
      //errorMsgStatus(true)
      errorMessage('Please enter username')
    }

    //errorMsgStatus(false)
    else {
      const loginRes = await httpClients.post("http://127.0.0.1:5002/loginService/login", {
        username,
        password,
      });
      //console.log("response",loginRes.data)
      // const data = await response.json()
      if (loginRes.data.id) {
        //console.log("response",loginRes.data)
        localStorage.setItem('userId',JSON.stringify(loginRes.data.id))
        //localStorage.setItem('userName',JSON.stringify(loginRes.data.username))
        onSubmitSuccess(loginRes.data.id)

      } else {
        
        onSubmitFailure(loginRes.data.error)
      }
    }
  }

  // useEffect(() => {
  //   sessionStorage.clear();
  // }, []);

  // const ProceedLogin = (e) => {
  //   e.preventDefault();
  //   if (validate()) {
  //     ///implentation
  //     // console.log('proceed');
  //     fetch("http://localhost:3004/user/" + username)
  //       .then((res) => {
  //         return res.json();
  //       })
  //       .then((resp) => {
  //         //console.log(resp)
  //         if (Object.keys(resp).length === 0) {
  //           toast.error("Please Enter valid username");
  //         } else {
  //           if (resp.password === password) {
  //             toast.success("Success");
  //             sessionStorage.setItem("username", username);
  //             sessionStorage.setItem("userrole", resp.role);
  //             usenavigate("/home");
  //           } else {
  //             toast.error("Please Enter valid credentials");
  //           }
  //         }
  //       })
  //       .catch((err) => {
  //         toast.error("Login Failed due to :" + err.message);
  //       });
  //   }
  // };



  const validate = () => {
    let result = true;
    if (username === "" || username === null) {
      result = false;
      toast.warning("Please Enter Username");
    }
    if (password === "" || password === null) {
      result = false;
      toast.warning("Please Enter Password");
    }
    return result;
  };

  const onChangeUsernameupdate = (e) => {
    usernameupdate(e.target.value)
    errorMessage("")
  }

  const onChangePasswordupdate = (e) => {
    passwordupdate(e.target.value)
    errorMessage("")
  }


  return (
    <div className="container1">
      <div className="forms-container1">
        <form onSubmit={submitForm} className="signin-signup">
          <h2 className="title">Sign in</h2>

          <div className="card-body">
            <div className="input-field">
              <i>
                <FaUser />
              </i>
              <input
                value={username}
                onChange={onChangeUsernameupdate}
                type="text"
                placeholder="Username"
              ></input>
            </div>
            <div className="input-field">
              <i>
                <FaLock />
              </i>
              <input
                value={password}
                onChange={onChangePasswordupdate}
                type="password"
                placeholder="Password"
              ></input>
            </div>
          </div>
          {errorHandle && <p Style='color:red;padding-left:14px;'>*{errorHandle}</p>}
          <input
            id="btnlogin"
            type="submit"
            value="Login"
            className="btn solid"
          />
        </form>
        {/* <div className="card-footer"> */}
        {/* <button type="submit" className="btn btn-primary">Login</button>  */}
        {/* <Link className="btn btn-success" to={"/register"}>
            New User
          </Link>
        </div> */}

        <div className="panels-container1">
          <div className="panel left-panel">
            <div className="content">
              <h2 className="panel-title">Background Checker</h2>
              <p>
                <b className="text-size">New user !! </b>
                Please register to obtain background information about a person.
              </p>
              <Link to={"/register"}>
                <button className="btn transparent" id="sign-up-btn">
                  Sign up
                </button>
              </Link>
            </div>
            <img src={Loginimg} alt="" />
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

export default Login;
