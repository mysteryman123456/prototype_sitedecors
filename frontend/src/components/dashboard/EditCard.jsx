import React, { useState } from 'react';
import axios from "axios";

const EditCard = ({data , seller_email , fetch_function : fetchData}) => {
  const  {image_url , ...updatedEditedData } = data
  const [updatedData, setUpdatedData] = useState(updatedEditedData);
  const[loading , setLoading] = useState(false)

  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    if (type === "checkbox") value = checked;
    setUpdatedData((prevData) => ({ ...prevData, [name]: value}));
  };

  const handleUpdate = async ()=>{
    if(updatedData.title.trim().length > 50) return window.failure("Title exceeds the limit")
    if(updatedData.title.trim().length <= 0) return window.failure("Title must be longer")
    if(updatedData.technical_description.trim().length < 100) return window.failure("Description must be 100 characters")
    if(updatedData.technical_description.trim().length > 300) return window.failure("Description must be shorter")
    if(updatedData.video_url.trim() !== "" && !/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})(\S*)$/.test(updatedData.video_url)) return window.failure("Invalid YouTube video url");
    setLoading(true)
    try{
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_PORT}/api/update-listing`,{...updatedData , seller_email},{withCredentials : true})
      if(response.status === 200) {
        fetchData()
        return window.success(response.data.message)
      }
    }catch(err){
      console.error(err?.response?.data?.message)
      window.failure("Please try again later")
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div className='edit-container'>
      <label htmlFor='title'>Title&nbsp;<small>{updatedData.title.length !== 0 && (`(currently using ${updatedData.title.length} characters)`)}&nbsp;- maximum 50 characters</small></label>
      <textarea  autoComplete='off' id='title' value={updatedData.title} name='title' onChange={handleChange} />
      <label htmlFor='tech_desc'>What buyer needs to know?&nbsp;<small>{updatedData.technical_description.length !== 0 && (`(currently using ${updatedData.technical_description.length} characters)`)}&nbsp;- maximum 300 characters</small></label>
      <textarea autoComplete='off' id='tech_desc' style={{minHeight:"70px"}} value={updatedData.technical_description} name='technical_description' onChange={handleChange} />
      <label htmlFor='video_url'>Video URL&nbsp;<small>(optional)</small></label>
      <input  autoComplete='off' id='video_url' type="text" placeholder='Explantaion video url' value={updatedData?.video_url || ""} name='video_url' onChange={handleChange} />
      <div className="edit-checkbox-group">
        <label><input type="checkbox" checked={updatedData.negotiable} name='negotiable' onChange={handleChange} />Price Negotiable</label>
        <label><input type="checkbox" checked={updatedData.undisclosed} name='undisclosed' onChange={handleChange} />Price Undisclosed</label>
        <label><input type="checkbox" checked={updatedData.co_founder} name='co_founder' onChange={handleChange} />Looking for Co-founder ?</label>
        <label><input type="checkbox" checked={updatedData.funds} name='funds' onChange={handleChange} />Seeking Funds ?</label>
      </div>
      <div className='edit-btn-layer'>
          <button disabled={loading === true ? true : false} onClick={handleUpdate} className='edit-save-btn'>{loading === true ? "Please wait..." : "Modify details"}</button>
      </div>
    </div>
  );
};

export default EditCard;
