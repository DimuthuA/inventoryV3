import express from "express";
import db from "../dataBase/db.js";

const resourceRouter = express.Router();
//let flag;

resourceRouter.get("/:labs", (req, res) => {
   const labsParam = req.params.labs;
   const labs = labsParam ? labsParam.split(",") : [];
 
  //console.log(labs);
  const q = "SELECT * FROM first_view WHERE lab_name IN (?) ;";
  db.query(q, [labs],(err, data) => {
    if (err) {
             // console.log(err);
              return res.json(err);}
    else{
      // console.log(data);
       return res.json(data);
     } // sends a json responce
  });
});

resourceRouter.get("/adminmore/:id", (req, res) => {
  const resource_id = req.params.id;
  const q = "SELECT * FROM resource WHERE resource_id = ? ;";
  db.query(q, [resource_id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

//get reservation table data for the requested id
resourceRouter.get("/reservation/:id", (req, res) => {
  const resource_id = req.params.id;
  const q = "SELECT starting_time,ending_time FROM unavailability WHERE resource_id = ? ;";
  db.query(q, [resource_id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
 // myfunc();
});

//get maintenance table data for the requested id
resourceRouter.get("/maintenance/:id", (req, res) => {
  const resource_id = req.params.id;
  const q = "SELECT maintenance_id,maintenance_type,start_date,completion_date,status FROM maintenance WHERE resource_id = ? ;";
  db.query(q, [resource_id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });

});

resourceRouter.delete("/:id", (req, res) => {
  const resource_id = req.params.id;
  const q = "DELETE FROM resource  WHERE resource_id = ?;";
  db.query(q, [resource_id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

resourceRouter.post("/", (req, res) => {
  const q =
    "INSERT INTO resource (`name`,`resource_type`,`model`,`serial_number`,`specifications`,`lab_name`,`location`,`availability`,`resource_condition`,`is_portable`,`last_maintenance_date`,`maintenance_interval`,`img_url`) values (?)";
  const values = [
    req.body.name,
    req.body.resource_type,
    req.body.model,
    req.body.serial_number,
    req.body.specifications,
    req.body.lab_name,
    req.body.location,
    req.body.availability,
    req.body.resource_condition,
    req.body.is_portable,
    req.body.last_maintenance_date,
    req.body.maintenance_interval,
    req.body.img_url,
  ];
  db.query(q, [values], (err, data) => {

    if (err) res.json({status: "not ok"});
    else return res.json({status: "ok"});
  });
});


//save and find conflicts in reservation times
resourceRouter.post("/reservedate", (req, res) => {

   const q =
    "INSERT INTO reservation (`user_id`,`resource_id`,`start_date`,`end_date`,`status`,`purpose`,`reservation_type`) values (?)";
  
    const r =
    "INSERT INTO unavailability (`resource_id`,`starting_time`,`ending_time`) values (?)";
    
 

    //const start_time_unav=  new Date(year, month - 1, day, hour, minute, second);
    const start_time_unav= new Date(req.body.start_dt + ":00.000Z");
    const end_time_unav= new Date(req.body.end_dt + ":00.000Z");

    const values_for_anav=[req.body.resource_id,start_time_unav,end_time_unav];
    

    const values = [
    req.body.user_id,
    req.body.resource_id,
    start_time_unav,
    end_time_unav,
    req.body.status,
    req.body.purpose,
    req.body.reservation_type,

  ];
  //console.log(values);

  if(end_time_unav<=start_time_unav){
   // console.log("it happens");
    return res.json("start_end_error");
  }
  
  chkConflicts(req.body.resource_id,start_time_unav,
    end_time_unav,
   (result) => {
    //console.log(result); // This will log either true or false based on the query result
    
      if(result){
          db.query(q, [values], (err, data) => {
           if (err){ 
            console.log(err);
            return res.json(err);}
           else{
              db.query(r, [values_for_anav], (err, data) => {
              if (err) console.log(err);
              else console.log("updated unavailability table");
              }); 
             return res.json("Done");
            }
           }); 
        //return res.json("no conflict");
      }else{
        return res.json("confilct");
      }

  });
  
});


//handle adding new maintenance schedule
resourceRouter.post("/maintenaceadd", (req, res) => {

  const q =
    "INSERT INTO maintenance (`resource_id`,`maintenance_type`,`start_date`,`completion_date`,`status`) values (?)";
  
    const r =
    "INSERT INTO unavailability (`resource_id`,`starting_time`,`ending_time`) values (?)";
    

    let [year, month, day] = req.body.start_date.split('-');
    let [hour, minute, second] = req.body.start_time.split(':');

    const start_datetime=  new Date(year, month - 1, day, hour, minute, second);

     [year, month, day] = req.body.completion_date.split('-');
     [hour, minute, second] = req.body.completion_time.split(':');

    const end_datetime=  new Date(year, month - 1, day, hour, minute, second);

    const values_for_anav=[req.body.resource_id,start_datetime,end_datetime];
  
    const values = [
      req.body.resource_id,
      req.body.maintenance_type,
      start_datetime,
      end_datetime,
      req.body.status,   
    ];

    if(end_datetime<=start_datetime){
      // console.log("it happens");
       return res.json("start_end_error");
     }

     return res.json("bb");
/*
     chkConflicts(req.body.resource_id,req.body.start_date,
      req.body.start_time,
      req.body.completion_date,
      req.body.completion_time,(result) => {
      
        if(result){
            db.query(q, [values], (err, data) => {
             if (err){ 
              console.log(err);
              return res.json(err);}
             else{
                db.query(r, [values_for_anav], (err, data) => {
                if (err) console.log(err);
                else console.log("updated unavailability table");
                }); 
               return res.json("Done");
              }
             }); 
          //return res.json("no conflict");
        }else{
          return res.json("confilct");
        }
  
    });
    */

});

resourceRouter.get("/usermore/:id", (req, res) => {
  const resource_id = req.params.id;
  const q = "SELECT * FROM userview WHERE resource_id = ?;";
  db.query(q, [resource_id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });

});
resourceRouter.get("/update/:id", (req, res) => {
  const resource_id = req.params.id;
  //console.log(resource_id);
  const q = "SELECT * FROM resource WHERE resource_id = ?;";
  db.query(q, [resource_id], (err, data) => {
    if (err) return res.json(err);
    else {
      //console.log(data);
      return res.json(data)};
    
  });
});
resourceRouter.put("/update/:id", (req, res) => {
  const resource_id = req.params.id;
  const q =
  "UPDATE resource SET name = ?, resource_type = ?, model = ?, serial_number = ?, specifications = ?, lab_name = ?, location = ?, availability = ?, resource_condition = ?, is_portable = ?, last_maintenance_date = ?, maintenance_interval = ?, img_url = ? WHERE resource_id = ?;";
    
  
  db.query(
    q,
    [
      req.body.name,
      req.body.resource_type,
      req.body.model,
      req.body.serial_number,
      req.body.specifications,
      req.body.lab_name,
      req.body.location,
      req.body.availability,
      req.body.resource_condition,
      req.body.is_portable,
      req.body.last_maintenance_date,
      req.body.maintenance_interval,
      req.body.img_url,
      resource_id,
    ],
    (err, data) => {
      if (err) return res.json({status: "not ok"});
      else return res.json({status: "ok"} );
    }
  );
});



//changing status of maintenance as "done"
resourceRouter.get("/updtmtschedule/:id", (req, res) => {
  const maintenance_id=req.params.id;
  const q = "UPDATE maintenance SET status = 'Done' WHERE maintenance_id = ?;"
  db.query(q, [maintenance_id], (err, data) => {
    if (err) {
      console.log(err);
     // console.log("hello");
      return res.json(err);}
    else return res.json(maintenance_id);
  });
  
});


// unavilability-reservation clash handle
 let chkConflicts=(res_id,start_date,end_date,callback)=>{
var flag=true;

const sql = 'SELECT starting_time,ending_time FROM unavailability WHERE resource_id=?;';

db.query(sql,[res_id], (queryErr, results) => {
  if (queryErr) {
    console.error('Error executing the query: ' + queryErr.stack);
    return;
  }

  if (results.length > 0) {
    //callback(true);
    for (let i = 0; i < results.length; i++) {
     
    
    // Assuming the datetime is the first result in the query
    const unav_start = results[i].starting_time;
    const unav_end = results[i].ending_time;

   

      if((start_date<unav_start & end_date<unav_start)||(start_date>unav_end)){
       // console.log("okay1");
       
        
      }else{
       // console.log("not okay1");
        flag=false;
       // callback(false);
        break;
      
      }

    }callback(flag);

  }else{
    flag=true;
    callback(flag);
  }

});


};

export default resourceRouter;
