import "./ActionOnProducts.css";
import { useState, useEffect } from "react";
//config
import { base_url, getProductAPIEndpoint, cloudinaryUploadImage_url, firebaseDatabaseURL } from "../../config";
import { Box, Button, Grid, TextField, MenuItem, InputAdornment } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import AlertComponent from "../ui/Alert/Alert";
import FormDialog from "../common/FormDialog";
import ImageUploadField from "../common/ImageUploadField";

const FORM_ID = "admin-product-form";

const DIET_COLORS = { Veg: "#2F855A", Nonveg: "#C53030", Vegan: "#2F6B4F" };

/** Indian food-label style marker: coloured square with a dot (green veg, red non-veg, leaf-green vegan). */
export function DietMarker({ category, size = 14 }) {
  const color = DIET_COLORS[category] ?? DIET_COLORS.Veg;
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        display: "inline-grid",
        placeItems: "center",
        border: "1.5px solid",
        borderColor: color,
        borderRadius: "3px",
        bgcolor: "#fff",
        "&::after": {
          content: '""',
          width: size * 0.45,
          height: size * 0.45,
          borderRadius: category === "Vegan" ? "0 60% 0 60%" : "50%",
          bgcolor: color,
        },
      }}
    />
  );
}

const CURRENCY_SYMBOL = { INR: "₹", DOLLAR: "$" };

