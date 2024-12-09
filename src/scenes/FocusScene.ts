/** Focus scene */
scene("FocusScene", () => {
	onDraw(() => {
		drawRect({
			width: width(),
			height: height(),
			anchor: "center",
			pos: center(),
			color: BLACK,
		});

		drawText({
			text: "Click to focus!",
			pos: center(),
			anchor: "center",
			color: WHITE,
		});
	});

	onClick(() => {
		go("MenuScene");
	});
});
