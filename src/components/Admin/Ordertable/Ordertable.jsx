import { useEffect, useState } from "react";
import { Container, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "./Ordertable.css";

import { base_url, getOrderAPIEndpoint } from "../../../config";

const columns = [
  { field: "name", headerName: "Name", flex: 1, minWidth: 160 },
  { field: "status", headerName: "Status", flex: 1, minWidth: 120 },
  { field: "amount", headerName: "Total Amount", type: "number", flex: 1, minWidth: 120 },
];

function Ordertable() {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const response = await fetch(`${base_url}${getOrderAPIEndpoint}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Failed to load orders (${response.status})`);
        setOrderData(await response.json());
      } catch (error) {
        if (error.name !== "AbortError") console.error(error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  return (
    <Container maxWidth="xl">
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Order List
        </Typography>
        <DataGrid
          rows={orderData}
          columns={columns}
          loading={loading}
          autoHeight
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
        />
      </Paper>
    </Container>
  );
}

export default Ordertable;
