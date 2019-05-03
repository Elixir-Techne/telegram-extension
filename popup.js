var allNames = [];

function getNames(names) {
  var linksTable = document.getElementById("links");
  while (linksTable.children.length > 1) {
    linksTable.removeChild(linksTable.children[linksTable.children.length - 1]);
  }
  for (var i = 0; i < names.length; ++i) {
    var row = document.createElement("tr");
    var col0 = document.createElement("td");
    var col1 = document.createElement("td");
    var button = document.createElement("img");
    button.src = "../icons/edit.png";
    button.addEventListener("click", showInput);
    row.id = names[i]["id"];
    button.id = names[i]["id"];
    col0.innerText = names[i]["name"];
    col0.style.whiteSpace = "nowrap";
    col1.appendChild(button);
    row.appendChild(col0);
    row.appendChild(col1);
    linksTable.appendChild(row);
  }
}

function filterName() {
  var filterValue = document.getElementById("filter").value.toUpperCase();
  var temp = [];
  for (var i = 0; i < allNames.length; ++i) {
    if (allNames[i]["name"].toUpperCase().includes(filterValue)) {
      temp.push(allNames[i]);
    }
  }
  getNames(temp);
}

function showInput(e) {
  var row = document.getElementById(e.target.id);
  var td = document.createElement("td");
  td.setAttribute("colspan", 2);
  var inputBox = document.createElement("input");
  inputBox.type = "text";
  inputBox.className = "form-control form-control-sm";
  inputBox.setAttribute("aria-describedby", "addon-wrapping");
  inputBox.id = e.target.id;
  inputBox.autofocus = true;
  inputBox.addEventListener("keyup", changeName);
  td.appendChild(inputBox);
  while (row.firstChild) {
    row.removeChild(row.firstChild);
  }
  row.appendChild(td);
}

function changeName(e) {
  if (e.keyCode === 13) {
    window.location.reload();
  } else {
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        message: "start",
        name: e.target.value,
        id: e.target.id
      });
    });
  }
}

chrome.extension.onRequest.addListener(function(names) {
  allNames = names;
  getNames(names);
});

window.onload = function() {
  document.getElementById("filter").addEventListener("input", filterName);
  chrome.windows.getCurrent(function(currentWindow) {
    chrome.tabs.query({ active: true, windowId: currentWindow.id }, function(
      activeTabs
    ) {
      chrome.tabs.executeScript(activeTabs[0].id, {
        file: "names.js",
        allFrames: true
      });
    });
  });
};
