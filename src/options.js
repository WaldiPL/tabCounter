(function(){
	document.getElementById("h3options").textContent=browser.i18n.getMessage("options");
	document.getElementById("colorLabel").textContent=browser.i18n.getMessage("bgColor");
	document.getElementById("submitSave").textContent=browser.i18n.getMessage("save");
})();

function saveOptions(e) {
  browser.storage.local.set({
    badgeColor: document.querySelector("#badgeColor").value
  });
  browser.browserAction.setBadgeBackgroundColor({
	 color: document.querySelector("#badgeColor").value
  });
  e.preventDefault();
}

function restoreOptions() {
  browser.storage.local.get('badgeColor').then(result=>{
    document.querySelector("#badgeColor").value = result.badgeColor?result.badgeColor:"#333333";
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);