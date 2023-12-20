"use strict";

(function(){
	document.getElementById("h3options").textContent=i18n("options");
	document.getElementById("badgeColorLabel").textContent=i18n("bgColor");
	document.getElementById("fontColorLabel").textContent=i18n("fontColor");
	document.getElementById("modeLabel").textContent=i18n("mode");
	document.getElementById("mode").options[0].text=i18n("icon");
	document.getElementById("mode").options[1].text=i18n("badge");
	document.getElementById("fontSizeLabel").textContent=i18n("fontSize");
	document.getElementById("boldLabel").textContent=i18n("bold");
	document.getElementById("bgStyleLabel").textContent=i18n("bgStyle");
	document.getElementById("bgStyle").options[0].text=i18n("rounded");
	document.getElementById("bgStyle").options[1].text=i18n("rectangle");
	document.getElementById("bgStyle").options[2].text=i18n("circle");
	document.getElementById("bgStyle").options[3].text=i18n("none");
})();

function saveOptions(e){
	const prefs={};
	const inputs=document.querySelectorAll("input:not([type=checkbox]),select");
	[...inputs].forEach(e=>{
		prefs[e.id]=e.value;
	});
	prefs.bold=document.getElementById("bold").checked;
	browser.storage.local.set(prefs);
	browser.runtime.sendMessage({refresh:true});
}

function restoreOptions() {
	browser.storage.local.get().then(result=>{
		document.getElementById("table").className=result.mode;
		Object.entries(result).forEach(e=>{
			if(e[0]==="bold"){
				document.getElementById(e[0]).checked=e[1];
			}else{
				document.getElementById(e[0]).value=e[1];
			}
		});
	});
}

function i18n(e){
	return browser.i18n.getMessage(e);
}

function changeMode(e){
	document.getElementById("table").className=e.target.value;
}

document.addEventListener("DOMContentLoaded",restoreOptions);
document.querySelector("form").addEventListener("change",saveOptions);
document.getElementById("mode").addEventListener("change",changeMode);
