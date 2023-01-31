import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Form,
  Row,
  Button,
  Modal,
} from "react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import {
  faPen,
  faTrash,
  faPlus,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Formik } from "formik";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { toast } from "react-toastify";
import { getallGroups, getAllVehicles, addGroups, updateGroups, assigndata } from '/services/management/ManageGroups'
import { encryptName } from "../../helpers/encryptions";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const ManageGroupsVehicles = () => {
  const { t } = useTranslation("Management")
  // all groups in shape of label and value of all gropus 
  const [dataoptions, setDataoptions] = useState([])

  // check if loading or not 
  const [load, setLoad] = useState(false)
  // all groups 
  const [allGroups, setAllGroups] = useState([]);
  // all un groups 
  let { vehData } =
    JSON.parse(localStorage.getItem(encryptName("userData")) ?? "[]") ?? [];
  const [allunGroups, setunAllGroups] = useState(vehData?.filter(i => i.GroupID === null))
  // all vehicles  og grops 
  const [vehicleGroup, setVehicleGroup] = useState([]);
  // check loading or not ?
  const [loading, setLoading] = useState(false)
  // check if chage in select (disabled buttons)
  const [check, setCheck] = useState(true)

  // state to get if when onchange
  const [getid, setGetId] = useState("")

  // variable to fillters when edit 
  const editGroups = allGroups.find((items) => items.ID == getid);


  // use state to put all selects  into arrays1 
  const [checkarray, setCheckarray] = useState([])
  // check inputs of checks  unassign bottons 
  const [checkinput, setCheckInput] = useState(null)
  const [checkunasignbtn, setcheckunasignbtn] = useState(false)

  //  asign bottons
  const [checkinputassing, setCheckInputassign] = useState(null)
  const [checkasignbtn, setcheckasignbtn] = useState(false)

  // use state to put all selects  into arrays2 
  const [checkarray2, setCheckarray2] = useState([])

  // control in value of react select 
  const [controldefault, setControldefault] = useState({ label: "select...", value: "" })




  // function to add new Groups
  const AddGroups = async (values) => {
    setLoad(true);
    console.log(values)
    try {
      setLoad(false);

      const response = await addGroups(values);
      if (response.status == 200) {
        setControldefault({ label: values.Name, value: "" })
        setLoad(false)
        toast.success('you added Group seccessfully')

        setDataoptions([...dataoptions, {
          label: values.Name,
          value: values.ParentGroupID
        }])
      }
    }
    catch (e) {
      setLoad(false)

      console.log("error", e)
    }


  }
  // function to edit name of groups 
  const EditGroup = async (value) => {

    try {

      const response = await updateGroups(editGroups.ID, value)
    }
    catch (e) {
      toast.error(e.response.data.message);

    }

  };

  // function to delet group 
  const DeletGroup = async (id, hideModel) => {

    try {
      const response = await axios({
        method: "delete",
        url: `/dashboard/management/groups/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status == 200) {
        toast.success(`${editGroups?.Name} deleted successfully `);
        setDataoptions(dataoptions.filter((items) => items.value !== id));
        setAllGroups(allGroups.filter((items) => items.ID !== id))

        setControldefault({ label: "select...", value: "" })
        hideModel()
      }
    }
    catch (e) {
      console.log("error", e.response.data.message);
      toast.error(`${e.response.data.message}`)
      setControldefault({ label: "select...", value: "" })

      setDataoptions(dataoptions.filter((items) => items.value !== id));
      setAllGroups(allGroups.filter((items) => items.ID !== id))
      hideModel()
    }
  };



  function AddGroupModal(props) {
    return (

      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="justify-content-center"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {t("Add Group")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="d-flex justify-content-center">
            <Col md="12">
              <Formik
                initialValues={{ Name: '', ParentGroupID: null }}
                validate={values => {
                  const errors = {};
                  if (!values.Name) {
                    errors.Name = 'Group Name is Required';
                  }
                  return errors;
                }}
                onSubmit={(values) => {
                  AddGroups(values)
                }}

              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  errors,
                  touched
                }) => (
                  <Form onSubmit={handleSubmit}
                  >
                    <Row className="p-3 mb-3">
                      <Col lg="12">
                        <Form.Group
                          className="form-group"
                          controlId="validationCustom01"
                        >
                          <Form.Label htmlFor="groupName">{t("Group Name")}</Form.Label>
                          <Form.Control
                            name="Name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.Name} type="text" required />
                          <p className="my-3 text-danger">
                            {errors.Name && touched.Name && errors.Name}

                          </p>
                        </Form.Group>
                      </Col>
                      <Col lg="12">
                        <div className="mb-3">
                          <Form.Group className="form-group">

                            <ReactSelect
                              options={dataoptions}
                              label="ParentGroupID"
                              placeholder="ParentGroupID"
                              name="ParentGroupID"
                              className={"col-12 mb-3"}
                              isSearchable={true}
                              isObject={false}
                            />

                          </Form.Group>
                        </div>
                      </Col>
                      <Modal.Footer>
                        <div className="mt-5 d-flex justify-content-end">
                          <button className="btn btn-primary px-3 py-2 ms-3" type="submit">
                            <FontAwesomeIcon className="mx-2" icon={faCheck} size="sm" />
                            {load ? "loading.." : `${t("submit")}`}
                          </button>
                          <button
                            className="btn btn-primary px-3 py-2 ms-3"
                            onClick={props.onHide}
                          >
                            <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
                            {t("cancel")}
                          </button>
                        </div>
                      </Modal.Footer>
                    </Row>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </Modal.Body>

      </Modal>


    );
  }

  function AddGroupBtn() {
    const [modalShow, setModalShow] = useState(false);

    return (
      <>
        <Button
          type="Button"
          className="btn btn-primary  px-3 py-2 m-2 "
          onClick={() => setModalShow(true)}
        >
          <FontAwesomeIcon className="me-2" icon={faPlus} size="sm" />
          {t("Add Group")}
        </Button>

        <AddGroupModal show={modalShow} onHide={() => setModalShow(false)} />
      </>
    );
  }














  //  Modals for Edit Group & Edit Group
  function EditGroupModal(props) {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {t("Edit Group")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="d-flex justify-content-center">
            <Col md="12">
              <Formik
                initialValues={{ Name: editGroups ? editGroups.Name : "" }}

                validate={values => {
                  const errors = {};
                  if (!values.Name) {
                    errors.Name = 'Group Name is Required';
                  }
                  return errors;
                }}
                onSubmit={(values) => {

                  EditGroup(values)
                }}

              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  errors,
                  touched
                }) => (
                  <Form onSubmit={handleSubmit}
                  >
                    <Row className="p-3 mb-3">
                      <Col lg="12">
                        <Form.Group
                          className="form-group"
                          controlId="validationCustom01"
                        >
                          <Form.Label htmlFor="groupName">{t("Group Name")}</Form.Label>
                          <Form.Control
                            name="Name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.Name} type="text" required />
                          <p className="my-3 text-danger">
                            {errors.Name && touched.Name && errors.Name}

                          </p>
                        </Form.Group>
                      </Col>

                      <Modal.Footer>
                        <div className="mt-5 d-flex justify-content-end">
                          <button className="btn btn-primary px-3 py-2 ms-3" type="submit"
                            onClick={props.onHide}
                          >
                            <FontAwesomeIcon className="mx-2" icon={faCheck} size="sm" />
                            {t("submit")}
                          </button>
                          <button
                            className="btn btn-primary px-3 py-2 ms-3"
                            onClick={props.onHide}
                          >
                            <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
                            {t("cancel")}
                          </button>
                        </div>
                      </Modal.Footer>
                    </Row>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </Modal.Body>

      </Modal>
    );
  }
  function EditGroupBtn() {
    const [modalShow, setModalShow] = useState(false);

    return (
      <>
        <Button
          type="Button"
          disabled={check}
          className="btn btn-primary  px-3 py-2 m-2 "
          onClick={() => setModalShow(true)}
        >
          <FontAwesomeIcon className="me-2" icon={faPen} size="sm" />
          {t("Edit Group")}
        </Button>

        <EditGroupModal show={modalShow} onHide={() => setModalShow(false)} />
      </>
    );
  }
  //  Modals for Delecte Group
  function DeleteGroupModal(props) {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {t("Delete Group")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="lead">`${t("Are you sure you want to delete")} {editGroups?.Name} Group?`</p>
        </Modal.Body>
        <Modal.Footer>
          <div className="mt-5 d-flex justify-content-end">
            <button
              className="btn btn-primary px-3 py-2 ms-3"
              type="submit"
              onClick={() => DeletGroup(editGroups?.ID, props.onHide)}
            >
              <FontAwesomeIcon className="mx-2" icon={faTrash} size="sm" />
              {("Delete")}
            </button>
            <button
              className="btn btn-primary px-3 py-2 ms-3"
              onClick={props.onHide}
            >
              <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
              {t("cancel")}
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }

  function DeleteGroupBtn() {
    const [modalShow, setModalShow] = useState(false);

    return (
      <>
        <Button
          type="Button"
          disabled={check}
          className="btn btn-primary  px-3 py-2 m-2 "
          onClick={() => setModalShow(true)}
        >
          <FontAwesomeIcon className="me-2" icon={faTrash} size="sm" />
          {t("Delete Group")}
        </Button>

        <DeleteGroupModal show={modalShow} onHide={() => setModalShow(false)} />
      </>
    );
  }



  // function to get all groups in select 
  useEffect(async () => {

    const Groups = await getallGroups();
    try {

      const selectOpt = Groups.result.map((items) => ({ label: items.Name, value: items.ID })
      )


      setDataoptions(selectOpt)
      setAllGroups(Groups?.result);
    }
    catch (e) {
      console.log("error", e)
    }


  }, []);


  // function to get all vehicles 
  const handleSelectGroup = async (value) => {
    setLoading(true)
    setGetId(value?.value)
    setControldefault(value)
    value !== undefined ? setCheck(false) : setCheck(true)

    try {
      const allvehicles = await getAllVehicles(value?.value);
      const data = allvehicles.vehicles;
      setLoading(false)
      const vehicles = data.map((items) => items);
      setVehicleGroup(vehicles)
      return vehicles


    }
    catch (e) {
      console.log("error", e)
    }



  };



  // function un asign group
  const unasign = async () => {
    const data = {
      vehicles: checkarray,
      groupId: null
    }
    setcheckunasignbtn(true)

    if (vehicleGroup.length > 0 && checkarray.length > 0) {
      try {
        const response = await assigndata(data);
        console.log("response", response)
        if (response.status == 200) {
          toast.success("you updated successfully :)");

          const data = vehicleGroup.filter((item) => !checkarray.includes(item.VehicleId));
          setVehicleGroup(data)
          const transferdata = vehicleGroup.filter((items) => checkarray.includes(items.VehicleId));


          const newTransferdata = transferdata.map((items) => ({ VehicleID: items.VehicleId, DisplayName: items.Vehicle }))
          setunAllGroups([...allunGroups, ...newTransferdata])
          setCheckarray([])
          setCheckInput(false)
          setcheckunasignbtn(false)
          // checksgroups

        }

      }
      catch (err) {
        console.log("error", err)
        setCheckInput(false)
        setcheckunasignbtn(false)


      }

    }
    else {
      toast.error("no Vehicles available")
      setcheckunasignbtn(false)

    }



  }

  // function assign group 
  const assign = async () => {
    setcheckasignbtn(true)
    const data = {
      vehicles: checkarray2,
      groupId: editGroups?.ID
    }
    if (checkarray2.length < 1) {
      toast.error("No data selected in ungrouped vehicles")
      setcheckasignbtn(false)

    }
    else if (data.groupId == undefined || null) {
      toast.error("You must choose group to assign ")
      setcheckasignbtn(false)


    }
    else {
      try {
        const response = await assigndata(data)
        if (response.status == 200) {
          setcheckasignbtn(false)
          toast.success(`${response.data.message}`)
          const data = allunGroups.filter(items => !checkarray2.includes(items.VehicleID));
          const transferdata = allunGroups.filter((items) => checkarray2.includes(items.VehicleID));

          const newTransferdata = transferdata.map((items) => ({ VehicleId: items.VehicleID, Vehicle: items.DisplayName }))

          setunAllGroups(data)
          setVehicleGroup([...vehicleGroup, ...newTransferdata])
          setCheckInputassign(false);

          // console.log("all groups", vehicleGroup)
          // setunAllGroups(allunGroups.filter(items => !checkarray2.includes(items.VehicleID)))
        }
      }

      catch (err) {
        console.log("error", err);
        toast.error(err.response.data.message)
      }

    }
  }

  // function to get array from checkbox 

  const checkboxArray = (value, word, data) => {
    if (word == "unassign") {
      setCheckInput(null)
      // add to list
      if (value) {
        setCheckarray([
          ...checkarray,
          data
        ]);


      } else {
        // remove from list
        setCheckarray(
          checkarray.filter((item) => item !== data),
        );



      }

    }

    else if (word == "assign") {
      setCheckInputassign(null)
      // add to list
      if (value) {
        setCheckarray2([
          ...checkarray2,
          data
        ]);
      }
      else {
        // remove from list

        setCheckarray2(
          checkarray2.filter((item) => item !== data),
        );
      }

    }
  }

  return (
    <>
      <Card className="management">
        <Card.Body>
          <Row className="d-flex justify-content-between">
            <Col lg="5" className="mb-3">
              <Row>
                <Col lg="12">
                  <div>
                    <Form.Group className="form-group">
                      <h4 className="mb-3">{t("Grouped Vehicles")}</h4>

                      <Select
                        options={dataoptions}
                        onChange={handleSelectGroup}
                        value={controldefault}

                      />
                    </Form.Group>
                  </div>
                </Col>

                <Col lg="12">
                  <div>
                    <AddGroupBtn />
                    <EditGroupBtn />
                    <DeleteGroupBtn />
                  </div>
                </Col>


                <Col lg="12">
                  <div className="items-grouped">
                    <ul>
                      {loading ? <h2>{t("please wait Data")} ... </h2> : vehicleGroup?.length > 0 ? vehicleGroup?.map((items) =>
                        <>
                          <li>
                            <input checked={checkinput} value={items.VehicleId}
                              onChange={(e) => {
                                checkboxArray(e.target.checked, "unassign", items?.VehicleId)
                              }

                              }

                              type="checkbox" name="346" />
                            {items.Vehicle}

                          </li>
                        </>
                      )
                        : <h2>{t("No Vehicles in this Group")}</h2>}

                    </ul>

                  </div>
                </Col>
              </Row>
            </Col>

            <Col lg="2" className="flex-column justify-content-center d-flex align-items-center ">

              <div className='items-buttons'>
                <button disabled={checkasignbtn} onClick={assign} style={{ backgroundColor: "#246C66" }} className='btn  text-white w-100 py-1 fs-5'><AiOutlineLeft />
                  {t("Assign")}</button>
                <button disabled={checkunasignbtn} onClick={unasign} className='btn btn-danger w-100 py-1 fs-5 my-4'> {t("Un Assign")}<AiOutlineRight />
                </button>

              </div>

            </Col>
            <Col lg="5" className="mb-3">
              <div className="ungrouped">
                <h4 className="mb-3">{t("Un Grouped Vehicles")}</h4>

                <div className="items-ungrouped">
                  <ul>
                    <ul>
                      {allunGroups?.length > 0 ? allunGroups?.map((items) =>
                        <>
                          <li>
                            <input checked={checkinputassing} value={items?.VehicleID}
                              onChange={(e) => {
                                checkboxArray(e.target.checked, "assign", items?.VehicleID)



                              }}

                              type="checkbox" name="346" id="60657" />
                            {items?.DisplayName}

                          </li>
                        </>
                      )
                        : <h2>{t("No Vehicles in this Group")}</h2>}

                    </ul>
                  </ul>

                </div>

              </div>

            </Col>
          </Row>



        </Card.Body>
      </Card>



    </>


  );
};

export default ManageGroupsVehicles;

// // translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["Management", "main"])),
    },
  };
}

// translation ##################################
