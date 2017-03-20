(function(){
	const oBody = document.body.innerHTML.toString();
	const nBody = oBody.replace(/__MSG_(\w+)__/g,(match,s1)=>{
		return s1 ? browser.i18n.getMessage(s1) : "";
	});
	if(nBody!=oBody){
		document.body.innerHTML = nBody;
	}
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