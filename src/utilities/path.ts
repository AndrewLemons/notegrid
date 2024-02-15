/**
 * Parse an SVG path into an array of points.
 * @param d - The SVG path string.
 * @returns An array of points.
 */
export function parsePathString(d: string): Point[] {
	const commands = d.match(/[A-Za-z][^A-Za-z]*/g);
	if (!commands) {
		return [];
	}
	const path: Point[] = [];
	for (let i = 0; i < commands.length; i++) {
		const command = commands[i];
		const type = command[0];
		const args = command
			.slice(1)
			.trim()
			.split(/\s*,\s*|\s+/)
			.map(parseFloat);
		path.push({ x: args[0], y: args[1] });
	}
	return path;
}

/**
 * Simplify an array of points by removing points that are too close to each other.
 * @param points - An array of points.
 * @param tolerance - The minimum distance between points.
 * @returns The simplified array of points.
 */
export function simplifyPath(points: Point[], tolerance: number = 1): Point[] {
	let initialLength = points.length;
	const simplifiedPath: Point[] = [];
	let prev: Point | null = null;
	for (let i = 0; i < points.length; i++) {
		const point = points[i];
		const x = point.x;
		const y = point.y;
		if (prev === null || Math.hypot(x - prev.x, y - prev.y) > tolerance) {
			simplifiedPath.push(point);
			prev = point;
		}
	}

	let finalLength = simplifiedPath.length;
	console.log(
		`Simplified path from ${initialLength} to ${finalLength} points (${((1 - finalLength / initialLength) * 100).toFixed(2)}%)`,
	);

	return simplifiedPath;
}

/**
 * Convert an array of points to a string path.
 * @param points - An array of points.
 * @returns A string path in SVG format.
 */
export function stringifyPath(points: Point[]): string {
	return "M" + points.map((point) => `${point.x} ${point.y}`).join(" L");
}

export interface Point {
	x: number;
	y: number;
}
