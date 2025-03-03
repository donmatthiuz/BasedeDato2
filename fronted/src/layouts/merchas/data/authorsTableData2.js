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

export default function Data2() {
  const { llamadowithoutbody } = useApi("http://127.0.0.1:5000/get_comerciantes");
  const [comerciantes, setComerciantes] = useState([]); // Estado para almacenar las transacciones

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await llamadowithoutbody("GET");
      console.log(data);
      if (data) {
        setComerciantes(data); // Si solo tienes un objeto, conviértelo en un array
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
      { Header: "Comerciantes", accessor: "author", width: "35%", align: "left" },
      { Header: "Categoria", accessor: "function", align: "left" },
      { Header: "riskLevel", accessor: "status", align: "center" },
      
    ],

    rows: comerciantes.map((comer) => ({
      author: (
        <Author
        name={`ID Comerciante: ${comer.merchantId}`}
          email={`Localizacion: ${comer.merchantLocation}`} // Puedes añadir el ID aquí también

          image={team2} // Asegúrate de que la imagen de autor esté configurada
        />
      ),
      function: <Job title={comer.merchantCategory} />,
      status: (
        <MDBox ml={-1}>
          <MDBadge
            badgeContent={comer.riskLevel}
            color="success"
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ),
      
     
    })),
  };
}
