import kaplay from "kaplay";
import { createCursor } from "./cursor";
import { loadAssets } from "./loader";
import { GameState } from "./play/GameScene";

const k = kaplay({
	// These will be changed later probably
	width: 640,
	height: 360,
	scale: 1.55,
	font: "happy",
});

setCursor("none");
await loadAssets();

function startingScene() {
	go("gamescene", { player: "Santa", score: 0, step: 1 } as GameState);
}

onLoad(() => {
	createCursor();
	if (isFocused()) startingScene();
	else go("focusscene");
});
