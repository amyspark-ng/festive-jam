import { drag } from "../plugins/drag";
import utils from "../utils";
import { minigameId, minigames, minigamesList, MinigameState, TOTAL_STEPS } from "./MinigameState";

/** Class that handles the state of the current game
 * @param instance Takes as a parameter an instance of itself
 */
export class GameState {
	/** The score?? have to check GDD */
	score: number;
	/** Wheter you're playing as santa or as a kid */
	player: "Santa" | "Kid" = "Kid";
	/** The step of the process you're in, will be from 1 to {@link TOTAL_STEPS `TOTAL_STEPS`} */
	step: number = 0;
	constructor(instance: GameState) {
		this.player = instance.player ?? "Kid";
		this.step = instance.step ?? 0;
		this.score = instance.score ?? 0;
	}
}

for (let i = 0; i < minigamesList.length; i++) {
	await import(`./minigames/${utils.removeNumbers(minigamesList[i])}/${minigamesList[i]}.ts`);
}

/** The scene where the game actually runs */
scene("gamescene", (stateParam: GameState) => {
	const gameState = new GameState(stateParam);

	const minigameState = new MinigameState((gameState.player.toLowerCase() + gameState.step) as minigameId);

	const contentOfMinigame = minigames[minigameState.currentMinigame];
	if (contentOfMinigame) {
		// very crucial line, runs the actual content of the minigame
		contentOfMinigame.game(minigameState);
	}
	else {
		throw new Error("Minigame not found: " + minigameState.currentMinigame);
	}

	minigameState.onTimeFinished(() => {
		debug.log("MINIGAME FINISHED");

		wait(1, () => {
			// still there's a step left
			if (gameState.step < TOTAL_STEPS) {
				gameState.step++;
				go("gamescene", gameState);
			}
			// all steps are done, go home
			else {
				debug.log("You finished you win or loss idk");
				go("menuscene");
			}
		});
	});
});
