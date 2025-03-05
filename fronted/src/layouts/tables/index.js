import { useState, useEffect, useCallback } from "react";
import useApi from "useApi"; // Asegúrate de que useApi esté bien definido
import Swal from "sweetalert2";
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
import CheckIcon from "@mui/icons-material/Check";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import useForm from "useForm";
import MDInput from "components/MDInput";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Data from "./data/authorsTableData";
import Divider from "@mui/material/Divider";
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import MDButton from "components/MDButton";
import { Select } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";




import { object, string, number, array } from 'yup';
import dialog from "assets/theme/components/dialog";

const schema = object({
  transactionAmount: number().required('El monto es requerido'),
  transactionDescription: string().required('Descripcion requerida'),
  transactionLocation: string().required('Localizacion requerida'),
  transactionType: string().required('Tipo de Transaccion requerida'),
  customer: array().of(
    object({
      customer_name: string().required('Nombre del customer requerido'),
      channel: string().required('Canal requerido'),
      deviceUsed: string().required('Dispositivo requerido'),
    })
  ).required('Customer requerido'),
  account:  array().of(object({
    branch_account: string().required('Cuenta Bancaria requerida'),
    balanceBefore: string().required('Saldo antes requerido'),
    balanceAfter: string().required('Saldo después requerido'),
  })).required('Cuenta requerida'),
  merchant: string().required('Comerciante requerido'),
  device: string().required('Dispositivo requerido'),
});




