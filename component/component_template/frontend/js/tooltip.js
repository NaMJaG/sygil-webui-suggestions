function RegisterTooltip()
{
	document.addEventListener(preLoadedOnceEventName, e =>
	{
		addParentStyleSheets.push("css/tooltip.css");
	});
}

function showTooltip( target, html = null, image = null, top = null, left = null, display = "flex", width = "inherit", height = "inherit")
{
	if(!html && !image)
		return;

	let currentFramePosition = currentFrameAbsolutePosition(target.ownerDocument);
	let rect = target.getBoundingClientRect();
	let element = parentDoc[tooltipID];
	element.innerHTML = html;
	if(image)
	{
		let img = parentDoc.createElement('img');
		img.src = image;
		element.appendChild(img)
	}
	element.style.display = display;
	element.style.top = top || (rect.bottom+currentFramePosition.y)+"px";
	element.style.left = left || (rect.right+currentFramePosition.x)+"px";
	element.style.width = width;
	element.style.height = height;
}

function hideTooltip()
{
	let element = parentDoc["phraseTooltip"];
	element.style.display= "none";
	element.innerHTML = "";
	element.style.top = "0px";
	element.style.left = "0px";
	element.style.width = "0px";
	element.style.height = "0px";
}

RegisterTooltip();