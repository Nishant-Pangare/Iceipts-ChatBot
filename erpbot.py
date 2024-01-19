from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Replace 'YOUR_ERP_API_ENDPOINT' with the actual endpoint of your ERP API for total sales
erp_api_endpoint = 'https://web.iceipts.com/api/inventory/dashboard/getTotalSales/196d0d63-79b8-4c8a-aa41-4b0d7f3badf9?receiptsType=SALES'

# Replace 'YOUR_ERP_BEARER_TOKEN' with the actual authorization bearer token for your ERP API
erp_bearer_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJEZWVwZXNoIGt1c2h3YWhhIiwiaWQiOiIxOTZkMGQ2My03OWI4LTRjOGEtYWE0MS00YjBkN2YzYmFkZjkiLCJpYXQiOjE3MDU2NDE1MDQsImV4cCI6MTczNzE3NzUwNCwiYXVkIjoiRGVlcGVzaCBrdXNod2FoYSJ9.Wd1FF4GMCj_FJZzlzV5svcdLgwGsashm1UWALyDhkGc'

userIdVariable = '196d0d63-79b8-4c8a-aa41-4b0d7f3badf9'


def get_total_sales_data():
    try:
        # Make a GET request to the ERP API with the authorization bearer token in the headers
        response = requests.get(erp_api_endpoint+ '/'  + userIdVariable + '?receiptsType=SALES', headers={'Authorization': f'Bearer {erp_bearer_token}'})

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Extract information from the API response (adjust this based on your API response format)
            total_sales_data = response.json()
            total_sales = total_sales_data['parties']

            # Return the information
            return f'The total sales are {total_sales} units.'
        else:
            # Handle the case when the API request was not successful
            return "Sorry, I couldn't retrieve the total sales information at the moment."
    except Exception as e:
        # Handle exceptions that may occur during the API request
        return f'An error occurred: {str(e)}'

@app.route('/webhook', methods=['POST'])
def webhook():
    req_data = request.get_json()

    # Extract the intent name from the request
    intent_name = req_data['queryResult']['intent']['displayName']

    if intent_name == 'TotalSales':
        total_sales_info = get_total_sales_data()
        fulfillment_response = {'fulfillmentText': total_sales_info}
        return jsonify(fulfillment_response)

    return jsonify({'fulfillmentText': 'Intent not recognized'})

if __name__ == '__main__':
    app.run(port=5000)
