# CodeCraft

An AI-powered collaborative coding platform that helps users solve coding challenges smarter with real-time collaboration features, AI-generated hints, and an interactive learning hub.

[CodeCraft Platform]
## User Guide

### Problem-Solving Workflow

1. **Browse Problems:** Use filters to find relevant coding problems.
2. **Solve a Problem:** Read the problem, code a solution, and submit.
3. **Get AI Assistance:**  Click *****AskAI***** for debugging hints and explanations.

### Collaboration Features

1. **Create/Join a Room:** Start a session and invite collaborators or join a session.
2. **Live Video Chat:** Enable camera & mic for real time discussions.
3. **Collaborative Coding:** Edit code together with real time sync.

### Learning Hub

1. **Search for Topics:** Get AI-generated explanations.
2. **Explore Resources:** View curated learning materials.


## Client Application

### Landing Page

- Displays a list of coding problems with filtering options.


### Problem Page

####	a. Header

- Displays problem title and details.

#### b. Playground

- **Code Editor:** Uses react-codemirror.
- **Test Cases:** Displays test cases and results.
- **AI Assistance:** Get hints for debugging.

#### c. Footer

- Buttons for submitting code and asking AI for help.

## Technology Stack

### **Frontend**

- **React.js** (UI Framework)
- **Tailwind CSS** (Styling)
- **Monaco Editor** (Code Editing)
- **React Router** (Navigation)

### **Collaboration Tools**

- **Yjs** (CRDT Library for code collaboration)
- **WebRTC** (Video & Audio Communication)

### **Backend & Services**

- **Django & DRF** (API services)
- **Firebase** (Database & Hosting)
- **Supabase** (Authentication & Database)
- **Judge0 API** (Code Compilation)
- **Gemini API** (AI Assistance)
- **Google API & YouTube API** (Resource Curation)



## WebRTC 

WebRTC (Web Real-Time Communication) enables real-time audio, video, and data sharing directly between web browsers and mobile apps.
#### WebRTC Flow

1. Peers connect to a *Signaling Server* to exchange SDP metadata.
2. They discover their public network addresses using *STUN servers* used for generating *ICE candidates*.
3. These candidates are exchanged through the Signaling Server.
4. Peers attempt to establish the most efficient connection possible.
5. If direct connection fails, communication falls back to *TURN server* relay.
6. Once a path is established, media streams flow directly between peers (or via TURN if necessary).

#### Key WebRTC APIs

- *****getUserMedia()*****: Captures audio and video from user's camera and microphone.
- *****RTCPeerConnection()*****: Manages the peer-to-peer connection, including *ICE* negotiation.
- *****RTCDataChannel()*****: Enables bidirectional data exchange between peers.
- *****MediaRecorder()*****: Records audio and video streams.
- *****MediaStream()*****: Represents synchronized audio and video tracks. 
- *****RTCSessionDescription()*****: Contains *SDP* data describing media session capabilities.

For more details, refer to this [WebRTC docs](https://webrtc.org/getting-started/overview) or [WebRTC Blog](https://medium.com/@fengliu_367/getting-started-with-webrtc-a-practical-guide-with-example-code-b0f60efdd0a7).

## CRDT 
CRDTs Conflict-free Replicated Data Types) are a class of data structures that allow for concurrent, distributed updates to a shared dataset without conflicts.

Yjs allows multiple users can concurrently edit without requiring a central server to merge the changes.
#### CRDT Flow
1. A user interacts with the document like typing a character on the shared editor.
2. An *operation* is created which includes *timestamp*, *operation type (insertion or deletion)*, *content*.
3. Yjs assigns a *unique ID* to the operation, based on *timestamp* and *unique client id* assigned when joining a room.
4. The operation is sent over a communication channel like *WebRTC* or *WebSocket* to other peers in the session. The operation is sent along with the *unique ID* and *timestamp*.
5. Each peer receives the *operation* and applies it to their local document copy. 
6. If multiple users type at same time updates are replicated based on *time stamp* and *client id*.
7. Yjs guarantees consistency, regardless of the order of operations or network delays, all peers will eventually converge to the same final document state. This is achieved through the *commutative* and *idempotent* nature of CRDTs.


#### Key Yjs (CRDT) APIs
- *****Y.Doc()***** : Creates a shared document that stores data.
- *****getText()*****: Creates a text data type, stored in the created *doc* container.
- *****WebrtcProvider()***** :  A *WebRTC* based provider that syncs Yjs documents between peers.
- *****getDoc()***** : Fetches *doc* from *firestore* based on *room id* if room previously exists.
- *****setDoc()***** : Saves current code to *firestore*.
  
