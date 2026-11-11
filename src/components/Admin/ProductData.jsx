import { useState, useEffect } from "react";
//config
import { base_url, getLayoutAPIEndpoint, getProductAPIEndpoint } from "../../config";

import {
  Box,
  Button,
  Container,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useTranslation } from "react-i18next";
import AddproductData, { DietMarker } from "./ActionsOnProducts";
import AlertComponent from "../ui/Alert/Alert";
import SectionHeading from "../common/SectionHeading";
import FoodImage from "../common/FoodImage";

const CURRENCY_CODE = { INR: "INR", DOLLAR: "USD" };

function formatPrice(price, currency) {
  const amount = Number(price);
  if (price === "" || price == null || Number.isNaN(amount)) return price ?? "—";
  try {
    return new Intl.NumberFormat(currency === "DOLLAR" ? "en-US" : "en-IN", {
      style: "currency",
      currency: CURRENCY_CODE[currency] ?? "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return String(price);
  }
}

function formatDate(value) {
  if (value == null || value === "") return "—";
  const m = moment(value);
  return m.isValid() ? m.format("DD MMM YYYY") : "—";
}

const COLUMN_COUNT = 8;

function ProductData() {
  const { t } = useTranslation();

  ////state managment
  const [productData, setProductsData] = useState();
  const [openAdd, setOpenAdd] = useState(false);
  const [updations, setUpdation] = useState();
  const [sendData, setSendData] = useState();
  const [id, setId] = useState(0);
  const [openalert, setOpenAlert] = useState(false);
  const [pageStyles, setpageStyles] = useState("");
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");

  // function component
  const fetchStyles = async () => {
    const response = await fetch(`${base_url}${getLayoutAPIEndpoint}?module=AllButtons`);
    let styles = await response.json();
    setpageStyles(styles[0]?.styles);
  };

  const productDataApi = async () => {
    let responseproductData = await fetch(`${base_url}${getProductAPIEndpoint}`);
    let responseproductDataJson = await responseproductData.json();
    responseproductDataJson.reverse();
    setProductsData(responseproductDataJson);
    setActiveCategory(""); // a full reload clears the category filter
  };

  //useEffect
  useEffect(() => {
    productDataApi();
    fetchStyles();
  }, []);

  const handleAddProducts = () => {
    setOpenAdd(true);
    setUpdation(false);
  };
  const handleEditProduct = (row) => {
    setOpenAdd(true);
    setUpdation(true);
    setSendData(row);
  };

  const handleDeleteProduct = async (id) => {
    await fetch(`${base_url}${getProductAPIEndpoint}${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    productDataApi();
  };

  const handleCategory = async (event) => {
    let responseproductData = await fetch(`${base_url}${getProductAPIEndpoint}`);
    let responseproductDataJson = await responseproductData.json();
    responseproductDataJson.reverse();
    let filteredCategories = responseproductDataJson?.filter((category) => category.category == event.target.value);

    setProductsData(filteredCategories);
  };

  const categoryOptions = [
    { value: "Veg", label: t("veg", "Veg") },
    { value: "Nonveg", label: t("non_veg", "Non-Veg") },
    { value: "Vegan", label: t("vegan", "Vegan") },
  ];

  const pickCategory = (value) => {
    setFilterAnchor(null);
    setActiveCategory(value);
    if (value) handleCategory({ target: { value } });
    else productDataApi();
  };

  const customBg = pageStyles?.bgColor ? { background: `${pageStyles.bgColor} !important` } : null;
  const activeLabel = categoryOptions.find((c) => c.value === activeCategory)?.label;

  return (
    <Box sx={{ py: { xs: 3, md: 5 }, flex: "1", minWidth: 0 }}>
      <Container maxWidth="xl">
        <SectionHeading
          overline="Admin"
          title={t("products", "Products")}
          subtitle={
            activeLabel
              ? `Showing ${activeLabel} products only.`
              : "Manage the grocery catalogue: stock, pricing and expiry."
          }
          actions={
            <Button variant="contained" startIcon={<AddRoundedIcon />} sx={customBg} onClick={handleAddProducts}>
              {t("add_product", "Add product")}
            </Button>
          }
        />

        <Paper sx={{ overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
          <TableContainer sx={{ borderRadius: 0 }}>
            <Table aria-label={t("products", "Products")} sx={{ minWidth: 960 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 80 }}>{t("image")}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                      <span>{t("title")}</span>
                      <Tooltip title="Filter by category">
                        <IconButton
                          size="small"
                          aria-label="Filter by category"
                          aria-haspopup="menu"
                          onClick={(e) => setFilterAnchor(e.currentTarget)}
                          color={activeCategory ? "primary" : "default"}
                        >
                          <FilterListRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={() => setFilterAnchor(null)}>
                      <MenuItem selected={!activeCategory} onClick={() => pickCategory("")}>
                        <ListItemText>{t("all", "All")}</ListItemText>
                      </MenuItem>
                      {categoryOptions.map((c) => (
                        <MenuItem key={c.value} selected={activeCategory === c.value} onClick={() => pickCategory(c.value)}>
                          <ListItemIcon sx={{ minWidth: "0 !important" }}>
                            <DietMarker category={c.value} />
                          </ListItemIcon>
                          <ListItemText>{c.label}</ListItemText>
                        </MenuItem>
                      ))}
                    </Menu>
                  </TableCell>
                  <TableCell>{t("description")}</TableCell>
                  <TableCell align="right">{t("total_quantity")}</TableCell>
                  <TableCell align="right">{t("price")}</TableCell>
                  <TableCell>{t("created_date")}</TableCell>
                  <TableCell>{t("expiry_date")}</TableCell>
                  <TableCell align="right">{t("Changes")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productData === undefined &&
                  [0, 1, 2].map((i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell>
                        <Skeleton variant="rounded" width={48} height={48} />
                      </TableCell>
                      {Array.from({ length: COLUMN_COUNT - 1 }, (_, j) => (
                        <TableCell key={j}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                {Array.isArray(productData) && productData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} sx={{ py: 8, textAlign: "center", border: 0 }}>
                      <Inventory2OutlinedIcon sx={{ fontSize: 44, color: "text.secondary", opacity: 0.6 }} />
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        No products {activeLabel ? `in ${activeLabel}` : "yet"}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        {activeLabel ? "Try another category filter." : "Add your first product to stock the store."}
                      </Typography>
                      {activeLabel ? (
                        <Button variant="outlined" onClick={() => pickCategory("")}>
                          Show all products
                        </Button>
                      ) : (
                        <Button variant="contained" startIcon={<AddRoundedIcon />} sx={customBg} onClick={handleAddProducts}>
                          {t("add_product", "Add product")}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}

                {productData?.map((row, index) => (
                  <TableRow key={row.id ?? index} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell>
                      <FoodImage
                        key={row?.image ?? "none"}
                        src={row?.image}
                        alt={row.title ?? ""}
                        seed={row.title}
                        width={96}
                        ratio="1 / 1"
                        sx={{ width: 48, height: 48, borderRadius: "12px" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <DietMarker category={row.category} />
                        <Typography sx={{ fontWeight: 700 }}>{row.title}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 280 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                        title={row.description}
                      >
                        {row.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      {row.total_quantity}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                      {formatPrice(row.price, row.currency)}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{formatDate(row.created_date)}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{formatDate(row.expiry_date)}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Tooltip title={t("edit", "Edit")}>
                        <IconButton size="small" aria-label={`Edit ${row.title ?? "product"}`} onClick={() => handleEditProduct(row)}>
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("delete", "Delete")}>
                        <IconButton
                          size="small"
                          color="error"
                          aria-label={`Delete ${row.title ?? "product"}`}
                          onClick={() => {
                            setOpenAlert(true);
                            setId(row.id);
                          }}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
      <AddproductData
        open={openAdd}
        setOpen={setOpenAdd}
        updations={updations}
        setUpdation={setUpdation}
        sendData={sendData}
        productDataApi={productDataApi}
      />
      <AlertComponent
        text="Are sure you want to delete?"
        option1="Yes"
        option2="No"
        show={openalert}
        setShow={setOpenAlert}
        handeldelete={handleDeleteProduct}
        dataid={id}
      />
    </Box>
  );
}

export default ProductData;
