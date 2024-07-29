import img2 from "@/assets/images/authentication/2.png";
import img3 from "@/assets/images/authentication/3.png";
import desktoplogo from "@/assets/images/favicon.ico";
import { BaseCheckbox, BaseInput, Button } from "@/components";
import { LocalStorageBackup } from "@/components/common/switcher/switcherdata/switcherdata";
import BasePassword from "@/components/core/BasePassword";
import useAuthService from "@/hooks/useAuthService";
import { ThemeChanger } from "@/redux/action";
import { RootState } from "@/redux/store.tsx";
import { FC, Fragment, useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { connect, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { showToast } from "@/contexts/Toast.tsx";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

interface LoginProps {}

const Login: FC<LoginProps> = ({ ThemeChanger }: any) => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordFeedbackMessage, setPasswordFeedbackMessage] = useState("");
  const domain = useSelector((state: RootState) => state.domain);
  const defaultDashboard = useSelector(
    (state: RootState) => state.defaultDashboard
  );
  const { login, isAuthenticated } = useAuthService();
  const [data, setData] = useState({
    email: "",
    password: "",
    remember_me: false
  });
  const navigator = useNavigate();
  const { email, password, remember_me } = data;

  const changeHandler = (e: any) => {
    if (e.target.name === "remember_me") {
      setData({ ...data, [e.target.name]: e.target.checked });
      return;
    }
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event: {
    preventDefault: () => void;
    stopPropagation: () => void;
    currentTarget: { checkValidity: () => boolean };
  }) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget.checkValidity() === false) {
      setPasswordFeedbackMessage("The Password field is required");
      setValidated(true);
      return;
    }

    setLoading(true);
    login(email, password, remember_me)
      .then(() => {
        showToast("success", "Login Successful");
        navigator(`/${defaultDashboard}`, { replace: true });
      })
      .catch(error => {
        if (error.errors && error.errors.message) {
          setPasswordFeedbackMessage(error.errors.message[0]);
        } else {
          setPasswordFeedbackMessage("Something went wrong");
        }
      })
      .finally(() => setLoading(false));
  };

  const logoStyle = {
    height: "5rem"
  };

  useEffect(() => {
    if (isAuthenticated()) {
      navigator(`/${defaultDashboard}`, { replace: true });
    }
    LocalStorageBackup(ThemeChanger);
    const rootDiv = document.getElementById("root");
    if (rootDiv) {
      // rootDiv.className = 'grid grid-cols-12 gap-6 w-full';
    }
    return () => {
      if (rootDiv) {
        rootDiv.className = ""; // Remove the className when component unmounts
      }
    };
  }, []);

  return (
    <Fragment>
      <Helmet>
        <body className="bg-white"></body>
      </Helmet>
      <div className="row authentication mx-0">
        <Col xxl={7} xl={7} lg={12}>
          <div className="row justify-content-center align-items-center h-100">
            <Col
              xxl={6}
              xl={7}
              lg={7}
              md={7}
              sm={8}
              className="border-default border col-12"
            >
              <div className="p-5">
                <div className="mb-3">
                  <Link to={`${import.meta.env.BASE_URL}`}>
                    <img
                      src={desktoplogo}
                      alt=""
                      className="authentication-brand desktop-logo"
                      style={logoStyle}
                    />
                    <img
                      src={desktoplogo}
                      alt=""
                      className="authentication-brand desktop-dark"
                      style={logoStyle}
                    />
                  </Link>
                </div>
                <p className="h5 fw-semibold mb-2">
                  Sokrio Login -{" "}
                  <span className="text-secondary">{domain}</span>
                </p>
                {/*<p className="mb-3 text-muted op-7 fw-normal">Welcome Back</p>*/}
                {/*<div className="btn-list">
                                    <Button variant='light' className="btn"><svg className="google-svg" xmlns="http://www.w3.org/2000/svg" width="2443" height="2500" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262"><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" /><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" /><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" /><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" /></svg>Sign In with google</Button>
                                    <Button variant='light' className="btn btn-icon"><i className="ri-facebook-fill"></i></Button>
                                    <Button variant='light' className="btn btn-icon"><i className="ri-twitter-fill"></i></Button>
                                </div>*/}
                <div className="text-center my-5 authentication-barrier">
                  <span>Log in to your Sokrio DMS account</span>
                </div>
                <div className="row gy-3">
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                  >
                    <Col xl={12} className="mt-0">
                      <BaseInput
                        label="Email"
                        type="email"
                        name="email"
                        value={email}
                        placeholder="e.g. john@email.com"
                        suffix="@"
                        required={true}
                        autoComplete="email"
                        onChange={changeHandler}
                      />
                    </Col>
                    <Col xl={12} className="mt-4 mb-3">
                      <BasePassword
                        name="password"
                        suffix={true}
                        required
                        placeholder="******"
                        value={password}
                        feedback={passwordFeedbackMessage}
                        onChange={changeHandler}
                      />
                      <div className="mt-2">
                        <BaseCheckbox
                          id="rememberMeCheckBox"
                          label="Remember password ?"
                          checked={remember_me}
                          name="remember_me"
                          onChange={() => {
                            setData({ ...data, remember_me: !remember_me });
                          }}
                        />
                      </div>
                    </Col>
                    <Col xl={12} className="d-grid mt-2">
                      <Button
                        loading={loading}
                        variant="primary"
                        className="btn"
                        type="submit"
                      >
                        Login
                      </Button>
                    </Col>
                  </Form>
                </div>
                {/*<div className="text-center">*/}
                {/*    <p className="fs-12 text-muted mt-4">Dont have an account? <Link to={`${import.meta.env.BASE_URL}authentication/signup/signupcover/`} className="text-primary">Sign Up</Link></p>*/}
                {/*</div>*/}
              </div>
            </Col>
          </div>
        </Col>
        <Col xxl={5} xl={5} lg={5} className="d-xl-block d-none px-0">
          <div className="authentication-cover">
            <div className="aunthentication-cover-content rounded">
              <div className="swiper keyboard-control">
                <Swiper
                  spaceBetween={30}
                  navigation={true}
                  centeredSlides={true}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  modules={[Pagination, Autoplay, Navigation]}
                  className="mySwiper"
                >
                  <SwiperSlide>
                    <div className="text-fixed-white text-center p-5 d-flex align-items-center justify-content-center">
                      <div>
                        <div className="mb-5">
                          <img
                            src={img2}
                            className="authentication-image"
                            alt=""
                          />
                        </div>
                        <h6 className="fw-semibold text-fixed-white">
                          Create Password
                        </h6>
                        <p className="fw-normal fs-14 op-7">
                          {" "}
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Ipsa eligendi expedita aliquam quaerat nulla
                          voluptas facilis. Porro rem voluptates possimus, ad,
                          autem quae culpa architecto, quam labore blanditiis at
                          ratione.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-slide">
                      <div className="text-fixed-white text-center p-5 d-flex align-items-center justify-content-center">
                        <div>
                          <div className="mb-5">
                            <img
                              src={img3}
                              className="authentication-image"
                              alt=""
                            />
                          </div>
                          <h6 className="fw-semibold text-fixed-white">
                            Create Password
                          </h6>
                          <p className="fw-normal fs-14 op-7">
                            {" "}
                            Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit. Ipsa eligendi expedita aliquam quaerat nulla
                            voluptas facilis. Porro rem voluptates possimus, ad,
                            autem quae culpa architecto, quam labore blanditiis
                            at ratione.
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="text-fixed-white text-center p-5 d-flex align-items-center justify-content-center">
                      <div>
                        <div className="mb-5">
                          <img
                            src={img2}
                            className="authentication-image"
                            alt=""
                          />
                        </div>
                        <h6 className="fw-semibold text-fixed-white">
                          Create Password
                        </h6>
                        <p className="fw-normal fs-14 op-7">
                          {" "}
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Ipsa eligendi expedita aliquam quaerat nulla
                          voluptas facilis. Porro rem voluptates possimus, ad,
                          autem quae culpa architecto, quam labore blanditiis at
                          ratione.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </Col>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  local_varaiable: state
});

export default connect(mapStateToProps, { ThemeChanger })(Login);
