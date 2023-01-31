import { Row, Col, Card, Form, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import data from "../../../data/static.json";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { add } from "../../../lib/slices/userInfo";

const AddUser3 = () => {
  const { t } = useTranslation("Management");
  const [subScriptionTarget, setSubScriptionTarget] = useState("");
  const [subScriptionList, setSubScriptionList] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [targetPermissions, setTargetPermissions] = useState([]);
  const [targetId, setTargetId] = useState(0);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const dispatch = useDispatch();
  const userInfos = useSelector((state) => state?.userInfo);
  const router = useRouter();

  console.log("userInfos", userInfos);

  const handleSubScriptionsList = (title, id) => {
    setSubScriptionTarget(title);
    setTargetId(id);
  };

  useEffect(() => {
    !subScriptionList.includes(subScriptionTarget) &&
      subScriptionTarget &&
      setSubScriptionList([...subScriptionList, subScriptionTarget]);
  }, [subScriptionTarget, subScriptionList]);

  useEffect(() => {
    let targetPermissions = data[0].SubScriptionsList.filter(
      (item) => item.id === targetId
    );
    targetPermissions.length > 0 &&
      setPermissions(targetPermissions[0].permissions);
  }, [targetId]);

  useEffect(() => {
    setTargetPermissions(data[0].SubScriptionsList);
  }, []);

  const handleCheckPermission = (e) => {
    let currVal = e.target.value;
    let allData = [...targetPermissions];
    allData?.map((item) => {
      if (item.id === targetId) {
        if (currVal === "All") {
          item.selectedPermissions = item.permissions;
          setSelectedPermissions(item.selectedPermissions);
          if (!e.target.checked) {
            item.selectedPermissions = [];
            setSelectedPermissions([]);
          }
        } else {
          !item.selectedPermissions.includes(currVal) &&
            item.selectedPermissions.push(currVal);
          !selectedPermissions.includes(currVal) &&
            currVal &&
            setSelectedPermissions([...selectedPermissions, currVal]);

          if (!e.target.checked) {
            let filteredTargetPermissions = item.selectedPermissions.filter(
              (item) => item !== currVal
            );
            item.selectedPermissions = filteredTargetPermissions;
            setSelectedPermissions(filteredTargetPermissions);
          }
        }
      }
    });
    setTargetPermissions(allData);
  };

  const handleCheckedPermissions = (name) => {
    const targetPermissions = data[0].SubScriptionsList.filter(
      (item) => item.id === targetId
    );
    return targetPermissions[0].selectedPermissions.includes(name);
  };

  const handleAddPermissions = () => {
    const filteredPermissions = data[0].SubScriptionsList.filter(
      (item) => item.selectedPermissions.length > 0
    );
    dispatch(add(filteredPermissions));
    router.push("/management/account-management/ConfirmationUser");
  };

  return (
    <Card>
      <Card.Body>
        <Row>
          <Col lg="8">
            <Card className="shadow-none">
              <Card.Body>
                <div className="header-title">
                  <h4 className="card-title">{t("User_Information")}</h4>
                </div>

                <Form className="mt-5">
                  <Row className="border border-light rounded p-3 mb-3">
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="FullName">
                          {t("Full_Name")}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="FullName"
                          value={`${userInfos.AddUser1.firstName} ${userInfos.AddUser1.lastName}`}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="userRole">
                          {t("User_Role")}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="userRole"
                          value={userInfos.AddUser1.userName}
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="email">{t("E-mail")}</Form.Label>
                        <Form.Control
                          type="text"
                          id="email"
                          value={userInfos.AddUser1.email}
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="status">{t("Status")}</Form.Label>
                        <Form.Control
                          type="text"
                          id="status"
                          value={userInfos.AddUser1.phoneNumber}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="border border-light rounded p-3 mb-3">
                    <h4>{t("General_System_Permissions")}</h4>
                    <hr className="my-3 mx-auto" />

                    <Form.Check className="d-block form-group">
                      <Form.Check.Input
                        className="me-2"
                        type="checkbox"
                        defaultValue=""
                        id="emails"
                      />
                      <Form.Check.Label htmlFor="emails">
                        {t("Recieve_Emails")}
                      </Form.Check.Label>
                    </Form.Check>

                    <Form.Check className="d-block form-group">
                      <Form.Check.Input
                        className="me-2"
                        type="checkbox"
                        defaultValue=""
                        id="alerts"
                      />
                      <Form.Check.Label htmlFor="alerts">
                        {t("Recieve_Alerts_Notifications")}
                      </Form.Check.Label>
                    </Form.Check>

                    <Form.Check className="d-block form-group">
                      <Form.Check.Input
                        className="me-2"
                        type="checkbox"
                        defaultValue=""
                        id="pushMsg"
                      />
                      <Form.Check.Label htmlFor="pushMsg">
                        {t("Recieve_Push_Messages")}
                      </Form.Check.Label>
                    </Form.Check>
                  </Row>
                  <Row className="border border-light rounded p-3 mb-3">
                    <h4>{t("User_Permissions")}</h4>
                    <hr className="my-3 mx-auto" />
                    <Row>
                      <Col xm="6">
                        <h5 className="mb-3">{t("Subscriptions")}</h5>
                        <ul className="list-group list-group-flush">
                          <div
                            className="list-group"
                            id="list-tab"
                            role="tablist"
                          >
                            {data[0].SubScriptionsList?.map((item, i) => {
                              return (
                                <a
                                  key={i}
                                  className="list-group-item list-group-item-action"
                                  id="list-home-list"
                                  data-bs-toggle="list"
                                  href="#list-home"
                                  role="tab"
                                  aria-controls="list-home"
                                  onClick={() =>
                                    handleSubScriptionsList(
                                      item.mainCategory,
                                      item.id
                                    )
                                  }
                                  value={item.name}
                                >
                                  {item.name}
                                </a>
                              );
                            })}
                          </div>
                        </ul>
                      </Col>
                      <Col xm="6">
                        <Card>
                          <h5 className="mb-3">{t("Functions")}</h5>
                          <Form>
                            <ListGroup as="ul">
                              <ListGroup.Item>
                                {permissions.length > 0 ? (
                                  permissions?.map((item, i) => {
                                    return (
                                      <div key={i}>
                                        <Form.Check className="form-group">
                                          <Form.Check.Input
                                            className="me-2"
                                            type="checkbox"
                                            defaultValue={item}
                                            id={item}
                                            value={item}
                                            onChange={handleCheckPermission}
                                            checked={handleCheckedPermissions(
                                              item
                                            )}
                                          />
                                          <Form.Check.Label htmlFor={item}>
                                            {item}
                                          </Form.Check.Label>
                                        </Form.Check>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="text-center">
                                    There is No permissions for this item
                                  </p>
                                )}
                              </ListGroup.Item>
                            </ListGroup>
                          </Form>
                        </Card>
                      </Col>
                    </Row>
                  </Row>
                </Form>

                <div className="mt-5 d-flex justify-content-end">
                  <button className="btn btn-primary px-3 py-2 ms-3">
                    <FontAwesomeIcon
                      className="me-2"
                      icon={faArrowLeft}
                      size="sm"
                    />

                    {t("Back")}
                  </button>
                  <button
                    onClick={() => handleAddPermissions()}
                    className="btn btn-primary px-3 py-2 ms-3"
                  >
                    <FontAwesomeIcon
                      className="me-2"
                      icon={faCheck}
                      size="sm"
                    />

                    {t("Save_changes")}
                  </button>
                  <button className="btn btn-primary px-3 py-2 ms-3">
                    <FontAwesomeIcon
                      className="me-2"
                      icon={faTimes}
                      size="sm"
                    />

                    {t("Cancel")}
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          {/* aside features section */}
          <Col lg="4">
            <Card className="shadow-none">
              <Card.Body>
                <div className="card-title">
                  <h4 className="mb-4">{t("Selected_User_Permissions")}</h4>
                </div>
                <div>
                  {targetPermissions?.map((item) => (
                    <Card className="border rounded shadow-none" key={item.id}>
                      <Card.Body>
                        <h5>{t(`${item.subMainCategory}`)}</h5>
                        <hr className="my-3 mx-auto" />
                        <div>
                          {item.selectedPermissions?.map((itemSub, key) => {
                            return (
                              <div key={key} className="p-2">
                                - {t(itemSub)}
                              </div>
                            );
                          })}
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default AddUser3;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["Management", "main"])),
    },
  };
}

// translation ##################################
