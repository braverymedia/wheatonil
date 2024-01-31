// AI Try
document.addEventListener("DOMContentLoaded", () => {
	const repMapItem = document.querySelectorAll(".rep__map__item");
	const repNavSelect = document.querySelector(".rep__select");
	const filterReps = (filterText) => {
		Array.from(
			document.querySelector(".filterable-group").children
		).forEach((item) => {
			const itemFilterStr = item.getAttribute("data-region");
			if (!itemFilterStr) return;

			const itemFilter = itemFilterStr
				.split(/,/)
				.map((i) => i.trim());

			if (itemFilter && itemFilter.indexOf(filterText) >= 0) {
				item.setAttribute("aria-hidden", "false");
			} else {
				item.setAttribute("aria-hidden", "true");
			}
		});
	};

	repNavSelect.addEventListener("change", () => {
		const selectVal = repNavSelect.value;
		filterReps(selectVal);

		Array.from(repMapItem).forEach((item) => {
			const itemNode = item;
			if (itemNode.id == selectVal) {
				itemNode.classList.add("selected");
			} else {
				itemNode.classList.remove("selected");
			}
		});
	});

	repMapItem.forEach((item) => {
		item.addEventListener("click", () => {
			const clickVal = item.id;
			filterReps(clickVal);
			repNavSelect.value = clickVal;
			repNavSelect.dispatchEvent(new Event("change"));
		});
	});
});