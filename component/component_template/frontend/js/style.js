function AppendStyle(id, content, targetDoc = document)
{
	  // get parent document head
	let head = targetDoc.getElementsByTagName('head')[0];

	// add style tag
	let style = targetDoc.createElement('style');
    // set type attribute
	style.setAttribute('type', 'text/css');
	style.id = id;
    // add css forwarded from python
	if (style.styleSheet) {   // IE
        style.styleSheet.cssText = content;
    } else {                // the world
        style.appendChild(parentDoc.createTextNode(content));
    }
	// add style to head
    head.appendChild(style);
}

function CloneStyle(sourceDoc = parentDoc)
{
	// Transfer all styles
	let head = document.getElementsByTagName("head")[0];
	let sourceStyle = source.getElementsByTagName("style");
	for (let i = 0; i < sourceStyle.length; i++)
		head.appendChild(sourceStyle[i].cloneNode(true));
	let sourceLinks = source.querySelectorAll('link[rel="stylesheet"]');
	for (let i = 0; i < sourceLinks.length; i++)
		head.appendChild(sourceLinks[i].cloneNode(true));
}

// pass document.styleSheets
function getCSSVariables(styleSheets, selector = ":root") {
  let cssVars = {};
  // loop each stylesheet
  for (let s = 0; s < styleSheets.length; s++) {
    // loop stylesheet's cssRules
    try { // try/catch used because 'hasOwnProperty' doesn't work
      for (let r = 0; r < styleSheets[s].rules.length; r++) {
        let block = styleSheets[s].rules[r].cssText;
        if (block.split(" ")[0] === selector)
        {
          let properties = block.split("{")[1].split("}")[0].split(";");
          for (let p = 0; p < properties.length; p++) {
            let property = properties[p].split(":");
            property[0] = property[0].trim();
            if(property[0] !== "")
            {
              property[1] = property[1].trim();
			  cssVars[property[0]]=property[1];
            }
          }
        }
      }
    } catch (error) { }
  }
  return cssVars;
}

function CSSVariablesToString(cssVars, readableFormat = false, block = ":root", indent = 4)
{
	let css = [];
	css.push(block);
	
	if (readableFormat)
		css.push("\n");
	
	css.push("{");
	
	if (readableFormat)
		css.push("\n");
	
	let indentStr = "".padStart(indent, ' ');
	
	for (let property in cssVars)
	{
		if (readableFormat)
			css.push(indentStr);
		
		css.push(property,":");
		
		if (readableFormat)
			css.push(" ");
		
		css.push(cssVars[property],";");
		
		if (readableFormat)
			css.push("\n");
	}
	
	css.push("}");
	
	return css.join("");
}

function cloneParentCssVariables()
{
	let cssVars = getCSSVariables(parentDoc.styleSheets);
	AppendStyle(componentID+"-parent-variables",CSSVariablesToString(cssVars));
}