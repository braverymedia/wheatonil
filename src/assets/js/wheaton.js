import A11yDialog from "a11y-dialog";
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
		// nextButton.removeAttribute("disabled");

		const closestItem = getClosestItem();

		let distanceToScroll;
		const rect = closestItem.getBoundingClientRect();

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
		// prevButton.removeAttribute("disabled");

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

// video embed from url
const embedVideo = (url) => {
	let embedUrl, videoId;

	// Check if the URL is from YouTube
	if (url.includes("youtube.com")) {
		videoId = url.split("v=")[1];
		const ampersandPosition = videoId.indexOf("&");
		if (ampersandPosition !== -1) {
			videoId = videoId.substring(0, ampersandPosition);
		}
		embedUrl = `https://www.youtube.com/embed/${videoId}`;
	}
	// Check if the URL is from Vimeo
	else if (url.includes("vimeo.com")) {
		videoId = url.split(".com/")[1];
		embedUrl = `https://player.vimeo.com/video/${videoId}`;
	}
	// If the URL is neither from YouTube nor Vimeo, return null
	else {
		return null;
	}

	// Create an iframe for the video embed
	const iframe = document.createElement("iframe");
	iframe.src = embedUrl;
	iframe.width = "640";
	iframe.height = "390";
	iframe.allow = "autoplay";

	// Return iframe to the body of the document
	return iframe;
};

const filterFacultyItems = () => {
	// Get DOM elements
	const nameFilter = document.getElementById("nameFilter");
	const filterMenu = document.getElementById("departmentFilterMenu");
	const filterButton = document.getElementById("departmentFilterButton");
	const filterableContainer = document.querySelector("[data-filterable]");

	// Guard against missing elements
	if (!nameFilter || !filterMenu || !filterButton || !filterableContainer) {
		console.warn("Faculty filter: Required elements not found");
		return;
	}

	const filterableItems =
		filterableContainer.querySelectorAll(".bm-card--faculty");

	if (!filterableItems.length) {
		console.warn("Faculty filter: No filterable items found");
		return;
	}

	// Create an indexed data structure for faster lookups
	const facultyIndex = new Map();
	const departmentIndex = new Map();
	const departmentSet = new Set();

	// Initialize indexes
	const initializeIndexes = () => {
		filterableItems.forEach((item) => {
			const name = item.getAttribute("data-name")?.toLowerCase() || "";
			const departmentStr = item.getAttribute("data-department");

			// Only process departments if the attribute exists and has content
			const departments = departmentStr
				? departmentStr
						.split("|")
						.map((dep) => dep.trim())
						.filter((dep) => dep && dep.length > 0) // Filter out empty strings
				: [];

			// Index by name and departments
			facultyIndex.set(item, {
				element: item,
				name,
				departments: new Set(departments),
			});

			// Build department index and set
			departments.forEach((dept) => {
				if (dept) {
					// Additional check to ensure department is not empty
					departmentSet.add(dept);
					if (!departmentIndex.has(dept)) {
						departmentIndex.set(dept, new Set());
					}
					departmentIndex.get(dept).add(item);
				}
			});
		});
	};

	// Debounce function
	const debounce = (func, wait) => {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	};

	// Function to populate department filters
	const populateDepartmentFilters = () => {
		// Filter out any empty departments and sort
		const departments = Array.from(departmentSet)
			.filter((dept) => dept && dept.trim().length > 0)
			.sort((a, b) => a.localeCompare(b));

		const fragment = document.createDocumentFragment();

		departments.forEach((department) => {
			const menuItem = document.createElement("li");
			const label = document.createElement("label");
			const checkbox = document.createElement("input");
			const labelText = document.createElement("span");

			checkbox.type = "checkbox";
			checkbox.value = department;
			checkbox.setAttribute("data-department", "");
			checkbox.id = `department-${department
				.toLowerCase()
				.replace(/\s+/g, "-")}`;

			labelText.textContent = department;
			labelText.id = `label-${department
				.toLowerCase()
				.replace(/\s+/g, "-")}`;

			label.appendChild(checkbox);
			label.appendChild(labelText);
			menuItem.appendChild(label);
			fragment.appendChild(menuItem);
		});

		filterMenu.innerHTML = "";
		filterMenu.appendChild(fragment);
	};

	// Toggle menu visibility
	const toggleMenu = () => {
		const isExpanded =
			filterButton.getAttribute("aria-expanded") === "true";
		filterButton.setAttribute("aria-expanded", !isExpanded);
		filterMenu.hidden = isExpanded;
	};

	// Close menu when clicking outside
	const handleClickOutside = (event) => {
		if (
			!filterMenu.contains(event.target) &&
			!filterButton.contains(event.target)
		) {
			filterButton.setAttribute("aria-expanded", "false");
			filterMenu.hidden = true;
		}
	};

	// Handle keyboard navigation
	const handleKeydown = (event) => {
		if (event.key === "Escape") {
			filterButton.setAttribute("aria-expanded", "false");
			filterMenu.hidden = true;
			filterButton.focus();
		}
	};

	// Filter items when input changes
	const filterItems = debounce(() => {
		const nameValue = nameFilter.value.toLowerCase();
		const selectedDepartments = new Set(
			Array.from(
				filterMenu.querySelectorAll('input[type="checkbox"]:checked')
			).map((checkbox) => checkbox.value)
		);

		// Use requestAnimationFrame for smooth DOM updates
		requestAnimationFrame(() => {
			filterableItems.forEach((item) => {
				const itemData = facultyIndex.get(item);
				const nameMatch =
					!nameValue || itemData.name.includes(nameValue);
				const deptMatch =
					!selectedDepartments.size ||
					Array.from(selectedDepartments).some((dept) =>
						itemData.departments.has(dept)
					);

				// Batch DOM updates by only changing if needed
				const shouldShow = nameMatch && deptMatch;
				const isCurrentlyShown = item.style.display !== "none";

				if (shouldShow !== isCurrentlyShown) {
					item.style.display = shouldShow ? "" : "none";
				}
			});
		});
	}, 150);

	// Initialize
	initializeIndexes();
	populateDepartmentFilters();

	// Initialize event listeners
	filterButton.addEventListener("click", toggleMenu);
	document.addEventListener("click", handleClickOutside);
	filterMenu.addEventListener("keydown", handleKeydown);
	nameFilter.addEventListener("input", filterItems);
	filterMenu.addEventListener("change", filterItems);
};

