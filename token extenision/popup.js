document.getElementById('copyButton').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: extractToken
    }, (injectionResults) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        document.getElementById('status').textContent = 'Error: ' + chrome.runtime.lastError.message;
        return;
      }

      const result = injectionResults[0].result;
      document.getElementById('status').textContent = result.message;
      if (result.token) {
        document.getElementById('tokenDisplay').value = result.token;
        document.getElementById('tokenDisplay').style.display = 'block';
        document.getElementById('manualCopyButton').style.display = 'inline-block';
      }
    });
  });
});

document.getElementById('manualCopyButton').addEventListener('click', function() {
  const tokenDisplay = document.getElementById('tokenDisplay');
  tokenDisplay.select();
  document.execCommand('copy');
  document.getElementById('status').textContent = 'Token manually copied to clipboard';
});

function extractToken() {
  try {
    const tokenData = localStorage.getItem('token');
    if (tokenData) {
      const parsedData = JSON.parse(tokenData);
      const token = parsedData.token;
      
      if (token) {
        return { success: true, message: 'Token extracted successfully', token: token };
      }
    }
    return { success: false, message: 'Token not found in localStorage', token: null };
  } catch (error) {
    console.error('Error extracting token:', error);
    return { success: false, message: 'Error extracting token: ' + error.message, token: null };
  }
}
