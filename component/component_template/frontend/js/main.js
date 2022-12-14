// The `Streamlit` object exists because our html file includes
// `streamlit-component-lib.js`.
// If you get an error about "Streamlit" not being defined, that
// means you're missing that file.

/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onDataFromPython(event) {
  const data = event.detail;
  let spec = JSON.parse(data.args.spec);
  console.log(spec);
}

document.addEventListener(componentLoadedEventName, e =>
{
	// Render the component whenever python send a "render event"
	Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onDataFromPython);
	// Tell Streamlit that the component is ready to receive events
	Streamlit.setComponentReady();
	Streamlit.setFrameHeight(0);
	Streamlit.setComponentValue({data:"send message"});
});