For more details, refer to this [Yjs documentation](https://docs.yjs.dev/) or [CRDT Blog](https://medium.com/dovetail-engineering/yjs-fundamentals-part-1-theory-232a450dad7b).


## Installation

#### Frontend Setup
1. Navigate to the frontend/client directory:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
   
3. Create a .env file in the root of the client directory and add the following:
   ```bash
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4.Start the React development server:
  ```bash
  npm start
  ```

#### Backend Setup

1. Create a virtual environment (optional but recommended)
   ```bash
   python3 -m venv venv
   ```

2. Activate the virtual environment
   - For Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - For macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. Install backend dependencies
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables
   Create a `.env` file in the Server directory with:
   ```
   gemini_api_key = your_gemini_api_key
   rapid_api_key = your_judge0_rapid_api_key
   GOOGLE_API_KEY = your_google_api_key
   CSE_ID = your_custom_search_engine_id
   YOUTUBE_API_KEY = your_youtube_api_key
   django_key = your_django_secret_key
   DEBUG = True  # Set to False for production
   ```

5. Apply migrations
   ```bash
   cd Server
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Start the Django server
   ```bash
   python manage.py runserver
   ```
   


## API Endpoints

### Django REST API

This repository contains a set of Django REST APIs for various functionalities. The APIs are built using the Django REST Framework and can be accessed through HTTP requests.



| Endpoint | Method | Description |
|----------|--------|-------------|
| `/compile` | POST | Compile and run code against test cases |
| `/languages` | GET | Get list of supported programming languages |
| `/hints` | POST | Get AI-powered hints for debugging |
| `/askAI` | POST | Get AI explanations about programming topics |


### 1. Compile API

- **URL:** `/compile`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "source_code": "print('hello')",
    "language_id": 71,
    "inputs": "",
    "outputs": "hello\n"
  }
  ```
- **Response:**
  ```json
  {
    "output": "hello\n",
    "time": "0.013",
    "status": {
      "id": 3,
      "description": "Accepted"
    }
  }
  ```
- **Description:** This API compiles and executes the provided source code in the specified programming language . It returns the output of the code execution, along with the execution time and a status indicator.

### 2. Languages API

- **URL:** `/languages`
- **Method:** `GET`
- **Response:**
  ```json
  [
    {
      "id": 45,
      "name": "Assembly (NASM 2.14.02)"
    },
    {
      "id": 46,
      "name": "Bash (5.0.0)"
    },
    // ... (Additional language entries)
  ]
  ```
- **Description:** This API retrieves a list of programming languages supported by the system, along with their respective IDs and names.

### 3. Generate hints API

- **URL:** `/hints`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "error": "Line 2: Char 20: error: expected ';' after namespace name\n    2 | using namespace std  // Missing semicolon here\n      |                    ^\n      |                    ;",
    "profession": "developer",
    "age": 25,
    "level": "expert",
    "experience": "5 years",
    "prev_response": "",
    "code": "#include<iostream>\nusing namespace std  // Missing semicolon here\n\nlong long factorial(int n){\n    return (n<=1) ? 1 : n*factorial(n-2);\n}\n\nint main(){\n    int n=5;\n    cout<<\"Factorial of \"<<n<<\" is \"<<factorial(n)<<endl;\n    return 0;\n}",
    "status": "Compilation Error"
   }


  ```
- **Response:**
  ```json
  {
    "response": "Hint 1: The compiler is pointing to line 2. Carefully examine this line for syntax errors.\nHint 2: Pay close attention to the end of the `using namespace std` statement. What is typically required to terminate such a statement?\nHint 3: Add the missing punctuation at the end of the mentioned statement and recompile.\n"
  }
  ```
- **Description:** This API accepts an error message, code along with some user information, and provides a response with suggestions or explanations related to the error.

### 4. Ask AI API

- **URL:** `/askAI`
- **Method:** `POST`
- **Request Body:**
  ```json
  {     
      "topic": "binary search on answers",
      "profession": "none",
      "age": 19,
      "level": "intermediate",
      "experience": "0 years",
      "prev_response": null
   }
   
  ```
