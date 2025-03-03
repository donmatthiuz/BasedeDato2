import React, { useState } from "react";
// @mui material components
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function CustomModal() {
  const [open, setOpen] = useState(false);  // Estado para controlar el modal

  const handleOpen = () => setOpen(true);  // Abre el modal
  const handleClose = () => setOpen(false);  // Cierra el modal

  return (
    <div>
      {/* Botón que abrirá el modal */}
      <MDButton onClick={handleOpen}>Abrir Modal</MDButton>

      {/* Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <MDTypography variant="h6">Detalles de la Transacción</MDTypography>
        </DialogTitle>
        <DialogContent>
          <MDBox>
            <MDTypography variant="body1">
              Aquí puedes agregar detalles sobre la transacción o cualquier otro contenido relevante que desees mostrar.
            </MDTypography>
            <MDBox mt={2}>
              <MDTypography variant="body2">
                Este es un ejemplo de cómo se puede organizar la información dentro de un modal.
              </MDTypography>
            </MDBox>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CustomModal;
