import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, FormCheck, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { add, empty } from "../../../lib/slices/accountInfo";
import { Formik } from "formik";
import { addFormData } from "../../../lib/slices/addForm";

const initialValues = {
  firstName: "",
  lastName: "",
  useName: "",
  email: "",
  phonenumber: "",
  password: "",
  confirmPassword: ""
}
const CreateAdminUser = () => {
  const { t } = useTranslation("Management");
  const dispatch = useDispatch();
  const router = useRouter();
  // dataredux 
  const dataRedux = useSelector((item) => item.addFormDatas.formdata);
  console.log("ttttt", dataRedux)
  // function handle prev buttons 
  const handlePrev = () => {
    router.push("/management/account-management/AccountWizard");

  }

  // function handle data redux 
  const handledata = (data) => {
    dispatch(addFormData(data))
    router.push("/management/account-management/SubScription")
  }
  useEffect(() => {
    if (!dataRedux?.AccountName) {
      router.replace("/management/account-management/22")

    }
  })

  const handleDeleteAllDataWithGoToMainPage = () => {
    router.push("/management/account-management/AccountWizard");
    dispatch(addFormData({ ...dataRedux, ...initialValues }))
  }
  return (
    <>
      <Card>
        <Card.Body>
          <Row className=" d-flex justify-content-center mb-5">
            <Col lg="8">

              <Formik
                initialValues={{
                  firstName: dataRedux?.firstName ? dataRedux.firstName : "",
                  lastName: dataRedux?.lastName ? dataRedux.lastName : "",
                  useName: dataRedux?.useName ? dataRedux.useName : "",
                  email: dataRedux?.email ? dataRedux.email : "",
                  phonenumber: dataRedux?.phonenumber ? dataRedux.phonenumber : "",
                  password: dataRedux?.password ? dataRedux.password : "",
                  confirmPassword: ""
                }}
                validate={values => {
                  const errors = {};
                  if (!values.firstName) {
                    errors.firstName = 'firstName is Required';
                  }
                  if (!values.lastName) {
                    errors.lastName = 'lastName is Required';
                  }
                  if (!values.useName) {
                    errors.useName = 'useName is Required';
                  }
                  if (!values.phonenumber) {
                    errors.phonenumber = 'phonenumber is Required';
                  }
                  if (!values.password) {
                    errors.password = 'password is Required';
                  }
                  else if (values.password && values.password !== values.confirmPassword) {
                    errors.confirmPassword = 'confirm passwords isn,t matche with  password  ';

                  }



                  return errors;
                }}
                onSubmit={(values, errors) => {

                  handledata(values)

                }}
              >
                {({ values,
                  errors,
                  touched,
                  handleChange,
                  setFieldValue,
                  handleBlur,
                  handleSubmit,
                  isSubmitting, }) => (
                  <>
                    <Form
                      className="mt-5"
                      onSubmit={handleSubmit}
                    >
                      <Row className="p-3 mb-3">
                        {/* first name */}
                        <Col md="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="firstName">
                              {t("First_Name")}
                            </Form.Label>
                            <Form.Control

                              type="text"
                              id="firstName"
                              value={values.firstName}
                              onChange={handleChange}
                              name="firstName"
                            />

                          </Form.Group>
                          <p className='text-danger mb-3'>{errors.firstName && touched.firstName && errors.firstName} </p>
                        </Col>
                        {/* last name */}
                        <Col md="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="lastName">
                              {t("Last_Name")}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="lastName"
                              value={values.lastName}
                              onChange={handleChange}
                              name="lastName"

                            />

                          </Form.Group>
                          <p className='text-danger mb-3'>{errors.lastName && touched.lastName && errors.lastName} </p>

                        </Col>
                        {/* user name */}
                        <Col md="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="userName">
                              {t("User_Name")}
                            </Form.Label>
                            <Form.Control
                              name="useName"
                              value={values.useName}
                              onChange={handleChange}
                              type="text"
                              id="userName"

                            />

                          </Form.Group>
                          <p className='text-danger mb-3'>{errors.useName && touched.useName && errors.useName} </p>

                        </Col>
                        {/* email  */}
                        <Col md="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="email">{t("Email")}</Form.Label>
                            <Form.Control
                              name="email"
                              value={values.email}
                              onChange={handleChange}
                              type="email"
                              id="email"

                            />

                          </Form.Group>
                        </Col>
                        {/* phone number */}
                        <Col md="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="phoneNumber">
                              {t("Phone_Number")}
                            </Form.Label>
                            <Form.Control
                              type="number"
                              name="phonenumber"
                              value={values.phonenumber}
                              onChange={handleChange}
                              id="phoneNumber"

                            />

                          </Form.Group>
                          <p className='text-danger mb-3'>{errors.phonenumber && touched.phonenumber && errors.phonenumber} </p>

                        </Col>
                        {/* password */}
                        <Col md="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="fPass">
                              {t("setting:Password")}
                            </Form.Label>
                            <Form.Control
                              name="password"
                              value={values.password}
                              onChange={handleChange}
                              type="password"
                              id="fPass"

                            />
                          </Form.Group>
                          <p className='text-danger mb-3'>{errors.password && touched.password && errors.password} </p>
                        </Col>
                        {/* confirm password */}
                        <Col md="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="lPass">
                              {t("setting:Confirm_Password")}
                            </Form.Label>
                            <Form.Control
                              name="confirmPassword"
                              value={values.confirmPassword}
                              onChange={handleChange}
                              type="password"
                              id="lPass"

                            />


                          </Form.Group>
                          <p className='text-danger mb-3'>{errors.confirmPassword && touched.confirmPassword && errors.confirmPassword} </p>

                        </Col>
                        <Col sm="12">
                          <div className="mt-5 d-flex justify-content-end">
                            {/* <button
                        className="btn btn-primary px-3 py-2 ms-3"
                        type="submit"
                      >
                        <FontAwesomeIcon
                          className="me-2"
                          icon={faArrowRight}
                          size="sm"
                        />
                        {t("Next")}
                      </button> */}
                            <Button
                              className="btn btn-primary px-3 py-2 ms-3"
                              onClick={handlePrev}
                            >
                              {" "}
                              <FontAwesomeIcon
                                className="me-2"
                                icon={faArrowLeft}
                                size="sm"
                              />
                              {t("Prev")}
                            </Button>
                            <Button
                              type="submit"
                              className="btn btn-primary px-3 py-2 ms-3"
                            //   firstName: "",






                            >
                              {" "}
                              <FontAwesomeIcon
                                className="me-2"
                                icon={faArrowRight}
                                size="sm"
                              />
                              {t("Next")}
                            </Button>
                            {/*<button className="btn btn-primary px-3 py-2 ms-3">
                  <FontAwesomeIcon
                    className="me-2"
                    icon={faArrowLeft}
                    size="sm"
                  />

                  {t("Back")}
                </button>
                <button className="btn btn-primary px-3 py-2 ms-3">
                  <FontAwesomeIcon className="me-2" icon={faCheck} size="sm" />
                  {t("Finish")}
                </button>*/}
                            <button
                              className="btn btn-primary px-3 py-2 ms-3"
                              onClick={() => handleDeleteAllDataWithGoToMainPage()}
                            >
                              <FontAwesomeIcon
                                className="me-2"
                                icon={faTimes}
                                size="sm"
                              />
                              {t("Cancel")}
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </Form>

                  </>


                )}

              </Formik>

            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};
export default CreateAdminUser;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "Management",
        "setting",
        "main",
      ])),
    },
  };
}
// translation ##################################
