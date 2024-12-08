import kaplay from "kaplay";
import { createCursor } from "./cursor";
import { loadAssets } from "./loader";

const k = kaplay({
	// These will be changed later probably
	width: 1024,
	height: 576,
});

setCursor("none");
await loadAssets();

onLoad(() => {
	createCursor();
	if (isFocused()) go("menuscene");
	else go("focusscene");
});
