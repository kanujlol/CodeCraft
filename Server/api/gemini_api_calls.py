import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
dotenv_path = '.env'
load_dotenv(dotenv_path)

# Initialize Gemini with API key
gemini_api_key = os.getenv("gemini_api_key")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)

# Function to generate hints
def generate_hints(data):
    try:
        # Define the model
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Extract dynamic attributes from the request
        error = data.get("error", "Unknown Error")
        profession = data.get("profession", "developer")
        age = data.get("age", 25)
        level = data.get("level", "beginner")
        experience = data.get("experience", "0 years")
        prev_response = data.get("prev_response", "")
        code = data.get("code", "")

        examples = {
            "syntax": "Example: Missing a colon at the end of a Python 'if' statement.",
            "runtime": "Example: Trying to access a variable that hasn't been initialized.",
            "tle": "Example: Using a nested loop for large inputs causing inefficiency.",
            "accepted": "Example: Your code ran successfully and produced the correct output."
        }
        example_hint = ""
        if "syntax" in error.lower():
            example_hint = examples["syntax"]
        elif "runtime" in error.lower():
            example_hint = examples["runtime"]
        elif "time limit exceeded" in error.lower():
            example_hint = examples["tle"]
        elif "accepted" in error.lower():
            example_hint = examples["accepted"]

        # Define the dynamic prompt
        prompt = f"""
        You are an assistant helping users debug their code. Tailor your suggestions dynamically based on the user's attributes and error.

        User Info:
        - Profession: {profession}
        - Age: {age}
        - Level: {level}
        - Experience: {experience}

        Code Snippet:
        {code}

        Compile Response:
        - Error: {error}

        Previous Response:
        {prev_response}

        Respond dynamically:
        1. Provide exactly three hints: a small hint, a medium hint, and a big hint.
        2. Each hint should not exceed two lines.
        3. Avoid providing direct solutions but guide them toward fixing the issue.
        4. Ensure the hints are clear and different from the previous response.

        Additional Example Based on Error Type:
        {example_hint}

        Dynamic Response:
        """

        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        return {"error": f"Error occurred: {str(e)}"}

# Function to handle AskAI request
def ask_ai(data):
    try:
        topic = data.get("topic", "Linear Search")
        profession = data.get("profession", "developer")
        age = data.get("age", 25)
        level = data.get("level", "beginner")
        experience = data.get("experience", "0 years")
        prev_response = data.get("prev_response", "")

        prompt = f"""
        You are an advanced teaching assistant capable of breaking down complex topics for users based on their profession, age, experience, and skill level.

        Topic: {topic}
        User Info:
        - Profession: {profession}
        - Age: {age}
        - Level: {level}
        - Experience: {experience}

        Previous Response:
        {prev_response}

        Provide a detailed and structured explanation of the topic in the following format:

        1. Objective/Definition: Clearly define the topic and its purpose.
        2. Intuition: Explain the fundamental idea behind the topic to build user understanding.
        3. Best Approach: Describe the most efficient or commonly used approach to implement the topic.
        4. Code Examples:
            - Provide code in C++.
            - Provide code in Python.
            - Provide code in Java.
        5. Dry Run: Walk through an example step-by-step to show how the topic is applied.
        6. Complexity Analysis: Provide a detailed explanation of the complexities involved.
            - Time Complexity: Explain how the time complexity is derived and what factors influence it.
            - Space Complexity: Explain how memory usage is calculated and optimized.
        7. Ensure the explanation is clear and detailed than the previous response if available.
        8. also ensure that give responses only if the requested topic is related to computer science and also give a warning if any inappropriate question is asked.
        """
        
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        return {"error": f"Error occurred: {str(e)}"}