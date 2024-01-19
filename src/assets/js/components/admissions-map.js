// AI Try
document.addEventListener("DOMContentLoaded", () => {
	const filterReps = (filterText) => {
		document.querySelector(".rep__result").innerHTML = "";

		const showRep = Array.from(
			document.querySelector(".rep-profile__group").children
		)
			.filter((item) => {
				const itemFilterStr = item.getAttribute("data-region");
				if (!itemFilterStr) return false;

				const itemFilter = itemFilterStr
					.split(/,/)
					.map((i) => i.trim());

				return itemFilter && itemFilter.indexOf(filterText) >= 0;
			})
			.map((item) => item.cloneNode(true));

		showRep.forEach((item) => {
			document.querySelector(".rep__result").appendChild(item);
		});
	};

	const repNavSelect = document.querySelector(".rep__select");
	repNavSelect.addEventListener("change", () => {
		const selectVal = repNavSelect.value;
		filterReps(selectVal);
		repMapItem.classList.remove("selected");

		Array.from(repMapItem).forEach((item) => {
			const itemNode = item;
			if (itemNode.id == selectVal) {
				itemNode.classList.add("selected");
			}
		});
	});

	const repMapItem = document.querySelectorAll(".rep__map__item");
	repMapItem.forEach((item) => {
		item.addEventListener("click", () => {
			const clickVal = item.id;
			filterReps(clickVal);
			repNavSelect.value = clickVal;
			repNavSelect.dispatchEvent(new Event("change"));
		});
	});
});