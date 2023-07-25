 import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
//config
import {
  base_url,
  getProductAPIEndpoint,
  getCartAPIEndpoint,
} from "../../config";
//

import Badge from "@mui/material/Badge";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  Container,
  Stack,
  Menu,
  MenuItem,
  Button,
  Dialog,
  Paper,
  Select,
  dialogClasses,
  FormControl,
  IconButton,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveIcon from "@mui/icons-material/Remove";
import { useLocation, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DummyImage from "../../assests/dummyimage.webp";

import AlertComponent from "../ui/Alert/Alert";
import Notification from "../../pages/Notification/Notification";
import { useTranslation, initReactI18next } from "react-i18next";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { reduceItemsfromStore } from "../../Util/Paymentgateway";

function Cart() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const location = useLocation();
  const initial = location.state.qttotal;
  const [itemdata, setItemdata] = useState([]);
  const [total, setTotal] = useState([initial]);
  const [productid, setProductid] = useState(null);
  const [amt, setAmt] = useState(initial);
  const [userdata, setUserdata] = useState(null);
const [isActive,setActive]=useState(false)
  const [cartdata, setCartdata] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log("das")
    let localuser = localStorage.getItem("items");
    let idofuser = JSON.parse(localuser);
    setUserdata(idofuser);
    const res = await fetch(`${base_url}${getCartAPIEndpoint}`);
    let final = await res.json();
    console.log(final,"das");



    
    final = final.filter((e) => {
      return e.userId == idofuser.id;
    });
    if (final[0]) {
      let arr = final[0].items;
      const arr2 = arr.map((e) => {
        return e.id;
      });
      const count = {};
      arr2.forEach((element) => {
        count[element] = (count[element] || 0) + 1;
      });
      const val = Object.entries(count);
      const more = val.filter((e) => {
        if (e[1] > 1) {
          return e;
        }
      });
      const [repeadtedqt] = more;
      let nonrepeat = arr.filter((value, i, arr) => {
        return (
          arr.findIndex((value2) => {
            if (value2.id == value.id) {
              return value2.id == value.id;
            }
          }) === i
        );
      });
      console.log(nonrepeat, repeadtedqt, "no");
      if (repeadtedqt) {
        nonrepeat.map((e) => {
          if (e.id == repeadtedqt[0]) {
            e.quantity = repeadtedqt[1];
          }
        });
        console.log(nonrepeat);
        // setItemdata(final[0]?.items);

        setItemdata(nonrepeat);
      }
       setItemdata(nonrepeat);
    } else {
      setItemdata(null);
    }
    //  const data = final[0].items.reduce((val, cv) => {
    //    return (val = val + cv.price);
    //  }, 0);
    //   console.log(data);

    //   // setTotal([...total,data]);
    //   amount([...total, data]);
    setProductid(final[0]?.id);

    setCartdata(final[0]);
  };

  const addqt = async (e, i) => {
    let localuser = localStorage.getItem("items");
    let idofuser = JSON.parse(localuser);

    const res = await fetch(`${base_url}${getCartAPIEndpoint}`);
    let final = await res.json();
    console.log(final, "1updated");
    final = final.filter((e) => {
      return e.userId == idofuser.id;
    });

    const updated = final[0].items.filter((ele) => {
      return ele.id == i;
    });

    updated[0].quantity = updated[0].quantity + 1; //updated

    console.log(updated[0], "updated obj");

    console.log(final[0].items, "toatal");
    let index1;
    final[0].items.map((e, ind) => {
      if (e.id == i) {
        index1 = ind;
      }
    });

    console.log(index1, "found");

    final[0].items.splice(index1, 1, updated[0]);

    console.log(final[0].items);
    await fetch(`${base_url}${getCartAPIEndpoint}${productid}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify({ userId: idofuser.id, items: final[0].items }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    fetchData();

    handelTotalPrice(updated[0].price);
  };

  const reduceqt = async (e, i) => {
    let localuser = localStorage.getItem("items");
    let idofuser = JSON.parse(localuser);

    // console.log(i)
    const res = await fetch(`${base_url}${getCartAPIEndpoint}`);
    let final = await res.json();

    final = final.filter((e) => {
      return e.userId == idofuser.id;
    });
    const updated = final[0].items.filter((ele) => {
      return ele.id == i;
    });

    if (updated[0].quantity > 1) {
      updated[0].quantity = updated[0].quantity - 1;

      console.log(final[0].items, "toatal");
      let index1;
      final[0].items.map((e, ind) => {
        if (e.id == i) {
          index1 = ind;
        }
      });

      console.log(index1, "found");

      final[0].items.splice(index1, 1, updated[0]);

      console.log(final[0].items);
      await fetch(`${base_url}${getCartAPIEndpoint}${productid}`, {
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify({ userId: idofuser.id, items: final[0].items }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      fetchData();

      console.log(total, updated[0].price);
      let indexofreduce;
      for (let i = 0; i < total.length; i++) {
        if (total[i] == updated[0].price) {
          indexofreduce = i;
        }
      }

      console.log(indexofreduce, "updated[0].price");
      total.splice(indexofreduce, 1);
      setTotal([...total]);
      amount(total);
    } else {
    }
  };

  const handelTotalPrice = (totalAmount) => {
    setTotal([...total, totalAmount]);
    amount([...total, totalAmount]);
  };

  const amount = (arr) => {
    const data = arr.reduce((val, cv) => {
      return (val = val + cv);
    }, 0);
    console.log(data, "finalllll");
    setAmt(data);
  };

  const addtoOrders = async (trid) => {
    let localuser = localStorage.getItem("items");
    let idofuser = JSON.parse(localuser);
    setUserdata(idofuser);

    const responsefromcart = await fetch(
      `http://localhost:8000/orders?userId=${idofuser.id}`
    );
    let foundDat = await responsefromcart.json();
    console.log(foundDat, "1111111");
    if (foundDat.length !== 0) {
      delete cartdata.id;
      cartdata.status = "success";
      cartdata.name = idofuser.name;
      cartdata.amount=amt
      const response = await fetch(
        `http://localhost:8000/orders/${foundDat[0].id}`,
        {
          method: "PATCH",
          body: JSON.stringify(cartdata),
          headers: {
            "Content-Type": "application/json ; charset=utf-8",
          },
        }
      );
      const final = await response.json();

      deletefromcart(trid);
    } else {
      delete cartdata.id;
      cartdata.status = "success";
      cartdata.name = idofuser.name;
       cartdata.amount = amt;
      const postedData = await fetch(`http://localhost:8000/orders`, {
        method: "POST",
        body: JSON.stringify(cartdata),
        headers: {
          "Content-Type": "application/json ; charset=utf-8",
        },
      });
      console.log(postedData);
      deletefromcart(trid);
    }
  };

  const deletefromcart = async (trid) => {
    await fetch(`http://localhost:8000/cart/${productid}`, {
      method: "DELETE",
    });
    setAmt(0);
    fetchData();
    reduceItemsfromStore();
console.log(trid, "transsection");
    await fetch(
      "https://meal-planner-390411-default-rtdb.firebaseio.com/transection.json",
      {
        method: "POST",
        body: JSON.stringify({ msg: `Your order (${trid}:id) is successful)` }),
        headers: {
          "Content-Type": "application/json ; charset=utf-8",
        },
      }
    );
setActive(true)
  };

  const options = {
    key: "rzp_test_HJG5Rtuy8Xh2NB",
    amount: "100", //  = INR 1
    name: "Paranjay's shop",
    description: "some description",
    image: "https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png",
    handler: async function (response) {
     
      alert(response.razorpay_payment_id);
      addtoOrders(response.razorpay_payment_id);
    },
    prefill: {
      name: `${userdata?.name}`,
      contact: `${userdata?.phone}`,
      email: `${userdata?.email}`,
    },
    notes: {
      address: "some address",
    },
    theme: {
      color: "#F37254",
      hide_topbar: false,
    },
  };

  const openPayModal = (options) => {
    options["amount"] = amt * 100;
    var rzp1 = new window.Razorpay(options);

    rzp1.open();
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <Box sx={{ backgroundColor: "White", py: 5, flex: "1" }}>
      <Container maxWidth="lg">
        {console.log(userdata)}
        {/* <Box sx={{ display: "flex", justifyContent: "end", mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              nav("/groceries");
            }}
          >
            Groceries
          </Button>
        </Box> */}
        <Box>
          {itemdata ? (
            <Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#4b5563" }}>
                    <TableRow>
                      <TableCell align="left">
                        <Typography
                          variant="subtitle1"
                          sx={{ fontSize: "20px", color: "white" }}
                        >
                          Cart Item
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography
                          variant="subtitle1"
                          sx={{ fontSize: "20px", color: "white" }}
                        >
                          Title
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontSize: "20px", color: "white" }}
                        >
                          Quantity
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography
                          variant="subtitle1"
                          sx={{ fontSize: "20px", color: "white" }}
                        >
                          Price
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography
                          variant="subtitle1"
                          sx={{ fontSize: "20px", color: "white" }}
                        >
                          Total
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itemdata?.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: "#e5e7eb",
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <img
                            src={row.image}
                            srcset=""
                            height="80px"
                            width="80px"
                            style={{ borderRadius: "25%" }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ fontSize: "20px" }}
                        >
                          {row.title}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ fontSize: "20px" }}
                        >
                          <Box sx={{ display: "flex" }}>
                            <AddRoundedIcon
                              sx={{ mr: 1, cursor: "pointer" }}
                              onClick={() => {
                                addqt(row, row.id);
                              }}
                            />
                            <Typography>{row.quantity}</Typography>

                            <RemoveIcon
                              sx={{ ml: 1, cursor: "pointer" }}
                              onClick={() => {
                                reduceqt(row, row.id);
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ fontSize: "20px" }}
                        >
                          {row.price} ₹
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            fontSize: "20px",
                          }}
                        >
                          {row.quantity * row.price} ₹
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box>
                <Grid container>
                  <Grid items lg={9}>
                    <Typography
                      variant="h5"
                      textAlign={"center"}
                      sx={{ ml: 85 }}
                    >
                      Grand Total
                    </Typography>
                  </Grid>
                  <Grid items lg={3}>
                    <Typography
                      variant="h5"
                      textAlign={"start"}
                      sx={{ ml: 10 }}
                    >
                      {amt}₹
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ my: 2, textAlign: "center" }}>
                  <Button
                    variant="contained"
                    onClick={() => openPayModal(options)}
                  >
                    Pay
                  </Button>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box textAlign={"center"}>
                <Typography variant="h5">Your Cart is empty</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    nav("/groceries");
                  }}
                >
                  Shop now
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
      <Notification text={"Payment Sucessfull"}

   isActive={isActive}
  setActive={  setActive}/>
    </Box>
  );
}

export default Cart;
//FAILED=pay_MCtkUWCVIpPedY;
//SUCCESS=pay_MCtobdMbfqDr3t;