function Tables() {
  const { llamadowithoutbody:onlynames } = useApi("http://127.0.0.1:5000/get_customers_names");
  const [onlynames_Set, setOnlyNames] = useState([]); // Estado para almacenar las transacciones
  const { llamadowithoutbody:names_customers } = useApi("http://127.0.0.1:5000/get_comerciantes_names");

  const { llamado: insertTransaction } = useApi("http://127.0.0.1:5000/transaction_log");



  const handle_InsertTransaction = async() => {
   
    
    const body = {
      ...values
      };
      console.log(body)
      
      const response = await insertTransaction(body, 'POST');
      if (response) {
        console.log(response)
        if (response.message === "Transaccion registrada"){
          
          Swal.fire({
            icon: "success",
            title: "Insertado Correctamente",
            text: "Se inserto de manera correcta",
          });
          setOpenModal(false)
      }else{
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se conoce el error",
        });
      }
      
      
      
    }
  } 





  


  const [merchants_Set, setMerchants] = useState([]); // Estado para almacenar las transacciones

  const [confirmedFields, setConfirmedFields] = useState({});
  
  const [confirmedFieldsCustom, setConfirmedFieldsCustom] = useState({});

  const [transactionFields, setTransactionFields] = useState([]);

  const handleAddTransactionField = () => {
    const newField = {
      name: `customTransactionField_${transactionFields.length + 1}`,
      value: "",
    };
  
    setTransactionFields([...transactionFields, newField]);
  
    // Agregar el campo en useForm
    setValue(newField.name, "");
  };

  const handleTransactionFieldChange = (index, field, newValue) => {
    setTransactionFields((prevFields) =>
      prevFields.map((item, i) => (i === index ? { ...item, [field]: newValue } : item))
    );
  
    if (field === "value") {
      setValue(transactionFields[index].name, newValue);
    }
  };



  const handleCustomFieldChange = (index, field, value) => {
    setCustomFields((prevFields) => {
      return prevFields.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
    });
  };


  const { values, setValue, validate, errors } = useForm(schema, { 
    transactionAmount: '', 
    transactionDescription: '', 
    transactionLocation: '', 
    transactionType: '', 
    customer: [{ 
      customer_name: '',
      channel: '', 
      deviceUsed: '' 
    }], 
    account: [{
      branch_account: '',
      balanceBefore: '', 
      balanceAfter: '' 
    }],
    merchant: '', 
    device: '' 
  });
  
  // aqui vamos a setear los datos de customer y account
  const addPropertyToCustomer = (propertyName) => {
    setValue("customer", values.customer.map(c => ({ ...c, [propertyName]: '' })));
  };

  const handleAccountFieldChange = (field, value) => {
    setValue("account", { ...values.account, [field]: value });
  };
  const handleRemoveTransactionField = (index) => {
    const updatedFields = transactionFields.filter((_, i) => i !== index);
    setTransactionFields(updatedFields);
  
    // Eliminar la propiedad de useForm
    const fieldName = transactionFields[index].name;
    setValue(fieldName, undefined);
  };
  
  const onclick_send = () => {
    console.log(values)
  }

  const handleCustomerChange = (index, field, value) => {
    const updatedCustomer = [...values.customer];
    updatedCustomer[index] = { ...updatedCustomer[index], [field]: value };
    setValue("customer", updatedCustomer);
  };

  const handleAccount_Change = (index, field, value) => {
    const updatedCustomer = [...values.account];
    updatedCustomer[index] = { ...updatedCustomer[index], [field]: value };
    setValue("account", updatedCustomer);
  };
  

  

  const handleAccountChange = (field, value) => {
    setValue("account", { ...values.account, [field]: value });
  };
  
  
  
  
  const handleChange_useForm = (e) => {
    const { name, value } = e.target;
    setValue(name, value);
  };
  

  useEffect(() => {
    const fetchTransactions = async () => {
     
      const data = await onlynames("GET");
      const data2 = await names_customers("GET");
      if (data) {
         setOnlyNames(data);
         setMerchants(data2);
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
  

  // Función para actualizar los valores de los campos personalizados
  const handleFieldChange = (index, field, value) => {
    const newFields = [...customFields];
    newFields[index][field] = value;
    setCustomFields(newFields);
  };


  const [customerFields, setCustomerFields] = useState([]);


  const [rememberMe, setRememberMe] = useState(false);
  const [transactionType, setTransactionType] = useState("");

  const handleChange = (event) => {
    setTransactionType(event.target.value);
  };

  const handleAddCustomerField = () => {
    setCustomerFields([...customerFields, { name: "", value: "" }]);
  };

  const handleAddCustomField = () => {
    setCustomFields([...customFields, { name: "", value: "" }]);
  };

  // Función para eliminar una propiedad del Customer
  const handleRemoveCustomerField = (index) => {
    const newFields = [...customerFields];
    newFields.splice(index, 1);
    setCustomerFields(newFields);
  };

  // Función para actualizar los valores de las propiedades del Customer
  const handleCustomerFieldChange = (index, field, value) => {
    setCustomerFields((prevFields) => {
      return prevFields.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
    });
  };
  


  


const handleRemoveFieldCustom = (index, name) => {
    // Eliminar del array de campos personalizados
    const newFields = [...customFields];
    newFields.splice(index, 1);
    setCustomFields(newFields);
  
    // Eliminar la propiedad del objeto customer
    handleRemoveCustomProperty(name);
  };
  
  const handleRemoveCustomProperty = (name) => {
    if (!name || !(name in values)) return; // Si no existe, no hacer nada
  
    // Eliminar la propiedad estableciendo undefined o null
    setValue(name, undefined); 
  
    // Eliminar la confirmación de la propiedad si estaba en confirmedFieldsCustom
    setConfirmedFieldsCustom((prev) => {
      const updatedConfirmed = { ...prev };
      delete updatedConfirmed[name];
      return updatedConfirmed;
    });
  };
  

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const { columns, rows,  searchInput } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();

  // Estado para manejar la apertura del modal
  const [openModal, setOpenModal] = useState(false);

  // Funciones para abrir y cerrar el modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);










  const handleRemoveFieldCustomer = (index, name) => {
    // Eliminar del array de campos personalizados
    const newFields = [...customerFields];
    newFields.splice(index, 1);
    setCustomerFields(newFields);
  
    // Eliminar la propiedad del objeto customer
    handleRemoveCustomerProperty(name);
  };
  
  const handleRemoveCustomerProperty = (name) => {
    setValue("customer", [
      Object.fromEntries(
        Object.entries(values.customer[0]).filter(([key]) => key !== name) // Filtra y elimina la propiedad
      ),
    ]);
  
    setConfirmedFields((prev) => {
      const updatedFields = { ...prev };
      delete updatedFields[name]; // Elimina del estado de confirmación
      return updatedFields;
    });
  };
  
  


  const handleAddCustomerProperty = (name, value) => {
    if (!name || !value) return; // Evita agregar propiedades vacías
  
    setValue("customer", [
      {
        ...values.customer[0],  // Mantiene las propiedades existentes
        [name]: value            // Agrega la nueva propiedad dinámicamente
      }
    ]);
  
    setConfirmedFields((prev) => ({
      ...prev,
      [name]: true, // Marca este campo como confirmado
    }));
  };


  const handleAddCustomProperty = (name, value) => {
    if (!name || !value) return; // Evita agregar propiedades vacías
  
    setValue(name,value);
  
    setConfirmedFieldsCustom((prev) => ({
      ...prev,
      [name]: true, // Marca este campo como confirmado
    }));
  };
  
  const handleRemoveField = (index) => {
    const newFields = [...customFields];
    newFields.splice(index, 1);
    setCustomFields(newFields);
  }; 



  
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
              <Data />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Modal */}
      <Dialog 
        open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth
        aria-labelledby="dialog-title"
  aria-describedby="dialog-description">
      <Card>
        <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" mx={2} mt={-3} p={2} textAlign="center">
          <MDTypography variant="h2" fontWeight="medium" color="white">
            Transacción
          </MDTypography>
        </MDBox>

        <MDBox pt={4} pb={13} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="number"
                name="transactionAmount" 
                label="Monto de Transacción" 
                fullWidth 
                onChange={handleChange_useForm}
                value={values.transactionAmount}
                />
            </MDBox>

            <MDBox mb={2}>
              <MDInput type="text" 
              name="transactionDescription" 
              label="Descripción" fullWidth 
              onChange={handleChange_useForm}
              value={values.transactionDescription}/>
            </MDBox>

            <MDBox mb={2}>
              <MDInput type="text" label="Localización" fullWidth
              name="transactionLocation" 
              onChange={handleChange_useForm}
              value={values.transactionLocation}
              />
            </MDBox>

            <FormControl fullWidth>
              <InputLabel>Tipo de Transacción</InputLabel>
              <br/>
              <Select 
                value={values.transactionType}
                 name="transactionType"
                onChange={handleChange_useForm}>
                <MenuItem value="Debit">Compra</MenuItem>
                <MenuItem value="Credit">Credit</MenuItem>
                <MenuItem value="Transfer">Transfer</MenuItem>
                <MenuItem value="Effective">Effective</MenuItem>
              </Select>
            </FormControl>

            
            <br/>
            <MDBox mt={3} textAlign="center">
              <MDButton variant="gradient" color="success" onClick={handleAddCustomField}>
                Agregar Propiedad Transacción
              </MDButton>
            </MDBox>

            {/* Campos personalizados de la Transacción */}
            {customFields.map((field, index) => (
              <MDBox key={index} mt={2} display="flex" alignItems="center">
                <MDInput
                  type="text"
                  label="Nombre del Campo"
                  value={field.name}
                  onChange={(e) => handleCustomFieldChange(index, "name", e.target.value)}
                  fullWidth
                  sx={{
                    backgroundColor: confirmedFieldsCustom[field.name] ? "#e0f7fa" : "white", // Azul claro si está confirmado
                  }}
                />
                <MDInput
                  type="text"
                  label="Valor"
                  value={field.value}
                  onChange={(e) => handleCustomFieldChange(index, "value", e.target.value)}
                  fullWidth
                
                  sx={{
                    ml: 2,
                    backgroundColor: confirmedFieldsCustom[field.name] ? "#e0f7fa" : "white", // Azul claro si está confirmado
                  }}
                />
                <IconButton color="error" onClick={() => handleRemoveFieldCustom(index, field.name)}>
                  <CloseIcon />
                </IconButton>

                <IconButton
                  color={confirmedFields[field.name] ? "primary" : "success"} // Azul si ya está agregado
                  onClick={() => handleAddCustomProperty(field.name, field.value)}
                >
                  <CheckIcon />
                </IconButton>
              </MDBox>
            ))}


          <MDTypography variant = "h3">Customer</MDTypography>
          <br/>
            <FormControl fullWidth>
           
              <br/>
              
              
              <InputLabel>Nombre Customer</InputLabel>
              <Select 
                name="customer_name"
                value={values.customer[0]?.customer_name || ""}
                onChange={(e) => handleCustomerChange(0, "customer_name", e.target.value)}
                >
              {onlynames_Set.map((name, index) => (
                <MenuItem key={index} value={name}>
                  {name}
                </MenuItem>
              ))}
              </Select>
              
            </FormControl>
            <br/>
            <br/>
            <MDBox mb={2}>
              <MDInput 
                type="text" 
                label="Canal Usado" fullWidth
                name="channel"
                value={values.customer[0]?.channel || ""}
                onChange={(e) => handleCustomerChange(0, "channel", e.target.value)} />
            </MDBox>

            <MDBox mb={2}>
              <MDInput 
              type="text" 
              label="Dispositivo Usado" 
               name="deviceUsed"
               value={values.customer[0]?.deviceUsed || ""}
                onChange={(e) => handleCustomerChange(0, "deviceUsed", e.target.value)}
              fullWidth />
            </MDBox>


            

            
            <MDBox mt={3} textAlign="center">
                <MDButton variant="gradient" color="success" onClick={handleAddCustomerField}>
                  Agregar Propiedad Relacion
                </MDButton>
              </MDBox>
             {/* Campos personalizados del Customer */}
             {customerFields.map((field, index) => (
              <MDBox key={index} mt={2} display="flex" alignItems="center">
                <MDInput
                  type="text"
                  label="Nombre del Campo"
                  value={field.name}
                  onChange={(e) => handleCustomerFieldChange(index, "name", e.target.value)}
                  fullWidth
                  sx={{
                    backgroundColor: confirmedFields[field.name] ? "#e0f7fa" : "white", // Azul claro si está confirmado
                  }}
                />
                <MDInput
                  type="text"
                  label="Valor"
                  value={field.value}
                  onChange={(e) => handleCustomerFieldChange(index, "value", e.target.value)}
                  fullWidth
                  sx={{
                    ml: 2,
                    backgroundColor: confirmedFields[field.name] ? "#e0f7fa" : "white", // Azul claro si está confirmado
                  }}
                />
                <IconButton color="error" onClick={() => handleRemoveFieldCustomer (index, field.name)}>
                  <CloseIcon />
                </IconButton>
                <IconButton
                  color={confirmedFields[field.name] ? "primary" : "success"} // Azul si ya está agregado
                  onClick={() => handleAddCustomerProperty(field.name, field.value)}
                >
                  <CheckIcon />
                </IconButton>
              </MDBox>
            ))}




               <MDTypography variant = "h3">Comerciantes</MDTypography>

               <InputLabel>Nombre Comerciantes</InputLabel>
              <Select 
                  name="merchant"
                  value={values.merchant} 
                  onChange={handleChange_useForm}>
                {merchants_Set.map((name, index) => (
                  <MenuItem key={index} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              <MDBox mt={4} mb={1}>

              <MDTypography variant = "h3">Dispositivos</MDTypography>
              <br/>
              <FormControl fullWidth>
              <InputLabel>Seleccionar Dispositivo</InputLabel>
              <br/>
              <Select 
                name="device"
                value={values.device} 
                onChange={handleChange_useForm}>
                <MenuItem value="Desktop">Desktop</MenuItem>
                <MenuItem value="POS">POS</MenuItem>
                <MenuItem value="Mobile">Mobile</MenuItem>
                <MenuItem value="ATM">ATM</MenuItem>
              </Select>
            </FormControl>
            <br/>
            <br/>

            <MDTypography variant = "h3">Cuenta Bancaria</MDTypography>

            <br/>
            <FormControl fullWidth>
              <InputLabel>Seleccionar Cuenta Bancaria</InputLabel>
              <br/>
              <Select 
                name="branch_account"
                value={values.account[0]?.branch_account || ""}
                onChange={(e) => handleAccount_Change(0, "branch_account", e.target.value)}>
                <MenuItem value="Port Blair Branch">Port Blair Branch</MenuItem>
                <MenuItem value="Rishikesh Branch">Rishikesh Branch</MenuItem>
                <MenuItem value="Nagaon Branch">Nagaon Branch</MenuItem>
              </Select>
            </FormControl>

            <br/>
            <br/>
            <MDBox mb={2}>
              <MDInput 
                type="text" 
                label="Saldo Antes" fullWidth 
                name="balanceBefore"
                value={values.account[0]?.balanceBefore || ""}
                onChange={(e) => handleAccount_Change(0, "balanceBefore", e.target.value)}/>
            </MDBox>
            <MDBox mb={2}>
              <MDInput 
                type="text" 
                label="Saldo Despues" 
                fullWidth 
                name="balanceAfter"
                value={values.account[0]?.balanceAfter || ""}
                onChange={(e) => handleAccount_Change(0, "balanceAfter", e.target.value)}
                />
            </MDBox>
            <br/>

              <MDButton variant="gradient" color="info" fullWidth
              onClick={handle_InsertTransaction}>
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
