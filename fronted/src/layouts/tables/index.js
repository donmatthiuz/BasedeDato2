import { useState, useEffect } from "react";
import useApi from "useApi"; // Asegúrate de que useApi esté bien definido

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import MDInput from "components/MDInput";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import MDButton from "components/MDButton";
import { Select } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
function Tables() {
  const { llamadowithoutbody:onlynames } = useApi("http://127.0.0.1:5000/get_customers_names");
  const [onlynames_Set, setOnlyNames] = useState([]); // Estado para almacenar las transacciones
  useEffect(() => {
    const fetchTransactions = async () => {
     
      const data = await onlynames("GET");
      if (data) {
         setOnlyNames(data);
      }
    };
    fetchTransactions();
  }, []);


  const [customFields, setCustomFields] = useState([]);


  // Función para agregar un nuevo campo
  const handleAddField = () => {
    setCustomFields([...customFields, { name: "", value: "" }]);
  };

  // Función para eliminar un campo
  const handleRemoveField = (index) => {
    const newFields = [...customFields];
    newFields.splice(index, 1);
    setCustomFields(newFields);
  };

  // Función para actualizar los valores de los campos personalizados
  const handleFieldChange = (index, field, value) => {
    const newFields = [...customFields];
    newFields[index][field] = value;
    setCustomFields(newFields);
  };

  const [rememberMe, setRememberMe] = useState(false);
  const [transactionType, setTransactionType] = useState("");

  const handleChange = (event) => {
    setTransactionType(event.target.value);
  };
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();

  // Estado para manejar la apertura del modal
  const [openModal, setOpenModal] = useState(false);

  // Funciones para abrir y cerrar el modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card sx={{ position: "relative" }}>
              {/* Botón posicionado en la esquina superior derecha */}
              <MDBox
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
              >
                <MDButton color="primary" onClick={handleOpenModal}>
                  Ingresar Nuevo
                </MDButton>
              </MDBox>

              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Transacciones
                </MDTypography>
              </MDBox>

              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
      <Card>
        <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" mx={2} mt={-3} p={2} textAlign="center">
          <MDTypography variant="h2" fontWeight="medium" color="white">
            Transacción
          </MDTypography>
        </MDBox>

        <MDBox pt={4} pb={13} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="number" label="Monto de Transacción" fullWidth />
            </MDBox>

            <MDBox mb={2}>
              <MDInput type="text" label="Descripción" fullWidth />
            </MDBox>

            <MDBox mb={2}>
              <MDInput type="text" label="Localización" fullWidth />
            </MDBox>

            <FormControl fullWidth>
              <InputLabel>Tipo de Transacción</InputLabel>
              <br/>
              <Select value={transactionType} onChange={handleChange}>
                <MenuItem value="Compra">Debit</MenuItem>
                <MenuItem value="Pago de Factura">Credit</MenuItem>
                <MenuItem value="Transferencia">Transfer</MenuItem>
                <MenuItem value="Retiro en Efectivo">Effective</MenuItem>
              </Select>
            </FormControl>

            
            <br/>
            {/* Botón para agregar campos personalizados */}
            <MDBox mt={3} textAlign="center">
              <MDButton variant="gradient" color="success" onClick={handleAddField}>
                Agregar Campo
              </MDButton>
            </MDBox>

            {/* Campos personalizados */}
            {customFields.map((field, index) => (
              <MDBox key={index} mt={2} display="flex" alignItems="center">
                <MDInput
                  type="text"
                  label="Nombre del Campo"
                  value={field.name}
                  onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                  fullWidth
                />
                <MDInput
                  type="text"
                  label="Valor"
                  value={field.value}
                  onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                  fullWidth
                  sx={{ ml: 2 }}
                />
                <IconButton color="error" onClick={() => handleRemoveField(index)}>
                  <CloseIcon />
                </IconButton>
              </MDBox>
            ))}

<FormControl fullWidth>
              <InputLabel>Customer</InputLabel>
              <br/>
              <Select value={transactionType} onChange={handleChange}>
              {onlynames_Set.map((name, index) => (
                <MenuItem key={index} value={name}>
                  {name}
                </MenuItem>
              ))}
              </Select>
            </FormControl>

            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth>
                Ingresar Transacción
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      </Dialog>
    </DashboardLayout>
  );
}

export default Tables;
