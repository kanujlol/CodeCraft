import os
import requests
from dotenv import load_dotenv
import json
import base64
from django.http import JsonResponse
from App.models import Question

# Load environment variables
dotenv_path = '.env'
load_dotenv(dotenv_path)

# API URLs and Keys
api_url = "https://ce.judge0.com/"
rapid_api_key = os.getenv('rapid_api_key')

def get_languages():
    try:
        url = api_url + "languages/"
        response = requests.get(url)
        response = response.json()
        return response
    except requests.exceptions.RequestException as e:
        return {"error": f"Error fetching languages: {e}"}

# Helper function to get submission token
def get_submission_token(source_code, lang_id, inputs, outputs):
    try:
        url = "https://judge029.p.rapidapi.com/submissions"
        querystring = {"base64_encoded": "true", "fields": "*"} 
        
        encoded_source_code = base64.b64encode(source_code.encode()).decode()
        encoded_inputs = base64.b64encode(inputs.encode()).decode()
        encoded_outputs = base64.b64encode(outputs.encode()).decode()

        payload = {
            "language_id": lang_id,
            "source_code": encoded_source_code,
            "stdin": encoded_inputs,
            "expected_output": encoded_outputs
        }
        headers = {
            "content-type": "application/json",
            "X-RapidAPI-Key": rapid_api_key,
            "X-RapidAPI-Host": "judge029.p.rapidapi.com"
        }
        response = requests.post(url, json=payload, headers=headers, params=querystring)
        return response.json().get('token')
    except requests.exceptions.RequestException as e:
        return None

# Helper function to check submission status
def check_submission_status(token):
    try:
        url = f"https://judge029.p.rapidapi.com/submissions/{token}"
        querystring = {"base64_encoded": "false", "fields": "*"}
        headers = {
            "X-RapidAPI-Key": rapid_api_key,
            "X-RapidAPI-Host": "judge029.p.rapidapi.com"
        }
        response = requests.get(url, headers=headers, params=querystring).json()
        
        # Debugging: Print the full response to see the status and details
        print(f"Response from Judge0: {response}")
        
        if response.get('status', {}).get('id') in [1, 2]:
            return check_submission_status(token)  # Poll until done
        
        return {
            'output': response.get('stdout', ''),
            'error': response.get('stderr', ''),
            'time': response.get('time', ''),
            'status': response.get('status', '')
        }
    except requests.exceptions.RequestException as e:
        return {"error": f"Error checking submission status: {e}"}



def compile_code(source_code, lang_id, testcases):
    results = []
    overall_status = 3  # Default to 'Accepted'
    
    try:
        for testcase in testcases:
            formatted_input = "\n".join(testcase['input'])
            formatted_output = "\n".join(testcase['output'])
            
            # Debugging: Print formatted input and output
            print(f"Formatted Input: {formatted_input}")
            print(f"Formatted Output: {formatted_output}")
            
            # Get the submission token for the current test case
            token = get_submission_token(source_code, lang_id, formatted_input, formatted_output)
            
            # Check the submission status
            result = check_submission_status(token)
            
            # Debugging: Print the result
            print(f"Result: {result}")
            
            # Extract status ID
            status_id = result.get('status', {}).get('id', 4)  # Default to 4 (Wrong Answer)
            if status_id != 3:
                overall_status = 4  # If any test case fails, set status to 4

            # Append the result to the results list
            results.append({
                "input": testcase['input'],
                "expected_output": testcase['output'],  # Ensure expected output is passed
                "actual_output": result.get('output', '').strip().split("\n") if result.get('output') else [],
                "error": result.get('error'),
                "status": result.get('status'),
                "time": result.get('time')
            })

        # Determine the description based on overall_status
        description = "Accepted" if overall_status == 3 else "Wrong Answer"

        return {
            "results": results,
            "status": overall_status,
            "description": description
        }  

    except Question.DoesNotExist:
        return {"error": "Question with the given ID does not exist."}
    except Exception as e:
        return {"error": f"Error occurred: {str(e)}"}
