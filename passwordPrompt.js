chrome.storage.sync.get("password", function(data) {
  const password = data.password || "";
  const userPassword = prompt("Enter the password to access this site:");

  if (userPassword === password) {
    window.location.reload();
  } else {
    alert("Incorrect password. Access denied.");
  }
});
