(() => {
  let lastProcessedUrl = '';
  let isLoading = false;

  const setLoadingState = (state) => {
    isLoading = state;
    const summaryButton = document.getElementById('summary-btn');
    if (summaryButton) {
      summaryButton.disabled = state;
      summaryButton.innerHTML = state
        ? `<span class="ant-btn-loading-icon"><span role="img" aria-label="loading" class="anticon anticon-loading anticon-spin"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" class="loading-icon"><path d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 958 197 921 150 874c-47-47-84-101.7-109.8-162.7C13.5 648.2 0 581.1 0 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 59.4 11.6 117 34.6 171.3 22.2 52.4 53.9 99.5 94.3 139.9 40.4 40.4 87.5 72.2 139.9 94.3C395 940.4 452.6 952 512 952c59.4 0 117-11.6 171.3-34.6 52.4-22.2 99.5-53.9 139.9-94.3 40.4-40.4 72.2-87.5 94.3-139.9C940.4 629 952 571.4 952 512c0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.2C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3s-13.5 136.2-40.2 199.3C958 772.3 921 827 874 874c-47 47-101.8 83.9-162.7 109.7-63.1 26.8-130.2 40.3-199.3 40.3z" fill="#ffffff"/></svg></span> Loading...`
        : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.66683 3.99998C4.66683 3.63179 4.96531 3.33331 5.3335 3.33331H12.0002C12.3684 3.33331 12.6668 3.63179 12.6668 3.99998C12.6668 4.36817 12.3684 4.66665 12.0002 4.66665H5.3335C4.96531 4.66665 4.66683 4.36817 4.66683 3.99998Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4.66683 7.99998C4.66683 7.63179 4.96531 7.33331 5.3335 7.33331H14.0002C14.3684 7.33331 14.6668 7.63179 14.6668 7.99998C14.6668 8.36817 14.3684 8.66665 14.0002 8.66665H5.3335C4.96531 8.66665 4.66683 8.36817 4.66683 7.99998Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4.66683 12C4.66683 11.6318 4.96531 11.3333 5.3335 11.3333H9.3335C9.70169 11.3333 10.0002 11.6318 10.0002 12C10.0002 12.3682 9.70169 12.6666 9.3335 12.6666H5.3335C4.96531 12.6666 4.66683 12.3682 4.66683 12Z" fill="currentColor"></path><path d="M2.66683 3.99998C2.66683 4.36817 2.36835 4.66665 2.00016 4.66665C1.63197 4.66665 1.3335 4.36817 1.3335 3.99998C1.3335 3.63179 1.63197 3.33331 2.00016 3.33331C2.36835 3.33331 2.66683 3.63179 2.66683 3.99998Z" fill="currentColor"></path><path d="M2.66683 7.99998C2.66683 8.36817 2.36835 8.66665 2.00016 8.66665C1.63197 8.66665 1.3335 8.36817 1.3335 7.99998C1.3335 7.63179 1.63197 7.33331 2.00016 7.33331C2.36835 7.33331 2.66683 7.63179 2.66683 7.99998Z" fill="currentColor"></path><path d="M2.66683 12C2.66683 12.3682 2.36835 12.6666 2.00016 12.6666C1.63197 12.6666 1.3335 12.3682 1.3335 12C1.3335 11.6318 1.63197 11.3333 2.00016 11.3333C2.36835 11.3333 2.66683 11.6318 2.66683 12Z" fill="currentColor"></path></svg> Summary';
    }
  };
  
//create UI
  const createUI = () => {
    const extensionContainer = document.createElement('div');
    extensionContainer.id = 'extension-container';

    const header = document.createElement('div');
    header.id = 'header-container';

    const icon = document.createElement('img');
    icon.src = chrome.runtime.getURL("src/assets/ext-icon.png");
    icon.title = "ext-icon";
    icon.className = "extension-icon";

    const title = document.createElement('p');
    title.textContent = "YouTube Summarizer";
    title.className = "extension-title";

    header.appendChild(icon);
    header.appendChild(title);

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'button-container';

    const summaryButton = document.createElement('button');
    summaryButton.id = 'summary-btn';
    summaryButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.66683 3.99998C4.66683 3.63179 4.96531 3.33331 5.3335 3.33331H12.0002C12.3684 3.33331 12.6668 3.63179 12.6668 3.99998C12.6668 4.36817 12.3684 4.66665 12.0002 4.66665H5.3335C4.96531 4.66665 4.66683 4.36817 4.66683 3.99998Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4.66683 7.99998C4.66683 7.63179 4.96531 7.33331 5.3335 7.33331H14.0002C14.3684 7.33331 14.6668 7.63179 14.6668 7.99998C14.6668 8.36817 14.3684 8.66665 14.0002 8.66665H5.3335C4.96531 8.66665 4.66683 8.36817 4.66683 7.99998Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4.66683 12C4.66683 11.6318 4.96531 11.3333 5.3335 11.3333H9.3335C9.70169 11.3333 10.0002 11.6318 10.0002 12C10.0002 12.3682 9.70169 12.6666 9.3335 12.6666H5.3335C4.96531 12.6666 4.66683 12.3682 4.66683 12Z" fill="currentColor"></path><path d="M2.66683 3.99998C2.66683 4.36817 2.36835 4.66665 2.00016 4.66665C1.63197 4.66665 1.3335 4.36817 1.3335 3.99998C1.3335 3.63179 1.63197 3.33331 2.00016 3.33331C2.36835 3.33331 2.66683 3.63179 2.66683 3.99998Z" fill="currentColor"></path><path d="M2.66683 7.99998C2.66683 8.36817 2.36835 8.66665 2.00016 8.66665C1.63197 8.66665 1.3335 8.36817 1.3335 7.99998C1.3335 7.63179 1.63197 7.33331 2.00016 7.33331C2.36835 7.33331 2.66683 7.63179 2.66683 7.99998Z" fill="currentColor"></path><path d="M2.66683 12C2.66683 12.3682 2.36835 12.6666 2.00016 12.6666C1.63197 12.6666 1.3335 12.3682 1.3335 12C1.3335 11.6318 1.63197 11.3333 2.00016 11.3333C2.36835 11.3333 2.66683 11.6318 2.66683 12Z" fill="currentColor"></path></svg>';
    summaryButton.addEventListener('click', handleSummaryButtonClick);

    const transcriptionButton = document.createElement('button');
    transcriptionButton.id = 'transcription-btn';
    transcriptionButton.innerHTML = '<svg width="20px" height="20px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M18.75,4 C20.5449254,4 22,5.45507456 22,7.25 L22,16.754591 C22,18.5495164 20.5449254,20.004591 18.75,20.004591 L5.25,20.004591 C3.45507456,20.004591 2,18.5495164 2,16.754591 L2,7.25 C2,5.51696854 3.35645477,4.10075407 5.06557609,4.00514479 L5.25,4 L18.75,4 Z M18.75,5.5 L5.25,5.5 L5.10647279,5.5058012 C4.20711027,5.57880766 3.5,6.3318266 3.5,7.25 L3.5,16.754591 C3.5,17.7210893 4.28350169,18.504591 5.25,18.504591 L18.75,18.504591 C19.7164983,18.504591 20.5,17.7210893 20.5,16.754591 L20.5,7.25 C20.5,6.28350169 19.7164983,5.5 18.75,5.5 Z M5.5,12 C5.5,8.85441664 8.21322176,7.22468635 10.6216203,8.59854135 C10.981411,8.80378156 11.1066989,9.2618296 10.9014586,9.62162028 C10.6962184,9.98141095 10.2381704,10.1066989 9.87837972,9.90145865 C8.48070939,9.10416685 7,9.9935733 7,12 C7,14.0045685 8.48410774,14.8962094 9.8791978,14.102709 C10.2392458,13.8979206 10.6971362,14.0237834 10.9019246,14.3838314 C11.106713,14.7438795 10.9808502,15.2017699 10.6208022,15.4065583 C8.21538655,16.7747125 5.5,15.1433285 5.5,12 Z M13,12 C13,8.85441664 15.7132218,7.22468635 18.1216203,8.59854135 C18.481411,8.80378156 18.6066989,9.2618296 18.4014586,9.62162028 C18.1962184,9.98141095 17.7381704,10.1066989 17.3783797,9.90145865 C15.9807094,9.10416685 14.5,9.9935733 14.5,12 C14.5,14.0045685 15.9841077,14.8962094 17.3791978,14.102709 C17.7392458,13.8979206 18.1971362,14.0237834 18.4019246,14.3838314 C18.606713,14.7438795 18.4808502,15.2017699 18.1208022,15.4065583 C15.7153866,16.7747125 13,15.1433285 13,12 Z" fill="currentColor""></path></svg>';
    transcriptionButton.addEventListener('click', handleTranscriptionButtonClick);

    const copyButton = document.createElement('button');
    copyButton.id = 'copy-btn';
    copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.1665 2.91663C1.1665 1.95013 1.95001 1.16663 2.9165 1.16663H7.58317C8.54967 1.16663 9.33317 1.95013 9.33317 2.91663V3.49996C9.33317 3.82213 9.072 4.08329 8.74984 4.08329C8.42767 4.08329 8.1665 3.82213 8.1665 3.49996V2.91663C8.1665 2.59446 7.90534 2.33329 7.58317 2.33329H2.9165C2.59434 2.33329 2.33317 2.59446 2.33317 2.91663V7.58329C2.33317 7.90546 2.59434 8.16663 2.9165 8.16663H3.49984C3.822 8.16663 4.08317 8.42779 4.08317 8.74996C4.08317 9.07213 3.822 9.33329 3.49984 9.33329H2.9165C1.95001 9.33329 1.1665 8.54979 1.1665 7.58329V2.91663ZM4.6665 6.41663C4.6665 5.45013 5.45001 4.66663 6.4165 4.66663H11.0832C12.0497 4.66663 12.8332 5.45013 12.8332 6.41663V11.0833C12.8332 12.0498 12.0497 12.8333 11.0832 12.8333H6.4165C5.45001 12.8333 4.6665 12.0498 4.6665 11.0833V6.41663ZM6.4165 5.83329C6.09434 5.83329 5.83317 6.09446 5.83317 6.41663V11.0833C5.83317 11.4055 6.09434 11.6666 6.4165 11.6666H11.0832C11.4053 11.6666 11.6665 11.4055 11.6665 11.0833V6.41663C11.6665 6.09446 11.4053 5.83329 11.0832 5.83329H6.4165Z" fill="currentColor"></path></svg>`;
    copyButton.addEventListener('click', handleCopyButtonClick);

    buttonContainer.appendChild(summaryButton);
    buttonContainer.appendChild(transcriptionButton);
    buttonContainer.appendChild(copyButton);

    extensionContainer.appendChild(header);
    extensionContainer.appendChild(buttonContainer);

    const summaryContainer = document.createElement('div');
    summaryContainer.id = 'summary-container';

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

  const handleSummaryButtonClick = async () => {
    console.log("Summary button clicked");
    setLoadingState(true);
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

  const handleTranscriptionButtonClick = async () => {
    console.log("Transcription button clicked");
    setLoadingState(true);
    expandSection();

    setTimeout(() => {
      clickTranscriptionButton();

      setTimeout(() => {
        const transcriptText = getTranscriptText(true);
        console.log("Fetched transcript text:", transcriptText); // Log fetched transcript
        if (transcriptText.length > 0) {
          loadSummary(transcriptText);
        } else {
          console.log("Transcript text is empty. Retrying...");
          setTimeout(() => {
            const retryTranscriptText = getTranscriptText(true);
            console.log("Retry fetched transcript text:", retryTranscriptText); // Log fetched transcript on retry
            if (retryTranscriptText.length > 0) {
              loadSummary(retryTranscriptText);
            } else {
              console.log("Transcript text is still empty after retry.");
              loadSummary("Transcript not available or failed to load.");
            }
          }, 3000); // Retry after an additional 3 seconds
        }
      }, 3000); // Initial delay to ensure transcription is loaded
    }, 3000); // Delay to ensure section is expanded
  };

  const expandSection = () => {
    const expandButton = document.querySelector("tp-yt-paper-button#expand");
    if (expandButton) {
      expandButton.click();
      console.log("Expand button clicked");
    } else {
      console.log("Expand button not found.");
    }
  };

  const clickTranscriptionButton = () => {
    const transcriptionButton = document.querySelector(".yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--outline");
    if (transcriptionButton) {
      transcriptionButton.click();
      console.log("Transcription button clicked");
    } else {
      console.log("Transcription button not found.");
    }
  };

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
        setLoadingState(false);
      })
      .catch(err => {
        console.error("Error fetching summary:", err);
        setLoadingState(false);
      });
  };

  const getTranscriptText = (withTimestamps = false) => {
    const transcriptSegments = document.querySelectorAll('ytd-transcript-segment-renderer');
    console.log("Found transcript segments:", transcriptSegments.length); // Log number of segments found
    let transcriptText = '';
    transcriptSegments.forEach(segment => {
      const time = segment.querySelector('.segment-timestamp').innerText;
      const text = segment.querySelector('.segment-text').innerText;
      transcriptText += withTimestamps ? `${time} ${text}\n` : `${text} `;
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

    summary.split('\n').forEach(paragraph => {
        const summaryTextElement = document.createElement('p');
        summaryTextElement.textContent = paragraph;
        summaryContainer.appendChild(summaryTextElement);
    });
  };

  const handleCopyButtonClick = () => {
    const summaryContainer = document.getElementById('summary-container');
    if (summaryContainer) {
      const textToCopy = summaryContainer.innerText;
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          console.log('Summary copied to clipboard');
        })
        .catch(err => {
          console.error('Error copying summary to clipboard:', err);
        });
    }
  };

  const init = () => {
    createUI();
  };

  init();
})();
