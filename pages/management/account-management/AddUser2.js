import { useState } from "react";
import { useRouter } from "next/router";
import { Row, Col, Form, Card, FormCheck } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { add, empty } from "../../../lib/slices/userInfo";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const AddUser2 = () => {
  const { t } = useTranslation("Management");
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectData, setSelectData] = useState(false);

  const handleAdmin = (e) => {
    setSelectData(e.target.value);
  };
  const handleAccountManager = (e) => {
    setSelectData(e.target.value);
  };
  const handleUser = (e) => {
    setSelectData(e.target.value);
  };
  const handleSales = (e) => {
    setSelectData(e.target.value);
  };
  const handleAccountAdmin = (e) => {
    setSelectData(e.target.value);
  };



  console.log("selectData", selectData);
  const allData = {
    selectData,
  };

  const handleDeleteAllDataWithGoToMainPage = () => {
    dispatch(empty());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectData) {
      dispatch(add(allData));
      router.push("/management/account-management/AddUser3");
    }
  };

  return (
    <div className="container-fluid">
      <Card>
        <Card.Body>
          <Row className=" d-flex justify-content-center my-5">
            <Col md="8">
              <Form onSubmit={handleSubmit}>
                <Form.Group as={Row}>
                  <Col md="6" className="mb-3">
                    <Card className="border-bottom border-4 border-0 border-primary">
                      <Card.Body className="d-flex justify-content-start align-items-center">
                        <div>
                          <Form.Check className="mb-3 form-check">
                            <FormCheck.Input
                              type="radio"
                              name="userRole"
                              className="me-3 p-2"
                              id="admin"
                              onChange={handleAdmin}
                              value="Admin"
                            />
                            <FormCheck.Label className="h4" htmlFor="admin">
                              {t("Admin")}
                            </FormCheck.Label>
                          </Form.Check>
                          <span>text deisciption here...</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md="6" className="mb-3">
                    <Card className="border-bottom border-4 border-0 border-primary">
                      <Card.Body className="d-flex justify-content-start align-items-center">
                        <div>
                          <Form.Check className="mb-3 form-check">
                            <FormCheck.Input
                              type="radio"
                              name="userRole"
                              className="me-3 p-2"
                              id="accountManager"
                              onChange={handleAccountManager}
                              value="AccountManager"
                            />
                            <FormCheck.Label
                              className="h4"
                              htmlFor="accountManager"
                            >
                              {t("AccountManager")}
                            </FormCheck.Label>
                          </Form.Check>
                          <span>text deisciption here...</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md="6" className="mb-3">
                    <Card className="border-bottom border-4 border-0 border-primary">
                      <Card.Body className="d-flex justify-content-start align-items-center">
                        <div>
                          <Form.Check className="mb-3 form-check">
                            <FormCheck.Input
                              type="radio"
                              name="userRole"
                              className="me-3 p-2"
                              id="user"
                              onChange={handleUser}
                              value="User"
                            />
                            <FormCheck.Label className="h4" htmlFor="user">
                              {t("User")}
                            </FormCheck.Label>
                          </Form.Check>
                          <span>text deisciption here...</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md="6" className="mb-3">
                    <Card className="border-bottom border-4 border-0 border-primary">
                      <Card.Body className="d-flex justify-content-start align-items-center">
                        <div>
                          <Form.Check className="mb-3 form-check">
                            <FormCheck.Input
                              type="radio"
                              name="userRole"
                              className="me-3 p-2"
                              id="sales"
                              onChange={handleSales}
                              value="Sales"
                            />
                            <FormCheck.Label className="h4" htmlFor="sales">
                              {t("Sales")}
                            </FormCheck.Label>
                          </Form.Check>
                          <span>text deisciption here...</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md="6" className="mb-3">
                    <Card className="border-bottom border-4 border-0 border-primary">
                      <Card.Body className="d-flex justify-content-start align-items-center">
                        <div>
                          <Form.Check className="mb-3 form-check">
                            <FormCheck.Input
                              type="radio"
                              name="userRole"
                              className="me-3 p-2"
                              id="accountAdmin"
                              onChange={handleAccountAdmin}
                              value="AccountAdmin"
                            />
                            <FormCheck.Label
                              className="h4"
                              htmlFor="accountAdmin"
                            >
                              {t("AccountAdmin")}
                            </FormCheck.Label>
                          </Form.Check>
                          <span>text deisciption here...</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <div className="mt-5 d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary px-3 py-2 ms-3"
                    >
                      <FontAwesomeIcon
                        className="me-2"
                        icon={faArrowRight}
                        size="sm"
                      />
                      Next
                    </button>
                    <Link
                      href="/management/account-management/ManageUsers"
                      passHref
                    >
                      <button
                        onClick={() => handleDeleteAllDataWithGoToMainPage()}
                        className="btn btn-primary px-3 py-2 ms-3"
                      >
                        <FontAwesomeIcon
                          className="me-2"
                          icon={faTimes}
                          size="sm"
                        />
                        Cancel
                      </button>
                    </Link>
                  </div>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddUser2;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["Management", "main"])),
    },
  };
}

// translation ##################################
