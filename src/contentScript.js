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
        : 'Get Summary';
    }
  };

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

    const tabsContainer = document.createElement('div');
    tabsContainer.id = 'tabs-container';

    const summaryTab = document.createElement('button');
    summaryTab.id = 'summary-tab';
    summaryTab.textContent = 'Summary';
    summaryTab.className = 'tab-button';
    summaryTab.addEventListener('click', () => switchTab('summary'));

    const transcriptTab = document.createElement('button');
    transcriptTab.id = 'transcript-tab';
    transcriptTab.textContent = 'Transcription';
    transcriptTab.className = 'tab-button';
    transcriptTab.addEventListener('click', () => switchTab('transcription'));

    tabsContainer.appendChild(summaryTab);
    tabsContainer.appendChild(transcriptTab);

    const summaryButton = document.createElement('button');
    summaryButton.id = 'summary-btn';
    summaryButton.textContent = 'Get Summary';
    summaryButton.addEventListener('click', handleSummaryButtonClick);

    const copyButton = document.createElement('button');
    copyButton.id = 'copy-btn';
    copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 14 14" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.1665 2.91663C1.1665 1.95013 1.95001 1.16663 2.9165 1.16663H7.58317C8.54967 1.16663 9.33317 1.95013 9.33317 2.91663V3.49996C9.33317 3.82213 9.072 4.08329 8.74984 4.08329C8.42767 4.08329 8.1665 3.82213 8.1665 3.49996V2.91663C8.1665 2.59446 7.90534 2.33329 7.58317 2.33329H2.9165C2.59434 2.33329 2.33317 2.59446 2.33317 2.91663V7.58329C2.33317 7.90546 2.59434 8.16663 2.9165 8.16663H3.49984C3.822 8.16663 4.08317 8.42779 4.08317 8.74996C4.08317 9.07213 3.822 9.33329 3.49984 9.33329H2.9165C1.95001 9.33329 1.1665 8.54979 1.1665 7.58329V2.91663ZM4.6665 6.41663C4.6665 5.45013 5.45001 4.66663 6.4165 4.66663H11.0832C12.0497 4.66663 12.8332 5.45013 12.8332 6.41663V11.0833C12.8332 12.0498 12.0497 12.8333 11.0832 12.8333H6.4165C5.45001 12.8333 4.6665 12.0498 4.6665 11.0833V6.41663ZM6.4165 5.83329C6.09434 5.83329 5.83317 6.09446 5.83317 6.41663V11.0833C5.83317 11.4055 6.09434 11.6666 6.4165 11.6666H11.0832C11.4053 11.6666 11.6665 11.4055 11.6665 11.0833V6.41663C11.6665 6.09446 11.4053 5.83329 11.0832 5.83329H6.4165Z" fill="currentColor"></path></svg>`;
    copyButton.addEventListener('click', handleCopyButtonClick);

    const summaryContainer = document.createElement('div');
    summaryContainer.id = 'summary-container';

    const transcriptContainer = document.createElement('div');
    transcriptContainer.id = 'transcript-container';
    transcriptContainer.style.display = 'none';

    extensionContainer.appendChild(header);
    extensionContainer.appendChild(tabsContainer);
    extensionContainer.appendChild(summaryContainer);
    extensionContainer.appendChild(transcriptContainer);
    extensionContainer.appendChild(summaryButton);
    extensionContainer.appendChild(copyButton);

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

  const getTranscriptText = () => {
    const transcriptSegments = document.querySelectorAll('ytd-transcript-segment-renderer .segment-text');
    console.log("Found transcript segments:", transcriptSegments.length); // Log number of segments found
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

    summary.split('\n').forEach(paragraph => {
        const summaryTextElement = document.createElement('p');
        summaryTextElement.textContent = paragraph;
        summaryContainer.appendChild(summaryTextElement);
    });
  };

  const loadTranscription = (transcription) => {
    const transcriptContainer = document.getElementById('transcript-container');
    if (!transcriptContainer) {
        console.log('Transcription container not found.');
        return;
    }

    transcriptContainer.innerHTML = ''; // Clear previous transcription

    transcription.split('\n').forEach(line => {
        const transcriptLineElement = document.createElement('p');
        transcriptLineElement.textContent = line;
        transcriptContainer.appendChild(transcriptLineElement);
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

  const switchTab = (tab) => {
    const summaryContainer = document.getElementById('summary-container');
    const transcriptContainer = document.getElementById('transcript-container');
    const summaryTab = document.getElementById('summary-tab');
    const transcriptTab = document.getElementById('transcript-tab');

    if (tab === 'summary') {
      summaryContainer.style.display = 'block';
      transcriptContainer.style.display = 'none';
      summaryTab.classList.add('active');
      transcriptTab.classList.remove('active');
    } else {
      summaryContainer.style.display = 'none';
      transcriptContainer.style.display = 'block';
      summaryTab.classList.remove('active');
      transcriptTab.classList.add('active');
    }
  };

  const init = () => {
    createUI();
  };

  init();
})();