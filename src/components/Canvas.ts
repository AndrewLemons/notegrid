import "./Canvas.scss";
import {
	parsePathString,
	simplifyPath,
	stringifyPath,
} from "../utilities/path";

class NGCanvasComponent extends HTMLElement {
	private currentPath?: SVGPathElement;

	constructor() {
		super();
		this.currentPath = undefined;
	}

	connectedCallback() {
		this.innerHTML = `
			<svg></svg>
		`;

		const svg = this.querySelector("svg");
		if (!svg) {
			return;
		}

		svg.addEventListener("mousedown", this.startDraw.bind(this));
		svg.addEventListener("mousemove", this.mouseMove.bind(this));
		svg.addEventListener("mouseup", this.stopDraw.bind(this));
		svg.addEventListener("mouseleave", this.stopDraw.bind(this));

		console.log("ng-canvas connected");
	}

	disconnectedCallback() {
		console.log("ng-canvas disconnected");
	}

	private startDraw(event) {
		// Create a new path element
		const currentPath = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"path",
		);
		currentPath.setAttribute("fill", "none");
		currentPath.setAttribute("stroke", "black");
		currentPath.setAttribute("stroke-width", "4pt");
		currentPath.setAttribute("stroke-linecap", "round");
		currentPath.setAttribute("stroke-linejoin", "round");
		currentPath.setAttribute("d", `M${event.offsetX} ${event.offsetY}`);
		this.currentPath = currentPath;
		const svg = this.querySelector("svg");
		if (!svg) {
			return;
		}
		svg.appendChild(currentPath);
	}

	private stopDraw(event) {
		if (!this.currentPath) {
			return;
		}
		// Parse and simplify the current line
		const d = this.currentPath.getAttribute("d");
		if (!d) {
			return;
		}
		const path = parsePathString(d);
		const simplifiedPath = simplifyPath(path, 2);
		this.currentPath.setAttribute("d", stringifyPath(simplifiedPath));

		this.currentPath = undefined;
	}

	private mouseMove(event) {
		if (!this.currentPath) {
			return;
		}
		const d = this.currentPath.getAttribute("d");
		if (!d) {
			return;
		}
		this.currentPath.setAttribute(
			"d",
			`${d} L${event.offsetX} ${event.offsetY}`,
		);
	}
}

customElements.define("ng-canvas", NGCanvasComponent);
