import React from "react";
import Header from "./header";
function Artisan({tradesperson}){
 return(
    <div>
        <Header/>
         <div>
         <img
        src={tradesperson.image}
        alt={`${tradesperson.fname} ${tradesperson.lname}`}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          objectFit: "cover",
           marginLeft:"500px"
        }}
      />
         </div>
    </div>
 );
}
export default Artisan;