import { useState , useEffect, useContext } from "react";
import categories from "../../assets/Categories";
import { SessionContext } from "../../context/SessionContext";
import WarningCard from "../../assets/WarningCard"
import giveCategoryIdSubCategoryId from "../../assets/GiveCategoryIdSubCategoryId"

const AddWebsite = () => { 
  const[loading , setLoading] = useState(false);
  const {sessionData} = useContext(SessionContext);
  const bodyTag = "<body>"
  const[copyHtmlIcon,setHtmlCopyIcon] = useState(false);
  
  const copyHtmlText = "<small style='display:none;'>SiteDecors-Verified-Listing</small>";

  const copyHtmlCode = () => {
    navigator.clipboard
      .writeText(copyHtmlText)
      .then(() => {
        setHtmlCopyIcon(true);
        setTimeout(()=>{
          setHtmlCopyIcon(false);
        },1000)
      })
      .catch((err) => {
        setHtmlCopyIcon(false);
        console.error("Failed to copy");
      });
  }
  
  const website_data = {
    category : "",
    title : "",
    subcategory : "",
    category_id : -1,
    subcategory_id : -1,
    price : "",
    negotiable : false,
    undisclosed : false,
    description : "",
    technical_description : "",
    assets : [],
    images : [],
    website_url : "",
    video_url : "",
    co_founder : false,
    funds : false,
    seller_email : "",
  }

  const[formData , setFormData] = useState(website_data);

  useEffect(() => {
    if (sessionData?.email) {
      setFormData((prevData) => ({
        ...prevData,
        seller_email: sessionData.email
      }));
    }
  }, [sessionData?.email]); 


  useEffect(()=>{
    const c_s_id = giveCategoryIdSubCategoryId(formData.category , formData.subcategory)
    setFormData((prevData)=>({...prevData , category_id : c_s_id.categoryId}))
    setFormData((prevData)=>({...prevData , subcategory_id : c_s_id.subcategoryId}))
  },[formData.category , formData.subcategory])

 const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const fileValidation = (files)=>{
    const validFiles = files.filter((file) =>
    ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'].includes(file.type)
  );
  if (validFiles.length === 0) return window.failure("Please provide valid files");
  if ((validFiles.length + formData.images.length) > 3) return window.failure("Upload maximum of 3 files")
  validFiles.forEach((file)=>{
    const previewImage = URL.createObjectURL(file);
    setFormData((prevData)=>({...prevData , images : [...prevData.images , {"image":file, "previewImage": previewImage}]}))
  })
  }
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    fileValidation(files)
  };
  const handleImageUpload=(e)=>{
    const files = Array.from(e.target.files)
    fileValidation(files)
  }

  const removeImage = (index) => {
    setFormData((prevData) => ({
      ...prevData, 
      images: prevData.images.filter((_,i) => i !== index), 
    }));
  };

  const handleAssetChange = (e) => {
    const value = e.target.value;
    if(e.target.checked){
      setFormData({...formData , assets : [...formData.assets , value]})
    }else{
      setFormData({...formData , assets : formData.assets.filter((asset)=> asset !== value)})
    } 
  };

  const handleChange=(e)=>{
    let {name , value , type} = e.target;
    if (type === "radio") value = value === "true"
    if (type === "checkbox") value = e.target.checked
    setFormData({...formData , [name] : value});
  }
  
  const handleSubmit = async () => {
    const website_url_regex =  /^https:\/\/(www\.)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(:[0-9]{1,5})?(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/;
    const yt_regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})(\S*)$/

    for (let key in formData) {
      const value = formData[key];
      setLoading(false);
      if (key === "video_url" && value.trim() !== "" && !yt_regex.test(value)) return window.failure("Provide a valid YouTube URL");
      if ((key === "technical_description" || key === "description") && value.trim().length <= 100)  return window.failure('Description must be longer');
      if ((key === "technical_description" || key === "description") && value.trim().length > 300)  return window.failure('Description must short');
      if (key === "title" && (value.trim().length >= 50))  return window.failure('Title exceeds the limit');
      if (key === "title" && (value.trim().length <= 0 || value.trim().length <= 0))  return window.failure('Title cannot be empty');
      if (key === "price" && (value > 20000))  return window.failure('Maximum price is 20,000');
      if (key === "price" && (value <= 0))  return window.failure('Provide valid price');
      if (key === "website_url" && !website_url_regex.test(value)) return window.failure("Provide a valid website URL")
      if (key === "images" && Array.isArray(value) && value.length === 0) return window.failure("Image is required") 
      if (key === "assets" && Array.isArray(value) && value.length <= 1) return window.failure("Minimum 2 assets required") 
      if (typeof value === "string" && key !== "video_url" && value.trim() === "") return window.failure("Fields can't be empty");  
    }
    setLoading(true);
    const newFormData = new FormData();
    for(let key in formData){
      if(Array.isArray(formData[key]) && key === "images"){
        formData[key].forEach((item)=>{
          newFormData.append("images",item.image)
        })
      }else if(Array.isArray(formData[key]) && key === "assets"){
        formData[key].forEach((item)=>{
          newFormData.append("assets",item);
        })
      }
      else{
        newFormData.append(`${key}`,formData[key])
      }
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_PORT}/api/add-website`, {
        method: "POST",
        body: newFormData,
        credentials : "include",
      });
      const data = await response.json();
      if (response.ok && response.status === 201) {
        window.success(data.message);
        return setFormData(website_data);
      } else {
        window.failure(data.message); 
      }
    } catch (err) {
      window.failure("Please try again later"); 
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <>
    <WarningCard message={"Please verify the price, description, website's landing page URL, category, and subcategory before submission, as these details cannot be modified later"} />
    <div className="add-page">
      <div className="columns">
        <div className="column">
          <div style={{position:"relative"}} className="container">
            <h3>General Information</h3>
            <label>Title&nbsp;{formData.title.length === 0 ? <small>(maximum 50 characters)</small> : <small>(currently using {formData.title.length} characters)</small>}</label>
            <input name="title" onChange={handleChange} value={formData.title} placeholder="e.g, Automated ecommerce website for sale" type="text" />
            {/* Categories and subcategories */}
            <label>Category</label>
            <select 
              onChange={handleChange} 
              name="category"
              value={formData.category || ""}
            >
              <option value="" disabled>Select category</option>
              {categories.map((category, index) => (
                <option 
                  key={index} 
                  value={category.name.toLowerCase().replace(/ /g, "-")}
                >
                  {category.name}
                </option>
              ))}
            </select>
            {
              categories.map((cat)=>(
                cat.name.toLowerCase().replace(/ /g , "-") === formData.category.toLowerCase().replace(/ /g, "-") ? 
                (<>
                  <label>Sub Category</label>
                  <select defaultValue={""} onChange={handleChange} name="subcategory">
                    <option disabled value="">Select Subcategory</option>
                    {
                  cat.subcategories.map((subcategory)=>(
                    <option value={subcategory.toLowerCase().replace(/ /g , "-")}>{subcategory}</option>
                  ))}
                  </select>
                  </>
                )
                 : 
                (
                  <></>
                )
              ))
            }

            <label>Description&nbsp;{formData.description.length === 0 ? <small>(minimum 100 characters)</small> : <small>(currently using {formData.description.length} characters)</small>}</label>
            <textarea onChange={handleChange} name="description" value={formData.description} placeholder="e.g, Description about the website you are lisitng"></textarea>
          </div>

          <div className="container">
            <h3>Technical Details</h3>
            <label>What buyer needs to know? &nbsp;{formData.technical_description.length === 0 ? <small>(minimum 100 characters)</small> : <small>(currently using {formData.technical_description.length} characters)</small>}</label>
            <textarea onChange={handleChange} name="technical_description" value={formData.technical_description} placeholder="e.g, Details about included hosting services, integrations like Cloudinary , Firebase, or any limitations buyers should be aware of..."></textarea>

            <label>Assets buyer will be recieving after purchase</label>
            <div className="items-sold">
                <input checked={formData.assets.includes("Code Files")} value="Code Files" onChange={handleAssetChange} name="assets" id="code" type="checkbox" />
                <label htmlFor="code">Code Files</label>
                <input checked={formData.assets.includes("Design Files")} value="Design Files" onChange={handleAssetChange} name="assets" id="designFiles" type="checkbox" />
                <label htmlFor="designFiles">Design Files</label>
                <input checked={formData.assets.includes("Domain")} value="Domain" onChange={handleAssetChange} name="assets" id="domain" type="checkbox" />
                <label htmlFor="domain">Domain Name</label>
                <input checked={formData.assets.includes("Hosting Credentials")} value="Hosting Credentials" onChange={handleAssetChange} name="assets" id="hosted_account" type="checkbox" />
                <label htmlFor="hosted_account">Hosting Credentials</label>
                <input checked={formData.assets.includes("Email Account")} value="Email Account" onChange={handleAssetChange} name="assets" id="email_account" type="checkbox" />
                <label htmlFor="email_account">Email Account</label>
            </div><br/><br/>
            <small>Hosting credentials refers to login details of that particular platform where your website is hosted</small>
          </div>

          <div className="container price-container">
            <h3>Pricing Details </h3>
            <label>Price<small>&nbsp;(maximum 20,000 NPR)</small></label>
            <input onChange={handleChange} name="price" value={formData.price} type="number" placeholder="Enter price" />

            <div className="negotiable">
                <div>
                    <input checked={formData.negotiable} onChange={handleChange} id="negotiable" name="negotiable" type="checkbox" />
                    <label htmlFor="negotiable">Negotiable</label>
                </div>
                <div>
                    <input checked={formData.undisclosed} onChange={handleChange} id="undisclosed" name="undisclosed" type="checkbox" />
                    <label htmlFor="undisclosed">Undisclosed</label>
                </div>
            </div>
          </div>
          
        </div>

        <div className="column">

          <div className="container">
            <h3>Upload Image</h3>
            <div onDragOver={handleDragOver} onDrop={handleDrop} className="drag-drop">
              <i className="ri-image-add-fill"></i>
              <p>Drag & Drop upto 3 images or <span onClick={()=>document.getElementById("fileInput").click()}>click</span> to upload</p>
              <input accept="image/*" onChange={handleImageUpload} id="fileInput" type="file" multiple style={{display :"none"}}/>
              <small>Png , Jpg , Webp formats only</small>
            </div>
            {formData.images && formData.images.length > 0 ? (
                formData.images.map((image, index) => (
                  <div key={index} className="websiteImage">
                    <div onClick={()=>removeImage(index)} className="closeImage"><span>< i className="ri-close-line"></i></span></div>
                    <img width={100} height={100} key={index} src={image.previewImage} alt={`Upload`} />
                  </div>
                ))
              ) : (
                ""
              )}
          </div>

          <div className="container">
            <h3>Additional Information</h3>

            <label>Website's landing page url</label>
            <input onChange={handleChange} value={formData.website_url} name="website_url" type="url" placeholder="e.g, https://sitedecors.com/" />

            <label>Explanation video url (<small>optional</small>)</label>
            <input  onChange={handleChange} value={formData.video_url}  name="video_url" type="url" placeholder="e.g, https://www.youtube.com/watch?v=abcdef12345" />

            <div className="check-group">
              <p>Are you seeking for co-founder?</p>
              <div className="label-check">
                <input
                  onChange={handleChange}
                  id="co-founder-yes"
                  name="co_founder"
                  value="true" 
                  checked={formData.co_founder === true} 
                  type="radio"
                />
                <label htmlFor="co-founder-yes">Yes</label>

                <input
                  onChange={handleChange}
                  id="co-founder-no"
                  name="co_founder"
                  value="false" 
                  checked={formData.co_founder === false} 
                  type="radio"
                />
                <label htmlFor="co-founder-no">No</label>
              </div>
            </div>

            <div className="check-group">
              <p>Are you seeking for funds?</p>
              <div className="label-check">
                <input
                  onChange={handleChange}
                  id="funds-yes"
                  value="true" 
                  checked={formData.funds === true} 
                  name="funds"
                  type="radio"
                />
                <label htmlFor="funds-yes">Yes</label>

                <input
                  onChange={handleChange}
                  id="funds-no"
                  value="false" 
                  checked={formData.funds === false} 
                  name="funds"
                  type="radio"
                />
                <label htmlFor="funds-no">No</label>
              </div>
            </div>
          </div>
          <div className="container owner">
            <h3>Ownership</h3>
            <label>Verification Code</label>
            <div className="ownership-code">
              <span>
                {copyHtmlText}
              </span>
              <div onClick={copyHtmlCode} className="copy-icon">
                {copyHtmlIcon === true ? <i className="ri-check-double-line"></i> : <i className="ri-clipboard-fill"></i>}
              </div>
            </div>
            <small>Add the above code to your main landing page (index.html) just below your {bodyTag} tag to verify your listing. Your listing will be verfied ASAP! </small>
          </div>
        </div>
      </div>
    </div>
      <div className="submit-row">
      <div className="btn-grp">
        <button disabled={loading === true ? true : false} onClick={handleSubmit} className="upload">{loading === true ? "Please wait..." : "Publish your listing"}</button>
        <button onClick={() => setFormData(website_data)} className="reset">Reset All</button>
      </div>
    </div>
    </>
  );
};

export default AddWebsite;
