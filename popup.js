function createStyledModal(title, message, buttonText, callback) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
  
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '40px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    modalContent.style.width = '350px';
    modalContent.style.textAlign = 'center';
  
    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    titleElement.style.marginBottom = '20px';
    titleElement.style.color = '#4CAF50';
  
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.marginBottom = '25px';
    messageElement.style.color = '#555';
  
    const inputsContainer = document.createElement('div');
    inputsContainer.style.display = 'flex';
    inputsContainer.style.flexDirection = 'column';
    inputsContainer.style.alignItems = 'center';
  
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = 'Enter password';
    passwordInput.style.width = '100%';
    passwordInput.style.padding = '12px';
    passwordInput.style.marginBottom = '15px';
    passwordInput.style.border = '1px solid #ccc';
    passwordInput.style.borderRadius = '4px';
    passwordInput.style.fontSize = '14px';
  
    const confirmPasswordInput = document.createElement('input');
    confirmPasswordInput.type = 'password';
    confirmPasswordInput.placeholder = 'Confirm password';
    confirmPasswordInput.style.width = '100%';
    confirmPasswordInput.style.padding = '12px';
    confirmPasswordInput.style.marginBottom = '25px';
    confirmPasswordInput.style.border = '1px solid #ccc';
    confirmPasswordInput.style.borderRadius = '4px';
    confirmPasswordInput.style.fontSize = '14px';
  
    const button = document.createElement('button');
    button.textContent = buttonText;
    button.style.padding = '12px 24px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    button.style.transition = 'background-color 0.3s';
  
    button.onmouseover = function() {
      button.style.backgroundColor = '#45a049';
    };
  
    button.onmouseout = function() {
      button.style.backgroundColor = '#4CAF50';
    };
  
    button.onclick = function() {
      callback(passwordInput.value, confirmPasswordInput.value);
    };
  
    inputsContainer.appendChild(passwordInput);
    inputsContainer.appendChild(confirmPasswordInput);
  
    modalContent.appendChild(titleElement);
    modalContent.appendChild(messageElement);
    modalContent.appendChild(inputsContainer);
    modalContent.appendChild(button);
    modal.appendChild(modalContent);
  
    return modal;
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    const protectButton = document.getElementById("protectCurrentSite");
  
    protectButton.addEventListener("click", function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentUrl = new URL(tabs[0].url).hostname;
        checkIfSiteProtected(currentUrl);
      });
    });
  
    displayProtectedSites();
  });
  
  function checkIfSiteProtected(url) {
    chrome.storage.sync.get("protectedSites", function(data) {
      const protectedSites = data.protectedSites || {};
      if (protectedSites[url]) {
        alert("You've already added this website. Please check your list to avoid duplicates.");
      } else {
        showPasswordModal(url);
      }
    });
  }
  
  function showPasswordModal(url) {
    const modal = createStyledModal(
      `Protect ${url}`,
      "Enter a password to protect this site",
      "Protect",
      function(password, confirmPassword) {
        if (password === confirmPassword) {
          addProtectedSite(url, password, modal);
        } else {
          alert("Passwords do not match!");
        }
      }
    );
    document.body.appendChild(modal);
  }
  
  function addProtectedSite(url, password, modal) {
    chrome.storage.sync.get("protectedSites", function(data) {
      const protectedSites = data.protectedSites || {};
      protectedSites[url] = password;
      chrome.storage.sync.set({ protectedSites: protectedSites }, function() {
        displayProtectedSites();
        if (modal && modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      });
    });
  }
  
  function displayProtectedSites() {
    chrome.storage.sync.get("protectedSites", function(data) {
      const protectedSites = data.protectedSites || {};
      const urlList = document.getElementById("urlList");
      urlList.innerHTML = "";
      for (const site in protectedSites) {
        const li = document.createElement("li");
        li.textContent = site;
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.marginBottom = '10px';
  
        const removeButton = document.createElement("button");
        removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        removeButton.style.background = "none";
        removeButton.style.border = "none";
        removeButton.style.cursor = "pointer";
        removeButton.style.color = "#888";
        removeButton.style.fontSize = "16px";
        removeButton.title = "Remove protected site";
        removeButton.onclick = function() {
          removeProtectedSite(site);
        };
  
        li.appendChild(removeButton);
        urlList.appendChild(li);
      }
    });
  }
  
  function removeProtectedSite(site) {
    chrome.storage.sync.get("protectedSites", function(data) {
      const protectedSites = data.protectedSites || {};
      delete protectedSites[site];
      chrome.storage.sync.set({ protectedSites: protectedSites }, function() {
        displayProtectedSites();
      });
    });
  }