import { GameState } from "../play/GameScene";

scene("MenuScene", () => {
	let inKidOrSantaScene = false;

	// TODO: The hell is this, refactor
	function KidOrSantaScene() {
		add([
			text("Kid or Santa?", { size: 50 }),
			pos(center()),
			anchor("center"),
		]);

		const kidBtn = add([
			text("Kid", { size: 50 }),
			pos(center().sub(vec2(0, 100))),
			anchor("center"),
			area(),
			color(),
		]);

		kidBtn.onUpdate(() => {
			if (kidBtn.isHovering()) kidBtn.color = lerp(kidBtn.color, BLACK, 0.5);
			else kidBtn.color = lerp(kidBtn.color, WHITE, 0.5);
		});

		kidBtn.onClick(() => {
			go("GameScene", { player: "Kid", step: 1, score: 0 } as GameState);
		});

		const santaBtn = add([
			text("Santa", { size: 50 }),
			pos(center().add(vec2(0, 100))),
			anchor("center"),
			area(),
			color(),
		]);

		santaBtn.onUpdate(() => {
			if (santaBtn.isHovering()) santaBtn.color = lerp(santaBtn.color, BLACK, 0.5);
			else santaBtn.color = lerp(santaBtn.color, WHITE, 0.5);
		});

		santaBtn.onClick(() => {
			go("GameScene", { player: "Santa", step: 1, score: 0 } as GameState);
		});
	}

	const title = add([
		text("FESTIVE GAME", { size: 70 }),
		color(BLACK),
		pos(center()),
		anchor("center"),
	]);

	onClick(() => {
		if (inKidOrSantaScene) return;
		inKidOrSantaScene = true;

		title?.destroy();
		KidOrSantaScene();
	});
});
