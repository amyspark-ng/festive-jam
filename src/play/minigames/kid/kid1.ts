import { cursor } from "../../../cursor";
import { drag } from "../../../plugins/drag";
import { GameState } from "../../GameScene";
import { minigames, MinigameState } from "../../MinigameState";

minigames["kid1"] = (minigame: MinigameState, state: GameState) => {
	// Test minigame
	cursor().onUpdate(() => {
		cursor().color = WHITE.lerp(RED, minigame.time / 12);
	});

	const beanAmount = 5;
	let beansDone = 0;

	onDraw(() => {
		drawLine({
			p1: vec2(width() / 2, 0),
			p2: vec2(width() / 2, height()),
			color: RED,
			width: 5,
		});
	});

	for (let index = 0; index < beanAmount; index++) {
		const position = vec2(rand(0, width() / 2), rand(0, height()));

		const bean = add([
			sprite("bean"),
			area(),
			pos(position),
			anchor("center"),
			drag(),
			color(),
			"hover",
		]);

		bean.onClick(() => {
			if (!bean.is("drag")) return;
			bean.pick();
		});

		bean.onMouseRelease(() => {
			if (!bean.dragging) return;
			bean.drop();
		});

		bean.onDrop(() => {
			if (bean.pos.x >= width() / 2) {
				bean.area.scale = vec2(0);
				bean.color = BLUE;
				beansDone++;
			}
		});
	}

	onUpdate(() => {
		if (beansDone >= beanAmount) minigame.hasWinned = true;
	});
};
