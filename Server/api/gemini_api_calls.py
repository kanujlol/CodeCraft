import os
import json
import requests
import google.generativeai as genai
from .resources import format_resources
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


        prompt = f"""
        You are an AI assistant helping users debug their code. Provide tailored suggestions based on the user's attributes and the error encountered.

        ### User Info:
        - **Profession:** ```{profession}```
        - **Age:** ```{age}```
        - **Level:** ```{level}```
        - **Experience:** ```{experience}```

        ### Code Snippet:
        ```{code}```

        ### Compile Response:
        - **Error:** ```{error}```
        - **Current Status:** ```{status}```
        - **Previous Response:** ```{prev_response}```

        ### Instructions for Response:
        1. Provide exactly **three progressive hints**: `hint1`, `hint2`, and `hint3`.
        2. Each hint must not exceed **two lines**.
        3. **Avoid direct solutions**—instead, guide the user toward debugging effectively.
        4. Ensure hints are **distinct from the previous response**.
        5. **Logical Progression for Errors:**
        - **Syntax, Runtime, or TLE Errors:**  
            - *Hint 1:* A **basic nudge** in the right direction.  
            - *Hint 2:* A **detailed narrowing down** of the issue.  
            - *Hint 3:* A **clear, actionable step** to resolve it.
        - **Logical Errors:** Instead of technical hints, return:  
            `"Logical error: Please review your logic."`  
            This encourages users to analyze their approach independently.
        6. If applicable, include general debugging advice like common syntax fixes, runtime optimizations, or efficiency improvements.

        ### Example Hints Based on Error Type:
        ```{example_hint}```

        ### Dynamic Response:
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
        language=data.get("prefered_language","cpp")
        additional_resources = format_resources(topic) 
       
        
        prompt = f"""
        You are an advanced teaching assistant, skilled in simplifying complex computer science topics based on the user's profession, age, experience, and skill level.

        ### Topic:
        ```{topic}```

        ### User Profile:
        - **Profession:** ```{profession}```
        - **Age:** ```{age}```
        - **Skill Level:** ```{level}```
        - **Experience:** ```{experience}```

        ### Previous Response (if applicable):
        ```{prev_response}```

        ### Instructions:
        1. **Ensure the topic is computer science-related.**  
        - If the topic is unrelated or inappropriate, return a polite warning instead of an explanation.  

        2. **Dynamically structure responses** based on the topic, rather than following a rigid format.  
        - Use **the most suitable headings** while ensuring all key aspects are covered.  

        3. **Provide a well-structured, in-depth explanation** that enhances clarity and depth, ensuring it is more informative than any previous response (if applicable), without explicitly referencing the comparison.

        ### Expected Breakdown (Adapt Based on Topic):
        - **Objective/Definition:** A precise definition and purpose of the topic.  
        - **Intuition:** Explain the fundamental idea in an easy-to-understand manner.  
        - **Best Approach:** Describe the most efficient method or commonly used technique.  
        - **Code Implementation (if applicable):**  
        - Provide clean, well-formatted code in ```{language}```.  
        - **Step-by-Step Dry Run:** Walk through an example to demonstrate real-world application.  
        - **Complexity Analysis:**  
        - **Time Complexity:** Derive and explain influencing factors.  
        - **Space Complexity:** Analyze memory usage and possible optimizations.  


        ### Response Format:
        Ensure responses are well-structured, adaptive, and **not bound to a fixed sequence**, allowing flexibility in presentation while maintaining completeness.  

       """
        
        model = genai.GenerativeModel("gemini-2.0-flash")

        response = model.generate_content(prompt)
        if hasattr(response, "text"):
            response_text = response.text  # Extract the actual string response
        else:
            response_text = str(response)  # Fallback if response structure is different

        full_response = f"{response_text}\n\n{additional_resources}"
        return full_response
    except Exception as e:
        return {"error": f"Error occurred: {str(e)}"}
    

    #prompt engineering

    #Principle 1: Write clear and specific instructions
        # Tactic 1: Use delimiters to clearly indicate distinct parts of the input-used to avoid prompt injections
        # Tactic 2: Use formatting to make the input more readable-Ask for a structured output
        # Tactic 3: Ask the model to check whether conditions are satisfied
        # Tactic 4: "Few-shot" prompting-give an example
    
    #Principle 2: Give the model time to “think”
        # Tactic 1: Specify the steps required to complete a task
        # Tactic 2: Instruct the model to work out its own solution before rushing to a conclusion
    



