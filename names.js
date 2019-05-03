var names = [];
var data = document.getElementsByClassName("im_dialog_peer");
for (var i = 0; i < data.length; i++) {
  names.push({ name: data[i].childNodes[1].innerText, id: i });
}

chrome.extension.sendRequest(names);
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "start") {
    data[request.id].childNodes[1].innerHTML = request.name;
  }
});
