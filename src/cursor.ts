import { AreaComp, GameObj } from "kaplay";
import { DragComp } from "./plugins/drag";

/** Creates a cursor object */
export function createCursor() {
	const cursor = add([
		sprite("cursor", { anim: "cursor" }),
		pos(mousePos()),
		anchor("topleft"),
		scale(),
		rotate(0),
		color(),
		opacity(),
		z(100),
		stay(),
		fixed(),
		"cursor",
		{
			/** How lerped the cursor should be */
			lerp: 0.9,
		},
	]);

	cursor.onUpdate(() => {
		cursor.pos = lerp(cursor.pos, mousePos(), cursor.lerp);

		// cursor animation
		const allHoverObjs = get("hover", { recursive: true });

		allHoverObjs.forEach((hoverObj: GameObj<DragComp | AreaComp>) => {
			if (!hoverObj.isHovering()) {
				if (hoverObj.dragging) cursor.play("grab");
				else {
					if (allHoverObjs.some((otherObj) => otherObj.isHovering())) return;
					else cursor.play("cursor");
				}
			}
			// cursor runs when the obj is being hovered
			else {
				if (isMouseDown("left")) {
					if (hoverObj.is("ignorepoint") && !hoverObj.dragging) return;
					cursor.play("grab");
				}
				else {
					if (!hoverObj.is("ignorepoint")) cursor.play("point");
					else cursor.play("cursor");
				}
			}
		});
	});

	return cursor;
}

// /** Returns the cursor object */
export const cursor = () => get("cursor")[0] as ReturnType<typeof createCursor>;
