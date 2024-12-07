import { gamescene } from "./play/gamescene";

export function loadAssets() {
	loadRoot("./"); // A good idea for Itch.io publishing later
	loadBean();

	loadSprite("cursor", "sprites/cursor.png", {
		sliceX: 3,
		sliceY: 1,
		anims: {
			cursor: 0,
			point: 1,
			grab: 2,
		},
	});

	gamescene();
}
