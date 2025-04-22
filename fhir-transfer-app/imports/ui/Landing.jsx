import React, { useEffect, useState } from "react";
import { Card, CardActionArea, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import { Meteor } from "meteor/meteor";
import {CLIENT_SECRET} from "../../credentials/secrets.js"; 
import { AUTH_BASE_URL } from '../utils/urls.js'; 

export const Landing = () => {
  const [clientSecret, setClientSecret] = useState(CLIENT_SECRET || "");
  const [medicalData, setMedicalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const authBaseURL = AUTH_BASE_URL;
  const clientID = "MIE-localhost";

  // Prompt user for client secret if not provided
  useEffect(() => {
    if (!clientSecret) {
      const userSecret = prompt("Enter the client secret:");
      if (userSecret) setClientSecret(userSecret);
    }
  }, []);

  // Fetch data on page load (not dependent on client secret)
  useEffect(() => {
    // fetchMedicalData();
  }, []);

  const handleAuth = () => {
    if (!clientSecret) {
      alert("Client Secret is required to proceed.");
      return;
    }

    window.location.href = `${authBaseURL}/webchart.cgi/oauth/authenticate/?response_type=code&client_id=${clientID}&redirect_uri=${window.location.origin}/code&scope=launch/patient openid fhirUser offline_access patient/*.read&state=secure_random_state&aud=${authBaseURL}/webchart.cgi`;
  };

  return (
    <Box sx={{ padding: 2, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Authentication Card (Full Width on Mobile) */}
      <Card 
        sx={{
          width: "100%", 
          maxWidth: 400, 
          borderRadius: 3, 
          boxShadow: 3, 
          marginBottom: 3, 
          backgroundColor: "#f8f9fa"
        }}
      >
        <CardActionArea sx={{ display: "flex", alignItems: "center", padding: 2 }} onClick={handleAuth}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: 18, fontWeight: "bold" }}>
            Get Data from WebChart
          </Typography>
          <Box
            component="img"
            sx={{ width: 50, height: "auto", marginLeft: 1 }}
            src="../../assets/wc_logo_full.png"
            alt="WebChart Logo"
          />
        </CardActionArea>
      </Card>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress size={40} />
        </Box>
      )}

      
      {/* No Data Message */}
      {!loading && medicalData.length === 0 && (
        <Typography variant="h6" sx={{ textAlign: "center", marginTop: 3, fontSize: 16 }}>
          No medical data available.
        </Typography>
      )}
    </Box>
  );
};
