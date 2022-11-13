// a11y Accordions
window.addEventListener('DOMContentLoaded', (event) => {
const accordionContainer = document.querySelector("[data-accordion]");
const collapsibles = document.querySelectorAll("[data-collapsible]");

const accordionClick = (event) => {
	const target = event.target;
	if (target instanceof HTMLButtonElement) {
		const panel = target.parentNode.nextElementSibling;
		const isExpanded = target.getAttribute("aria-expanded") === "true";

		target.setAttribute("aria-expanded", `${!isExpanded}`);

		if (isExpanded) {
			panel.setAttribute("hidden", "");
			panel.parentElement.classList.remove("visible");
		} else {
			panel.removeAttribute("hidden");
			panel.parentElement.classList.add("visible");
		}
	}
};

accordionContainer?.addEventListener("click", accordionClick);
for (let i = 0; i < collapsibles.length; i++) {
	let collapsible = collapsibles[i];
	collapsible.addEventListener("click", accordionClick);
}

});