import { KEventController } from "kaplay";
import { anchorPt } from "kaplay/dist/declaration/gfx";
import utils from "../../../utils";
import { minigames, MinigameState } from "../../MinigameState";

minigames["santa1"] = {
	game: (minigame: MinigameState) => {
		function getRandomStamp() {
			const stamps = ["pacman", "star", "heart"];
			return add([
				sprite("santa1_stamp_" + choose(stamps)),
				pos(),
				color(utils.randomColor()),
				rotate(0),
				anchor("center"),
				scale(),
			]);
		}

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
		]);

		onUpdate(() => {
			minigame.time = 12;
		});

		let objectsPickedUp = 0;

		function addLetter(stamp: ReturnType<typeof getRandomStamp>) {
			const letter = add([
				sprite("santa1_letter"),
				pos(width() / 2 + rand(-30, 30), dispenser.pos.y),
				z(0),
				scale(),
				area(),
				rotate(0),
				anchor("center"),
			]);

			letter.children.push(stamp);

			return letter;
		}

		onDraw(() => {
		});

		// card generator
		loop(1.5, () => {
			const stamp = getRandomStamp();
			const letter = addLetter(stamp);
			letter.use("hover");

			let onClickEvent: KEventController = null;

			const speed = rand(1.5, 2.5);

			letter.onUpdate(() => {
				letter.pos.y += speed;
				letter.angle += speed / 2;

				if (letter.pos.y > height() - letter.height * 1.45) {
					letter.destroy();
					letter.clearEvents();
				}
			});

			letter.onClick(() => {
				objectsPickedUp++;
				letter.destroy();
				const newLetter = addLetter(stamp);

				newLetter.unuse("area");
				newLetter.angle = letter.angle;
				newLetter.pos = letter.pos;
				newLetter.z = 2;

				const timeForTween = 0.2 + rand(0.1, 0.15);
				const newX = newLetter.width + rand(-10, 10);
				const newY = (height() - newLetter.height / 2) - ((newLetter.height / 4) * objectsPickedUp);

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
		});
	},
};
