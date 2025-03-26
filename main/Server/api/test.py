
import os
import json
import requests
import google.generativeai as genai
from dotenv import load_dotenv

dotenv_path = '.env'
load_dotenv(dotenv_path)


gemini_api_key = os.getenv("gemini_api_key")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)

# Function to generate hints
def generate_hints(data):
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")


        error = data.get("error", "null")
        profession = data.get("profession", "developer")
        age = data.get("age", 25)
        level = data.get("level", "beginner")
        experience = data.get("experience", "0 years")
        prev_response = data.get("prev_response", "")
        code = data.get("code", "")
        status=data.get("status","")

        examples = {
            "syntax": [
                "Hint 1: Check for missing punctuation, such as `:` at the end of `if`, `for`, `while`, or function definitions.",
                "Hint 2: Ensure parentheses `()` and brackets `[]` are properly closed and balanced in expressions.",
                "Hint 3: Check for typos in keywords (`def`, `return`, `class`) and ensure indentation follows Python's rules."
            ],
            "runtime": [
                "Hint 1: A variable may be used before assignment. Verify that all variables are initialized before use.",
                "Hint 2: Check for incorrect function calls. Ensure that arguments match the function definition.",
                "Hint 3: Look for division by zero or invalid type operations (e.g., adding `int` and `str`)."
            ],
            "tle": [
                "Hint 1: Your code is running too long. Try optimizing loops and avoiding unnecessary computations.",
                "Hint 2: Check for nested loops on large inputs. Consider using data structures like sets or dictionaries for faster lookups.",
                "Hint 3: Identify redundant calculations and use memoization or dynamic programming to optimize efficiency."
            ],
            "accepted": [
                "Your code is correct! 🎉 Now, consider optimizing it further for efficiency.",
                "Great job! Try reducing memory usage or using more efficient data structures.",
                "Your solution works! If possible, analyze the time complexity and optimize for larger inputs."
            ],
            "logical": [
                "Hint 1: Test with edge cases (empty input, negative values, large numbers) to spot logical errors.",
                "Hint 2: Use print statements or debugging tools to track variable values and control flow.",
                "Hint 3: Walk through the code step by step with a sample input and verify if the output matches expectations."
            ]
        }


        prompt = f"""
        You are an AI assistant specializing in debugging user code. Your task is to provide **clear, structured, and progressive hints** based on the user's attributes and error type. Your goal is to **guide the user toward identifying and fixing the issue independently**, rather than directly giving solutions.

        ---

        ### **User Information**  
        - **Profession:** `{profession}`  
        - **Age:** `{age}`  
        - **Level:** `{level}`  
        - **Experience:** `{experience}`  

        ---

        ### **Code Context**  
        - **Code Snippet:**  
        ```{code}```

        ### Compile Response:
        - **Error Encountered:** `{error}`  
        - **Execution Status:** `{status}`  
        - **Previous Response (if any):** `{prev_response}`  

        ---

        ### **Response Instructions**  
        1. Provide **three progressive hints**: `hint1`, `hint2`, and `hint3`.  
        2. Each hint must be **concise (max 2 lines)** and **actionable**.  
        3. **Do not give direct solutions**—instead, encourage structured debugging.  
        4. Ensure hints follow a **logical progression**, gradually leading the user to the fix.  
        5. **Avoid repeating previous responses**—provide fresh insights.  

        #### **Error-Specific Guidelines:**  
        - **Syntax, Runtime, or TLE Errors:**  
            - *Hint 1:* A **gentle nudge** in the right direction.  
            - *Hint 2:* A **specific narrowing down** of the issue.  
            - *Hint 3:* A **clear, actionable step** to fix it.  

        - **Logical Errors:**  
            - *Hint 1:* Encourage testing with edge cases (e.g., negative numbers, large inputs, empty lists).  
            - *Hint 2:* Suggest using print statements or a debugger to track variable values.  
            - *Hint 3:* Advise manually walking through the code with a simple test case.  

        6.If accepted, respond with: `"Your code is correct."` followed by hints for runtime optimizations and efficiency improvements.

        7. Select hints dynamically based on the status and error type,follwing are some examples:
            - **Syntax Errors:** {examples.get("syntax", [""])}
            - **Runtime Errors:** {examples.get("runtime", [""])}
            - **Time Limit Exceeded (TLE):** {examples.get("tle", [""])}
            - **Accepted Code:** {examples.get("accepted", [""])}
            - **Logical Errors:** {examples.get("logical", [""])}
        8. Always prioritize analyzing the latest source code errors while using the previous response only for avoiding duplicate hints. Do not base new hints on the previous response if the current source code contains a different error.
            
        9. **Do NOT wrap the response in triple backticks** or code blocks. Just output the hints as plain text.

        ---

        """

        response_text = model.generate_content(prompt).text

        if not response_text.strip():
            return "Error: Received empty response from Gemini API"

        return response_text

    except Exception as e:
        return {"error": f"Error occurred: {str(e)}"}
