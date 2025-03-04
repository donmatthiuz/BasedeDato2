import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import useApi from "useApi";
import TextField from "@mui/material/TextField"; // Input de búsqueda

// Imágenes
import team2 from "assets/images/team-2.jpg";

export default function Data() {
  const { llamadowithoutbody } = useApi("http://127.0.0.1:5000/get_transaction");
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await llamadowithoutbody("GET");
      if (data) {
        setTransactions(data);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Author = ({ name, email, image }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  return {
    searchInput: (
      <TextField
        label="Buscar por id"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
    ),
    columns: [
      { Header: "Transacción", accessor: "author", width: "35%", align: "left" },
      { Header: "Descripción", accessor: "function", align: "left" },
      { Header: "Es Fraudulenta", accessor: "status", align: "center" },
      { Header: "Fecha", accessor: "employed", align: "center" },
      { Header: "Eliminar", accessor: "action", align: "center" },
    ],
    rows: filteredTransactions.map((transaction) => ({
      author: (
        <Author
          name={`Precio ${transaction.transactionAmount}`}
          email={`ID Transacción: ${transaction.transactionId}`}
          image={team2}
        />
      ),
      function: <Job title={transaction.transactionType} description={transaction.transactionDescription} />, 
      status: (
        <MDBox ml={-1}>
          <MDBadge
            badgeContent={transaction.isFraudTeoric ? "Fraudulenta" : "No Fraudulenta"}
            color={transaction.isFraudTeoric ? "danger" : "success"}
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ),
      employed: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {new Date(transaction.transactionDate).toLocaleDateString()}
        </MDTypography>
      ),
      action: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          Delete
        </MDTypography>
      ),
    })),
  };
}
