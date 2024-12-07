import kaplay from "kaplay";
import { loadAssets } from "./loader";

const k = kaplay({
	// These will be changed later probably
	width: 1024,
	height: 576,
});

setCursor("none");
loadAssets();
go("gamescene")