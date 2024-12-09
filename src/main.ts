import "./engine";
import "./loader";
import "./play/GameScene";
import "./scenes/FocusScene";
import "./scenes/MenuScene";
import { createCursor } from "./cursor";
import { GameState } from "./play/GameScene";

setCursor("none");

function startingScene() {
	go("GameScene", { player: "Santa", score: 0, step: 1 } as GameState);
}

onLoad(() => {
	createCursor();
	if (isFocused()) startingScene();
	else go("FocusScene");
});
