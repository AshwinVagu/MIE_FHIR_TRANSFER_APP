import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress, Container, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from "react-router-dom";

export const DataRetrieval = () => {
    const [loading, setLoading] = useState(false);
    const [medicalData, setMedicalData] = useState(null);
    const [cookie, setCookie] = useState("");
    const [postResult, setPostResult] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        let token = localStorage.getItem("webchart_get_access_token");
        const patient_info = JSON.parse(localStorage.getItem("webchart_get_token_results"));
        const patient_id = patient_info?.patient;
        if (token && patient_id) {
            fetchMedicalHealthData(token, patient_id);
        }
    }, []);

    const fetchMedicalHealthData = async (access_token, patient_id) => {
        setLoading(true);
        try {
            const res = await Meteor.callAsync("ehrData.get", access_token, patient_id);
            const resource = getFirstCondition(res);
            // console.log("Data obtained:", JSON.stringify(resource?.resource));
            setMedicalData(resource?.resource || null);
        } catch (err) {
            console.error("Error fetching medical data:", err);
        } finally {
            setLoading(false);
        }
    };

    const postMedicalData = async () => {
        if (!cookie || !medicalData) {
            alert("Cookie and FHIR data must be provided");
            return;
        }

        try {
            console.log("Posting medical data with cookie:", medicalData);
            const result = await Meteor.callAsync("ehrData.post", cookie, medicalData);
            console.log("Post result:", result);
            setPostResult(result);
            alert("FHIR data posted successfully");
        } catch (err) {
            console.error("Error posting medical data:", err);
            alert("Failed to post FHIR data");
        }
    };

    const getFirstCondition = (retrieved_resource) => {
        if (retrieved_resource.resourceType !== "Bundle") {
            return retrieved_resource;
        }

        return retrieved_resource.entry.find(
            (entry) => entry.resource && entry.resource.resourceType === "Condition"
        ) || null;
    };

    return (
        <Container style={{ marginTop: 20, maxWidth: "600px" }}>
            {loading ? (
                <CircularProgress />
            ) : medicalData ? (
                <>
                    <pre style={{ fontSize: "14px", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                        {JSON.stringify(medicalData, null, 2)}
                    </pre>
                    <TextField
                        label="Cookie"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={cookie}
                        onChange={(e) => setCookie(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={postMedicalData}>
                        Post and get MIE object
                    </Button>
                    {postResult && (
                        <div style={{ marginTop: 20 }}>
                            <Typography variant="h6" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                                RESULT:
                            </Typography>
                            <pre style={{ fontSize: "14px", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                                {JSON.stringify(postResult, null, 2)}
                            </pre>
                        </div>
                    )}
                </>
            ) : (
                <Typography>No condition data found.</Typography>
            )}
        </Container>
    );
};