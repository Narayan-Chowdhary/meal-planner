import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import Badge from "@mui/material/Badge";
import moment from "moment";
import React, { useEffect, useState } from "react";
import "./cart.css";
import { useNavigate } from "react-router";
import dummyofproduct from "../../assests/dummyofproduct.jpeg"; 
import { useTranslation } from "react-i18next";

function Groceries() {
  const user = localStorage.getItem("items");
  const userloggedin = JSON.parse(user);
  const nav = useNavigate();
const { t } = useTranslation();

  const [food, setFood] = useState([]);
  const [productofuser, setproductofuser] = useState(0);
  const [userdata, setUserdata] = useState(null);
  const [senditems, setSenditems] = useState({
    userId: "",
    items: [],
  });
  let show = false;
  //   const options = {
  //     key: "rzp_test_HJG5Rtuy8Xh2NB",
  //     amount: "100", //  = INR 1
  //     name: "Acme shop",
  //     description: "some description",
  //     image: "https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png",
  //     handler: function (response) {
  //       alert(response.razorpay_payment_id);
  //     },
  //     prefill: {
  //       name: "Gaurav",
  //       contact: "9999999999",
  //       email: "demo@demo.com",
  //     },
  //     notes: {
  //       address: "some address",
  //     },
  //     theme: {
  //       color: "#F37254",
  //       hide_topbar: false,
  //     },
  //   };

  //   const openPayModal = (options) => {
  //     var rzp1 = new window.Razorpay(options);
  //     rzp1.open();
  //   };

  //   useEffect(() => {
  //     const script = document.createElement("script");
  //     script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //     script.async = true;
  //     document.body.appendChild(script);
  //   }, []);

  const fetchData = async () => {
    const res = await fetch(` http://localhost:8000/Products`);
    let final = await res.json();

    setFood(final);
  };

  const addtocart = async (e, index) => {
    alert("data send");
    show = true;

    console.log("minus", e, index);
    const res = await fetch(` http://localhost:8000/Products/${index}`);
    let final = await res.json();
    console.log(final, "found");
    const data = final.total_quantity - 1;

    await fetch(` http://localhost:8000/Products/${index}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify({ total_quantity: data }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const dateof_purchase = moment().toDate().getTime();

    let obj = {};
    const { id, price, currency, title, image } = e;
    obj.id = id;
    obj.dateof_purchase = dateof_purchase;
    obj.price = price;
    obj.currency = currency;
    obj.title = title;
    obj.quantity = 1;
    obj.image = image;

    setSenditems({ userId: userloggedin.id, items: [...senditems.items, obj] });
    fetchData();
  };

  const sendProducts = async () => {
    let localuser = localStorage.getItem("items");
    let idofuser = JSON.parse(localuser);
    setUserdata(idofuser);
    console.log(idofuser.id);
    const responsefromcart = await fetch(
      `http://localhost:8000/cart?userId=${idofuser.id}`
    );
    let foundDat = await responsefromcart.json();
    console.log(foundDat[0]?.items[0], "mil gaya");
    foundDat[0]?.items.map((e) => {
      senditems.items.push(e);
    });
    if (foundDat.length !== 0) {
      alert("patch");
      console.log(senditems, "senditems");

      console.log(senditems, "adsasdasjdjasgdfahiugfjuahsfahjugsfagu");
      const response = await fetch(
        `http://localhost:8000/cart/${foundDat[0].id}`,
        {
          method: "PATCH",
          body: JSON.stringify(senditems),
          headers: {
            "Content-Type": "application/json ; charset=utf-8",
          },
        }
      );
      const final = await response.json();
      console.log(final.items, "response mil gaya");
      const qttotal = final.items.reduce((ini, cv) => {
        return (ini = ini + cv.price * cv.quantity);
      }, 0);
      console.log(qttotal);
      nav("/cart", { state: { qttotal } });
    } else {
      alert("post");
      const response = await fetch("http://localhost:8000/cart", {
        method: "POST",
        body: JSON.stringify(senditems),
        headers: {
          "Content-Type": "application/json ; charset=utf-8",
        },
      });
      const final = await response.json();
      console.log(final.items);
      const qttotal = final.items.reduce((ini, cv) => {
        return (ini = ini + cv.price * cv.quantity);
      }, 0);
      console.log(qttotal);
      nav("/cart", { state: { qttotal } });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Box>
      <Grid container>
        <Grid item md={11} sx={{ my: 1 }}>
          <Box>
            <Typography variant="h3" textAlign={"center"}>
              Groceries
            </Typography>
          </Box>
        </Grid>
        <Grid item md={1} sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <Box>
              <Badge
                badgeContent={
                  senditems.items.length == 0 ? null : senditems.items.length
                }
                color="primary"
              >
                <ShoppingCartIcon
                  sx={{ fontSize: "50px", cursor: "pointer" }}
                  onClick={() => {
                    sendProducts();
                  }}
                />
              </Badge>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ mt: 1 }}></Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Container>
        <Box>
          <Grid container>
            <Grid item xs={12} sm={12} lg={12}>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {food?.map((e, i) => {
                  return (
                    <Paper
                      key={i}
                      sx={{
                        backgroundColor: "white",
                        m: 1,
                        p: 4,
                        borderRadius: 5,
                        border: "1px solid #afafaf",
                        width: "200px",
                      }}
                    >
                      <Box>
                        <img
                          src={e.image ? e.image : dummyofproduct}
                          alt="Index"
                          className="cart_img"
                        />
                      </Box>
                      <Box>
                        <Box
                          sx={{
                            padding: "10px 0px",
                            textAlign: "center",
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="h7"
                            sx={{ fontWeight: "400", fontSize: "24px" }}
                          >
                            {e.title.toUpperCase()}
                          </Typography>
                          <Box>
                            <Typography
                              variant="h7"
                              sx={{ fontWeight: "400", fontSize: "24px" }}
                            >
                              {e.price}₹
                            </Typography>
                            {/* <AddShoppingCartIcon
                            onClick={() => addtocart(e, e.id) }
                            sx={{fontSize:"30px"}}
                          /> */}
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            // padding: "5px 16px 5px 16px",
                            paddingBottom: "5px",
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent:
                              e.total_quantity == 0
                                ? "center"
                                : "space-between",
                          }}
                        >
                          <Box>
                            <Typography variant="h5">
                              {e.total_quantity == 0 ? "" : t("total_quantity")}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="h5">
                              {e.total_quantity == 0
                                ? t("currently_not_avialable")
                                : e.total_quantity}
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          {console.log(e.total_quantity)}
                          <Button
                            variant="contained"
                            fullWidth="true"
                            disabled={e.total_quantity < 1 ? true : false}
                            onClick={() => addtocart(e, e.id)}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        </Box>
        {/* <Box sx={{ my: 2, textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={() => {
            sendProducts();
          }}
        >
          Buy
        </Button>
        <button onClick={() => openPayModal(options)}>Pay</button>
      </Box> */}
      </Container>
    </Box>
  );
}

export default Groceries;
