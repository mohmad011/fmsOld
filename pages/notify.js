import axios from 'axios';
import { getSession } from 'next-auth/client';

import React from 'react'
import { useState , useCallback} from 'react';
import { Button, Card } from 'react-bootstrap'
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from 'react-icons/ai';
import { toast } from 'react-toastify';
import AgGridDT from '../components/AgGridDT';
import AddModal from '../components/notify/AddModal'
import ViewModal from '../components/notify/ViewModal'


const NotifySettings = () => {

  
  const [ allAccounts, setAllAccounts] = useState([])
  const [ updateSettings, setUpdateSettings] = useState(null)
  const [modalShow, setModalShow] = useState(false);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  // get All accounts settings
  const onGridReady = useCallback( async (params) =>{
    try {
      const req = await axios.get('/notify/getAS')
      setAllAccounts(req.data.AccountSettings)
      setGridApi(params.api);
      setGridColumnApi(params.columnApi);
    } catch (error) {
      toast.error('oops something went wrong!, ' + error.message)
    }
  }, [])

  // delete account settings function 
  async function deleteSettings(id){
    try {
    const addRequest = await axios.delete(`/notify/getAS/${id}`)
    toast.success('Account settings deleted successfully.')
    setAllAccounts(prev => prev.filter(item => item.ID !== id))
    return addRequest.data
  } catch (error) {
    toast.error('something went wrong')
    console.log(error)
  }
}

  // account settings table columns
  const columnDefs = [
    {
      headerName: "Actions",
      field: "ID",
      minWidth: 180,
      cellRenderer: (params) => (
        <div className='d-flex gap-1 align-items-center justify-content-center mt-2'>
            <Button
              onClick={() => {
                setUpdateSettings(params.data)
                setViewModalShow(true)
              }}
              variant="primary"
            >
              <AiOutlineEye />
            </Button>
            <Button
              onClick={() =>{
                setModalShow(true)
                setUpdateSettings(params.data)
                }}
              variant="info"
            >
              <AiOutlineEdit  />
            </Button>
            <Button
              onClick={() => deleteSettings(params.data.ID)}
              variant="danger"
            >
              <AiOutlineDelete  />
            </Button>
        </div>
      ),
    },
    {
      headerName: "AccountID",
      field: "AccountID",
      minWidth: 150,
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Emails",
      field: "Emails",
      minWidth: 300,
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Mobiles",
      field: "Mobiles",
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Notify Type",
      field: "NotifyType",
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Notify Channels",
      field: "NotifyChannels",
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Fire Wait Sec",
      field: "FireWaitSec",
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Unfire Wait Sec",
      field: "UnfireWaitSec",
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Notify Wait Sec",
      field: "NotifyWaitSec",
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Custom Settings",
      field: "CustomSettings",
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Modify Time",
      field: "ModifyTime",
      sortable: true,
      unSortIcon: true,
    },
  ];


  return (
    <Card className='mx-3'>
      <Card.Body>
        <Button className='p-2 mb-2' onClick={() => {
          setModalShow(true)
          setUpdateSettings(null)
        }}>Add account settings</Button>
        <AddModal 
        modalShow={modalShow} 
        setModalShow={setModalShow}
        AllAccounts={allAccounts}
        setAllAccounts={setAllAccounts}
        updateData={updateSettings}
         />

         <ViewModal
         show={viewModalShow}
         setShow={setViewModalShow}
         data={updateSettings}
         />
        <AgGridDT
          rowHeight={44} 
          columnDefs={columnDefs}
          rowData={allAccounts}
          onGridReady={onGridReady}
          gridApi={gridApi}
          gridColumnApi={gridColumnApi}
        />
      </Card.Body>
      </Card>
  )
}

export default NotifySettings

// * handle premssions for this page based on user role type
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (session.user.user.role !== 'Admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}