import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { AddSimValidation } from "helpers/yup-validations/management/sim-management";
import { addSimRequest } from "services/management/SimManagement";

const AddSim = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // options for sim provider for react select
  const simProviderOptions = [
    { value: 1, label: "Mobily" },
    { value: 2, label: "STC" },
    { value: 3, label: "Zain" },
    { value: 4, label: "Lebara" },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const respond = await addSimRequest(data);
      setLoading(false);
      router.push("/management/sim-management");
      toast.success("Sim Card Added Successfully");
    } catch (error) {
      toast.error(error.response.data?.message);
      setLoading(false);
    }
  };

  const initialValues = {
    SimSerialNumber: "",
    PhoneNumber: "",
    ProviderID: 1,
  };

  return (
    <div className="container-fluid">
      <Card>
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={AddSimValidation}
            onSubmit={onSubmit}
          >
            {(formik) => {
              return (
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col className="mx-auto" md={6}>
                      <Row>
                        <h4 className="mb-3">Add a new SIM Card</h4>
                        <Input
                          placeholder="Serial Number"
                          label="Serial Number"
                          name="SimSerialNumber"
                          type="text"
                          className={"col-6 mb-3"}
                          onFocus={(event) => event.target.select()}
                        />

                        <Input
                          placeholder="Phone Number"
                          label="Phone Number"
                          name="PhoneNumber"
                          type="number"
                          min={0}
                          className={"col-6 mb-3"}
                          onFocus={(event) => event.target.select()}
                        />

                        <ReactSelect
                          options={simProviderOptions}
                          label="SIM Provider"
                          placeholder="Select SIM Provider"
                          name="ProviderID"
                          className={"col-12 mb-3"}
                          isSearchable={true}
                        />
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="mx-auto" md={6}>
                      <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                        <Button
                          type="submit"
                          className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0"
                          disabled={loading}
                        >
                          {!loading ? (
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={faCheck}
                              size="sm"
                            />
                          ) : (
                            <FontAwesomeIcon
                              className="mx-2 fa-spin"
                              icon={faSpinner}
                              size="sm"
                            />
                          )}
                          Submit
                        </Button>
                        <Button
                          className="px-3 py-2 text-nowrap me-3 ms-0"
                          onClick={() => {
                            router.push("/management/sim-management");
                          }}
                        >
                          <FontAwesomeIcon
                            className="mx-2"
                            icon={faTimes}
                            size="sm"
                          />
                          Cancel
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddSim;

// translation ##################################
export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["main", "management"])),
    },
  };
}
// translation ##################################
