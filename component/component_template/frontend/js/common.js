// parent document
const parentDoc = window.parent.document;
// components iframe element in parent document
const iframe = window.frameElement;

var componentID = document.title.replaceAll(" ","_").replace(/[^a-zA-Z0-9_]/g, '').trim().toLowerCase();

var tooltipID = componentID+"-tooltip";

const preLoadedOnceEventName = 'pre-loaded-once';
const preLoadedOnceEvent = new Event(preLoadedOnceEventName);

const loadedOnceEventName = 'pre-loaded-once';
const loadedOnceEvent = new Event(loadedOnceEventName);

const componentLoadedEventName = 'component-loaded';
const componentLoadedEvent = new Event(componentLoadedEventName);

var absolutePath = null;

var addParentStyleSheets = ["css/parent.css"];

// for sharing data between components of the same type
var sharedData = null;
// for sharing data between all components
var globalData = null;

function currentFrameAbsolutePosition(doc = document) {
  let currentWindow = doc.parentWindow || doc.defaultView;
  let currentParentWindow;
  let positions = [];
  let rect;

  while (currentWindow !== window.top) {
    currentParentWindow = currentWindow.parent;
    for (let idx = 0; idx < currentParentWindow.frames.length; idx++)
      if (currentParentWindow.frames[idx] === currentWindow) {
        for (let frameElement of currentParentWindow.document.getElementsByTagName('iframe')) {
          if (frameElement.contentWindow === currentWindow) {
            rect = frameElement.getBoundingClientRect();
            positions.push({x: rect.x, y: rect.y});
          }
        }
        currentWindow = currentParentWindow;
        break;
      }
  }
  return positions.reduce((accumulator, currentValue) => {
    return {
      x: accumulator.x + currentValue.x,
      y: accumulator.y + currentValue.y
    };
  }, { x: 0, y: 0 });
}

// check if element is visible
function isVisible(e) {
    return !!( e.offsetWidth || e.offsetHeight || e.getClientRects().length );
}

// find visible prompt field to connect to this iframe
function queryVisible(query, targetDocument = parentDoc, callback = null)
{
	let all = targetDocument.querySelectorAll(query);
	for(let i = 0; i < all.length; i++)
	{
		if(isVisible(all[i]))
		{
			if(callback != null)callback(all[i]);
			return all[i];
		}
	}
}

function isComponentVisible()
{
	return isVisible(iframe);
}

function getCaretPosition(ctrl) {
    // IE < 9 Support 
    if (document.selection) {
        ctrl.focus();
		let range = document.selection.createRange();
		let rangeLen = range.text.length;
        range.moveStart('character', -ctrl.value.length);
		let start = range.text.length - rangeLen;
        return {
            'start': start,
            'end': start + rangeLen
        };
    } // IE >=9 and other browsers
    else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
        return {
            'start': ctrl.selectionStart,
            'end': ctrl.selectionEnd
        };
    } else {
        return {
            'start': 0,
            'end': 0
        };
    }
}

function setCaretPosition(ctrl, start, end) {
    // IE >= 9 and other browsers
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(start, end);
    }
    // IE < 9 
    else if (ctrl.createTextRange) {
		let range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', start);
        range.select();
    }
}

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

// when pressing a button, give the focus back to the prompt field
function keepFocus(e, target)
{
	e.preventDefault();
	target.focus();
}

function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    let sliceSize = 1024;
    let byteCharacters = atob(base64Data);
    let bytesLength = byteCharacters.length;
    let slicesCount = Math.ceil(bytesLength / sliceSize);
    let byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        let begin = sliceIndex * sliceSize;
        let end = Math.min(begin + sliceSize, bytesLength);

        let bytes = new Array(end - begin);
        for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}

String.prototype.removeDouble = function(symbol)
{
	let str = this.slice();
	let doubleSymbole = symbol+symbol;
	while(str.includes(doubleSymbole))
	{
		str = str.replaceAll(doubleSymbole, symbol);
	}
	return str;
};

String.prototype.replaceVariables = function()
{
	let str = this.slice();
	if(!str)
		return;
	let reg = /(?<=%)(.*?)(?=%)/g;
	let search = str.match(reg);

	search.forEach( toReplace =>
	{
		if(window.hasOwnProperty(toReplace))
		{
			str = str.replaceAll("%"+toReplace+"%", window[toReplace]);
			if(!reg.test(str))
				return str;
		}
	});
	return str;
};

Array.prototype.unique = function() {
    let a = this.concat();
    for(let i=0; i<a.length; ++i) {
        for(let j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

function SetText(target, value)
{
	target.focus();
	target.select();
	target.ownerDocument.execCommand('insertText', false /*no UI*/, value);
}

function InsertText()
{
	target.focus();
	target.ownerDocument.execCommand('insertText', false /*no UI*/, value);
}