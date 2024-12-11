import { Color, Rect, Vec2 } from "kaplay";

type coolFormatNumberOpt = {
	/**
	 * Simple - Idk
	 *
	 * Decimal - 1 = 1.0 | 0 = 0.0
	 */
	type: "simple" | "decimal";
};

/** A simple utility class */
export class utils {
	/**
	 * This function will run only when the game is running on desktop
	 * @param action The function
	 */
	static runInDesktop(action: () => void) {
		if ("__TAURI__" in window) {
			action();
		}
	}

	/** Add a certain element in a certain index */
	static addInIndex(arr: any[], element: any, index: number) {
		return arr.splice(index, 0, element);
	}

	/** A pretty cool star */
	static star = "★";

	/** Gets a random position between 0 and width and height */
	static randomPos() {
		return vec2(rand(0, width()), rand(0, height()));
	}

	/** Gets a random color */
	static randomColor() {
		return rgb(rand(0, 255), rand(0, 255), rand(0, 255));
	}

	/** Returns an array with the specified element removed from it */
	static removeFromArr(el: any, arr: any[]) {
		const arrCopy = [...arr];
		arrCopy.splice(arr.indexOf(el), 1);
		return arrCopy;
	}

	/** Gets the value of a path in a given object */
	static getVar(obj: any, path: string) {
		const parts = path.split(".");
		const target = parts.slice(0, -1).reduce((o, p) => o[p], obj);
		return target[parts[parts.length - 1]];
	}

	/** Sets the value of a property in a given object and path */
	static setVar(obj: any, path: string, value: any) {
		const parts = path.split(".");
		const target = parts.slice(0, -1).reduce((o, p) => o[p], obj);
		target[parts[parts.length - 1]] = value;
	}

	// 3 columns means 3 objects laid horizontally, 3 rows is 3 objects laid vertically
	// from top to bottom
	//   ccc
	//  r...
	//  r...
	/**
	 * Function to get the position of an object in a grid
	 * @param initialpos It's the initial pos the objects will be at, column 0 and row 0 means this exact position
	 * @param row These are objects displayed vertically, the greater it is the more to the bottom they'll be
	 * @param column These are objects displayed horizontally, the greater it is the more to the right they'll be
	 * @param spacing It's the spacing objects will have, if you set Y spacing to 0, the objects won't be more apart when changing the row
	 * @returns A Vec2 with the position of the object
	 */
	static getPosInGrid(initialpos: Vec2, row: number, column: number, spacing: Vec2) {
		return vec2(initialpos.x + spacing.x * column, initialpos.y + spacing.y * row);
	}

	/** Formats time with seconds */
	static formatSeconds(timeInSeconds: number): string {
		// TODO: i have to fix it so if the miliseconds is only 1 character, it will add a 0 in front
		return `${Math.floor(timeInSeconds)}:${Math.floor((timeInSeconds - Math.floor(timeInSeconds)) * 100)}`;
	}

	/** Removes numbers from a string */
	static removeNumbers(str: string) {
		return str.replace(/\d/g, "");
	}

	/** Converts string to kebab case (eg: Hello, World! -> hello-world) */
	static kebabCase(str: string) {
		return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase().replaceAll(" ", "-").replaceAll("'", "");
	}

	/** Makes it so it's always fixed to 0.1 or 1.2 or 0.0 */
	static fixDecimal(num: number) {
		return parseFloat(num.toFixed(1));
	}

	/** Formats a number */
	static formatNumber(num: number, opts: coolFormatNumberOpt) {
		if (opts.type == "decimal") {
			return num.toFixed(1);
		}
		else {
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
		}
	}

	/** Returns if a number is between a range */
	static isInRange(num: number, min: number, max: number): boolean {
		return num >= min && num <= max;
	}

	// thank you u/LambentLight
	/** Converts width and height to the radius of a circle */
	static widthAndHeightToRadius(size: Vec2) {
		return (size.y / 2) + ((size.x) / (8 * size.y));
	}
}

export default utils;
