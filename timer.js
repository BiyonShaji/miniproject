bg=chrome.extension.getBackgroundPage();

function startstop()
{
	//alert("hi");
	
	
	hours = parseInt(document.getElementById("hh").value); if (isNaN(hours)) hours=0;
	minutes = parseInt(document.getElementById("mm").value); if (isNaN(minutes)) minutes=0;
	seconds = parseInt(document.getElementById("ss").value); if (isNaN(seconds)) seconds=0;
	newtimelimit = 60 * 60 * hours + 60 * minutes + seconds;
	starttime = new Date();
	starttime = starttime.getTime();
	starttime = starttime/1000 | 0;
	chrome.storage.local.set({'starttime': starttime, 'timelimit': newtimelimit});
	if (bg.started==1)
	{
		// turn off
		
		bg.clearalarm();
		$('#start').removeClass('red').addClass('green').text('Start');
		$('#pause').removeClass('green').addClass('not-active');
		clearInterval(newInterval);
		chrome.contentSettings['notifications'].clear({});
		
	}
	else
	{
		// turn on
		if (newtimelimit > 0)
		{
		bg.setalarm(newtimelimit*1000);
		$('#start').text('Pause').removeClass('green').addClass('red');
		$('#pause').removeClass('not-active').addClass('green');
		chrome.contentSettings['notifications'].set({
			'primaryPattern': '<all_urls>',
			'setting': 'block'
		  });
		startcounter();
		}
	}
}

function stop()
{
	bg.clearalarm();
	clearInterval(newInterval);
	
	chrome.contentSettings['notifications'].clear({});

	chrome.storage.local.set({'timelimit': 0 });
	$('#start').removeClass('red').addClass('green').text('Start');
	$('#pause').removeClass('green').addClass('not-active');
	document.getElementById('hh').value='00';
	document.getElementById('mm').value='00';
	document.getElementById('ss').value='00';
}

function startcounter()
{
	chrome.storage.local.get(['timelimit','starttime'], function(result){
	currenttime = new Date();
	currenttime = currenttime.getTime();
	currenttime = currenttime/1000 | 0;
	timeleft=result.timelimit-(currenttime-result.starttime);
	document.getElementById('hh').value=('0'+(timeleft/60/60 | 0)).slice(-2);
	document.getElementById('mm').value=('0'+((timeleft/60)%60 | 0)).slice(-2);
	document.getElementById('ss').value=('0'+(timeleft%60)).slice(-2);
	newInterval=setInterval(function() {
		currenttime = new Date();
		currenttime = currenttime.getTime();
		currenttime = currenttime/1000 | 0;
		timeleft=result.timelimit-(currenttime-result.starttime);
		document.getElementById('hh').value=('0'+(timeleft/60/60 | 0)).slice(-2);
		document.getElementById('mm').value=('0'+((timeleft/60)%60 | 0)).slice(-2);
		document.getElementById('ss').value=('0'+(timeleft%60)).slice(-2);
		if (timeleft<1)
		{
			clearInterval(newInterval);
			document.getElementById('hh').value='00';
			document.getElementById('mm').value='00';
			document.getElementById('ss').value='00';
			chrome.contentSettings['notifications'].clear({});
		$('#start').removeClass('red').addClass('green').text('Start');
		$('#pause').removeClass('green').addClass('not-active');
		}
		}, 1000);
    });
}

document.addEventListener('DOMContentLoaded', function () {
	
	document.getElementById('start').addEventListener('click', startstop);
	document.getElementById('pause').addEventListener('click', stop);
	if (bg.started==1)
	{
		$('#start').text('Pause').removeClass('green').addClass('red');
		$('#pause').removeClass('not-active').addClass('green');
		chrome.contentSettings['notifications'].set({
			'primaryPattern': '<all_urls>',
			'setting': 'block'
		  });
		startcounter();
	}
	else
	{
		
		$('#start').removeClass('red').addClass('green').text('Start');
		$('#pause').removeClass('green').addClass('not-active');
		chrome.contentSettings['notifications'].clear({});

		chrome.storage.local.get({'timelimit': 0}, function(result){
			document.getElementById('hh').value=('0'+(result.timelimit/60/60 | 0)).slice(-2);
			document.getElementById('mm').value=('0'+((result.timelimit/60)%60 | 0)).slice(-2);
			document.getElementById('ss').value=('0'+(result.timelimit%60)).slice(-2);
		});
	}
	
});