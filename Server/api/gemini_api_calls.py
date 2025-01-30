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
        status=data.get("status","")
        

        examples = {
            "syntax": [
                "Hint 1: Check if you've missed any punctuation, like `:` or `()` in your code. Small syntax mistakes can cause big errors!",
                "Hint 2: It looks like you might have forgotten a `:` at the end of a statement, such as an `if`, `for`, or `while` in Python.",
                "Hint 3: Ensure that every control statement (`if`, `for`, `while`, `def`, `class`) ends with a colon (`:`) to avoid syntax errors."
            ],
            "runtime": [
                "Hint 1: You're using a variable that may not have been assigned a value yet. Check your variable declarations.",
                "Hint 2: A variable is being accessed before it's defined. Look for missing assignments before usage.",
                "Hint 3: Ensure that every variable is initialized before use. For example: `x = 0` before `print(x)`, instead of directly using `print(x)`."
            ],
            "tle": [
                "Hint 1: Your code is taking too long to execute. Consider optimizing loops or using efficient algorithms.",
                "Hint 2: You may be using nested loops on large inputs. Try reducing complexity, such as using hashing or binary search.",
                "Hint 3: Replace `O(n^2)` approaches with efficient ones like sorting + binary search (`O(n log n)`) or use memoization to avoid redundant calculations."
            ],
            "accepted": [
                "Example: Your code ran successfully and produced the correct output."
            ],
            "logical": [
                "Hint 1: Logical error: Please review your logic.",
                "Hint 2: Logical error: Please review your logic.",
                "Hint 3: Logical error: Please review your logic."
            ]
        }

        example_hint = ""
        if "syntax" in status.lower():
            example_hint = examples["syntax"]
        elif "runtime" in status.lower():
            example_hint = examples["runtime"]
        elif "time limit exceeded" in status.lower():
            example_hint = examples["tle"]
        elif "accepted" in status.lower():
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
        - Current status : {status}
        Previous Response:
        {prev_response}

        Respond dynamically:
        1. Provide exactly three hints: hint1 , hint2, and hint3.
        2. Each hint should not exceed two lines.
        3. Avoid providing direct solutions but guide them toward fixing the issue.
        4. Ensure the hints are clear and different from the previous response.
        5. Generate three progressive hints for a given error type. If the error is a syntax, runtime, or time-limit-exceeded (TLE) error, ensure the hints follow a logical progression like a thread:
            Hint 1 should be a basic nudge in the right direction.
            Hint 2 should provide more details, narrowing down the issue.
            Hint 3 should be a clear and actionable solution.
           If a threaded progression isn't possible, provide the best hints separately
        6. If the error is related to syntax, runtime issues, or time limits, offer appropriate hints. These could include advice on debugging common issues, optimizing the code, or fixing syntactical mistakes.
        7. For logical errors, avoid giving technical hints. Instead, provide the following general hint: "Logical error: Please review your logic." This encourages the user to check their thought process or approach and find the root cause of the issue themselves.
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