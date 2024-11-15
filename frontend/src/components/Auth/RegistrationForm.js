import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { AuthContext } from "./AuthContext";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";

const RegistrationForm = () => {
  const { setIsAuthenticated } = useContext(AuthContext);

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={Yup.object({
        username: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string()
          .min(8, "Must be at least 8 characters")
          .required("Required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        axios
          .post("http://localhost:2000/register", values, {
            withCredentials: true,
          })
          .then((response) => {
            alert(response.data.message);
            setSubmitting(false);
            setIsAuthenticated(true);
          })
          .catch((error) => {
            alert(error.response.data.message || "Registration failed");
            setSubmitting(false);
          });
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <MDBContainer className="my-5 gradient-form">
          <MDBRow>
            <MDBCol col="6" className="mb-5">
              <div className="d-flex flex-column ms-5">
                <div className="text-center">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                    style={{ width: "185px" }}
                    alt="logo"
                  />
                  <h4 className="mt-1 mb-5 pb-1">We are The Lotus Team</h4>
                </div>

                <p>Please register for an account</p>

                <Form onSubmit={handleSubmit}>
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Username"
                    id="formUsername"
                    type="text"
                    name="username"
                    as={Field}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-danger mb-3"
                  />

                  <MDBInput
                    wrapperClass="mb-4"
                    label="Email address"
                    id="formEmail"
                    type="email"
                    name="email"
                    as={Field}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger mb-3"
                  />

                  <MDBInput
                    wrapperClass="mb-4"
                    label="Password"
                    id="formPassword"
                    type="password"
                    name="password"
                    as={Field}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger mb-3"
                  />

                  <MDBInput
                    wrapperClass="mb-4"
                    label="Confirm Password"
                    id="formConfirmPassword"
                    type="password"
                    name="confirmPassword"
                    as={Field}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-danger mb-3"
                  />

                  <div className="text-center pt-1 mb-5 pb-1">
                    <MDBBtn
                      type="submit"
                      className="mb-4 w-100 gradient-custom-2"
                      disabled={isSubmitting}
                    >
                      Register
                    </MDBBtn>
                  </div>
                </Form>
              </div>
            </MDBCol>

            <MDBCol col="6" className="mb-5">
              <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
                <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                  <h4 className="mb-4">We are more than just a company</h4>
                  <p className="small mb-0">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      )}
    </Formik>
  );
};

export default RegistrationForm;
