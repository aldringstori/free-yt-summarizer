// contentScript.js

(() => {
    // Create the user interface for the extension
    const createUI = () => {
      const extensionContainer = document.createElement('div');
      extensionContainer.id = 'extension-container';
  
      const header = document.createElement('div');
      header.id = 'header-container';
  
      const icon = document.createElement('img');
      icon.src = chrome.runtime.getURL("assets/ext-icon.png");
      icon.title = "ext-icon";
      icon.className = "extension-icon";
  
      const title = document.createElement('p');
      title.textContent = "YouTube Summarizer";
      title.className = "extension-title";
  
      header.appendChild(icon);
      header.appendChild(title);
  
      const summaryButton = document.createElement('button');
      summaryButton.id = 'summary-btn';
      summaryButton.textContent = 'Get Summary';
      summaryButton.addEventListener('click', handleSummaryButtonClick);
  
      const summaryContainer = document.createElement('div');
      summaryContainer.id = 'summary-container';
  
      extensionContainer.appendChild(header);
      extensionContainer.appendChild(summaryButton);
      extensionContainer.appendChild(summaryContainer);
  
      // Delay to ensure elements have loaded before inserting the extension container
      setTimeout(() => {
          const secondaryElement = document.getElementById("secondary");
          const secondaryInnerElement = document.getElementById("secondary-inner");
          if (secondaryElement && secondaryInnerElement) {
              secondaryElement.insertBefore(extensionContainer, secondaryInnerElement);
          } else {
              document.body.appendChild(extensionContainer);
          }
      }, 9000); // 9 seconds delay
    };
  
    // Handle the summary button click event
    const handleSummaryButtonClick = async () => {
      console.log("Summary button clicked");
      expandSection();
  
      setTimeout(() => {
        clickTranscriptionButton();
  
        setTimeout(() => {
          const transcriptText = getTranscriptText();
          console.log("Fetched transcript text:", transcriptText); // Log fetched transcript
          if (transcriptText.length > 0) {
            fetchSummary(transcriptText);
          } else {
            console.log("Transcript text is empty. Retrying...");
            setTimeout(() => {
              const retryTranscriptText = getTranscriptText();
              console.log("Retry fetched transcript text:", retryTranscriptText); // Log fetched transcript on retry
              if (retryTranscriptText.length > 0) {
                fetchSummary(retryTranscriptText);
              } else {
                console.log("Transcript text is still empty after retry.");
                loadSummary("Transcript not available or failed to load.");
              }
            }, 3000); // Retry after an additional 3 seconds
          }
        }, 3000); // Initial delay to ensure transcription is loaded
      }, 3000); // Delay to ensure section is expanded
    };
  
    // Expand the section to show the transcript button
    const expandSection = () => {
      const expandButton = document.querySelector("tp-yt-paper-button#expand");
      if (expandButton) {
        expandButton.click();
        console.log("Expand button clicked");
      } else {
        console.log("Expand button not found.");
      }
    };
  
    // Click the transcription button to show the transcript
    const clickTranscriptionButton = () => {
        const transcriptionButton = document.querySelector(".yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--outline");
        if (transcriptionButton) {
          transcriptionButton.click();
          console.log("Transcription button clicked");
        } else {
          console.log("Transcription button not found.");
        }
      };
  
    // Fetch the summary of the transcript text
    const fetchSummary = async (transcriptText) => {
      const payload = {
        text: transcriptText
      };
  
      fetch('http://127.0.0.1:5000/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(response => response.json())
        .then(data => {
          const summaryText = data.summary;
          console.log("Received summary:", summaryText); // Log received summary
          loadSummary(summaryText);
        })
        .catch(err => {
          console.error("Error fetching summary:", err);
        });
    };
  
    // Get the transcript text from the transcript segments
    const getTranscriptText = () => {
      const transcriptSegments = document.querySelectorAll('ytd-transcript-segment-renderer .segment-text');
      console.log("Found transcript segments:", transcriptSegments.length); // Log number of segments found
      let transcriptText = '';
      transcriptSegments.forEach(segment => {
        transcriptText += segment.innerText + ' ';
      });
      return transcriptText.trim();
    };
  
    // Load the summary into the summary container
    const loadSummary = (summary) => {
      const summaryContainer = document.getElementById('summary-container');
      if (!summaryContainer) {
        console.log('Summary container not found.');
        return;
      }
  
      summaryContainer.innerHTML = ''; // Clear previous summary
  
      const summaryTextElement = document.createElement('p');
      summaryTextElement.textContent = summary;
      summaryContainer.appendChild(summaryTextElement);
    };
  
    // Initialize the UI and message listener
    const init = () => {
      createUI();
  
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === "NEW") {
          console.log('NEW video detected:', request.videoId);
        }
      });
    };
  
    init(); // Initialize the UI and message listener immediately
  })();
  