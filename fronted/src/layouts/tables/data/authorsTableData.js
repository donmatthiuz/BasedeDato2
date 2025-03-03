import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import useApi from "useApi"; // Asegúrate de que useApi esté bien definido

// Imágenes
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

export default function Data() {
  const { llamadowithoutbody } = useApi("http://127.0.0.1:5000/get_transaction");
  const [transactions, setTransactions] = useState([]); // Estado para almacenar las transacciones

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await llamadowithoutbody("GET");
      console.log(data);
      if (data) {
        setTransactions(data); // Si solo tienes un objeto, conviértelo en un array
      }
    };
    fetchTransactions();
  }, []);

  const Author = ({ name, email, image }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
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
    columns: [
      { Header: "Transaccion", accessor: "author", width: "35%", align: "left" },
      { Header: "Descripcion Transaccion", accessor: "function", align: "left" },
      { Header: "Es Fraudulenta", accessor: "status", align: "center" },
      { Header: "Fecha", accessor: "employed", align: "center" },
      { Header: "Eliminar", accessor: "action", align: "center" },
    ],

    rows: transactions.map((transaction) => ({
      author: (
        <Author
        name={`Precio ${transaction.transactionAmount}`}
          email={`ID Transacción: ${transaction.transactionId}`} // Puedes añadir el ID aquí también

          image={team2} // Asegúrate de que la imagen de autor esté configurada
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
