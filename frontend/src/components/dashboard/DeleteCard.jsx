import axios from "axios";
import React, { useState } from "react";

const DeleteCard = ({
  delete_id,
  seller_email,
  closeModal,
  fetch_function,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_PORT}/api/delete-listing`,
        {
          withCredentials: true,
          data: { web_id: delete_id, seller_email },
        }
      );
      if (response.status === 204) {
        fetch_function();
        closeModal();
        return window.success("Deleted successfully");
      }
    } catch (err) {
      window.failure(err?.response?.data?.message || "Please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-container delete-container">
      <h4>Confirm Deletion</h4>
      <p>
        Once you delete this, it cannot be undone or recovered. Please make sure
        you want to proceed before confirming
      </p>
      <button
        disabled={loading}
        onClick={handleDelete}
        className="edit-save-btn dc-delete-btn"
      >
        {loading ? "Please wait..." : "Delete"}
      </button>
      <button
        disabled={loading}
        onClick={closeModal}
        className="edit-save-btn dc-cancel-btn"
      >
        Cancel
      </button>
    </div>
  );
};

export default DeleteCard;
