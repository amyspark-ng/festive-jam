import { GameState } from "../../GameScene";
import { minigames, MinigameState } from "../../MinigameState";

minigames["santa2"] = (minigame: MinigameState, state: GameState) => {
	debug.log("You have to do " + state.objectAmount + " toys");
};
