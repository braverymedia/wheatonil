import "a11y-dialog";
let carousels = {};
let marquees = {};

const initResizing = () => {
	const resizeCarousels = () => {
		for (const carousel of carousels) {
			carousel.items.style.width = "";
			carousel.items.style.flexShrink = 1;
			carousel.items.style.setProperty("--offset", "0 !important");
		}

		for (const carousel of carousels) {
			resizeCarousel(carousel);
		}
	};

	resizeCarousels();
	window.addEventListener("resize", () => {
		resizeCarousels();
	});
};

const resizeCarousel = (carousel) => {
	const shouldExpand =
		carousel.element.getAttribute("data-bravery-carousel-breakout") ===
		"expand";
	const computedStyles = getComputedStyle(carousel.items);
	const gap = computedStyles.getPropertyValue("--gap") || "0px";
	const columns = computedStyles.getPropertyValue("--columns");

	if (!columns) {
		return;
	}

	const containerWidth = carousel.items.offsetWidth;
	const containerOffsetToRightOfScreen = Math.round(
		window.innerWidth - carousel.items.getBoundingClientRect().right
	);

	const newContainerWidth = containerWidth + containerOffsetToRightOfScreen;
	const relativeContainerWidth = shouldExpand
		? 100
		: (containerWidth / newContainerWidth) * 100;

	carousel.items.style.setProperty(
		"--width",
		`calc((${relativeContainerWidth}% - (${gap} * ${columns} - ${gap})) / ${columns})`
	);

	carousel.items.style.setProperty(
		"--offset",
		shouldExpand ? 0 : `${containerOffsetToRightOfScreen}px`
	);

	carousel.items.style.width = `${newContainerWidth}px`;
	carousel.items.style.flexShrink = 0;
};

const initCarousel = (carousel) => {
	const items = carousel.element.querySelector(
		"[data-bravery-carousel-items]"
	);
	const controls = carousel.element.querySelector(
		"[data-bravery-carousel-controls]"
	);
	const prevButton = carousel.element.querySelector(
		"[data-bravery-carousel-prev]"
	);
	const nextButton = carousel.element.querySelector(
		"[data-bravery-carousel-next]"
	);

	carousels = carousels.map((carouselObject) => {
		if (carousel.id === carouselObject.id) {
			return {
				...carousel,
				items,
				prevButton,
				nextButton,
			};
		}

		return carouselObject;
	});

	if (!controls) {
		return;
	}

	const getClosestItem = () => {
		const children = items.children;

		const parentRect = items.getBoundingClientRect();
		const parentX = parentRect.x;

		const closestItem = [...children].reduce(
			(closest, child) => {
				const rect = child.getBoundingClientRect();
				const x = rect.x;

				if (!closest.child) {
					return { x, child };
				}

				if (Math.abs(x - parentX) < Math.abs(closest.x - parentX)) {
					return { x, child };
				}

				return closest;
			},
			{ x: 0, child: null }
		);

		return closestItem.child;
	};

	prevButton.addEventListener("click", () => {
		nextButton.removeAttribute("disabled");

		const closestItem = getClosestItem();

		let distanceToScroll;
		const rect = closestItem.getBoundingClientRect();

		if (rect.x < 0) {
			distanceToScroll = Math.abs(rect.x);
		}

		if (!distanceToScroll) {
			let prevItem = closestItem.previousElementSibling;

			if (!prevItem) {
				prevItem = items.firstElementChild;
			}

			distanceToScroll = prevItem.offsetWidth;
		}

		items.scrollTo({
			left: items.scrollLeft - distanceToScroll,
			behavior: "smooth",
		});
	});

	nextButton.addEventListener("click", () => {
		prevButton.removeAttribute("disabled");

		const closestItem = getClosestItem();

		items.scrollTo({
			left: items.scrollLeft + closestItem.offsetWidth,
			behavior: "smooth",
		});
	});

	items.addEventListener("scroll", () => {
		const itemsScrollWidth = items.scrollWidth;
		const itemsOuterWidth = items.clientWidth;

		prevButton.removeAttribute("disabled");
		nextButton.removeAttribute("disabled");

		if (items.scrollLeft <= 0) {
			prevButton.setAttribute("disabled", "");
		}

		if (Math.ceil(items.scrollLeft) >= itemsScrollWidth - itemsOuterWidth) {
			nextButton.setAttribute("disabled", "");
		}
	});
};

