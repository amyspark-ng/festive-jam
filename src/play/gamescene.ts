import { drag } from "../plugins/drag";
import { minigameId, minigames, minigamesList, MinigameState } from "./MinigameState";

for (let i = 0; i < minigamesList.length; i++) {
	await import(`./minigames/${minigamesList[i]}.ts`);
}

/** The scene where the game actually runs */
export const GameScene = () =>
	scene("gamescene", (param: minigameId) => {
		const state = new MinigameState(param);
		minigames[state.currentMinigame](state);
	});
