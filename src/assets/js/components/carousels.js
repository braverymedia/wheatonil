import domReady from "@wordpress/dom-ready";

let carousels = {};

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
		console.log('none');
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

domReady(() => {
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
