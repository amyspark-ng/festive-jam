import { Color, GameObj, PosComp, Vec2 } from "kaplay";
import { mulfokColors } from "../../../utils/colors";
import { GameState } from "../../GameScene";
import { minigames, MinigameState } from "../../MinigameState";

minigames["kid2"] = (minigame: MinigameState, state: GameState) => {
	const colorKeys = [
		"red",
		"green",
		"blue",
		"orange",
		"pink",
	];

	// change the order of colors in a random assortment
	colorKeys.sort(() => Math.random() - 0.5);

	const startingX = 130;

	colorKeys.forEach((colorkey, index) => {
		const mColor: Color = mulfokColors[colorkey.toUpperCase()];

		// top one
		const outlet = add([
			rect(50, 50),
			color(mColor),
			pos(startingX + index * 60, 50),
			outline(5, BLACK),
			anchor("center"),
			area(),
			"outlet",
			{
				respectiveEx: null,
				occupied: false,
			},
		]);

		const extension = add([
			rect(50, 50),
			color(mColor),
			anchor("center"),
			outline(5, BLACK),
			pos(startingX + index * 60, height() - 50),
			"extension",
			{
				wiring: false,
				wire: {
					p1: vec2(),
					p2: vec2(),
				},
			},
		]);

		outlet.respectiveEx = extension;
		// choseoutlet has to be a random outlet that hasn't been picked and it's not the same as the current outlet
		let choseOutlet = outlet;

		extension.wire.p1 = extension.pos;
		extension.wire.p2 = choseOutlet.pos;

		onUpdate(() => {
			if (extension.wiring) extension.wire.p2 = mousePos();
		});

		outlet.onClick(() => {
			// i have to find an extension that is wiring
			const extensionWiring = (get("extension") as typeof extension[]).find((ex) => {
				return ex.wiring == true;
			});

			// if theres an extension wiring
			if (extensionWiring) {
				// then set the p2 of that extension to this outlet
				extensionWiring.wiring = false;
				extensionWiring.wire.p2 = outlet.pos;
			}
			// if there's no extension wiring then it's going to change the wiring of an outlet
			else {
				// i have to find the extension that is connected to this outlet
				const extensionWithWire = (get("extension") as typeof extension[]).find((ex) => {
					return ex.wire.p2.eq(outlet.pos);
				});

				if (extensionWithWire) {
					extensionWithWire.wiring = true;
				}
			}

			// winning condition
			const wiresFixed = (get("extension") as typeof extension[]).every((ex) => {
				const respectiveOutlet = (get("outlet") as typeof outlet[]).find((out) => {
					return out.respectiveEx == ex;
				});
				return ex.wire.p2.eq(respectiveOutlet.pos);
			});

			if (wiresFixed && !minigame.hasWinned) {
				minigame.hasWinned = true;
				debug.log("you won yay");
			}
		});

		onDraw(() => {
			drawLine({
				p1: extension.wire.p1,
				p2: extension.wire.p2,
				width: 10,
				color: extension.color,
				outline: {
					width: 5,
					color: BLACK,
				},
			});
		});
	});

	// shuffle all the wires
	const extensions = get("extension");
	const outlets = get("outlet");

	extensions.sort(() => Math.random() - 0.5);
	outlets.sort(() => Math.random() - 0.5);

	// i need to go through each extension and assign them a random outlet that hasn't been picked before
	extensions.forEach((extension) => {
		let choseOutlet = outlets.find((outlet) => {
			return outlet.occupied == false;
		});
		choseOutlet.occupied = true;
		extension.wire.p2 = choseOutlet.pos;
	});
};
