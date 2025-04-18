import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import useApi from "useApi";
import source_link from "source_repo";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Bill from "layouts/billing/components/Bill";

function BillingInformation() {
  const { llamadowithoutbody } = useApi(`${source_link}/get_customers`);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await llamadowithoutbody("GET");
      
      if (data) {
        setCustomers(data);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <Card id="delete-account">
      <MDBox pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Customers
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <Bill
                key={customer.customerId}
                customerName={customer.customerName}
                customerEmail={customer.customerEmail}
                age={customer.age}
                gender={customer.gender} 
                customerContact={customer.customerContact}
                city={customer.city}
                state={customer.state}
                customerId={customer.customerId}
              />
            ))
          ) : (
            <MDTypography variant="body2" color="textSecondary">
              No hay información de clientes disponible.
            </MDTypography>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default BillingInformation;
