// contentScript.js

(() => {
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

    document.body.appendChild(extensionContainer);
  };

  const handleSummaryButtonClick = async () => {
    clickTranscriptionButton();

    setTimeout(() => {
      const transcriptText = getTranscriptText();
      fetchSummary(transcriptText);
    }, 2000); // Adjust this delay as needed
  };

  const clickTranscriptionButton = () => {
    const transcriptionButton = document.querySelector(".yt-spec-touch-feedback-shape__fill");
    if (transcriptionButton) {
      transcriptionButton.click();
    } else {
      console.log("Transcription button not found.");
    }
  };

  const fetchSummary = async (transcriptText) => {
    const payload = {
      text: transcriptText,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const summaryText = data.summary || data.error;
      loadSummary(summaryText);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const getTranscriptText = () => {
    const transcriptSegments = document.querySelectorAll('ytd-transcript-segment-renderer .segment-text');
    let transcriptText = '';
    transcriptSegments.forEach(segment => {
      transcriptText += segment.innerText + ' ';
    });
    return transcriptText.trim();
  };

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
