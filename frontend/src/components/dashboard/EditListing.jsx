import { useEffect, useState, useContext } from 'react';
import ContainerLoader from "../loaders/ContainerLoader"
import { SessionContext } from '../../context/SessionContext';
import DataTable from "react-data-table-component";
import EditCard from './EditCard';
import DeleteCard from './DeleteCard';
import axios from 'axios';

const EditListing = () => {
  const { sessionData } = useContext(SessionContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const editRow = (row) => {
    setEditedData(row);
    setIsEditOpen(true);
  };

  const deleteRow = (id) => {
    setDeleteId(id)
    setIsDeleteOpen(true)
  };

  const closeEdit = () => {
    setIsEditOpen(false);
  };

  const closeDelete = () => {
    setIsDeleteOpen(false);
  };

  const fetchData = async () => {
    if (!sessionData?.email) return;
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_PORT}/api/get-seller-website/${sessionData?.email}`,{withCredentials : true});
      if (response.status === 200) {
        setListings(response.data);
      }
    } catch (error) {
      console.error(error.message);
      setListings([]);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: "Image",
      selector: (row) => (
        <img height={40} width={80} src={row.image_url.image_url} alt="Listing" />
      ),
    },
    {
      name: "Title",
      sortable: true,
      selector: (row) => row.title,
    },
    {
      name: "Price",
      sortable: true,
      selector: (row) => "NPR " + row.price,
    },
    {
      name: "Price Negotiable",
      selector: (row) => (
        <div style={{ padding: "2px" }}>
          <input type="checkbox" checked={row.negotiable} disabled />
        </div>
      ),
    },
    {
      name: "Price Undisclosed",
      selector: (row) => (
        <div style={{ padding: "2px" }}>
          <input type="checkbox" checked={row.undisclosed} disabled />
        </div>
      ),
    },
    {
      name: "Edit",
      cell: (row) => (
        <button onClick={() => editRow(row)} className='edit-btn'>
          <i className="ri-edit-box-line"></i>
        </button>
      ),
    },
    {
      name: "Remove",
      cell: (row) => (
        <button onClick={() => deleteRow(row.web_id)} className='delete-btn edit-btn'>
          <i className="ri-delete-bin-6-line"></i>
        </button>
      ),
    }
  ];
  
  useEffect(() => {
    fetchData();
  }, [sessionData?.email]);

  if (loading) {
    return (
      <ContainerLoader/>
    );
  }

  if (notFound) {
    return (
      <div style={{ width: '100%', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="product-not-found">
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px' }}>Requested item not found</h2>
          <p style={{ marginBottom: '10px' }}>You have not listed any products for Sale!</p>
          <i style={{ fontSize: '70px' }} className="ri-search-line"></i>
        </div>
      </div>
    );
  }

  return (
    <div className='edit-listing'>
      <DataTable
        columns={columns}
        data={listings}
        pagination
      />

      {isEditOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={closeEdit}>&times;</button>
            <EditCard data={editedData} fetch_function={fetchData} seller_email={sessionData?.email} />
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <DeleteCard delete_id={deleteId} fetch_function={fetchData} closeModal={closeDelete} seller_email={sessionData?.email} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditListing;
