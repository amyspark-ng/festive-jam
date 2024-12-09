loadRoot("./"); // A good idea for Itch.io publishing later

loadBean();

loadBitmapFont("happy", "sprites/happy_28x36.png", 28, 36);

loadSprite("timer_ball", "sprites/timer_ball.png");

// santa1
loadSprite("santa1_base", "sprites/santa1/santa1_base.png");
loadSprite("santa1_table", "sprites/santa1/santa1_table.png");
loadSprite("santa1_dispenser", "sprites/santa1/santa1_dispenser.png");
loadSprite("santa1_letter", "sprites/santa1/santa1_letter.png");
loadSprite("santa1_stamp_heart", "sprites/santa1/santa1_stamp_heart.png");
loadSprite("santa1_stamp_pacman", "sprites/santa1/santa1_stamp_pacman.png");
loadSprite("santa1_stamp_star", "sprites/santa1/santa1_stamp_star.png");

loadSprite("cursor", "sprites/cursor.png", {
	sliceX: 3,
	sliceY: 1,
	anims: {
		cursor: 0,
		point: 1,
		grab: 2,
	},
});
