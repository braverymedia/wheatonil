// const oembed = require("oembed");

// a11y Accordions
const accordionContainer = document.querySelector("[data-accordion]");

const accordionClick = (event) => {
	const target = event.target;
	if (target instanceof HTMLButtonElement) {
		const panel = target.parentNode.nextElementSibling;
		const isExpanded = target.getAttribute("aria-expanded") === "true";

		target.setAttribute("aria-expanded", `${!isExpanded}`);

		if (isExpanded) {
			panel.setAttribute("hidden", "");
		} else {
			panel.removeAttribute("hidden");
		}
	}
};

accordionContainer?.addEventListener("click", accordionClick);

