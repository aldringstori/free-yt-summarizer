Created by Aldrin Gustavo Stori


## Simple explanation (for begginers)
1. User opens YouTube and clicks on 'Summary' button.
2. A request is sent to the Flask server.
3. Flask server sends a request to the local LLM API.
4. Local LLM API processes the request and sends a summary back to the Flask server.
5. Flask server sends the summary back to the Chrome extension.
6. The Chrome extension displays the summary in the view box on YouTube.



## Step-by-Step Explanation (for curious)

1. **User Opens YouTube:**
    
    - The user navigates to a YouTube video page (e.g., `https://www.youtube.com/watch?v=videoId`).
2. **Content Script Injection:**
    
    - The Chrome extension's content script (`contentScript.js`) is automatically injected into the YouTube video page.
3. **UI Creation:**
    
    - The `createUI` function is called, which creates a user interface (UI) for the extension.
    - This UI consists of a container (`extensionContainer`), a header with an icon and title, and a summary button (`summaryButton`).
    - The UI is appended to the body of the YouTube page.
4. **User Clicks the Summary Button:**
    
    - The user clicks the "Get Summary" button (`summaryButton`).
5. **Click the Transcription Button:**
    
    - The `handleSummaryButtonClick` function is triggered by the button click.
    - This function calls `clickTranscriptionButton`, which simulates a click on the YouTube transcription button to load the video transcript.
    - The transcription button is identified by the CSS class `.yt-spec-touch-feedback-shape__fill`.
6. **Wait for Transcript to Load:**
    
    - A delay (set to 2000 milliseconds) is introduced using `setTimeout` to allow the transcript to fully load.
7. **Extract Transcript Text:**
    
    - After the delay, the `getTranscriptText` function is called.
    - This function selects all elements with the class `segment-text` within `ytd-transcript-segment-renderer` to extract the transcript text.
    - The text content of each segment is concatenated into a single string (`transcriptText`).
8. **Send Request to Flask Server:**
    
    - The `fetchSummary` function is called with the extracted transcript text as the argument.
    - This function prepares a payload containing the transcript text and sends a POST request to the Flask server running at `http://127.0.0.1:5000/summarize`.
9. **Flask Server Handles Request:**
    
    - The Flask server (`llm_service.py`) receives the POST request at the `/summarize` endpoint.
    - The server extracts the `text` from the request payload and calls the `generate_text` function.
10. **Generate Summary Using LLM:**
    
    - The `generate_text` function sends a POST request to the `phi3 ollama` LLM running on `http://localhost:11434/api/generate` with the provided prompt.
    - The LLM processes the prompt and generates a summary.
    - The generated summary is returned to the Flask server.
11. **Respond with Summary:**
    
    - The Flask server returns the summary as a JSON response to the content script.
12. **Display Summary:**
    
    - The content script receives the response and extracts the summary text.
    - The `loadSummary` function is called with the summary text.
    - This function updates the summary container (`summaryContainer`) in the UI with the generated summary.


## Detailed Code Flow (for nerds)

**contentScript.js:**

- **Initialization (`init` function):**
    
    - Calls `createUI` to set up the extension's UI.
    - Adds a message listener to handle any future messages from the background script.
- **UI Creation (`createUI` function):**
    
    - Creates and configures HTML elements for the extension's UI.
    - Appends the elements to the body of the YouTube page.
- **Summary Button Click Handling (`handleSummaryButtonClick` function):**
    
    - Calls `clickTranscriptionButton` to simulate a click on the YouTube transcription button.
    - Waits for the transcript to load using `setTimeout`.
    - Calls `getTranscriptText` to extract the transcript text.
    - Calls `fetchSummary` to send the transcript text to the Flask server for summarization.
- **Transcription Button Click Simulation (`clickTranscriptionButton` function):**
    
    - Finds the transcription button on the YouTube page and simulates a click.
- **Transcript Text Extraction (`getTranscriptText` function):**
    
    - Selects all transcript segments on the YouTube page and concatenates their text content into a single string.
- **Summary Fetching (`fetchSummary` function):**
    
    - Sends the extracted transcript text to the Flask server.
    - Handles the server's response and updates the UI with the generated summary.

**llm_service.py:**

- **Flask Application Setup:**
    
    - Configures the Flask application and enables CORS.
- **Text Generation (`generate_text` function):**
    
    - Prepares a request payload for the `phi3 ollama` LLM.
    - Sends a request to the LLM and processes the response.
    - Returns the generated summary.
- **Summarization Endpoint (`/summarize` route):**
    
    - Handles POST requests to the `/summarize` endpoint.
    - Extracts the transcript text from the request payload.
    - Calls `generate_text` to generate a summary.
    - Returns the summary as a JSON response.
