import { async } from '@firebase/util';
import axios from 'axios';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import { IoCarSportSharp } from 'react-icons/io'
import { fetchAllAssignUsers } from '../../../../../services/management/ManagneVehicles';
import "rc-tree/assets/index.css";
import Tree, { TreeNode } from "rc-tree";

const userManages = () => {
    const router = useRouter();
    const [user, setUser] = useState(null)
    const [AssignedVehicles, setAssignedVehicles] = useState([])
    const [UnAsssignedVehicles, setUnAssignedVehicles] = useState([])

    const { id } = router.query;


    // function to group 
    var groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key === null ? 'Upgrouped' : key]] = rv[x[key === null ? 'Upgrouped' : key]] || []).push(x);
            return rv;
        }, {});
    };



    const GetUser = async () => {
        const response = await fetchAllAssignUsers();
        const filtered = response.users.find((items) => items.ProfileID == id);
        const { data } = filtered && await axios.get(`dashboard/management/users/${filtered?.ASPNetUserID}`);
        // group by assign vehicles 
        const dataassignvehicles = Object.entries(groupBy(data.assignedVehicles, 'GroupName'));
        const Undataassignvehicles = Object.entries(groupBy(data.unAssignedVehicles, 'GroupName'));
        setAssignedVehicles(dataassignvehicles)
        setUnAssignedVehicles(Undataassignvehicles)
        setUser(filtered)
    }

    console.log("Assignes ", AssignedVehicles)

    useEffect(() => {
        GetUser()

    }, [])

    const loop = (data) =>
        data?.map((item, index) => {
            console.log(item, item[1])
            if (item[1]?.length > 0) {
                return (
                    <TreeNode
                        key={`${item[0]}`}
                        data={item}
                        defaultExpandAll={true}
                        autoExpandParent={true}
                        title={
                            <span
                                className="d-flex align-items-center"
                                style={{
                                    fontSize: "12px",
                                }}
                            >
                                {item[0]}
                                {/* <span className="badge bg-secondary px-1 mx-2">
                          {item?.title === "All" ? badgeCount : item.children?.length}
                        </span> */}
                            </span>
                        }
                        icon={<i class="fa fa-car" />}
                    >
                        {loop(item[1])
                        }
                    </TreeNode >
                )
            }

            return (
                <TreeNode
                    className="foo"
                    key={item?.VehicleID}
                    icon={<i class="fa fa-car" />}

                    data={item}

                    isLeaf={true}
                    title={
                        <div className="d-flex align-items-center">
                            <div
                                className="me-1"

                                style={{ fontSize: "10px" }}
                            >
                                {item?.PlateNumber}
                            </div>
                        </div>
                    }
                />
            );

        })
    const onCheck = (selectedKeys, info) => {
        console.log("data", selectedKeys, info)
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <div className="d-flex align-items-center">
                        <h3>User : </h3>
                        <h4 className="mb-0 ms-3 mt-2 " style={{ color: "#075F68" }}>{user ? user?.FirstName + " " + user?.LastName : "Loading..."}</h4>


                    </div>
                    <Row className='my-3'>
                        {/* Assign Vehicles */}
                        <Col md="5">
                            <div style={{ minHeight: "100vh", maxWidth: "auto", overflowY: 'auto' }} className='items'>
                                <div className='rounded-1' style={{ backgroundColor: "#397A74" }}>
                                    <h3 className='text-white px-3 py-2 '>Assign Vehicles </h3>

                                    <div className=' border border-top-0 border-2 border-solid border-muted rounded-bottom-2  bg-white shadow-sm' style={{
                                        height: 'calc(100vh - 240px)',
                                        overflow: 'hidden  scroll',
                                    }}>
                                        {AssignedVehicles.length > 0 ?
                                            <>
                                                <Tree
                                                    checkable
                                                    selectable={false}
                                                    showLine={true}
                                                    defaultExpandAll
                                                    autoExpandParent={true}
                                                    onCheck={onCheck}
                                                    showIcon
                                                >
                                                    {loop(AssignedVehicles)}
                                                </Tree>


                                            </> : 'Loading Dataa......'}
                                    </div>
                                </div>

                            </div>
                        </Col>
                        {/* two buttons */}
                        <Col md="2">
                            <div className='d-flex flex-column justify-content-center' style={{ minHeight: "70vh", maxWidth: "auto" }}>
                                <button className='btn btn-info mb-3 py-2  fw-bolder'>Assign</button>
                                <button className='btn btn-success py-2  fw-bolder'>UnAssign</button>

                            </div>
                        </Col>


                        {/* un Assign Vehicles */}
                        <Col md="5">
                            <div style={{ minHeight: "100vh", maxWidth: "auto", overflowY: 'auto' }} className='items'>
                                <div className='rounded-1' style={{ backgroundColor: "#397A74" }}>
                                    <h3 className='text-white px-3 py-2 '>UnAssign Vehicles </h3>

                                    <div className=' border border-top-0 border-2 border-solid border-muted rounded-bottom-2  bg-white shadow-sm' style={{
                                        height: 'calc(100vh - 240px)',
                                        overflow: 'hidden  scroll',
                                    }}>
                                        {UnAsssignedVehicles.length > 0 ?
                                            <>
                                                <Tree
                                                    checkable
                                                    selectable={false}
                                                    showLine={true}
                                                    defaultExpandAll
                                                    autoExpandParent={true}
                                                    onCheck={onCheck}
                                                    showIcon
                                                >
                                                    {loop(UnAsssignedVehicles)}
                                                </Tree>


                                            </> : 'Loading Dataa......'}
                                    </div>
                                </div>

                            </div>
                        </Col>
                    </Row>

                </Card.Body>

            </Card>

        </>
    )
}


export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["Management", "main"])),
        },
    };
}
export default userManages