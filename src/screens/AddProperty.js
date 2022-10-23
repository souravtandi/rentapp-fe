import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2';

function AddProperty() {

  const { propertyId } = useParams()
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [price, setPrice] = useState()
  const [image, setImage] = useState({ preview: '', data: '' })
  const [status, setStatus] = useState('')

  const handleImgChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    }
    setImage(img)
  }

  const navigate = useNavigate()

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  };


  const getPropertyById = async (propertyId) => {
    const property = await axios.get(`${API_URL}/viewProperties/${propertyId}`)
    setTitle(property.data.property.title)
    setDescription(property.data.property.description)
    setPrice(property.data.property.price)
    let img = { preview: `http://localhost:5000/files/${property.data.property.propertyImgName}`, data: '' }
    setImage(img)
  }
  useEffect(() => {
    if(propertyId){
      getPropertyById(propertyId)
    }
    
  }, []);

  const addProperty = (event) => {
    event.preventDefault();
    let formData = new FormData()
    formData.append('file', image.data)
    axios.post('http://localhost:5000/uploadFile', formData)
    .then((data)=>{
        setStatus(data.statusText)
        const request = { title, description, price, imgName: data.data.fileName, userId: localStorage.getItem("id") };
        let url = `${API_URL}/addProperties`;
        let msg = 'Property added successfully...';
        if (propertyId) {
          url = `${API_URL}/editProperty/${propertyId}`;
          msg = 'Property modified successfully...';
          axios.put(url, request, CONFIG_OBJ)
            .then((data) => {
              if (data) {
                Swal.fire({
                  icon: 'success',
                  title: 'Property modified successfully',
                  text: 'We will email you once Refresh is completed!',
                });
                navigate("/properties")
              }
            })
            .catch((err) => {
              Swal.fire({
                icon: 'error',
                title: 'Property not modified'
              });
            })
        }
        else {
          axios.post(url, request, CONFIG_OBJ)
            .then((data) => {
              if (data) {
                Swal.fire({
                  icon: 'success',
                  title: 'Property added Successfully',
                  text: 'We will email you once Refresh is completed!',
                });
                navigate("/properties")
              }
            })
            .catch((err) => {
              Swal.fire({
                icon: 'error',
                title: 'Property not added'
              });
            })
        }
    })
    .catch((err)=>{
      console.log(err);
    })
    
  }

  return (
    <div className='container py-3 mb-3'>
      <h3 className='text-center my-2 shadow'>{propertyId ? "Edit" : "Add"} Property</h3>
      <form onSubmit={(event) => addProperty(event)} className='form-container mx-auto'>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input onChange={(event) => setTitle(event.target.value)} value={title} type="text" className="form-control" id="title" required />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input onChange={(event) => setDescription(event.target.value)} value={description} type="text" className="form-control" id="description" required />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input onChange={(event) => setPrice(event.target.value)} value={price} type="number" className="form-control" id="price" required />
        </div>
        <div className="mb-3">
            {image.preview && <img src={image.preview} width='100' height='100' />}
            <hr></hr>
            <input type='file' name='file' onChange={handleImgChange}></input>
            {status && <h4>{status}</h4>}
        </div>
        <div className='d-grid mt-3'>
          <button type="submit" className="btn btn-success">{propertyId ? "Update" : "Add"}</button>
        </div>
      </form>
    </div>
  )
}

export default AddProperty