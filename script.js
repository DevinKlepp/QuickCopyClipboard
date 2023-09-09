const entriesList = document.getElementById("entries");

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log("Copied to clipboard:", text);
  });
}

function addEntry(key, value) {
  const entryText = `${key}: ${value}`;
  const entryItem = document.createElement("li");

  const contentDiv = document.createElement("div"); // Create a div for content
  contentDiv.className = "entry-content"; // Apply the entry-content class to the div

  const textNode = document.createTextNode(entryText);
  contentDiv.appendChild(textNode); // Add text content to the div

  const actionButtonsDiv = document.createElement("div"); // Create a div for action buttons
  actionButtonsDiv.className = "action-buttons"; // Apply the action-buttons class to the div

  const copyButton = document.createElement("button");
  copyButton.textContent = "📋";
  copyButton.id = "copyButton";
  copyButton.addEventListener("click", function () {
    copyToClipboard(value);
  });

  const removeButton = document.createElement("button");
  removeButton.textContent = "🗑️";
  removeButton.id = "removeButton";
  removeButton.addEventListener("click", function () {
    // Remove from storage and entry list
    chrome.storage.sync.remove(key, function () {
      entriesList.removeChild(entryItem);
    });
  });

  actionButtonsDiv.appendChild(copyButton);
  actionButtonsDiv.appendChild(removeButton);

  entryItem.appendChild(contentDiv); // Add content div to the list item
  entryItem.appendChild(actionButtonsDiv); // Add action buttons div to the list item

  entriesList.appendChild(entryItem);
}

document.getElementById("addButton").addEventListener("click", function () {
  const key = document.getElementById("key").value;
  const value = document.getElementById("value").value;

  // Store the key-value pair
  chrome.storage.sync.set({ [key]: value }, function () {
    console.log("Value is set");
    // Add the entry to the list after storing
    addEntry(key, value);

    // Clear input fields after successful addition
    document.getElementById("key").value = "";
    document.getElementById("value").value = "";
  });
});

// Retrieve and display stored data when the page loads
document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get(null, function (data) {
    for (const key in data) {
      console.log(key)
      console.log(data)
      addEntry(key, data[key]);
    }
  });
});
