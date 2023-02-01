import { useState, useEffect } from "react";
import Select from "react-select";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { fetchAllReportsTypes } from "services/scheduledReports";
import { Field, ErrorMessage } from "formik";
import ReactSelect from "components/Select";


const options = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const days = [
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
];



const Report = () => {
  const [reportsType, setReportsType] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Daily");

  useEffect(async () => {
    const res = await fetchAllReportsTypes();
    console.log(res);
    setReportsType(res.report);
  }, []);

  const handleChange = (e) => {
    setSelectedOption(e.value);
  };

  const renderSwitch = (param) => {
    switch (param) {
      case "daily":
        return (
          <>
            <p className="mb-1">Hour</p>
            <TextField
              ampm={false}
              id="time"
              type="time"
              defaultValue="07:30"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300,
              }}
              sx={{ width: 150 }}
              onChange={(e) => console.log(e.target.value)}
            />
          </>
        );
      case "weekly":
        return (
          <div className="d-flex align-items-center gap-5">
            <div>
              <p className="mb-1">Day</p>
              <Select
                onChange={handleChange}
                placeholder="Saturday"
                options={days}
              />
            </div>
            <div>
              <p className="mb-1">Hour</p>
              <TextField
                ampm={false}
                id="time"
                type="time"
                defaultValue="07:30"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300,
                }}
                sx={{ width: 100 }}
                onChange={(e) => console.log(e.target.value)}
              />
            </div>
          </div>
        );
      case "monthly":
        return (
          <div className="d-flex align-items-center gap-5">
            <div>
              <p className="mb-1">Day</p>
              <TextField
                id="date"
                type="date"
                defaultValue="2017-05-24"
                sx={{ width: 220 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div>
              <p className="mb-1">Hour</p>
              <TextField
                ampm={false}
                id="time"
                type="time"
                defaultValue="07:30"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300,
                }}
                sx={{ width: 100 }}
                onChange={(e) => console.log(e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return (
          <>
            <p className="mb-1">Hour</p>
            <TextField
              ampm={false}
              id="time"
              type="time"
              defaultValue="07:30"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300,
              }}
              sx={{ width: 150 }}
              onChange={(e) => console.log(e.target.value)}
            />
          </>
        );
    }
  };

  return (
    <>
      <div className="col-md-4">
        <h3 className="bg-primary text-white text-center py-2 rounded mb-3">
          Report Included
        </h3>

        <div className="bg-soft-primary  border p-3">
          {reportsType.map((e) => (
            <div
              key={e.ReportID}
              className="d-flex align-items-center gap-2 mb-3"
            >
              <input
                type="checkbox"
                id={e.ReportID}
                name={e.ReportResourceTitle}
                value={e.ReportTitle}
              />
              <label for={e.ReportID}>{e.ReportResourceTitle}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="col-md-8">
        <div className="mb-5">
          <p className="mb-1">Schedule Frequency</p>
          <Select
            onChange={handleChange}
            placeholder="Daily"
            options={options}
          />
        </div>

        <div>{renderSwitch(selectedOption)}</div>
      </div>
    </>
  );
};

export default Report;
