/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import useApi from "useApi"; // Asegúrate de que useApi esté bien definido
import { useState, useEffect } from "react";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

function Account() {
  const { llamadowithoutbody } = useApi("http://127.0.0.1:5000/get_accounts");
    const [accounts, setAccounts] = useState([]); // Estado para almacenar las transacciones
  
    useEffect(() => {
      const fetchTransactions = async () => {
        const data = await llamadowithoutbody("GET");
       
        if (data) {
          setAccounts(data); // Si solo tienes un objeto, conviértelo en un array
        }
      };
      fetchTransactions();
    }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>

          {accounts.length > 0 ? (
                      accounts.map((acc) => (
                        <Grid item xs={12} md={6} lg={3}>
                          <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                             color="success"

                              icon="account_balance_wallet_icon"
                              title={acc.bankBranch}
                              count={acc.accountBalance}
                              percentage={{
                                color: "success",
                                amount: acc.status,
                                label: acc.accountType,
                              }}
                            />
                          </MDBox>
                        </Grid>
                      ))
                    ) : (
                      <MDTypography variant="body2" color="textSecondary">
                        No hay información de clientes disponible.
                      </MDTypography>
                    )}

          
          
          
        </Grid>
      
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Account;
