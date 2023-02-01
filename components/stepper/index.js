import { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import Stack from "@mui/material/Stack";

import StepLabel from "@mui/material/StepLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWrench,
  faPencil,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { Button } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

import Report from "./Report";
import Cars from "./Cars";
import AdditionalData from "./AdditionalData";

// get steps
const steps = ["step 1", "step 2", "step 3"];

// get step content
function getStepContent(step) {
  switch (step) {
    case 0:
      return <Report />;
    case 1:
      return <Cars />;
    case 2:
      return <AdditionalData />;
    default:
      return "Unknown step";
  }
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#1e8178",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#1e8178",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 1,
    border: 0,
    width: "calc(100% - 10px )",
    margin: "0 auto",
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor: "transparent",
  border: "1px solid #c8c8c8",
  zIndex: 1,
  color: "#c8c8c8",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    border: "1px solid #1e8178",
    color: "#1e8178",
  }),
  ...(ownerState.completed && {
    border: "1px solid #1e8178",
    color: "#1e8178",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <FontAwesomeIcon icon={faWrench} size="md" />,
    2: <FontAwesomeIcon icon={faWrench} size="md" />,
    3: <FontAwesomeIcon icon={faWrench} size="md" />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

export default function CustomizedSteppers() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const router = useRouter();


  const initialInputValues = {
    Description: "",
    FrequencyTitle: "",
    ReportTitle: "",
  };


  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleCancel = () => {
    router.push("/scheduledReports");
  };

  return (
    <>
      <Stack sx={{ width: "100%" }} spacing={4} className="my-4">
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<ColorlibConnector />}
        >
          {steps.map((label, index) => {
            const stepProps = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Stack>

      <Formik initialValues={{ initialInputValues }}  >
        {getStepContent(activeStep)}
      </Formik>

      <div className="d-flex align-items-center justify-content-end mb-2"  >
        <Button
          className={
            activeStep === 0
              ? "d-none"
              : "d-flex px-3 py-1 fs-5 bg-transparent text-primary"
          }
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Previous
        </Button>
        <Button
          variant="primary px-3 py-1 fs-5"
          className="m-1"
          onClick={handleNext}
        >
          {activeStep === steps.length - 1 ? "Save" : "Contine"}
        </Button>

        <Button
          variant=" px-3 py-1 fs-5"
          className="m-1 bg-soft-primary"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </>
  );
}
