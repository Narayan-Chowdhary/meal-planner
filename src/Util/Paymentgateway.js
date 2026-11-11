import { base_url } from "../config";




export const reduceItemsfromStore = async () => {
  console.log("hey");
  const localdataofuser = localStorage.getItem("items");
  const dataofuser = JSON.parse(localdataofuser);
  console.log(dataofuser, "dataofuser");
  const productdata = await fetch(`${base_url}Products`);
  const responseofproductdata = await productdata.json();
  console.log(responseofproductdata, "responseofproductdata");
  const orderdataofuser = await fetch(
    `${base_url}orders?userId=${dataofuser.id}`
  );
  const responseoforderdataofuser = await orderdataofuser.json();

  console.log(responseoforderdataofuser[0].items, "responseoforderdataofuser");
  const orderid=responseoforderdataofuser[0].items.map((e)=>{return e.id})
   





const matchedItems = responseofproductdata.filter((orderItem) => {
  const matchingProduct = responseoforderdataofuser[0].items.find((product) => {
    if (product.id === orderItem.id) {
       return orderItem.total_quantity =orderItem.total_quantity - product.quantity;
    ;
    }
  });
  return matchingProduct;
});
console.log(matchedItems,"matx")
const updatedqt=matchedItems.map((e) => {
     return e.total_quantity;
   });

console.log(updatedqt,orderid)
orderid.map(async(e, i) => {
const response = await fetch(`${base_url}Products/${e}`, {
  method: "PATCH",
  mode: "cors",
  body: JSON.stringify({ total_quantity: updatedqt[i] }),
  headers: {
    "Content-type": "application/json",
  },
});


})


};
