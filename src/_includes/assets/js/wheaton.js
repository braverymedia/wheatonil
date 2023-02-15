// a11y Accordions
window.addEventListener('DOMContentLoaded', (event) => {
	const accordionContainer = document.querySelector("[data-accordion]");
	const mobileMenuContainer = document.querySelector("[data-mobilemenu]");
	const menuPanels = mobileMenuContainer.querySelectorAll(".accordion-panel");
	const collapsibles = document.querySelectorAll("[data-collapsible]");
	const showOverlay = document.querySelector(".menu-more");
	const showSearch = document.querySelector("button.search");
	const hideOverlay = document.querySelector(".close-menu");
	const overlay = document.querySelector("[data-feature='nav']");
	const sectionNavToggle = document.querySelector('.bm--jump-menu > button');

	document.body.classList.add('has-js');

	const accordionClick = (event) => {
		const target = event.target;
		if (target instanceof HTMLButtonElement) {
			const panel = target.parentNode.nextElementSibling;
			const isExpanded = target.getAttribute("aria-expanded") === "true";

			target.setAttribute("aria-expanded", `${!isExpanded}`);

			if (isExpanded) {
				panel.setAttribute("hidden", "");
				panel.classList.remove("visible");
			} else {
				panel.removeAttribute("hidden");
				panel.classList.add("visible");
			}
		}
	};
	const hoverShow = (event) => {
		const target = event.target;
		const panel = target.parentNode.nextElementSibling;

		if ( target instanceof HTMLButtonElement ) {
			target.setAttribute("aria-expanded", "true");
			panel.classList.add("visible");
			menuPanels.forEach((mpanel) => {
				let labeled = mpanel.getAttribute("id");
				if (labeled !== target.getAttribute("aria-controls")) {
					mpanel.classList.remove("visible");
					document
						.querySelector(`[aria-controls="${labeled}"]`)
						.setAttribute("aria-expanded", "false");
				}
			});
		}
	}

	const openOverlay = () => {
		if ( showOverlay.getAttribute('aria-expanded') === "false") {
			showOverlay.setAttribute('aria-expanded', "true");
			overlay.dataset.state = "visible";
		}
	}

	const closeOverlay = () => {
		showOverlay.setAttribute('aria-expanded', "false");
		overlay.dataset.state = "hidden";
	}

	const openSearch = () => {
		openOverlay();
		document.getElementById("site-search").focus({ focusVisible: true });
	}

	const mobileSectionNav = (event) => {
		const target = event.target;

		if (target instanceof HTMLButtonElement) {
			const nav = target.nextElementSibling;
			const isExpanded = target.getAttribute("aria-expanded") === "true";

			target.setAttribute("aria-expanded", `${!isExpanded}`);

			if (isExpanded) {
				nav.setAttribute("hidden", "");
				nav.classList.remove("visible");
			} else {
				nav.removeAttribute("hidden");
				nav.classList.add("visible");
			}
		}
	}

	showOverlay?.addEventListener("click", openOverlay);
	showSearch?.addEventListener("click", openSearch);
	hideOverlay?.addEventListener("click", closeOverlay);

	accordionContainer?.addEventListener("click", accordionClick);
	mobileMenuContainer?.addEventListener("click", accordionClick);
	mobileMenuContainer?.addEventListener("mouseover", hoverShow);

	// Section nav toggle
	sectionNavToggle?.addEventListener('click', mobileSectionNav);


	for (let i = 0; i < collapsibles.length; i++) {
		let collapsible = collapsibles[i];
		collapsible.addEventListener("click", accordionClick);
	}

});