import React, { useEffect, useState } from "react";
import { Row, Col, Form, Card, Button } from "react-bootstrap";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { userConfigImg } from "../lib/slices/config";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";



const Setting = () => {
  const { t } = useTranslation("setting");
  const { config } = useSelector((state) => state);
  const dispatch = useDispatch();


  // use Form
  // const { register, handleSubmit } = useForm();
  // upload image to server
  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [check, setCheck] = useState(false)
  const handleFileChange = (event) => {
    console.log(event.target.files);

    setImage(event.target.files[0]);
    setImage2(URL.createObjectURL(event.target.files[0]));
    // console.log(image);
  };

  //
  console.log("config", config)
  const handleSubmitImage = async (event) => {
    setCheck(true)
    event.preventDefault();
    event.persist();
    let formData = new FormData();
    formData.append("image", image);

    // console.log(formData.get("image"));

    try {
      await axios
        .put("config", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response?.data?.updateUser?.image);
          dispatch(userConfigImg(response?.data?.updateUser?.image));
          toast.success("Image Uploaded Successfully");
          setCheck(false)
          // dispatch(getUserImage(response?.data?.updateUser?.image))
        });
    } catch (error) {
      toast.error("please upload image type JPG OR JPEG OR PNG !");
      setCheck(false)
      console.log(error.message);
    }
  };

  // another use effect
  useEffect(() => {
    const fetchAllMaintenance = async () => {
      await axios
        .post(`vss`)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    };
    fetchAllMaintenance();
  }, []);

  useEffect(() => {
    const getImage = async () => {
      const res = await axios("config");
      dispatch(userConfigImg(res?.data?.configs[0]?.image))
      console.log(res.data.configs[0].image);
      setImageUrl(res.data.configs[0].image);
    };

    getImage();
  }, [imageUrl]);

  return (
    <Card>
      <Card.Body className="py-4">
        <h3 className="mb-4 ">{t("change image")}</h3>
        <Form id="form" className="text-center mt-3 mx-auto">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="position-relative mb-2">
              <input id="upload" accept="image/*" type="file" className="d-none" onChange={handleFileChange} />
              <div className="show-user-image ">
                {imageUrl && (<img src={image2 || imageUrl} alt="user" />
                )}
              </div>

              <label htmlFor="upload" style={{ cursor: "pointer" }} className="btn btn-primary text-white next  shadow-none position-absolute pos-icon">
                <FiUpload color="white" size={"1.2rem"} />
              </label>
            </div>
          </div>

          <Button type="button" name="next" className="btn btn-primary next action-button  px-4 py-2 shadow-none" value="submit" onClick={handleSubmitImage}
          > {check ? 'Loading...' : t("change image")}  </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Setting;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["setting", "main"])),
    },
  };
}
// translation ##################################
