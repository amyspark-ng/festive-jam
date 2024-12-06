import { gamescene } from "./gamescene";

export function loadAssets() {
	loadRoot("./"); // A good idea for Itch.io publishing later
	loadBean();
	gamescene();
}