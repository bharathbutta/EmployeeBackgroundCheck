import React from "react";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/Businessman-amico.png";
import Navbar from "./Navbar";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom'
import httpClients from "../Login/httpClients";
import Swal from 'sweetalert2'
import { CLoadingButton } from '@coreui/react-pro'
import Loader from "../Assets/Pulse-0.6s-50px.gif"

import Popup from 'reactjs-popup';
import { FaSleigh } from "react-icons/fa";


const Home = () => {
  const [selectValue, setSelectValue] = React.useState("default");
  const [selectedFrontImg, setSelectedFrontImg] = React.useState("");
  const [selectedBackImg, setSelectedBackImg] = React.useState("");
  const [selectedPanImg, setSelectedPanImg] = React.useState("");
  const [loaderStatus, setLoaderStatus] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState('')
  const[checkBoxValue, setCheckBoxValue ]=React.useState(false)
  const navigate = useNavigate();

  const newsAPIFn = async (data) => {
    const newsData = await httpClients.post("http://127.0.0.1:5000/apidata/newsapi", {
      Name: data.Name,
      Address: selectValue === 'Aadhar' ? data.Address : ''
    });

    localStorage.setItem('newsPoints', JSON.stringify(newsData.data.newsapi_points))
  }

  const courtAndNewsAPICalls = async (data) => {
    const courtData = await httpClients.post("http://127.0.0.1:5000/apidata/courtapi", {
      Name: data.Name
    });
    console.log('cccccc', courtData)
    localStorage.setItem('courtPoints', JSON.stringify(courtData.data.courtapi_points))
    await newsAPIFn(data)
  }
  const popupFun = () => {
    Swal.fire(
      'Sorry!! There was a error communicate with API Please try after sometime.'
    )
  }

  const submitDoc = async () => {
    //clearInterval(int)

    // Swal.fire(
    //   'Sorry!! There was a error communicate with API.'
    // )
    if (selectedPanImg) {
      setLoaderStatus(true)

      try {
        const empData = await httpClients.post("http://127.0.0.1:5000/apidata/PanImgScan", {
          image: selectedPanImg
        });
        console.log(empData.data.error)
        if (empData.data.error) {
          setLoaderStatus(false)
          console.log('errrrrrrrr')
          setErrorMsg(empData.data.error)
        } else {
          localStorage.setItem('empDetails', JSON.stringify(empData.data.data))
          await courtAndNewsAPICalls(empData.data.data)
          setLoaderStatus(false)
          setSelectedPanImg('')
          navigate("/information");
        }
      } catch {
        setLoaderStatus(false)

        console.log('afeterrrr')
        console.log('elseeeee')
        setTimeout(popupFun, 1000)
        //window.location.reload()
      }

    } else {
      setLoaderStatus(true)
      try{
      const empData = await httpClients.post("http://127.0.0.1:5000/apidata/adharImgScan", {
        image: selectedFrontImg,
        image1: selectedBackImg,
      });
      if (empData.data.error) {
        setLoaderStatus(false)
        console.log('errrrrrrrr')
        setErrorMsg(empData.data.error)
      } else {
      setLoaderStatus(false)
      console.log('emp', empData)
      // const aadharDetails={
      //   "Aadhar_number": "8632 2061 4130",
      //   "Address": " o Teangana ",
      //   "Dob": "19/07/2001",
      //   "Gender": "Male",
      //   "Name": "Butta Bharath"
      // }
      localStorage.setItem('empDetails', JSON.stringify(empData.data.data))
      setSelectedFrontImg('')
      setSelectedBackImg('')
      navigate("/information");
      }

    }catch {
      setLoaderStatus(false)

      console.log('afeterrrr')
      console.log('elseeeee')
      setTimeout(popupFun, 1000)
      //window.location.reload()
    }

  }}
  const frontImageUploadOnChange = async (event) => {
    //console.log('upload', event.target.value)
    if (event.target.files && event.target.files[0]) {
      //setSelectedFrontImg(URL.createObjectURL(event.target.files[0]));

      const file = event.target.files[0];
      const base64 = await convertBase64(file);
      setSelectedFrontImg(base64);


      // const file = event.target.files[0]
      // const reader = new FileReader()

      // reader.onloadend = () => {
      //   setSelectedFrontImg(reader.result.toString());
      // }
      // reader.readAsDataURL(file)
      // console.log(file)
    }
    //setSelectedFrontImg(event.target.value)

  }
  const backImageUploadOnChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      //setSelectedBackImg(URL.createObjectURL(event.target.files[0]));
      const file = event.target.files[0];
      const base64 = await convertBase64(file);
      setSelectedBackImg(base64);






      // const file = event.target.files[0]
      // const reader = new FileReader()

      // reader.onloadend = () => {
      //   setSelectedBackImg(reader.result.toString());
      // }
      // reader.readAsDataURL(file)
      // console.log(file)

    }
    //setSelectedBackImg(event.target.value)

  }
  const panImageUploadOnChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      //setSelectedPanImg(URL.createObjectURL(event.target.files[0]));

      const file = event.target.files[0];
      const base64 = await convertBase64(file);
      setSelectedPanImg(base64);


      // const file = event.target.files[0]
      // const reader = new FileReader()

      // reader.onloadend = () => {
      //   setSelectedPanImg(reader.result.toString());
      // }
      // reader.readAsDataURL(file)
      // console.log(file)
    }
    //setSelectedPanImg(event.target.value)
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const checkBoxStatus =()=>{
    setCheckBoxValue(true)
  }

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    window.location.href = "/login";

    // navigate("/", { replace: true })
  }
  // else if (jwtToken) {
  //   window.location.href = "/home";
  // }
  const onChangeDocTypeVal = (event) => {
    localStorage.setItem('selectedDocType', JSON.stringify(event.target.value))
    setSelectValue(event.target.value);
  }

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>

        <div className="home-text-section">
          <h1 className="primary-heading">Character Check</h1>
          <label style={{ marginLeft: "10px" }} htmlFor="slct">
            Please select required documnet*
          </label>

          <div className="select">
            <select name="slct" id="slct" onChange={onChangeDocTypeVal}>
              <option value='default' selected>Select required documnet</option>
              <option value='Aadhar'>Aadhar Card</option>
              <option value='Pan'>Pan Card</option>
            </select>
          </div>
          {selectValue === 'Aadhar' && (
            <div>
              <label style={{ marginLeft: "10px" }} htmlFor="aadharFront">Upload Aadhar Front Image*</label>
              <div style={{ marginBottom: "10px" }} className="uploadImageStyle">
                <input id="aadharFront" type="file" accept="image/*" onChange={frontImageUploadOnChange} />
              </div>
              <label style={{ marginLeft: "10px" }} htmlFor="aadharFront">Upload Aadhar Back Image*</label>
              <div className="uploadImageStyle">
                <input id="aadharFront" type="file" accept="image/*" onChange={backImageUploadOnChange} />
              </div>
              <div className="terms">
              <input type="checkbox" onClick={checkBoxStatus}/><p style={{ marginLeft: "10px", color: "blue", textDecoration: "underline"}}>Accept Tearms and Conditons</p>
              </div>
              {errorMsg && <p Style='color:red'>*{errorMsg}</p>}
              { !loaderStatus   ? (<button
                // disabled="frontImageBtnStatus"
                type="button"
                className={selectedFrontImg && selectedBackImg && checkBoxValue ? "save-btn" : "disabledBtn"}
                onClick={submitDoc}
              >
                Submit
              </button> )
             :(<img

              src={Loader}

              alt="Loading.."

            />)}
            </div>)}
          {selectValue === 'Pan' && (<div>
            <label style={{ marginLeft: "10px" }} htmlFor="aadharFront">Upload Pan Card*</label>
            <div className="uploadImageStyle">
              <input id="aadharFront" type="file" accept="image/*" onChange={panImageUploadOnChange} />
            </div>
            <div className="terms">
            <input type="checkbox" onClick={checkBoxStatus}/><p style={{ marginLeft: "10px", color: "blue", textDecoration: "underline"}}>Accept Tearms and Conditons</p>
            </div>
            {errorMsg && <p Style='color:red'>*{errorMsg}</p>}
            { !loaderStatus   ? (<button

              type="button"
              onClick={submitDoc}
              className={selectedPanImg && checkBoxValue ? "save-btn" : "disabledBtn"}
            >
              Submit

            </button>)
             :(<img

              src={Loader}

              alt="Loading.."

            />)}
          </div>)}
          {/* <img alt="preview image" src={selectedBackImg}/> */}
          {/* <button className="secondary-button">Submit</button> */}
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div >
      {/* <Display />
      <Footer /> */}
    </div >
  );
};

export default Home;
