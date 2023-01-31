import { Form } from "react-bootstrap";

export default function CustomSelectBox({
  name,
  Label,
  value = "",
  handleChange,
  Options,
  ClassN = "col-12 col-md-6 col-lg-4",
}) {
  return (
    <div className={`${ClassN} mb-3`}>
      <Form.Label>{Label}</Form.Label>
      <Form.Select
        className="border-primary fw-bold"
        name={name}
        value={value}
        aria-label="Default select example"
        onChange={handleChange}
      >
        {Options?.map((ele) => {
          return (
            <option key={ele.name} className="" value={ele.value}>
              {ele.label}
            </option>
          );
        })}
      </Form.Select>
    </div>
  );
}
