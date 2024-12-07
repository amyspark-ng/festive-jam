import { drag } from "../drag"
import { minigameId, minigames, minigamesList, MinigameState } from "./MinigameState"

/** The scene where the game actually runs */
export const gamescene = () => scene("gamescene", (param: minigameId) => {
	minigamesList.forEach((id:minigameId) => {
		
	})
	
	const state = new MinigameState(param)
	minigames[state.currentMinigame](state)
})