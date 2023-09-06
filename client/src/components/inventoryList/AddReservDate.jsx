import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const AddReservDate= ()=>{
    const { id } = useParams();
    // const u_id=22;
   const[u_id,set_uid]=useState(0);

    
   
   
    const[info,setAsset]= useState({
        user_id: u_id, // get the user's id and set here---Implement this!
        resource_id: id,
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
        status: "",
        purpose: "",
        reservation_type: "Select a type",
    });
 
    useEffect(() => {
      const getUserInfo = async () => {
        try {
            const res = await axios.get("http://localhost:8800/auth/user");
            //console.log(res.data[0]);
            set_uid(res.data[0].user_id);
           // console.log(res.data[0].user_id);
            setAsset((prev) => ({ ...prev, user_id: res.data[0].user_id }));
  
        } catch (error) {
            console.log(error);
        }
     }
     getUserInfo(); 
      }, []);  

    const handleChange = (e) => {
        setAsset((prev) => ({ ...prev, [e.target.name]: e.target.value }));
       // console.log(info);
      };

    const navigate = useNavigate();

      const handleSave = (e) => {
        e.preventDefault();
        Swal.fire({
          title: "Are you sure?",
          text: " ",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, save it!",
        }).then((result) => {
          if (result.isConfirmed) {
            handleIsConfirmed();
            
          }
        });
      };

      const handleIsConfirmed = async () => {
       
        try {
          const responce = await axios.post(
            "http://localhost:8800/resources/reservedate",
            info
          );
          if(responce.data=="Done"){
           Swal.fire("Saved!", "Reservation Added", "success");      
           navigate("/resources");
          console.log(responce.data);
             }else if(responce.data=="start_end_error"){
              Swal.fire('Warning!', 'Requested ending date should be greater than starting date! ', 'warning');
            }else{
              Swal.fire('Item is unavailable at selected time!', 'Please consider selecting another time slot! ', 'warning');
             }

        } catch (error) {
          console.log(error);
        }
      }; 

      
  const handleClear = (e) => {
    e.preventDefault();
    setAsset({
        user_id: u_id, // get the user's id and set here---Implement this!
        resource_id: id,
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
        status: "",
        purpose: "",
        reservation_type: "Select a type",
    });
  };

      return(

        <div className="container-md">
        <div className="row my-5 ">
          <div className="col-6 bg-primary-subtle mx-auto shadow rounded">
            <h1 className="my-3">Add a Reservation</h1>
  
            <form>
              <div className="row">
                <div className="form-group col">
                  <label htmlFor="name" className="form-label ">
                    Status
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={info.status}
                    onChange={(e) => handleChange(e)}
                    name="status"
                    //placeholder="title"
                  />
                </div>
                <div className="form-group col">
                  <label htmlFor="" className="form-label ">
                    Reservation Type
                  </label>
                  <select
                    className="form-select"
                    name="reservation_type"
                    value={info.reservation_type}
                    onChange={(e) => handleChange(e)}
                  >
                    <option selected disabled>
                      Select a type
                    </option>
                    <option value="On_premises">On premises</option>
                    <option value="Out_premises">Elsewhere</option>
                    
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="form-group col">
                  <label htmlFor="" className="form-label ">
                    Purpose
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    value={info.purpose}
                    id=""
                    name="purpose"
                  />
                </div>
               
              </div>
  
              
         

             
              <div className="row">
                <div className="form-group col">
                  <label htmlFor="" className="form-label ">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id=""
                    onChange={(e) => handleChange(e)}
                    value={info.start_date}
                    name="start_date"
                  />
                </div>
  
                <div className="form-group col">
                  <label htmlFor="" className="form-label ">
                    Start Time
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id=""
                    value={info.start_time}
                    onChange={(e) => handleChange(e)}
                    name="start_time"
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group col">
                  <label htmlFor="" className="form-label ">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id=""
                    onChange={(e) => handleChange(e)}
                    value={info.end_date}
                    name="end_date"
                  />
                </div>
  
                <div className="form-group col">
                  <label htmlFor="" className="form-label ">
                    end_time
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id=""
                    value={info.end_time}
                    onChange={(e) => handleChange(e)}
                    name="end_time"
                  />
                </div>
              </div>


            </form>

            <div className="my-3">
              <button
                type="button"
                className="btn btn btn-success  "
                onClick={(e) => handleSave(e)}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn btn-danger m-2"
                onClick={(e) => handleClear(e)}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>



      );



};

export default AddReservDate;