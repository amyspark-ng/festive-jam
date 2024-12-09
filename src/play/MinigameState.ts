import { AreaComp, GameObj } from "kaplay";
import { addConfetti } from "../plugins/confetti";
import { DragComp } from "../plugins/drag";
import { GameState } from "./GameScene";

/** Total amount of seconds a single minigame lasts */
export const MINIGAME_TIME = 12;

/** Total amount of steps a run has */
export const TOTAL_STEPS = 2;

/** Creates the UI for the base minigame */
function createUI() {
	const timer = add([
		sprite("timer_ball"),
		pos(),
		anchor("center"),
		scale(),
		opacity(),
		color(),
		z(99),
		{
			text: "12",
		},
	]);

	timer.pos = vec2(timer.width / 2, timer.height / 2);

	timer.add([
		pos(0, 10),
		text(timer.text, { align: "center" }),
		color(BLACK),
		anchor("center"),
		{
			update() {
				this.text = timer.text;
			},
		},
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
	"santa2",
] as const;

/** The id of a minigame (will be something like kid1, or santa1) */
export type minigameId = typeof minigamesList[number];
type minigameContent = (minigame: MinigameState, state: GameState) => void;

/** The object containing all the minigames */
export const minigames: Partial<Record<minigameId, minigameContent>> = {};

/** Class that handles the base behaviour of any minigame */
export class MinigameState {
	/** The id of the current minigame */
	currentMinigame: minigameId;

	/** Time from 0 to 12 seconds */
	time: number = 0;

	/** The UI for the minigame */
	ui: ReturnType<typeof createUI> = null;

	/** The events of the minigame */
	private events = [
		"timeFinished",
	] as const;

	/** Wheter the player has winned the minigame */
	hasWinned: boolean = false;

	/** Wheter the minigame has finished */
	hasFinished: boolean = false;

	/** Wheter to finish the minigame instantly */
	finishMinigame() {
		this.hasFinished = true;
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

		this.ui = createUI();

		onKeyPress("r", () => {
			go("GameScene");
		});

		this.time = MINIGAME_TIME;

		onUpdate(() => {
			// time counter
			if (this.time > 0) {
				this.time -= dt();
			}
			else if (this.time <= 0 && !this.hasFinished) {
				this.hasFinished = true;
				this.triggerEvent("timeFinished");
			}

			this.ui.timer.text = Math.round(this.time).toString();

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

			// turn off and drop all objects
			get("drag", { recursive: true }).forEach((obj: GameObj<DragComp>) => {
				obj.drop();
				obj.unuse("drag");
			});
			get("hover", { recursive: true }).forEach((obj: GameObj) => obj.unuse("hover"));
			get("area", { recursive: true }).forEach((obj: GameObj<AreaComp>) => {
				obj.area.scale = vec2(0);
			});
		});
	}
}
