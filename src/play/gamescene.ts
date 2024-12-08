import { drag } from "../plugins/drag";
import utils from "../utils";
import { minigameId, minigames, minigamesList, MinigameState, TOTAL_STEPS } from "./MinigameState";

/** Class that handles the state of the current game */
class GameState {
	score: number;
	player: "Santa" | "Kid" = "Kid";
	step: number = 0;
	constructor(player: "Santa" | "Kid") {
		this.score = 0;
		this.player = player;
		this.step = 0;
	}
}

for (let i = 0; i < minigamesList.length; i++) {
	await import(`./minigames/${utils.removeNumbers(minigamesList[i])}/${minigamesList[i]}.ts`);
}

/** The scene where the game actually runs */
export const GameScene = () =>
	scene("gamescene", (player: "Santa" | "Kid", step: number) => {
		const gameState = new GameState(player);
		gameState.step = step;

		const minigameState = new MinigameState((player.toLowerCase() + step) as minigameId);

		const contentOfMinigame = minigames[minigameState.currentMinigame];
		if (contentOfMinigame) {
			// very crucial line, runs the actual content of the minigame
			contentOfMinigame(minigameState);
		}
		else {
			throw new Error("Minigame not found: " + minigameState.currentMinigame);
		}

		minigameState.onTimeFinished(() => {
			debug.log("MINIGAME FINISHED");

			wait(1, () => {
				// still there's a step left
				if (gameState.step < TOTAL_STEPS) {
					go("gamescene", player, gameState.step + 1);
				}
				// all steps are done, go home
				else {
					debug.log("You finished you win or loss idk");
					go("menuscene");
				}
			});
		});
	});
