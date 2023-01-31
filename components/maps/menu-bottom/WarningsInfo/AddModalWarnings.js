import { useMemo, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
// import { toast } from "react-toastify";
// import { CustomInput } from "../../../CustomInput";
// import { useTranslation } from "next-i18next";

const AddModalWarnings = ({
  // setData_table,
  showAddWarningModal,
  // setShowViewWarningModal,
  setShowAddWarningModal,
}) => {
  const [Stand, setStand] = useState({
    kindOfStand: {},
  });
  const dataFormRadio = useMemo(
    () => [
      {
        id: 1,
        name: "Geofence in",
        radioName: "GeofenceIn",
        Disable: "Disable",
        Enable: "Enable",
      },
      {
        id: 2,
        name: "Geofence out",
        radioName: "Geofenceout",
        Disable: "Disable",
        Enable: "Enable",
      },
      {
        id: 3,
        name: "Power cut off",
        radioName: "PowerCutOff",
        Disable: "Disable",
        Enable: "Enable",
      },
      {
        id: 4,
        name: "Over Speed",
        radioName: "OverSpeed",
        Disable: "Disable",
        Enable: "Enable",
      },
      {
        id: 5,
        name: "Low voltage",
        radioName: "LowVoltage",
        Disable: "Disable",
        Enable: "Enable",
      },
      {
        id: 6,
        name: "Harsh Break",
        radioName: "HarshBreak",
        Disable: "Disable",
        Enable: "Enable",
      },
      {
        id: 7,
        name: "Acceleration",
        radioName: "Acceleration",
        Disable: "Disable",
        Enable: "Enable",
      },
      {
        id: 8,
        name: "Preventive Maintenance",
        radioName: "PreventiveMaintenance",
        Disable: "Disable",
        Enable: "Enable",
      },
    ],
    []
  );
  const [checkedList, setCheckedList] = useState(dataFormRadio);

  const handleClose = () => setShowAddWarningModal(false);

  function toggleOption(id, checked) {
    return dataFormRadio.map((option) =>
      option.name + option.name === id ? { ...option, checked } : option
    );
  }

  const changeList = (id, checked) => {
    const newCheckedList = toggleOption(id, checked);
    console.log(newCheckedList);
    setCheckedList(newCheckedList);
  };

  const handleChange = (e) => {
    e.persist();
    setStand((prev) => {
      const currentkindOfStand = prev.kindOfStand;
      currentkindOfStand[e.target.value] = e.target.value;
      return {
        ...prev,
        kindOfStand: currentkindOfStand,
      };
    });
  };

  const handleSubmit = (e) => {
    e.persist();
    // console.log("email", e.target.email);
    setShowAddWarningModal(false);
  };

  return (
    <Modal centered show={showAddWarningModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Modal Warnings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {dataFormRadio?.map(
            ({ id, name, Disable, Enable, checked, radioName }, key) => (
              <Form.Group className="mb-3" key={key} controlId="kindOfStand">
                <Row>
                  <Col sm={4}>
                    <Form.Label>{name}</Form.Label>
                  </Col>
                  <Col sm={4}>
                    <Form.Check
                      // onChange={handleChange}
                      onChange={(e) => changeList(id, e.target.checked)}
                      // checked={Stand.kindOfStand == item.Enable + item.name}
                      checked={checked}
                      type="radio"
                      name={radioName}
                      label={Enable}
                      value={Enable + name.replace(" ", "")}
                      id={Enable + name.replace(" ", "")}
                    />
                  </Col>

                  <Col sm={4}>
                    <Form.Check
                      onChange={handleChange}
                      // checked={Stand.kindOfStand == item.Disable + item.name.replace(" ", "")}
                      checked={checked}
                      type="radio"
                      name={radioName}
                      label={Disable}
                      id={Disable + name.replace(" ", "")}
                      value={Disable + name.replace(" ", "")}
                    />
                  </Col>
                </Row>
              </Form.Group>
            )
          )}
          <Row>
            <Col sm={4}>
              <Form.Label>Email Address</Form.Label>
            </Col>

            <Col sm={8}>
              <Form.Control
                type="email"
                name="email"
                className="border border-primary"
                placeholder="name@example.com"
              />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col sm={2}>
              <Button
                className="p-2"
                size="lg"
                variant="secondary"
                onClick={handleClose}
              >
                Close
              </Button>
            </Col>
            <Col sm={2}>
              <Button className="p-2" size="lg" variant="primary" type="submit">
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddModalWarnings;
