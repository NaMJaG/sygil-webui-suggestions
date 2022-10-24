document.addEventListener("DOMContentLoaded", e =>
{
	console.log("onLoad");
	// only execute once (even though multiple instances exist)
	if(!parentDoc.hasOwnProperty(componentID+'_data'))
	{
		// Dispatch the event.
		document.dispatchEvent(preLoadedOnceEvent);
		parentDoc[componentID+'_data'] = {registeredComponents: []};

		let url = window.location.pathname;
		let segments = url.split('/');
		if(segments[segments.length-1].includes('.htm'))
		{
			segments.pop();
		}
		absolutePath = window.location.protocol+"://"+window.location.host+segments.join("/")+"/";

		let r = new RegExp('^(?:[a-z+]+:)?//', 'i');

		for(i = 0; i < addParentStyleSheets.length; i++)
		{
			console.log("Adding "+addParentStyleSheets[i]);

			let client = new XMLHttpRequest();
			client.open('GET', addParentStyleSheets[i]);
			client.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200){
					if(this.responseText)
					{
						let text = this.responseText.replaceVariables();

						console.log(text);
						AppendStyle(componentID, text, parentDoc);
					}
				}
			}
			client.send();
		}

		// Dispatch the event.
		document.dispatchEvent(loadedOnceEvent);
	}
	sharedData = parentDoc[componentID+'_data'];
	sharedData.registeredComponents.push(document);
	
	let global_component_data = 'global_component_data';
	if(!parentDoc.hasOwnProperty(global_component_data))
	{
		parentDoc[global_component_data] = {registeredComponents: sharedData.registeredComponents};
	}
	globalData = parentDoc[global_component_data];
	
	document.dispatchEvent(componentLoadedEvent);
});