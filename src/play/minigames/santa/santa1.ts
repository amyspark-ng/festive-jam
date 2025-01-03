import { cursor } from "../../../cursor";
import { mulfokColors } from "../../../utils/colors";
import { GameState } from "../../GameScene";
import { minigames, MinigameState } from "../../MinigameState";

minigames["santa1"] = (minigame: MinigameState, state: GameState) => {
	/** Gets a random stamp key for a letter */
	function getRandStampKey() {
		const colors = ["red", "green", "blue", "orange", "pink"];
		const stamps = ["pacman", "star", "heart"];
		return choose(colors) + "_" + choose(stamps);
	}

	/** Gets an object with a given stamp
	 * @param str Stamp to add, eg: "red_heart"
	 */
	function makeStampObj(str: string) {
		const shape = str.split("_")[1];
		const mColor = str.split("_")[0].toUpperCase();
		const obj = make([
			sprite("santa1_stamp_" + shape),
			pos(),
			color(mulfokColors[mColor]),
			rotate(0),
			anchor("center"),
			scale(),
			z(1),
			{
				key: str,
			},
		]);

		return obj;
	}

	/** Adds a letter object
	 * @param stamp Stamp that the letter will have
	 */
	function createLetterObject(stamp: ReturnType<typeof makeStampObj>) {
		const letter = add([
			sprite("santa1_letter"),
			pos(),
			z(0),
			scale(),
			area(),
			rotate(0),
			anchor("center"),
			{
				stamp: stamp,
			},
		]);

		letter.add(stamp);

		return letter;
	}

	/** Add one of those letters that fall */
	function addClickLetter() {
		let stampKey = getRandStampKey();
		// chance of getting the actual stamp
		if (chance(1 / 3.5)) {
			stampKey = actualStamp;
		}

		const stamp = makeStampObj(stampKey);
		const letter = createLetterObject(stamp);
		letter.use("hover");

		// sets pos
		letter.pos.y = dispenser.pos.y;
		letter.pos.x = (width() / 2 - 100) + (letter.width * rand(0, 2.5));

		let speed = 20;
		tween(speed, rand(1.5, 2.5), 0.5, (p) => speed = p, easings.easeOutQuart);
		const direction = choose([-1, 1]);

		letter.onUpdate(() => {
			letter.pos.y += speed;
			letter.angle += (speed * direction) / 2;

			// too late
			if (letter.pos.y > height() - letter.height * 1.45) {
				letter.destroy();
				letter.clearEvents();
			}
		});

		letter.onClick(() => {
			if (penalized || minigame.hasFinished) return;

			if (letter.stamp.key != actualStamp) {
				penalized = true;
				wait(1.5, () => penalized = false);
				return;
			}

			state.objectAmount++;
			letter.destroy();
			addPickedLetter(letter);
		});
	}

	/** Add one of those letters that have been picked */
	function addPickedLetter(letter: ReturnType<typeof createLetterObject>) {
		const newLetter = createLetterObject(makeStampObj(letter.stamp.key));

		newLetter.angle = letter.angle;
		newLetter.pos = letter.pos;
		newLetter.z = 2;

		const timeForTween = 0.2 + rand(0.1, 0.15);
		const newX = newLetter.width + rand(-10, 10);
		const newY = (height() - newLetter.height / 2) - ((newLetter.height / 4) * state.objectAmount);

		tween(newLetter.pos.x, newX, timeForTween, (p) => newLetter.pos.x = p, easings.easeOutExpo);

		tween(
			newLetter.pos.y,
			newY,
			timeForTween,
			(p) => newLetter.pos.y = p,
			easings.easeOutExpo,
		);
		tween(
			newLetter.angle,
			0,
			timeForTween,
			(p) => newLetter.angle = p,
			easings.easeOutExpo,
		);
	}

	/** Shape and color of the stamp you have to get (eg: "red_heart") */
	const actualStamp = getRandStampKey();

	/** Wheter was penalized by clicking the wrong letter */
	let penalized = false;

	/** How often will a new letter pop up
	 *
	 * Can be either 0.6 or 0.3
	 */
	let loopTime = 0.6;

	cursor().onUpdate(() => {
		cursor().color = lerp(cursor().color, penalized ? RED : WHITE, 0.5);
	});

	// add a single letter so it doesn't look empty
	state.objectAmount++;
	addPickedLetter(createLetterObject(makeStampObj(actualStamp)));
	minigame.hasWinned = true;

	// description text
	const descriptionText = add([
		text("Get all letters with", { size: 15, align: "center" }),
		anchor("right"),
		pos(center().x, height() - 30),
		z(5),
	]);
	descriptionText.pos.x += descriptionText.width / 2;
	const stampObjThing = descriptionText.add(makeStampObj(actualStamp));
	stampObjThing.pos.x += 15;

	minigame.ui.timer.pos = vec2(width() - minigame.ui.timer.width / 2, height() - minigame.ui.timer.height / 2);

	// bases for background and table
	add([
		sprite("santa1_base"),
	]);

	add([
		sprite("santa1_table"),
		z(1),
	]);

	const dispenser = add([
		sprite("santa1_dispenser"),
		z(1),
		pos(),
		anchor("top"),
		scale(),
	]);
	dispenser.pos.x += dispenser.width / 2;

	// card generator
	let timeInLoop = 0;
	onUpdate(() => {
		timeInLoop += dt();
		if (timeInLoop >= loopTime) {
			timeInLoop = 0;

			// chance of spitting early
			if (chance(1 / 3)) loopTime = 0.3;
			else loopTime = 0.6;

			if (minigame.hasFinished) return;

			// tween
			tween(1.3, 1, 0.5, (p) => dispenser.scale.y = p, easings.easeOutQuart);
			// chance of adding 2 letters
			if (chance(1 / 5)) {
				for (let i = 0; i < randi(1, 2); i++) {
					addClickLetter();
				}
			}
			else {
				addClickLetter();
			}
		}
	});
};
