started=0;

chrome.browserAction.setBadgeBackgroundColor({ color: [100, 100, 100, 255] });
chrome.browserAction.setBadgeText( { text: 'Off' } );


function setalarm(t)
{
	started=1;
	chrome.browserAction.setBadgeBackgroundColor({ color: [0, 255, 0, 255] });
	chrome.browserAction.setBadgeText( { text: 'On' } );
	timeout=setTimeout(function() {
		chrome.storage.local.set({'starttime': 0, 'timelimit': 0});
    	started=0;
    	nID = new Date();
		nID = nID.getTime();
		nID = nID/1000 | 0;
		nID = nID.toString();
		chrome.notifications.create(nID, { type: 'basic', title: 'Time is up!', message: '', priority: 2, iconUrl: "img1.jpg" }, function() { });
    	at=6; c=true;
    	interval=setInterval(function() {
    		if (c) chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
    		else chrome.browserAction.setBadgeBackgroundColor({ color: [100, 100, 100, 255] });
    		c = !c; at--; if (at==0) clearInterval(interval);
    	}, 500);
		chrome.browserAction.setBadgeBackgroundColor({ color: [100, 100, 100, 255] });
		chrome.browserAction.setBadgeText( { text: 'Off' } );
	}, t);

}

function clearalarm()
{
	clearTimeout(timeout);
	started=0;
	chrome.browserAction.setBadgeBackgroundColor({ color: [100, 100, 100, 255] });
	chrome.browserAction.setBadgeText( { text: 'Off' } );
}