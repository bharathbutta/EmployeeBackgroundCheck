import "./App.css";
import Home from "./Components/Home";
// import Work from "./Components/Work";
// import Testimonial from "./Components/Testimonial";
// import Contact from "./Components/Contact";
import Information from "./Components/Information";
import Backgroundcheck from "./Components/Backgroundcheck"

import Login from "./Login/login";
import Register from "./Login/register";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Quickcheck from "./Components/Quickcheck";
import Feedback from "./Components/Feedback";
import Cookies from "js-cookie";

function App() {
  
  let authKey = Cookies.get('jwt_token')
  let currentPath = window.location.pathname

  return (
    <div className="App">
      {/* <ToastContainer></ToastContainer> */}
      <BrowserRouter>
        <Routes>
          <Route exact path ="/login" element={authKey ? <Navigate to='/home'/> : <Login />}></Route>
          <Route exact path="/home" element={<Home/>}></Route>
          <Route exact path="/register" element={authKey ? <Navigate to='/home'/> : <Register />}></Route>
          <Route exact path="/information" element={<Information />}></Route>
          <Route exact path="/backgroundcheck" element={<Backgroundcheck />}></Route>
          <Route exact path="/Feedback" element={<Feedback />}></Route>
          <Route exact path="/quickcheck" element={<Quickcheck />}></Route>
          <Route path='/' element={<Navigate to='/login' />} />
          {/* <Route path='*' element={<Navigate to='/' />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
