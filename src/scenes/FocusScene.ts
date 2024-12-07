/** Focus scene */
export const FocusScene = () =>
	scene("focusscene", () => {
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
			go("menuscene");
		});
	});
