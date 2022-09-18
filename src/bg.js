"use strict";

let tabsPerWindow={};
const prefs={
	mode:"icon",
	fontSize:12,
	fontColor:"#ffffff",
	bold:true,
	badgeColor:"#d90000",
	bgStyle:"rounded",
};

browser.runtime.onInstalled.addListener(handleInstalled);
function handleInstalled(details){
	if(details.reaseon==="update"){
		prefs.mode="badge";
	}
	browser.storage.local.get().then(result=>{
		const settings=Object.assign({},prefs,result);
		browser.storage.local.set(settings).then(()=>{
			init();
		});
	});
}

browser.runtime.onMessage.addListener(run);
function run(m){
	if(m.refresh){
		Object.entries(tabsPerWindow).forEach(e=>{
			const winId=parseInt(e[0]);
			browser.browserAction.setIcon({
				path:"icons/none.svg",
				windowId:winId
			});
			browser.browserAction.setBadgeText({
				text:"",
				windowId:winId
			});
		});
		init();
	}
}

(function(){
	browser.tabs.onCreated.addListener(tab=>{
		plus(tab.windowId);
	});
	browser.tabs.onRemoved.addListener((tabId,e)=>{
		minus(e.windowId);
	});
	browser.tabs.onAttached.addListener((tabId,e)=>{
		plus(e.newWindowId);
	});
	browser.tabs.onDetached.addListener((tabId,e)=>{
		minus(e.oldWindowId);
	});
	init();
	browser.contextMenus.removeAll();
	browser.contextMenus.create({
		  title: browser.i18n.getMessage("options"),
		  contexts: ["browser_action"],
		  onclick: function(e,tab){
			 browser.runtime.openOptionsPage();
		  }
	});
})();

async function init(){
	await getPrefs();
	const allTabs=await browser.tabs.query({});
	tabsPerWindow={};
	allTabs.forEach(e=>{
		tabsPerWindow[e.windowId]=(tabsPerWindow[e.windowId])?tabsPerWindow[e.windowId]+1:1;
	});
	Object.entries(tabsPerWindow).forEach(e=>{
		const winId=parseInt(e[0]);
		const numTabs=e[1];
		updateInfo(numTabs,winId);
	});
	browser.browserAction.setBadgeBackgroundColor({color:prefs.badgeColor});
	browser.browserAction.setBadgeTextColor({color:prefs.fontColor});
}

function getPrefs(){
	return browser.storage.local.get().then(e=>{
		if(e.mode){
			prefs.mode=e.mode;
			prefs.fontSize=e.fontSize;
			prefs.fontColor=e.fontColor;
			prefs.bold=e.bold;
			prefs.badgeColor=e.badgeColor;
			prefs.bgStyle=e.bgStyle;
		}
	});
}

function plus(winId){
	tabsPerWindow[winId]=(tabsPerWindow[winId])?tabsPerWindow[winId]+1:1;
	updateInfo(tabsPerWindow[winId],winId);
}

function minus(winId){
	tabsPerWindow[winId]=tabsPerWindow[winId]-1;
	updateInfo(tabsPerWindow[winId],winId);
}

function updateInfo(numTabs,winId){
	if(prefs.mode==="icon"){
		browser.browserAction.setIcon({
			imageData:generateIcon(numTabs),
			windowId:winId
		});
	}else{
		browser.browserAction.setBadgeText({
			text:numTabs.toString(),
			windowId:winId
		});
	}
	browser.browserAction.setTitle({
		title:browser.i18n.getMessage("btnTitle",numTabs),
		windowId:winId
	});
}

function generateIcon(num){
	const fontSize=(num<100)?prefs.fontSize:prefs.fontSize*.85;
	const bold=(prefs.bold)?"600":"";
	const maxWidth=(prefs.bgStyle==="none")?16:14;
	const c=document.createElement("canvas");
	const ctx=c.getContext("2d");
	c.width=16;
	c.height=16;
	switch(prefs.bgStyle){
		case "none":
			break;
		case "rectangle":
			ctx.fillStyle=prefs.badgeColor;
			ctx.fillRect(0,0,16,16);
			break;
		case "circle":
			ctx.fillStyle=prefs.badgeColor;
			ctx.arc(8,8,8,0,360);
			ctx.fill();
			break;
		case "rounded":
		default:
			ctx.fillStyle=prefs.badgeColor;
			ctx.arc(8,8,10,0,360);
			ctx.fill();
	}
	ctx.font=bold+" "+fontSize+"px Segoe UI,Tahoma,Helvetica Neue,Lucida Grande,Ubuntu,sans-serif";
	ctx.fillStyle=prefs.fontColor;
	ctx.textAlign="center";
	ctx.textBaseline="middle";
	ctx.fillText(num+"",8,9,maxWidth);
	return ctx.getImageData(0,0,16,16);
}
