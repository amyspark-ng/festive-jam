import { AreaComp, GameObj } from "kaplay";
import { createCursor, cursor } from "../cursor";
import { addConfetti } from "../plugins/confetti";
import { DragComp } from "../plugins/drag";
import utils from "../utils";

/** Total amount of seconds a single minigame lasts */
const MINIGAME_TIME = 5;

/** Total amount of steps a run has */
export const TOTAL_STEPS = 2;

/** Creates the UI for the base minigame */
function createUI() {
	const timer = add([
		text("00:00"),
		pos(10, 10),
		z(10),
		color(BLACK),
	]);

	return {
		timer,
	};
}

/** A list of all the minigame ids */
export const minigamesList = [
	"kid1",
	"kid2",
	"santa1",
] as const;

/** The id of a minigame */
export type minigameId = typeof minigamesList[number];
type minigameFunc = (minigame: MinigameState) => void;

/** The object containing all the minigames */
export const minigames: Partial<Record<minigameId, minigameFunc>> = {};

/** Class that handles the base behaviour of any minigame */
export class MinigameState {
	/** The id of the current minigame */
	currentMinigame: minigameId;

	/** The amount of letters/toys the player got at the initial minigame  */
	objectAmount: number = 0;

	/** Time from 0 to 12 seconds */
	time: number = 0;

	/** The UI for the minigame */
	ui: ReturnType<typeof createUI> = null;

	/** The events of the minigame */
	private events = [
		"timeFinished",
	] as const;

	/** Wheter the player has winned the minigame */
	private hasWinned: boolean = false;

	/** Call when the player has winned the minigame */
	setWin() {
		this.hasWinned = true;
	}

	/** Wheter to finish the minigame instantly */
	finishMinigame() {
		return this.triggerEvent("timeFinished");
	}

	/** Triggers an event */
	triggerEvent(event: typeof this.events[number], params?: any) {
		return getTreeRoot().trigger(event, params);
	}

	/** Will run when the time for the minigame is finished */
	onTimeFinished(action: () => void) {
		return getTreeRoot().on("timeFinished", action);
	}

	constructor(newMinigame: minigameId) {
		this.currentMinigame = newMinigame;

		let minigameDone = false;

		this.ui = createUI();

		onKeyPress("r", () => {
			go("gamescene");
		});

		onUpdate(() => {
			// time counter
			if (this.time < MINIGAME_TIME) {
				this.time += dt();
			}
			else if (this.time >= MINIGAME_TIME && !minigameDone) {
				minigameDone = true;
				this.triggerEvent("timeFinished");
			}

			this.ui.timer.text = utils.formatSeconds(this.time);

			// cursor stuff
		});

		// you're done
		this.onTimeFinished(() => {
			if (this.hasWinned) {
				debug.log("YIPPEEE");
				addConfetti({ pos: vec2(center().x, height()) });
			}
			else {
				debug.log("boooo");
				shake();
			}

			get("drag").forEach((obj: GameObj<DragComp>) => {
				obj.drop();
				obj.unuse("drag");
			});
			get("hover").forEach((obj: GameObj) => obj.unuse("hover"));
			get("area").forEach((obj: GameObj<AreaComp>) => obj.unuse("area"));
		});
	}
}
