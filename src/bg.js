(function(){
	browser.tabs.onRemoved.addListener((e,i)=>{updateCounter(false);});
	browser.tabs.onCreated.addListener(updateCounter);
	browser.windows.onFocusChanged.addListener(updateCounter);
	browser.storage.local.get('badgeColor').then(result=>{
		let bg = result.badgeColor?result.badgeColor:"#333333";
		browser.browserAction.setBadgeBackgroundColor({
			color: bg
		});
	});
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
		if (arguments.length == 1 && typeof arguments[0] == 'boolean' && !arguments[0]) {
			count--;
		}
		browser.browserAction.setBadgeText({
			text:count+""
		});
		browser.browserAction.setTitle({
			title:browser.i18n.getMessage("btnTitle",count)
		});
	});
}
