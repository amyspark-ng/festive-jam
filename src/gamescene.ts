export const gamescene = () => scene("gamescene", () => {
	const bean = add([
		sprite("bean"),
		anchor("center"),
		pos(center()),
		rotate(0),
	])

	bean.onUpdate(() => {
		bean.angle += 3;
	})

	onClick(() => {
		addKaboom(mousePos());
	})
})