export default function ActionsOnProducts(props) {
  const { t } = useTranslation();

  const openAdd = props.open;
  const setOpenAdd = props.setOpen;
  const updations = props.updations;
  const getProducts = props.sendData;
  const productDataApi = props.productDataApi;

  const ProductSchema = Yup.object().shape({
    title: Yup.string().min(3, "Too Short!").max(20, "Too Long!").required("title is required"),

    description: Yup.string().min(5, "Too Short!").max(100, "Too Long!").required("description is required"),

    total_quantity: Yup.string()
      .max(10000, "max lenght should be 5 digit")
      .min(1, "min lenght should be 1 digit")
      .required("Quantity is required"),

    price: Yup.string()
      .max(8, "price must be 8 characters at maximum")
      .matches(/[0-9]/, "price requires a number")
      .required("price is required"),
  });

  const [, setProductsData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlert1, setShowAlert1] = useState(false);

  const [newImage, setNewImage] = useState("");
  const [previewImage, setPreviewImage] = useState(null); // edit-mode preview only
  const [openCircle, setCircleOpen] = useState(false);
  const [expiryDate, setExpiryDate] = useState(new Date());

  const handleClose = () => {
    setOpenAdd(false);
    setPreviewImage(null);
    setNewImage(""); // don't carry the last upload into the next product
  };

  const getAllProducts = () => {
    fetch(`${base_url}${getProductAPIEndpoint}`)
      .then((res) => res.json())
      .then((udata) => {
        setProductsData(udata);
      });
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mealPlanner");
    const responseImg = await fetch(`${cloudinaryUploadImage_url}`, {
      method: "POST",
      body: formData,
    });
    const getImage = await responseImg.json();
    return getImage.url;
  };

  // Add mode: upload and keep the URL for the POST payload.
  const ImageUpload = async (file) => {
    try {
      const FinalImageKey = await uploadToCloudinary(file);
      setNewImage(FinalImageKey);
    } finally {
      setCircleOpen(false);
    }
    getAllProducts();
  };

  // Edit mode: upload and PATCH the product's image straight away.
  const dataChanged = async (file) => {
    try {
      const FinalImageKey = await uploadToCloudinary(file);
      await fetch(`${base_url}${getProductAPIEndpoint}${getProducts.id}`, {
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify({ image: FinalImageKey }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      setPreviewImage(FinalImageKey);
    } finally {
      setCircleOpen(false);
    }
    getAllProducts();
  };

  const submitData = async (values) => {
    const id = uuidv4();
    if (updations == false) {
      const newProducsAdding = {
        title: values.title,
        id,
        description: values.description,
        total_quantity: values.total_quantity,
        price: values.price,
        image: newImage,
        currency: values.currency,
        created_date: moment().toDate().getTime(),
        expiry_date: expiryDate,
        category: values.category,
      };

      const fireBase = {
        title: values.title,
        id,
        description: values.description,
        total_quantity: values.total_quantity,
        price: values.price,
        image: newImage,
        currency: values.currency,
        created_date: moment().toDate().getTime(),
        expiry_date: expiryDate,
        category: values.category,
      };
      // post data on firebase
      await fetch(`${firebaseDatabaseURL}products.json`, {
        method: "POST",
        body: JSON.stringify(fireBase),
        headers: {
          "Content-Type": "application/json ; charset=utf-8",
        },
      });

      // post data on json server
      await fetch(`${base_url}${getProductAPIEndpoint}`, {
        method: "POST",
        body: JSON.stringify(newProducsAdding),
        headers: {
          "Content-Type": "application/json ; charset=utf-8",
        },
      });
      handleClose();
      productDataApi();
    }
    if (updations == true) {
      await fetch(`${base_url}${getProductAPIEndpoint}${getProducts?.id}`, {
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      setShowAlert1(true);
      handleClose();
      setPreviewImage(null);
      productDataApi();
    }
  };

  const fieldProps = (name, touched, errors) => ({
    name,
    error: Boolean(touched[name] && errors[name]),
    helperText: touched[name] ? errors[name] : undefined,
  });

  // expiryDate is a Date until the admin picks one, then the input's "YYYY-MM-DD" string (stored as-is).
  const expiryInputValue = expiryDate instanceof Date ? moment(expiryDate).format("YYYY-MM-DD") : expiryDate ?? "";

  const categories = [
    { value: "Veg", label: t("veg", "Veg") },
    { value: "Nonveg", label: t("non_veg", "Non-Veg") },
    { value: "Vegan", label: t("vegan", "Vegan") },
  ];

  return (
    <Box>
      <FormDialog
        open={openAdd}
        onClose={handleClose}
        title={updations ? t("edit_product", "Edit product") : t("add_product", "Add product")}
        subtitle={updations ? "Update this product's details." : "Add a new item to the store."}
        icon={updations ? <EditNoteRoundedIcon /> : <AddShoppingCartRoundedIcon />}
        actions={
          <>
            <Button color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" form={FORM_ID} disabled={openCircle}>
              {updations ? "Save changes" : t("add_product", "Add product")}
            </Button>
          </>
        }
      >
        <Formik
          initialValues={
            updations
              ? {
                  title: getProducts.title,
                  total_quantity: getProducts.total_quantity,
                  description: getProducts.description,
                  currency: getProducts.currency,
                  price: getProducts.price,
                  created: getProducts.created_date,
                  expiry: getProducts.expiry_date,
                  category: getProducts.category,
                  image: getProducts.image,
                }
              : {
                  title: "",
                  id: "",
                  total_quantity: "",
                  description: "",
                  currency: "INR",
                  price: "",
                  created: moment().format("DD/MM/YYYY"),
                  category: "Veg",
                }
          }
          validationSchema={ProductSchema}
          validateOnChange={true}
          validateOnBlur={false}
          onSubmit={(values) => {
            submitData(values);
          }}
        >
          {({ errors, values, handleChange, touched }) => (
            <Form id={FORM_ID} noValidate>
              <Box sx={{ mb: 3, "& label[for]": { aspectRatio: "5 / 2" } }}>
                <ImageUploadField
                  variant="cover"
                  label={t("image", "Image")}
                  helperText="PNG or JPG, a clear shot of the product"
                  value={updations ? previewImage ?? getProducts?.image : newImage}
                  uploading={openCircle}
                  onFileSelect={(file) => {
                    setCircleOpen(true);
                    if (updations) dataChanged(file);
                    else ImageUpload(file);
                  }}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label={t("title", "Title")}
                    type="text"
                    value={values.title}
                    onChange={handleChange("title")}
                    {...fieldProps("title", touched, errors)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    label={t("Category", "Category")}
                    value={values.category ?? ""}
                    onChange={handleChange("category")}
                    {...fieldProps("category", touched, errors)}
                  >
                    {categories.map((c) => (
                      <MenuItem key={c.value} value={c.value}>
                        <DietMarker category={c.value} />
                        {c.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={12}>
                  <TextField
                    label={t("description", "Description")}
                    multiline
                    minRows={2}
                    maxRows={5}
                    value={values.description}
                    onChange={handleChange("description")}
                    {...fieldProps("description", touched, errors)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label={t("total_quantity", "Total quantity")}
                    type="number"
                    value={values.total_quantity}
                    onChange={handleChange("total_quantity")}
                    {...fieldProps("total_quantity", touched, errors)}
                    slotProps={{ htmlInput: { min: 0 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label={t("expiry_date", "Expiry date")}
                    type="date"
                    value={expiryInputValue}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    label={t("currency", "Currency")}
                    value={values.currency ?? ""}
                    onChange={handleChange("currency")}
                    {...fieldProps("currency", touched, errors)}
                  >
                    <MenuItem value="INR">{t("INR", "INR (₹)")}</MenuItem>
                    <MenuItem value="DOLLAR">{t("DOLLAR", "USD ($)")}</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label={t("price", "Price")}
                    type="number"
                    value={values.price}
                    onChange={handleChange("price")}
                    {...fieldProps("price", touched, errors)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">{CURRENCY_SYMBOL[values.currency] ?? ""}</InputAdornment>
                        ),
                      },
                      htmlInput: { min: 0, step: "any" },
                    }}
                  />
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </FormDialog>

      <AlertComponent
        text={showAlert ? "User Already exist" : showAlert1 ? "Details Updated" : "User Added"}
        option2="Ok"
        show={showAlert}
        setShow={setShowAlert}
      />
    </Box>
  );
}
