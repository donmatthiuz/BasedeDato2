import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import useApi from "useApi";
import TextField from "@mui/material/TextField"; // Input de búsqueda
import Dialog from "@mui/material/Dialog"; // Componente de Dialog
import DialogActions from "@mui/material/DialogActions"; // Componente de acciones del diálogo
import DialogContent from "@mui/material/DialogContent"; // Contenido del diálogo
import DialogTitle from "@mui/material/DialogTitle"; // Título del diálogo
import Button from "@mui/material/Button"; // Botones del diálogo
import DataTable from "examples/Tables/DataTable";
// Imágenes
import team2 from "assets/images/team-2.jpg";

export default function Data() {
  const { llamadowithoutbody } = useApi("http://127.0.0.1:5000/get_transaction");
  const { llamado } = useApi("http://127.0.0.1:5000/detect_frauds");

  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro
  const [openDialog, setOpenDialog] = useState(false); // Estado para controlar el diálogo
  const [selectedTransaction, setSelectedTransaction] = useState(null); // Transacción seleccionada para mostrar detalles
  const [fraudType, setFraudType] = useState(""); // Estado para el tipo de fraude
  const [fraudReasons, setFraudReasons] = useState(""); // Estado para almacenar los motivos de fraude

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

  const handleClickOpen = async (transaction) => {
    setSelectedTransaction(transaction); // Asignar la transacción seleccionada
    setOpenDialog(true); // Abrir el diálogo

    // Aquí haces el llamado POST para obtener los motivos de fraude
    const body = {
      transaction_id: transaction.transactionId, // El id de la transacción que seleccionaste
    };

    const response = await llamado(body, "POST"); // Llamada al API de fraude

    if (response && response["casos de fraude"]) {
      // Extrae el tipo de fraude y los casos de fraude
      const fraudCases = response["casos de fraude"];
      let reasons = "No hay motivos disponibles";
      let type = "Desconocido";

      // Asume que el primer caso es el motivo
      if (fraudCases.length > 0) {
        const fraudCase = fraudCases[0];
        type = fraudCase["Tipo de Fraude"]; // Extrae el tipo de fraude

        reasons = fraudCase["casos"]
          .map(
            (caseItem) =>
              `${caseItem[0]} reportó un posible fraude por ${caseItem[2]} en el sector ${caseItem[3]} por un monto de ${caseItem[4]}`
          )
          .join("\n");
      }

      setFraudType(type); // Actualiza el tipo de fraude
      setFraudReasons(reasons); // Actualiza los motivos de fraude en el estado
    }
  };

  const handleClose = () => {
    setOpenDialog(false); // Cerrar el diálogo
    setSelectedTransaction(null); // Limpiar la transacción seleccionada
    setFraudReasons(""); // Limpiar los motivos de fraude
    setFraudType(""); // Limpiar el tipo de fraude
  };

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

  return (
    <MDBox pt={3}>
      {/* Input de búsqueda */}
      <TextField
        label="Buscar por id"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      {/* Diálogo de motivos */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Motivos de la Transacción</DialogTitle>
        <DialogContent>
          {selectedTransaction ? (
            <MDBox>
              <MDTypography variant="body1">
                {`Motivos de la transacción ${selectedTransaction.transactionId}:`}
              </MDTypography>
              <MDTypography variant="body2">
                <strong>Tipo de Fraude:</strong> {fraudType}
              </MDTypography>
              <MDTypography variant="body2">{fraudReasons || "No hay motivos disponibles"}</MDTypography>
            </MDBox>
          ) : (
            <MDTypography variant="body2">Cargando motivos...</MDTypography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* DataTable */}
      <DataTable
        table={{
          columns: [
            { Header: "Transacción", accessor: "author", width: "35%", align: "left" },
            { Header: "Descripción", accessor: "function", align: "left" },
            { Header: "Es Fraudulenta", accessor: "status", align: "center" },
            { Header: "Fecha", accessor: "employed", align: "center" },
            { Header: "Motivos", accessor: "action", align: "center" },
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
              <MDTypography
                component="a"
                href="#"
                variant="caption"
                color="text"
                fontWeight="medium"
                onClick={() => handleClickOpen(transaction)} // Al hacer click, abrir el diálogo
              >
                Ver Motivos
              </MDTypography>
            ),
          })),
        }}
        isSorted={false}
        entriesPerPage={false}
        showTotalEntries={false}
        noEndBorder
      />
    </MDBox>
  );
}
