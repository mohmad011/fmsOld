import React from "react";
const EmptyMess = ({ msg }) => {
  return (
    <>
      <div
        style={{ height: "245px" }}
        className="d-flex align-items-center justify-content-center fs-4 text-black-50"
      >
        {msg}
      </div>
    </>
  );
};
export default EmptyMess;
