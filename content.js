chrome.storage.sync.get("protectedSites", function(data) {
  const protectedSites = data.protectedSites || {};
  const currentUrl = new URL(window.location.href).hostname;

  if (protectedSites[currentUrl]) {
    showPasswordPrompt(currentUrl, protectedSites[currentUrl]);
  }
});

function showPasswordPrompt(url, correctPassword) {
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.left = '0';
  modal.style.top = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '10000';
  modal.style.fontFamily = "'Poppins', sans-serif";

  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = '#fff';
  modalContent.style.padding = '20px';
  modalContent.style.borderRadius = '10px';
  modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
  modalContent.style.width = '300px';
  modalContent.style.textAlign = 'center';

  const title = document.createElement('h3');
  title.textContent = `Enter password for ${url}`;
  title.style.marginBottom = '15px';
  title.style.fontWeight = '600';
  title.style.color = '#333';

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.placeholder = 'Enter password';
  passwordInput.style.width = '100%';
  passwordInput.style.padding = '10px';
  passwordInput.style.marginBottom = '15px';
  passwordInput.style.border = '1px solid #ccc';
  passwordInput.style.borderRadius = '4px';
  passwordInput.style.fontSize = '14px';
  passwordInput.style.background = '#f9f9f9';
  passwordInput.style.color = '#333';

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.style.backgroundColor = '#4CAF50';
  submitButton.style.color = 'white';
  submitButton.style.padding = '10px';
  submitButton.style.border = 'none';
  submitButton.style.borderRadius = '4px';
  submitButton.style.cursor = 'pointer';
  submitButton.style.fontSize = '14px';
  submitButton.style.width = '100%';

  submitButton.onclick = function() {
    if (passwordInput.value === correctPassword) {
      document.body.removeChild(modal);
    } else {
      alert("Incorrect password!");
    }
  };

  modalContent.appendChild(title);
  modalContent.appendChild(passwordInput);
  modalContent.appendChild(submitButton);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}
