import { React, useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import "./Ordertable.css";
import { Container } from "@mui/material";

//
import { base_url, getOrderAPIEndpoint } from "../../../config";
function Ordertable() {
  //variable declearations

  let objectoforder = {};





  const columns = [
    {
      name: "name",
      label: "Name",
    },
    {
      name: "status",
      label: "Status",
    },
    {
      name: "amount",
      label: "Total Amount",
    },
  ];

  const [orderData, setOrderData] = useState([]);

  //side effects
  useEffect(() => {
    fetchData();
  }, []);

 
  // function body
  const fetchData = async () => {
    const responsefromorder = await fetch(`${base_url}${getOrderAPIEndpoint}`);
    const finalorders = await responsefromorder.json();

   
 setOrderData(finalorders);

  };
 
  return (
    <>
      <Container maxWidth={"xl"}>
       <MUIDataTable title={"Order List"} data={orderData} columns={columns} />
      </Container>
    </>
  );
}

export default Ordertable;
