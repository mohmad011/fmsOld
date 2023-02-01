import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import Link from "next/link";

// icons
import { FiUsers } from "react-icons/fi";
import { BiCar, BiCreditCardAlt } from "react-icons/bi";
import { BsSdCard } from "react-icons/bs";
import { VscGroupByRefType } from "react-icons/vsc";
import { MdOutlineSensors } from "react-icons/md";
import { RiUserSettingsLine } from "react-icons/ri";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSession } from "next-auth/client";
const Management = () => {
  const { t } = useTranslation("Management");
  const { user } = useSession()[0]?.user;

  const iconStyle = {fontSize:'3.5rem'}

  const cardsData = [
    {
      title: t("Manage_Your_Accounts"),
      desc: t("To manage your Accounts and add new accounts click here"),
      icon: <FiUsers style={iconStyle} />,
      path: `/management/account-management/${user?.id || ''}`,
      btnTitle:t('Manage_Accounts')
    },
    {
      title: t("Manage_Your_Users"),
      desc: t("To manage your Users, Add new Users, Manage User's Vehicles and Edit Users Role please click here"),
      icon: <RiUserSettingsLine style={iconStyle} />,
      path: "/management/account-management/manageUsers",
      btnTitle:t('Manage Users')
    },
    {
      title: t("Manage_Your_Vehicles"),
      desc: t("To manage your Vehicles please click here"),
      icon: <BiCar style={iconStyle} />,
      path: "/management/VehicleManagment",
      btnTitle:t('Manage Vehicles')
    },
    {
      title: t("Manage_Your_Devices"),
      desc: t("To manage your devices and assign devices to your vehicle please click here"),
      icon: <MdOutlineSensors style={iconStyle} />,
      path: "/management/device-management",
      btnTitle:t('Manage Devices')
    },
    {
      title: t("Manage_Your_SIM_Cards"),
      desc: t("To manage your SIM Cards please click here"),
      icon: <BsSdCard style={iconStyle} />,
      path: "/management/sim-management",
      btnTitle:t('Manage SIM Cards')
    },
    {
      title: t("Manage_Your_Drivers"),
      desc: t("To manage your drivers and assign drivers to your vehicle please click here"),
      icon: <FiUsers style={iconStyle} />,
      path: "/driversManagement",
      btnTitle:t('Manage Drivers')
    },
    {
      title: t("Manage_Your_Groups"),
      desc: t("To manage your drivers and assign drivers to your vehicle please click here"),
      icon: <VscGroupByRefType style={iconStyle} />,
      path: "/management/ManageGroupsVehicles",
      btnTitle:t('Manage Groups')
    },
    {
      title: t("Manage_Your_Payments"),
      desc: t("To manage your invoice"),
      icon: <BiCreditCardAlt style={iconStyle} />,
      path: `/payment/${user?.id || ''}`,
      btnTitle:t('Manage Payments')
    }]

  return (
    <div className="mx-3">
      <Row>
        {cardsData.map(({ title, desc, icon, path, btnTitle }, idx) => {
          return (
            <Col md="6" key={idx}>
              <Card className="shadow-sm border-1" style={{height:'calc(100% - 2rem)'}}>
                <Card.Body>
                  <Row>
                    <Col
                      sm={3}
                      className="mx-auto text-center d-flex align-items-center justify-content-center"
                    >
                      {icon}
                    </Col>
                    <Col sm={9}>
                      <h5 className="mb-2">{title}</h5>
                      <p className="mb-3 fs-6">{desc}</p>
                      <Link 
                        href={path}
                        replace>
                        <a className='btn px-3 py-2 btn-primary'>{btnTitle}</a>
                      </Link>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["Management", "main"])),
    },
  };
}

export default Management;