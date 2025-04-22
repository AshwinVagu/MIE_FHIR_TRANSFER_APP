import { Meteor } from 'meteor/meteor';
import axios from 'axios';

Meteor.methods({
  'ehrData.get': async function (access_token, patient_id) {
    this.unblock(); 

    try {
        let url = `https://ashwinvagu.webch.art/webchart.cgi/fhir//Condition?patient=${patient_id}`;
        let queryParams = new URLSearchParams();

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: "application/fhir+json",
            },
        });

        return response.data;
    } catch (error) {
        throw new Meteor.Error("FHIR_API_ERROR", error.response?.data || "Failed to fetch FHIR metadata");
    }
},
'ehrData.post': async function (cookie, fhirData) {
    this.unblock();

    console.log("Posting FHIR data:", fhirData);

    try {
        const url = `https://dcarlson.dev.webchart.app/webchart.cgi/fhir/Condition?viewMIEjson=1`;

        const response = await axios.post(url, fhirData, {
            headers: {
                // "Content-Type": "application/fhir+json",
                // "Accept": "application/fhir+json",
                "Cookie": cookie
            },
        });


        return response.data;
    } catch (error) {
        throw new Meteor.Error("FHIR_POST_ERROR", error.response?.data || "Failed to post FHIR data");
    }
}

});
