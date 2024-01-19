const express = require('express');
const axios = require('axios');

const app = express();
const port = 5000;

// Replace 'YOUR_ERP_API_ENDPOINT' with the actual endpoint of your ERP API for total sales
const erpApiEndpoint = 'https://web.iceipts.com/api/inventory/dashboard/getTotalSales/196d0d63-79b8-4c8a-aa41-4b0d7f3badf9?receiptsType=SALES';

// Replace 'YOUR_ERP_BEARER_TOKEN' with the actual authorization bearer token for your ERP API
const erpBearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJEZWVwZXNoIGt1c2h3YWhhIiwiaWQiOiIxOTZkMGQ2My03OWI4LTRjOGEtYWE0MS00YjBkN2YzYmFkZjkiLCJpYXQiOjE3MDU2NDE1MDQsImV4cCI6MTczNzE3NzUwNCwiYXVkIjoiRGVlcGVzaCBrdXNod2FoYSJ9.Wd1FF4GMCj_FJZzlzV5svcdLgwGsashm1UWALyDhkGc';

const userIdVariable = '196d0d63-79b8-4c8a-aa41-4b0d7f3badf9';

async function getTotalSalesData() {
    try {
        // Make a GET request to the ERP API with the authorization bearer token in the headers
        const response = await axios.get(`${erpApiEndpoint}/${userIdVariable}?receiptsType=SALES`, {
            headers: {
                'Authorization': `Bearer ${erpBearerToken}`
            }
        });

        // Check if the request was successful (status code 200)
        if (response.status === 200) {
            // Extract information from the API response (adjust this based on your API response format)
            const totalSalesData = response.data;
            const totalSales = totalSalesData.parties;

            // Return the information
            return `The total sales are ${totalSales} units.`;
        } else {
            // Handle the case when the API request was not successful
            return "Sorry, I couldn't retrieve the total sales information at the moment.";
        }
    } catch (error) {
        // Handle exceptions that may occur during the API request
        return `An error occurred: ${error.message}`;
    }
}

app.use(express.json());

app.post('/webhook', async (req, res) => {
    const intentName = req.body.queryResult.intent.displayName;

    if (intentName === 'TotalSales') {
        const totalSalesInfo = await getTotalSalesData();
        const fulfillmentResponse = { fulfillmentText: totalSalesInfo };
        return res.json(fulfillmentResponse);
    }

    return res.json({ fulfillmentText: 'Intent not recognized' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
