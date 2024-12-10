export class _GameSave {
	hasUnlockedSanta: boolean = false;
	highscore = 0;
	save() {
		setData("festive-game", this);
	}

	load() {
		const data: _GameSave = getData("festive-game") || new _GameSave();
		Object.assign(this, data);
	}
}

export const GameSave = new _GameSave();