- **Response:**
  ```json
  {
    "response": "Okay, let's explore the technique of \"Binary Search on Answers.\" It's a powerful problem-solving approach, especially useful when you need to find a *specific value* that satisfies a given condition, and you can efficiently *check* whether a given value meets that condition.\n\n### Objective/Definition\n\nBinary search on answers is a technique where you apply binary search, not directly on a sorted *array* of data, but on the *range* of possible *answers* to a problem. Instead of searching for a specific element, you're searching for the answer (often a number) that makes a certain condition true. This is especially useful when the answer space is sorted (or can be thought of as sorted) and you can efficiently determine if a potential answer is \"too low\" or \"too high.\"\n\n### Intuition\n\nImagine you're trying to guess a number between 1 and 100. Instead of randomly guessing, you start with 50. If the number is higher, you know it's between 51 and 100. If it's lower, it's between 1 and 49. You then repeat this process by guessing the middle of the remaining range. This is the essence of binary search – narrowing down the possibilities by half with each guess.\n\nIn \"binary search on answers,\" the \"number you're guessing\" becomes the potential *answer* to the problem, and the \"higher/lower\" feedback is replaced by a function that checks if the current guess satisfies the problem's condition.\n\n### Best Approach\n\n1.  **Identify the Answer Space:** Define the range within which the answer must lie. This could be a range of integers, floating-point numbers, or even a more abstract range depending on the problem.\n\n2.  **Define the `check()` Function:** This is the most crucial part. You need a function `bool check(answer)` that takes a potential answer as input and returns `true` if the answer satisfies the problem's condition, and `false` otherwise. The efficiency of this function is critical to the overall performance of the binary search.\n\n3.  **Apply Binary Search:** Use a standard binary search algorithm within the defined answer space. In each iteration:\n\n    *   Calculate the middle point `mid` of the current range.\n    *   Call the `check(mid)` function.\n    *   If `check(mid)` is `true`, it means `mid` (or potentially a lower value) could be a valid answer. Adjust the search range to the lower half.\n    *   If `check(mid)` is `false`, it means `mid` is too low (or too high depending on the problem). Adjust the search range to the upper half.\n\n4.  **Handle Precision (for floating-point numbers):** When dealing with floating-point answers, continue the binary search until the range between `low` and `high` is smaller than a certain epsilon (a very small value representing the desired precision).\n\n### Code Implementation (C++)\n\n```cpp\n#include <iostream>\n#include <iomanip> // Required for setprecision\n\nusing namespace std;\n\n// Example: Find the square root of a number using binary search.\n// Illustrative, not necessarily the fastest square root method.\n\ndouble findSquareRoot(double n, double precision) {\n    double low = 0.0;\n    double high = n; //The answer range is between 0 and n\n    double ans = 0.0;\n\n    while (high - low > precision) {\n        double mid = low + (high - low) / 2.0;  // Prevent potential overflow\n        if (mid * mid <= n) {\n            low = mid;\n            ans = mid;  // Potential answer, update it\n        } else {\n            high = mid;\n        }\n    }\n    return ans;\n}\n\nint main() {\n    double number = 10;\n    double precision = 0.00001;\n    double squareRoot = findSquareRoot(number, precision);\n\n    cout << fixed << setprecision(5) << \"Square root of \" << number << \" is approximately: \" << squareRoot << endl;\n\n    return 0;\n}\n```\n\n### Step-by-Step Dry Run (findSquareRoot Example)\n\nLet's say we want to find the square root of `n = 10` with `precision = 0.1`.\n\n1.  **Initialization:** `low = 0`, `high = 10`, `ans = 0`.\n\n2.  **Iteration 1:**\n\n    *   `mid = (0 + 10) / 2 = 5`\n    *   `mid * mid = 25 > 10`\n    *   `high = 5`\n\n3.  **Iteration 2:**\n\n    *   `mid = (0 + 5) / 2 = 2.5`\n    *   `mid * mid = 6.25 < 10`\n    *   `low = 2.5`, `ans = 2.5`\n\n4.  **Iteration 3:**\n\n    *   `mid = (2.5 + 5) / 2 = 3.75`\n    *   `mid * mid = 14.0625 > 10`\n    *   `high = 3.75`\n\n5.  **Iteration 4:**\n\n    *   `mid = (2.5 + 3.75) / 2 = 3.125`\n    *   `mid * mid = 9.765625 < 10`\n    *   `low = 3.125`, `ans = 3.125`\n\n6.  ... The loop continues, narrowing the range between `low` and `high` until `high - low < 0.1`.  `ans` will keep getting updated with the best potential answer found so far.\n\n7.  Finally, the loop terminates, and the last value of `ans` (which is close to the square root of 10) is returned.\n\n### Complexity Analysis\n\n*   **Time Complexity:** O(log(R) \\* T), where:\n    *   R is the range of the answer space (`high - low`).\n    *   T is the time complexity of the `check()` function.  The binary search performs approximately log<sub>2</sub>(R) iterations, and each iteration requires calling the `check()` function.\n    *   In the `findSquareRoot` example, R = `n - 0 = n`. Assuming the multiplication operation in `check()` takes O(1), T = O(1). Therefore, the time complexity is O(log n).\n\n*   **Space Complexity:** O(1).  Binary search on answers typically uses a constant amount of extra space, regardless of the input size. Only a few variables are needed to store the `low`, `high`, and `mid` values.\n\n\n### Additional Learning Resources for binary search on answers:\n\n#### 🔗 Best Blogs:\n  - [I still struggle with binary search after 500+ problems... Are there any ...](https://www.reddit.com/r/leetcode/comments/1csos9p/i_still_struggle_with_binary_search_after_500/)\n  - [Binary Search on Answer. In this blog, I've not explained about ...](https://medium.com/@smrutiranjanrout2019/binary-search-on-answer-a406089e8e17)\n  - [Binary Search · USACO Guide](https://usaco.guide/silver/binary-search)\n  - [Help to understand binary search better : r/algorithms](https://www.reddit.com/r/algorithms/comments/iwyqke/help_to_understand_binary_search_better/)\n  - [Bertrand Meyer's technology+ blog » Blog Archive Getting a ...](https://bertrandmeyer.com/2020/03/26/getting-program-right-nine-episodes/)\n  - [algorithms - Why is binary search,which needs sorted data ...](https://softwareengineering.stackexchange.com/questions/204260/why-is-binary-search-which-needs-sorted-data-considered-better-than-linear-sear)\n\n#### 🌍 Best Websites:\n  - [Binary Search · USACO Guide](https://usaco.guide/silver/binary-search)\n  - [Binary Search On Answer / KOKO Type - LeetCode Discuss](https://leetcode.com/discuss/interview-question/3725477/Binary-Search-On-Answer-KOKO-Type)\n  - [Binary Search on Answer. In this blog, I've not explained about ...](https://medium.com/@smrutiranjanrout2019/binary-search-on-answer-a406089e8e17)\n  - [Anyone has tips or tricks for Dynamic Programming vs Greedy vs ...](https://www.reddit.com/r/leetcode/comments/1dx7uuz/anyone_has_tips_or_tricks_for_dynamic_programming/)\n  - [Solving Binary Search on Answer Problems - USACO Forum](https://forum.usaco.guide/t/solving-binary-search-on-answer-problems/500)\n  - [Binary Search - Algorithms for Competitive Programming](https://cp-algorithms.com/num_methods/binary_search.html)\n\n#### ▶️ YouTube Videos:\n  - [Mastering Binary Search on Answer Space: A Step-by-Step Guide | Binary Search](https://www.youtube.com/watch?v=BCPRGs0AvfI)\n  - [3 Simple Steps for Solving Any Binary Search Problem](https://www.youtube.com/watch?v=iuGwaDVSLi4)\n  - [CP tutorial #2: Binary search on answer (must know algorithm for USACO silver)](https://www.youtube.com/watch?v=p5EmBXOg1b4)\n  - [16 Binary Search on Answer Concept](https://www.youtube.com/watch?v=IZP_8-JZqhM)\n  - [L3 | Binary Search Problems on Answers | By Raj (Striver)](https://www.youtube.com/watch?v=Kb3KOTQfjew)\n  - [Linear search vs Binary search](https://www.youtube.com/watch?v=sSYQ1H9-Vks)"
   }
  ```

  - **Description:** This API provides an explanation and example implementation of the Merge Sort algorithm in Python, based on the requested topic and user information.




## Project Structure

```
CodeCraft/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   │   ├── LandingPage/
│   │   │   ├── ProblemPage/
│   │   │   ├── ChatPage/
│   │   │   ├── ProfilePage/
│   │   │   ├── AuthPage/
│   │   │   └── LearningPage/
│   │   │
│   │   └── supabase/        # Supabase client configuration
│   └── package.json
├── Server/                  # Django backend
│   ├── App/                 # Main Django application
│   │   ├── views.py         # API endpoint definitions
│   │   └── models.py        # Database models
│   ├── api/                 # Core functionality modules
│   │   ├── judge0_calls.py  # Code execution via Judge0 API
│   │   ├── gemini_api_calls.py # AI assistance using Gemini API
│   │   └── resources.py     # External resources fetching
│   └── manage.py
│
└── README.md
```

## Deployment

### Frontend Deployment

The frontend is deployed on *netlify* :
<!-- mention the  site  used to deploy-->
### Backend Deployment
The Django backend is deployed on *render* 

### Future Enhancements

- Implement screen sharing capability
- Implement recording capabilities for collaboration sessions
- Integrate a shared whiteboard feature
- Implement customizable editor themes

### Contributing

Contributions to this project are welcome. If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgements

- [Yjs](https://github.com/yjs/yjs) for the CRDT implementation
- [Monaco Editor](https://github.com/microsoft/monaco-editor) for the code editor
- [React](https://reactjs.org/) for the UI framework
- [Django](https://www.djangoproject.com/) for the backend framework
- [WebRTC](http://webrtc.org) technology for real-time communication
- [Firebase](https://firebase.google.com/) and [Supabase](https://supabase.io/) for backend services
- [Judge0](https://ce.judge0.com/) for code execution capabilities
