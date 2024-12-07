export const MenuScene = () =>
	scene("menuscene", () => {
		const title = add([
			text("FESTIVE GAME", { size: 70 }),
			color(BLACK),
			pos(center()),
			anchor("center"),
		]);
	});
