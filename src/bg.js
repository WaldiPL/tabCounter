(function(){
	browser.tabs.onRemoved.addListener((e,i)=>{updateCounter();if(i)setTimeout(updateCounter,1000);});
	browser.tabs.onCreated.addListener(updateCounter);
	browser.windows.onFocusChanged.addListener(updateCounter);
	browser.storage.local.get('badgeColor').then(result=>{
		let bg = result.badgeColor?result.badgeColor:"#333333";
		browser.browserAction.setBadgeBackgroundColor({
			color: bg
		});
	});
	updateCounter();
	browser.contextMenus.removeAll();
	browser.contextMenus.create({
		  title: browser.i18n.getMessage("options"),
		  contexts: ["browser_action"],
		  onclick: function(e,tab){
			 browser.runtime.openOptionsPage();
		  }
	});
})();

function updateCounter(){
	browser.tabs.query({currentWindow:true}).then(tabs=>{
		let count=tabs.length;
		browser.browserAction.setBadgeText({
			text:count+""
		});
		browser.browserAction.setTitle({
			title:browser.i18n.getMessage("btnTitle",count)
		});
	});
}