window.addEventListener("DOMContentLoaded", (event) => {
	// Initialize faculty filters
	filterFacultyItems();

	const accordionContainer = document.querySelector("[data-accordion]");
	const mobileMenuContainer = document.querySelector("[data-mobilemenu]");
	const menuPanels = mobileMenuContainer.querySelectorAll(".accordion-panel");
	const collapsibles = document.querySelectorAll("[data-collapsible]");
	const sectionNav = document.querySelector("[data-sectionnav]");
	const showOverlay = document.querySelector(".menu-more");
	const showSearch = document.querySelector("button.search");
	const hideOverlay = document.querySelector(".close-menu");
	const overlay = document.querySelector("[data-feature='nav']");
	const jumpNavs = document.querySelectorAll("[data-jumpnav]");

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
		if (showOverlay && showOverlay.getAttribute("aria-expanded") === "false") {
			// Set expanded state
			showOverlay.setAttribute("aria-expanded", "true");
			
			// Reset animations by temporarily removing the visible state
			if (overlay) {
				overlay.dataset.state = "opening";
				
				// Force reflow to ensure the state is applied before adding visible state
				void overlay.offsetHeight;
				
				// Set the visible state to trigger animations
				overlay.dataset.state = "visible";
			}
		}
	};

	const closeOverlay = () => {
		if (showOverlay) {
			showOverlay.setAttribute("aria-expanded", "false");
		}
		if (overlay) {
			overlay.dataset.state = "hidden";
		}
	};

	const openSearch = () => {
		openOverlay();
		document.getElementById("site-search").focus({ focusVisible: true });
	};

	// Handle hover on desktop
	const handleHoverIn = (event) => {
		if (window.innerWidth >= 1024) {
			const header = event.currentTarget;
			const button = header.querySelector('.nav-menu--toggle');
			const panel = button ? document.getElementById(button.getAttribute('aria-controls')) : null;
			
			if (panel) {
				panel.classList.add('visible');
				header.classList.add('is-expanded');
				button.setAttribute('aria-expanded', 'true');
			}
		}
	};

	// Handle hover out on desktop
	const handleHoverOut = (event) => {
		if (window.innerWidth >= 1024) {
			const header = event.currentTarget;
			const button = header.querySelector('.nav-menu--toggle');
			const panel = button ? document.getElementById(button.getAttribute('aria-controls')) : null;
			
			if (panel) {
				panel.classList.remove('visible');
				header.classList.remove('is-expanded');
				button.setAttribute('aria-expanded', 'false');
			}
		}
	};

	// Handle mobile touch interactions
	const handleMobileClick = (event) => {
		event.stopPropagation();
		const target = event.target;

		// Handle button clicks (toggle panel)
		if (target.classList.contains('nav-menu--toggle')) {
			event.preventDefault();
			const header = target.closest('.nav-menu--header');
			const panel = document.getElementById(target.getAttribute('aria-controls'));
			const isExpanded = target.getAttribute("aria-expanded") === "true";

			target.setAttribute("aria-expanded", `${!isExpanded}`);

			if (isExpanded) {
				header?.classList.remove('is-expanded');
				panel.classList.remove("visible");
			} else {
				header?.classList.add('is-expanded');
				panel.classList.add("visible");
			}
		} 
		// Handle link clicks inside header
		else if (target.closest('.nav-menu--header')) {
			const header = target.closest('.nav-menu--header');
			const link = header.querySelector('.nav-menu--link');
			const button = header.querySelector('.nav-menu--toggle');
			const panel = button ? document.getElementById(button.getAttribute('aria-controls')) : null;

			// On mobile, if clicking the link and panel is closed, prevent default and open panel
			if (window.innerWidth < 1024 && target === link && panel && button.getAttribute('aria-expanded') === 'false') {
				event.preventDefault();
				button.setAttribute('aria-expanded', 'true');
				header.classList.add('is-expanded');
				panel.classList.add('visible');
			}
			// On desktop or if panel is already open, let the default link behavior happen
		}
	};

	// Main function to handle both hover and click events
	const mobileSectionNav = (event) => {
		if (window.innerWidth >= 1024) {
			// On desktop, handle hover events
			if (event.type === 'mouseenter') {
				handleHoverIn(event);
			} else if (event.type === 'mouseleave') {
				handleHoverOut(event);
			}
		} else {
			// On mobile, handle click events
			handleMobileClick(event);
		}
	};

	// Initialize event listeners for navigation headers
	const navHeaders = document.querySelectorAll('.nav-menu--header');
	navHeaders.forEach(header => {
		header.addEventListener('mouseenter', mobileSectionNav);
		header.addEventListener('mouseleave', mobileSectionNav);
		header.addEventListener('click', mobileSectionNav);
	});
	// Close jump menu on mobile when link is clicked
	const mobileJumpNavigation = (event) => {
		const target = event.target;

		if (target instanceof HTMLAnchorElement) {
			const button = target.closest("nav").querySelector("button");
			const nav = button?.nextElementSibling;
			const isExpanded = button?.getAttribute("aria-expanded") === "true";
			console.log(button);
			if (button) {
				button.setAttribute("aria-expanded", `${!isExpanded}`);
			}

			if (nav) {
				if (isExpanded) {
					nav.classList.remove("visible");
				} else {
					nav.classList.add("visible");
				}
			}
		}
	};

	showOverlay?.addEventListener("click", openOverlay);
	showSearch?.addEventListener("click", openSearch);
	hideOverlay?.addEventListener("click", closeOverlay);

	// Add hover behavior for desktop
	accordionContainer?.addEventListener("mouseover", hoverShow);

	// Handle mobile navigation - add click handler to headers
	document.querySelectorAll(".nav-menu--header").forEach((header) => {
		header.addEventListener("click", mobileSectionNav);
	});

	// Handle toggle button clicks separately
	document.querySelectorAll(".nav-menu--toggle").forEach((button) => {
		button.addEventListener("click", mobileSectionNav);
	});

	// Handle jump navigation
	document.querySelectorAll(".bm--menu-jump button").forEach((button) => {
		button.addEventListener("click", mobileJumpNavigation);
	});

	// Section nav toggle
	sectionNav?.addEventListener("click", mobileSectionNav);

	// Jump nav toggles - only add click handlers to the buttons
	for (let i = 0; i < jumpNavs.length; i++) {
		let jumpNav = jumpNavs[i];
		const button = jumpNav.querySelector('button');
		if (button) {
			button.addEventListener("click", mobileJumpNavigation);
		}
	}

	// Collapsibles toggle
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

	/**
	 * Media Modal
	 */
	const a11ymodal = document.getElementById("bm-modal-dialog");
	const dialog = new A11yDialog(a11ymodal);
	const mediaTriggers = document.querySelectorAll("[data-bm-modal]");
	const modalContentContainer = document.querySelector(".bm--modal-content");

	function embedVideo(url) {
		const videoId = url.includes('youtu')
			? url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)[1]
			: url.match(/vimeo\.com\/(?:.*\/)?([0-9]+)/)[1];

		const iframe = document.createElement('iframe');
		iframe.className = 'bm--modal-media';
		// Set width to 100% to allow responsive scaling while maintaining 16:9 aspect ratio
		iframe.style.width = '100%';
		iframe.style.aspectRatio = '16 / 9';
		iframe.style.height = 'auto';
		if (url.includes('youtu')) {
			iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
		} else {
			iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
		}

		iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
		iframe.allowFullscreen = true;
		return iframe;
	}

	function embedImage(url, trigger) {
		// Find the parent figure element
		const sourceFigure = trigger.closest('figure');
		if (!sourceFigure) {
			// Fallback to simple image if no figure found
			const img = document.createElement('img');
			img.className = 'bm--modal-media';
			img.src = url;
			img.alt = trigger.getAttribute('data-alt') || '';
			return img;
		}

		// Create a new figure for the modal
		const figure = document.createElement('figure');
		figure.className = 'bm--modal-media';

		// Get the source image, excluding the button
		const sourceImg = sourceFigure.querySelector('img:not(.bm--modal-trigger)');
		if (sourceImg) {
			const img = document.createElement('img');
			img.src = url;
			img.alt = trigger.getAttribute('data-alt') || sourceImg.alt;
			// Copy any relevant attributes from source image
			['loading', 'decoding'].forEach(attr => {
				if (sourceImg.hasAttribute(attr)) {
					img.setAttribute(attr, sourceImg.getAttribute(attr));
				}
			});
			figure.appendChild(img);
		}

		// Clone the figcaption if it exists
		const sourceCaption = sourceFigure.querySelector('figcaption');
		if (sourceCaption) {
			const figcaption = sourceCaption.cloneNode(true);
			figure.appendChild(figcaption);
		}

		return figure;
	}

	mediaTriggers.forEach((trigger) => {
		trigger.addEventListener("click", (e) => {
			e.preventDefault(); // Prevent default for links

			// Get the media URL either from href (for links) or data-src (for buttons)
			let url = trigger.tagName.toLowerCase() === 'a'
				? trigger.getAttribute("href")
				: trigger.getAttribute("data-src");

			if (!url) {
				console.warn('No media URL provided for modal trigger');
				return;
			}

			let mediaType = trigger.getAttribute("data-media-type") || "video";
			let embedMarkup = mediaType === "image" ? embedImage(url, trigger) : embedVideo(url);
			modalContentContainer.appendChild(embedMarkup);
			dialog.show();
		});
	});

	// Clear contents on hide
	dialog
		.on("show", () => (document.documentElement.style.overflowY = "hidden"))
		.on("hide", function (event) {
			document.documentElement.style.overflowY = "";
			const container = event.target;
			const mediaElement = container.querySelector('.bm--modal-media');
			if (mediaElement) {
				mediaElement.remove();
			}
		});
});
