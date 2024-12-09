import { cursor } from "../../../cursor";
import { mulfokColors } from "../../../utils/colors";
import { GameState } from "../../GameScene";
import { minigames, MinigameState } from "../../MinigameState";

// TODO: Forget about description
minigames["santa1"] = {
	game: (minigame: MinigameState, state: GameState) => {
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
		function addLetter(stamp: ReturnType<typeof makeStampObj>) {
			const letter = add([
				sprite("santa1_letter"),
				pos(),
				z(0),
				scale(),
				area(),
				rotate(0),
				anchor("center"),
				{
					stampKey: stamp.key,
				},
			]);

			letter.add(stamp);

			return letter;
		}

		/** Shape and color of the stamp you have to get (eg: "red_heart") */
		const actualStamp = getRandStampKey();

		/** Wheter was penalized by clicking the wrong letter */
		let penalized = false;

		/** How often will a new letter pop up */
		const LOOP_TIME = 0.6;

		cursor().onUpdate(() => {
			cursor().color = lerp(cursor().color, penalized ? RED : WHITE, 0.5);
		});

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

		function addClickableCard() {
			let stampKey = getRandStampKey();
			if (chance(1 / 4)) {
				stampKey = actualStamp;
			}

			const stamp = makeStampObj(stampKey);
			const letter = addLetter(stamp);
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

				// too early
				if (letter.is("area")) {
					if (letter.pos.y < letter.height * 1.5) {
						letter.area.scale = vec2(0);
					}
					else {
						letter.area.scale = vec2(1);
					}

					// too late
					if (letter.pos.y > height() - letter.height * 1.45) {
						letter.destroy();
						letter.clearEvents();
					}
				}
			});

			letter.onClick(() => {
				if (penalized) return;

				if (letter.stampKey != actualStamp) {
					penalized = true;
					wait(1.5, () => penalized = false);
					return;
				}

				state.objectAmount++;
				letter.destroy();
				const newLetter = addLetter(makeStampObj(stampKey));

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
			});
		}

		// card generator
		loop(LOOP_TIME, () => {
			if (minigame.hasFinished) return;
			tween(1.3, 1, 0.5, (p) => dispenser.scale.y = p, easings.easeOutQuart);

			if (chance(1 / 4)) {
				for (let i = 0; i < 2; i++) {
					addClickableCard();
				}
			}
			else {
				addClickableCard();
			}
		});
	},
};