const initMarquee = (marquee) => {
	const items = marquee.element.querySelectorAll("picture");
	let images = [...items];
	const half = Math.ceil(images.length / 2);
	const firstHalf = images.slice(0, half);
	const secondHalf = images.slice(half);

	// Prep Group 1
	const column = marquee.element.querySelector(".bm-gallery-col");
	let group = document.createElement("div");
	group.className = "bm-marquee--group";

	const group1 = group.cloneNode(true);
	group1.append(...firstHalf);
	const group1Copy = group1.cloneNode(true);
	const group2 = group.cloneNode(true);
	group2.append(...secondHalf);
	const group2Copy = group2.cloneNode(true);

	group1Copy.setAttribute("aria-hidden", true);
	group2Copy.setAttribute("aria-hidden", true);

	let reversed = document.createElement("section");
	reversed.className = "bm-gallery-col bm-marquee";
	reversed.setAttribute("data-direction", "reverse");

	// Build it
	column.innerHTML = "";
	column.append(group1, group1Copy);
	reversed.append(group2, group2Copy);
	marquee.element.append(reversed);
};
window.addEventListener("DOMContentLoaded", (event) => {
	const accordionContainer = document.querySelector("[data-accordion]");
	const mobileMenuContainer = document.querySelector("[data-mobilemenu]");
	const menuPanels = mobileMenuContainer.querySelectorAll(".accordion-panel");
	const collapsibles = document.querySelectorAll("[data-collapsible]");
	const sectionNav = document.querySelector("[data-sectionnav]");
	const showOverlay = document.querySelector(".menu-more");
	const showSearch = document.querySelector("button.search");
	const hideOverlay = document.querySelector(".close-menu");
	const overlay = document.querySelector("[data-feature='nav']");
	const jumpMenu = document.querySelector(".bm--jump-menu > button");

	document.body.classList.add("has-js");

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

		if (target instanceof HTMLButtonElement) {
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
	};

	const openOverlay = () => {
		if (showOverlay.getAttribute("aria-expanded") === "false") {
			showOverlay.setAttribute("aria-expanded", "true");
			overlay.dataset.state = "visible";
		}
	};

	const closeOverlay = () => {
		showOverlay.setAttribute("aria-expanded", "false");
		overlay.dataset.state = "hidden";
	};

	const openSearch = () => {
		openOverlay();
		document.getElementById("site-search").focus({ focusVisible: true });
	};

	const mobileSectionNav = (event) => {
		const target = event.target;

		if (target instanceof HTMLButtonElement) {
			const nav = target.nextElementSibling;
			const isExpanded = target.getAttribute("aria-expanded") === "true";

			target.setAttribute("aria-expanded", `${!isExpanded}`);

			if (isExpanded) {
				nav.classList.remove("visible");
			} else {
				nav.classList.add("visible");
			}
		}
	};

	showOverlay?.addEventListener("click", openOverlay);
	showSearch?.addEventListener("click", openSearch);
	hideOverlay?.addEventListener("click", closeOverlay);

	accordionContainer?.addEventListener("click", accordionClick);
	mobileMenuContainer?.addEventListener("click", accordionClick);
	mobileMenuContainer?.addEventListener("mouseover", hoverShow);

	jumpMenu?.addEventListener("click", toggleMobileJumpMenu);

	// Section nav toggle
	sectionNav?.addEventListener("click", mobileSectionNav);

	for (let i = 0; i < collapsibles.length; i++) {
		let collapsible = collapsibles[i];
		collapsible.addEventListener("click", accordionClick);
	}
	// Marquee
	marquees = [...document.querySelectorAll(".bm-gallery--marquee")].map(
		(element, index) => ({
			id: index + 1,
			element,
		})
	);

	for (const marquee of marquees) {
		initMarquee(marquee);
	}

	// Carousel
	carousels = [...document.querySelectorAll("[data-bravery-carousel]")].map(
		(element, index) => ({
			id: index + 1,
			element,
		})
	);

	for (const carousel of carousels) {
		initCarousel(carousel);
	}

	initResizing();

	for (const carousel of carousels) {
		carousel.element.setAttribute("data-bravery-carousel-init", "");
	}
});

// video embed from url
const embedVideo = (url) => {
	let video_id_regExp =
			/^.*((youtu.be\/|vimeo.com\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
		match = url.match(video_id_regExp),
		video_id;

	if (match && match[7]) {
		//valid
		video_id = match[7];
	} else {
		//invalid
		alert("Invalid Video URL");
	}
}