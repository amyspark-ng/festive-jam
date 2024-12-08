export const MenuScene = () =>
	scene("menuscene", () => {
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
				go("gamescene", "kid", 1);
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
				go("gamescene", "santa", 1);
			});
		}

		const title = add([
			text("FESTIVE GAME", { size: 70 }),
			color(BLACK),
			pos(center()),
			anchor("center"),
		]);

		onKeyPress(["space", "enter"], () => {
			if (inKidOrSantaScene) return;
			inKidOrSantaScene = true;

			title?.destroy();
			KidOrSantaScene();
		});

		onClick(() => {
			if (inKidOrSantaScene) return;
			inKidOrSantaScene = true;

			title?.destroy();
			KidOrSantaScene();
		});
	});
