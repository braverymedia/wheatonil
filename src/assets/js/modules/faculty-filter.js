(function(wheaton) {
    'use strict';

    let nameFilter, filterMenu, filterButton, filterableContainer, facultyIndex, departmentIndex, departmentSet;

    /**
     * Initialize the faculty index data structure
     */
    function initializeIndexes() {
        const filterableItems = filterableContainer.querySelectorAll('.bm-card--faculty');
        
        facultyIndex = new Map();
        departmentIndex = new Map();
        departmentSet = new Set();

        filterableItems.forEach((item) => {
            const name = item.getAttribute('data-name')?.toLowerCase() || '';
            const departmentStr = item.getAttribute('data-department');

            // Only process departments if the attribute exists and has content
            const departments = departmentStr
                ? departmentStr
                      .split('|')
                      .map((dep) => dep.trim())
                      .filter((dep) => dep && dep.length > 0)
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
                    departmentSet.add(dept);
                    if (!departmentIndex.has(dept)) {
                        departmentIndex.set(dept, new Set());
                    }
                    departmentIndex.get(dept).add(item);
                }
            });
        });
    }

    /**
     * Populate the department filter dropdown
     */
    function populateDepartmentFilters() {
        // Filter out any empty departments and sort
        const departments = Array.from(departmentSet)
            .filter((dept) => dept && dept.trim().length > 0)
            .sort((a, b) => a.localeCompare(b));

        const fragment = document.createDocumentFragment();

        departments.forEach((department) => {
            const menuItem = document.createElement('li');
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            const labelText = document.createElement('span');

            checkbox.type = 'checkbox';
            checkbox.value = department;
            checkbox.setAttribute('data-department', '');
            checkbox.id = `department-${department
                .toLowerCase()
                .replace(/\s+/g, '-')}`;

            labelText.textContent = department;
            labelText.id = `label-${department
                .toLowerCase()
                .replace(/\s+/g, '-')}`;

            label.appendChild(checkbox);
            label.appendChild(labelText);
            menuItem.appendChild(label);
            fragment.appendChild(menuItem);
        });

        filterMenu.innerHTML = '';
        filterMenu.appendChild(fragment);
    }

    /**
     * Toggle the filter menu
     */
    function toggleMenu() {
        const isExpanded = filterButton.getAttribute('aria-expanded') === 'true';
        filterButton.setAttribute('aria-expanded', !isExpanded);
        filterMenu.hidden = isExpanded;
    }

    /**
     * Handle clicks outside the filter menu
     * @param {Event} event - The click event
     */
    function handleClickOutside(event) {
        if (
            !filterMenu.contains(event.target) &&
            !filterButton.contains(event.target)
        ) {
            filterButton.setAttribute('aria-expanded', 'false');
            filterMenu.hidden = true;
        }
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} event - The keydown event
     */
    function handleKeydown(event) {
        if (event.key === 'Escape') {
            filterButton.setAttribute('aria-expanded', 'false');
            filterMenu.hidden = true;
            filterButton.focus();
        }
    }

    /**
     * Filter items based on name and department
     */
    const filterItems = wheaton.utils.debounce(() => {
        const nameValue = nameFilter.value.toLowerCase();
        const selectedDepartments = new Set(
            Array.from(
                filterMenu.querySelectorAll('input[type="checkbox"]:checked')
            ).map((checkbox) => checkbox.value)
        );

        // Use requestAnimationFrame for smooth DOM updates
        requestAnimationFrame(() => {
            facultyIndex.forEach((itemData, item) => {
                const nameMatch = !nameValue || itemData.name.includes(nameValue);
                const deptMatch =
                    !selectedDepartments.size ||
                    Array.from(selectedDepartments).some((dept) =>
                        itemData.departments.has(dept)
                    );

                // Batch DOM updates by only changing if needed
                const shouldShow = nameMatch && deptMatch;
                const isCurrentlyShown = item.style.display !== 'none';

                if (shouldShow !== isCurrentlyShown) {
                    item.style.display = shouldShow ? '' : 'none';
                }
            });
        });
    }, 150);

    /**
     * Initialize the faculty filter
     */
    function init() {
        // Get DOM elements
        nameFilter = document.getElementById('nameFilter');
        filterMenu = document.getElementById('departmentFilterMenu');
        filterButton = document.getElementById('departmentFilterButton');
        filterableContainer = document.querySelector('[data-filterable]');

        // Guard against missing elements
        if (!nameFilter || !filterMenu || !filterButton || !filterableContainer) {
            console.warn('Faculty filter: Required elements not found');
            return;
        }

        const filterableItems = filterableContainer.querySelectorAll('.bm-card--faculty');
        if (!filterableItems.length) {
            console.warn('Faculty filter: No filterable items found');
            return;
        }

        // Initialize
        initializeIndexes();
        populateDepartmentFilters();

        // Add event listeners
        filterButton.addEventListener('click', toggleMenu);
        document.addEventListener('click', handleClickOutside);
        filterMenu.addEventListener('keydown', handleKeydown);
        nameFilter.addEventListener('input', filterItems);
        filterMenu.addEventListener('change', filterItems);
    }

    // Public API
    wheaton.facultyFilter = {
        init
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window.wheaton = window.wheaton || {});
