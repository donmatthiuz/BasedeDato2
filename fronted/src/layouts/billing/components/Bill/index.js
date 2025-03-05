import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import useApi from "useApi";
import Swal from "sweetalert2";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";

function Bill({ customerId, customerName, gender, age, customerContact, customerEmail, city, state, noGutter }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId,
    customerName,
    gender,
    age,
    customerContact,
    customerEmail,
    city,
    state,
  });

  const { llamado: insertCustomer } = useApi("http://127.0.0.1:5000/update_customer");
  const { llamado: getRelationCustomer } = useApi("http://127.0.0.1:5000/get_relation_customer");

  const [transactionData, setTransactionData] = useState(null);
  const [relationshipData, setRelationshipData] = useState([]);

  useEffect(() => {
    const fetchTransactionData = async () => {
      const response = await getRelationCustomer({ customerId }, 'POST');
      if (response) {
        setTransactionData(response.Nodo);
        setRelationshipData(response.Relacion);
      }
    };

    fetchTransactionData();
  }, [customerId]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handle_update = async () => {
    const body = { ...formData };
    const response = await insertCustomer(body, 'POST');
    if (response) {
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Se actualizó exitosamente",
        text: "La información se actualizó correctamente.",
      });
    }
  };

  return (
    <>
      <MDBox
        component="li"
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        bgColor={darkMode ? "transparent" : "grey-100"}
        borderRadius="lg"
        p={3}
        mb={noGutter ? 0 : 1}
        mt={2}
      >
        <MDBox width="100%" display="flex" flexDirection="column">
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
              {customerName}
            </MDTypography>
            <MDBox display="flex" alignItems="center">
              <MDBox mr={1}>
                <MDButton variant="text" color="error">
                  <Icon>delete</Icon>&nbsp;Eliminar
                </MDButton>
              </MDBox>
              <MDButton variant="text" color={darkMode ? "white" : "dark"} onClick={handleOpen}>
                <Icon>edit</Icon>&nbsp;Editar
              </MDButton>
            </MDBox>
          </MDBox>
          <MDTypography variant="caption" color="text">City: {city}</MDTypography>
          <MDTypography variant="caption" color="text">Email: {customerEmail}</MDTypography>
          <MDTypography variant="caption" color="text">Age: {age}</MDTypography>
          <MDTypography variant="caption" color="text">Celphone: {customerContact}</MDTypography>
          <MDTypography variant="caption" color="text">State: {state}</MDTypography>
          <MDTypography variant="caption" color="text">Customer ID: {customerId}</MDTypography>
          <MDTypography variant="caption" color="text">Gender: {gender}</MDTypography>

          {/* Transaction Information */}
          {transactionData && (
            <MDBox mt={2}>
              <MDTypography variant="caption" color="text">Transaction ID: {transactionData.transactionId}</MDTypography>
              <MDTypography variant="caption" color="text">Transaction Location: {transactionData.transactionLocation}</MDTypography>
            </MDBox>
          )}

          {/* Relationship Information (Editable fields) */}
          {relationshipData.length > 0 && (
            <MDBox mt={2}>
              <MDTypography variant="caption" color="text">Relationship Properties:</MDTypography>
              {relationshipData.map((prop, index) => {
                const [label, value] = prop.split(":");
                return (
                  <TextField
                    key={index}
                    fullWidth
                    margin="dense"
                    label={label} // Use the property name as the label
                    value={value} // Use the value of the property
                    onChange={(e) => {
                      const updatedProps = [...relationshipData];
                      updatedProps[index] = `${label}:${e.target.value}`;
                      setRelationshipData(updatedProps);
                    }}
                  />
                );
              })}
            </MDBox>
          )}
        </MDBox>
      </MDBox>

      {/* Dialog for Editing */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Información</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Customer ID"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Celphone"
            name="customerContact"
            value={formData.customerContact}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleClose} color="error">Cancelar</MDButton>
          <MDButton onClick={handle_update} color="success">Guardar</MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

Bill.defaultProps = { noGutter: false };

Bill.propTypes = {
  customerId: PropTypes.string.isRequired,
  customerName: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  customerContact: PropTypes.string.isRequired,
  customerEmail: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default Bill;
