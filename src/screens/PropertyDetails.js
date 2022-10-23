import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
import Swal from 'sweetalert2';

function PropertyDetails() {
  
  const user = useSelector(state => state.user)

  const navigate = useNavigate()
  const [property, setProperty] = useState({})

  const [loading, setLoading] = useState(false);

  const { propertyId } = useParams()
  console.log(`propertyId ${propertyId}`)

  const CONFIG_OBJ = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
};

  const getPropertyDetails = async () => {
    const result = await axios.get(`${API_URL}/viewProperties/${propertyId}`)
    setProperty(result.data.property)
  }

  const contactOwner = () => {
    if(localStorage.getItem("token")){//user is logged in
        setLoading(false);
        let emailBody = `User name: ${user.user.fname} ${user.user.lname} <br/> User email: ${user.user.email} <br/> User phone: ${user.user.phone} <br/> Owner name: ${property.user.fname} ${property.user.fname} <br/> Owner phone: ${property.user.phone} <br/> Owner property: ${property.description}`
        const request = { from: "souravtandi10@gmail.com", to: "obify.consulting@gmail.com", subject: "contact owner", body: emailBody };
        axios.post(`${API_URL}/sendEmail`, request, CONFIG_OBJ)
          .then((data) => {
            if (data) {
              console.log("email sent")
              Swal.fire({
                icon: 'info',
                title: 'Owner contacted successfully...',
                text: 'Owner will get back to you on your registered phone no. within 24hrs',
              });
            }
          })
          .catch((err) => {
            console.log(err + "email not sent")
          })
        
    }else{
      navigate('/register')
    }
  }

  useEffect(() => {
    getPropertyDetails()
  }, [])
  return (
    <div className='container'>
      <h3 className='text-center mt-2 shadow' style={{ color: "F62459" }}>Property Details</h3>
      <Link to={"/allProperties"} className= 'btn btn-outline-primary'>Go Back <i className="fa-solid fa-circle-arrow-left"></i></Link>
      {loading ? <div className='text-center mt-5'>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div> : ''}
      <div className='profileDtls my-3'>
        <div className='pimg col-8 me-2'>
          <img src={`${API_URL}/files/${property.propertyImgName}`} className="card-img-top" alt="..." />
        </div>
        <div className="col-lg-5">
              <div className="card mb-4">
                <div className="card-body">
                <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Title</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{property.title}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Description</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{property.description}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Price</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{property.price}</p>
                    </div>
                  </div>
                  <hr />
                  <button onClick={()=>{contactOwner()}} className='btn btn-primary'>Contact Owner</button>
                </div>
              </div>
            </div>
      </div>
    </div>

  )
}

export default PropertyDetails