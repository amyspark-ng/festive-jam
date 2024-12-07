import { AreaComp, GameObj } from "kaplay"
import { DragComp } from "../drag"
import { addConfetti } from "../confetti"
import utils from "../utils"

/** How long should minigames last */
const MINIGAME_TIME = 5

/** Creates a cursor object */
function createCursor() {
	const cursor = add([
		sprite("cursor", { anim: "cursor" }),
		pos(mousePos()),
		anchor("topleft"),
		scale(),
		rotate(0),
		color(),
		opacity(),
		z(100),
		{
			/** How lerped the cursor should be */
			lerp: 0.9
		}
	])

	cursor.onUpdate(() => {
		cursor.pos = lerp(cursor.pos, mousePos(), cursor.lerp)
	
		// cursor animation
		const allHoverObjs = get("hover", { recursive: true })

		allHoverObjs.forEach((hoverObj:GameObj<DragComp | AreaComp>) => {
			if (!hoverObj.isHovering()) {
				if (hoverObj.dragging) cursor.play("grab")
				else {
					if (allHoverObjs.some((otherObj) => otherObj.isHovering())) return
					else cursor.play("cursor")
				}
			}

			// cursor runs when the obj is being hovered
			else {
				if (isMouseDown("left")) {
					if (hoverObj.is("ignorepoint") && !hoverObj.dragging) return;
					cursor.play("grab")
				}

				else {
					if (!hoverObj.is("ignorepoint")) cursor.play("point")
					else cursor.play("cursor")
				}
			}
		})
	})

	return cursor;
} 

/** Creates the UI for the base minigame */
function createUI() {
	const timer = add([
		text("00:00"),
		pos(10, 10),
		z(10),
		color(BLACK),
	])

	return {
		timer,
	}
}

/** Class that handles the base behaviour of any minigame */
export class MinigameState {
	/** The id of the current minigame */
	currentMinigame: string = "some"
	
	/** The amount of letters/toys the player got at the initial minigame  */
	objectAmount: number = 0;

	/** Wheter the player is playing as santa or a kid */
	player: "Santa" | "Kid" = "Kid";

	/** Time from 0 to 12 seconds */
	time: number = 0;

	/** The cursor of the game */
	cursor: ReturnType<typeof createCursor> = null;

	/** The UI for the minigame */
	ui: ReturnType<typeof createUI> =  null;

	/** The events of the minigame */
	private events = [
		"timeFinished",
	] as const

	/** Wheter the player has winned the minigame */
	private hasWinned: boolean = false

	/** Call when the player has winned the minigame */
	setWin() {
		this.hasWinned = true
	}

	/** Wheter to finish the minigame instantly */
	finishMinigame() {
		return this.triggerEvent("timeFinished");
	}

	/** Triggers an event */
	triggerEvent(event: typeof this.events[number], params?: any) {
		return getTreeRoot().trigger(event, params)
	}

	/** Will run when the time for the minigame is finished */
	onTimeFinished(action: () => void) {
		return getTreeRoot().on("timeFinished", action)
	}

	constructor(newMinigame:string) {
		if (!newMinigame) newMinigame = "namehere"
		this.currentMinigame = newMinigame

		let minigameDone = false

		this.cursor = createCursor()
		this.ui = createUI()

		onKeyPress("r", () => { go("gamescene") })

		onUpdate(() => {
			if (this.time < MINIGAME_TIME) {
				this.time += dt()
			}

			else if (this.time >= MINIGAME_TIME && !minigameDone) {
				minigameDone = true
				this.triggerEvent("timeFinished")
			}
		
			this.ui.timer.text = utils.formatSeconds(this.time)
		})

		// you're done
		this.onTimeFinished(() => {
			if (this.hasWinned) {
				debug.log("YIPPEEE")
				addConfetti({ pos: center() })
			}

			else {
				debug.log("boooo")
				shake()
			}
			
			get("drag").forEach((obj:GameObj<DragComp>) => obj.drop())
		})
	}
}