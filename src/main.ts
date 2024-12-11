import "./engine";
import "./loader";
import "./play/GameScene";
import "./scenes/FocusScene";
import "./scenes/MenuScene";
import { createCursor } from "./cursor";
import { GameState } from "./play/GameScene";

setCursor("none");

function startingScene() {
	go("GameScene", { player: "Kid", score: 0, step: 2 } as GameState);
	// go("MenuScene");
}

onLoad(() => {
	createCursor();
	if (isFocused()) startingScene();
	else go("FocusScene");
});
