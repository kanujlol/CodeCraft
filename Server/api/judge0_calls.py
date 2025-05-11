import os
import requests
from dotenv import load_dotenv
import json
import base64
from django.http import JsonResponse
from App.models import Question

dotenv_path='.env'
load_dotenv(dotenv_path)

api_url="https://ce.judge0.com/"
rapid_api_key=os.getenv('rapid_api_key')

def get_languages():
    try:
        url=api_url+"languages/"
        response=requests.get(url)
        response=response.json()
        return response
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] get_languages: Exception -> {e}")
        return {"error":f"Error fetching languages: {e}"}

def get_submission_token(source_code,lang_id,inputs,outputs):
    try:
        url="https://judge0-ce.p.rapidapi.com/submissions"
        querystring={"base64_encoded":"true","fields":"*"}
        encoded_source_code=base64.b64encode(source_code.encode()).decode()
        encoded_inputs=base64.b64encode(inputs.encode()).decode()
        encoded_outputs=base64.b64encode(outputs.encode()).decode()

        payload={
            "language_id":lang_id,
            "source_code":encoded_source_code,
            "stdin":encoded_inputs,
            "expected_output":encoded_outputs
        }
        headers={
            "content-type":"application/json",
            "X-RapidAPI-Key":rapid_api_key,
            "X-RapidAPI-Host":"judge0-ce.p.rapidapi.com"
        }

        print(f"[DEBUG] get_submission_token: Headers -> {headers}")

        response=requests.post(url,json=payload,headers=headers,params=querystring)
        token=response.json().get('token')
        return token
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] get_submission_token: Exception -> {e}")
        return None

def check_submission_status(token):
    try:
        url=f"https://judge0-ce.p.rapidapi.com/submissions/{token}"
        querystring={"base64_encoded":"false","fields":"*"}
        headers={
            "X-RapidAPI-Key":rapid_api_key,
            "X-RapidAPI-Host":"judge0-ce.p.rapidapi.com"
        }

        response=requests.get(url,headers=headers,params=querystring).json()

        if response.get('status',{}).get('id') in [1,2]:
            return check_submission_status(token)
        
        return {
            'output':response.get('stdout',''),
            'error':response.get('stderr',''),
            'time':response.get('time',''),
            'status':response.get('status','')
        }
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] check_submission_status: Exception -> {e}")
        return {"error":f"Error checking submission status: {e}"}

def compile_code(source_code,lang_id,testcases):
    results=[]
    overall_status=3
    try:
        for idx,testcase in enumerate(testcases):
            formatted_input="\n".join(testcase['input'])
            formatted_output="\n".join(testcase['output'])

            print(f"Input -> {formatted_input}")
            print(f"Expected Output -> {formatted_output}")

            token=get_submission_token(source_code,lang_id,formatted_input,formatted_output)
            if not token:
                print("[ERROR] compile_code: Failed to get submission token.")
                continue

            result=check_submission_status(token)
            print(f"[DEBUG] compile_code: Judge0 Result -> {result}")

            status_id=result.get('status',{}).get('id',4)
            if status_id!=3:
                overall_status=4

            results.append({
                "input":testcase['input'],
                "expected_output":testcase['output'],
                "actual_output":result.get('output','').strip().split("\n") if result.get('output') else [],
                "error":result.get('error'),
                "status":result.get('status'),
                "time":result.get('time')
            })

        description=result.get('status',{}).get('description',4)
        print(f"[DEBUG] compile_code: Final Status -> {overall_status}, Description -> {description}")
        return {
            "results":results,
            "status":overall_status,
            "description":description
        }
    except Question.DoesNotExist:
        print("[ERROR] compile_code: Question with the given ID does not exist.")
        return {"error":"Question with the given ID does not exist."}
    except Exception as e:
        print(f"[ERROR] compile_code: Exception -> {str(e)}")
        return {"error":f"Error occurred: {str(e)}"}
