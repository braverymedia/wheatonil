(function(wheaton) {
    'use strict';

    let programs = [];
    const selectedFilters = {
        areas_of_study: [],
        credential_types: []
    };
    let isInitialized = false;
    let currentOverlay = null;

    /**
     * Initialize the program finder
     */
    function init() {
        if (isInitialized) return;

        // Load programs from data attributes
        loadPrograms();

        // Initialize fullscreen finder
        initFullscreenFinder();

        // Set up overlay triggers
        setupOverlayTriggers();

        // Set up URL synchronization
        setupURLSync();

        isInitialized = true;

        // Expose public methods
        wheaton.programFinder = {
            openOverlay: openOverlay,
            closeOverlay: closeOverlay,
            filterPrograms: filterPrograms,
            updateResults: updateResults
        };
    }

    /**
     * Load programs from data attributes
     */
    function loadPrograms() {
        const dataElements = document.querySelectorAll('.program-data-2023');
        programs = Array.from(dataElements).map(element => ({
            name: element.dataset.name || 'Unnamed',
            credential_types: (element.dataset.credentialTypes || '').split('|').filter(Boolean),
            credential_type_values: (element.dataset.credentialTypeValues || '').split('|').filter(Boolean),
            degree_types: (element.dataset.degreeTypes || '').split('|').filter(Boolean),
            areas_of_study: (element.dataset.areasOfStudy || '').split('|').filter(Boolean),
            link: element.dataset.link || '',
            concentrations: element.dataset.concentrations || ''
        })).filter(isShowableProgram);
    }

    /**
     * Check if a program should be shown
     */
    function isShowableProgram(program) {
        return program &&
            !!program.name &&
            !!program.credential_types &&
            program.credential_types.length > 0 &&
            !!program.credential_type_values &&
            program.credential_type_values.length > 0 &&
            !!program.degree_types &&
            program.degree_types.length > 0 &&
            !!program.areas_of_study &&
            program.areas_of_study.length > 0 &&
            !!program.link;
    }

    /**
     * Initialize the fullscreen program finder
     */
    function initFullscreenFinder() {
        const mountPoint = document.getElementById('program-finder-mountpoint');
        if (!mountPoint) return;

        // Load initial state from URL
        loadInitialState();

        // Render the finder
        renderFullscreenFinder(mountPoint);

        // Bind events
        bindFullscreenEvents(mountPoint);
    }

    /**
     * Load initial state from URL parameters
     */
    function loadInitialState() {
        const urlParams = new URLSearchParams(window.location.search);
        selectedFilters.areas_of_study = urlParams.getAll('pf-aos');
        selectedFilters.credential_types = urlParams.getAll('pf-ct');
    }

    /**
     * Render the fullscreen program finder
     */
    function renderFullscreenFinder(mountPoint) {
        const credentialTypes = getUniqueCredentialTypes();
        const areasOfStudy = getUniqueAreasOfStudy();
        const filteredPrograms = filterPrograms();

        mountPoint.innerHTML = `
            <div class="program-finder-2023 container">
                <div class="col1">
                    <div class="finder">
                        <h1 class="is-fancy">Find your program</h1>
                        <form class="form_bluebg">
                            <fieldset class="credential_types">
                                <legend>1. Select program type</legend>
                                <div class="scroller">
                                    ${credentialTypes.map(type => `
                                        <button type="button" class="bm--cta style-primary ${selectedFilters.credential_types.includes(type) ? 'selected' : ''}"
                                                data-filter="credential_types" data-value="${type}"
                                                aria-pressed="${selectedFilters.credential_types.includes(type)}">
                                            ${type}
                                        </button>
                                    `).join('')}
                                </div>
                            </fieldset>
                            <fieldset class="areas_of_study">
                                <legend>2. Area of study</legend>
                                <div class="checkbox-container">
                                    ${areasOfStudy.map(area => `
                                        <label class="checkbox">
                                            <input type="checkbox" name="areas_of_study" value="${area}"
                                                   ${selectedFilters.areas_of_study.includes(area) ? 'checked' : ''}>
                                            ${area}
                                        </label>
                                    `).join('')}
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div class="col2">
                    <p>Viewing ${filteredPrograms.length} program${filteredPrograms.length === 1 ? '' : 's'}</p>
                    <ul class="results" aria-live="polite" aria-relevant="additions removals">
                        ${renderProgramResults(filteredPrograms)}
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * Render program results
     */
    function renderProgramResults(programs) {
        return programs.map(program => `
            <li class="result">
                <p class="program_name">
                    <a href="${program.link}">${program.name}</a>
                </p>
                <div class="details">
                    ${program.credential_types?.length ? `
                        <div class="detail credential_types">
                            <p class="detail_type">Credential Type</p>
                            <p>${program.credential_types.join(', ')}</p>
                        </div>
                    ` : ''}
                    ${program.degree_types?.length ? `
                        <div class="detail degree_types">
                            <p class="detail_type">Offered As</p>
                            <p>${program.degree_types.join(', ')}</p>
                        </div>
                    ` : ''}
                    ${program.concentrations ? `
                        <div class="detail concentrations">
                            <p class="detail_type">Concentrations</p>
                            <p>${program.concentrations}</p>
                        </div>
                    ` : ''}
                </div>
            </li>
        `).join('');
    }

    /**
     * Bind events for fullscreen finder
     */
    function bindFullscreenEvents(mountPoint) {
        // Credential type buttons
        mountPoint.addEventListener('click', (e) => {
            if (e.target.dataset.filter === 'credential_types') {
                e.preventDefault();
                toggleFilter('credential_types', e.target.dataset.value);
                updateFullscreenFinder(mountPoint);
            }
        });

        // Area of study checkboxes
        mountPoint.addEventListener('change', (e) => {
            if (e.target.name === 'areas_of_study') {
                toggleFilter('areas_of_study', e.target.value);
                updateFullscreenFinder(mountPoint);
            }
        });
    }

    /**
     * Update the fullscreen finder
     */
    function updateFullscreenFinder(mountPoint) {
        const filteredPrograms = filterPrograms();
        const resultsContainer = mountPoint.querySelector('.results');
        const countElement = mountPoint.querySelector('p');

        countElement.textContent = `Viewing ${filteredPrograms.length} program${filteredPrograms.length === 1 ? '' : 's'}`;
        resultsContainer.innerHTML = renderProgramResults(filteredPrograms);

        // Update credential type buttons
        mountPoint.querySelectorAll('[data-filter="credential_types"]').forEach(button => {
            const value = button.dataset.value;
            const isSelected = selectedFilters.credential_types.includes(value);
            button.classList.toggle('selected', isSelected);
            button.setAttribute('aria-pressed', isSelected);
        });

        // Update area of study checkboxes
        mountPoint.querySelectorAll('input[name="areas_of_study"]').forEach(checkbox => {
            checkbox.checked = selectedFilters.areas_of_study.includes(checkbox.value);
        });
    }

    /**
     * Set up overlay triggers
     */
    function setupOverlayTriggers() {
        document.addEventListener('click', (e) => {
            if (e.target.dataset.widget === 'program-finder') {
                e.preventDefault();
                openOverlay();
            }
        });
    }

    /**
     * Open the program finder overlay
     */
    function openOverlay() {
        if (currentOverlay) {
            currentOverlay.setOpen(true);
            return;
        }

        currentOverlay = new ProgramFinderOverlay({
            programs: programs,
            title: 'Find your program',
            fullScreenPath: '/academics/programs/',
            isOpen: true
        });
    }

    /**
     * Close the program finder overlay
     */
    function closeOverlay() {
        if (currentOverlay) {
            currentOverlay.setOpen(false);
        }
    }

    /**
     * Program Finder Overlay Class
     */
    class ProgramFinderOverlay {
        constructor(options = {}) {
            this.programs = options.programs || [];
            this.title = options.title || 'Find your program';
            this.fullScreenPath = options.fullScreenPath || '/academics/programs/';
            this.isOpen = options.isOpen || false;

            this.createOverlay();
            this.bindEvents();
        }

        createOverlay() {
            this.overlay = document.createElement('div');
            this.overlay.className = 'program-finder-2023-popover';
            this.overlay.innerHTML = `
                <div class="program-finder-2023-popover__overlay">
                    <div class="program-finder-2023-popover__container">
                        <button class="program-finder-2023-popover__close" aria-label="Close program finder">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                        <div class="program-finder-content"></div>
                    </div>
                </div>
            `;

            document.body.appendChild(this.overlay);
            this.contentContainer = this.overlay.querySelector('.program-finder-content');

            // Initialize the finder content
            this.renderContent();

            this.setOpen(this.isOpen);
        }

        renderContent() {
            const credentialTypes = getUniqueCredentialTypes();
            const areasOfStudy = getUniqueAreasOfStudy();
            const filteredPrograms = filterPrograms();

            this.contentContainer.innerHTML = `
                <div class="finder">
                    <h1 class="is-fancy">${this.title}</h1>
                    <form class="form_bluebg">
                        <fieldset class="credential_types">
                            <legend>1. Select program type</legend>
                            <div class="scroller">
                                ${credentialTypes.map(type => `
                                    <button type="button" class="bm--cta style-primary ${selectedFilters.credential_types.includes(type) ? 'selected' : ''}"
                                            data-filter="credential_types" data-value="${type}"
                                            aria-pressed="${selectedFilters.credential_types.includes(type)}">
                                        ${type}
                                    </button>
                                `).join('')}
                            </div>
                        </fieldset>
                        <fieldset class="areas_of_study">
                            <legend>2. Area of study</legend>
                            <div class="checkbox-container">
                                ${areasOfStudy.map(area => `
                                    <label class="checkbox">
                                        <input type="checkbox" name="areas_of_study" value="${area}"
                                               ${selectedFilters.areas_of_study.includes(area) ? 'checked' : ''}>
                                        ${area}
                                    </label>
                                `).join('')}
                            </div>
                        </fieldset>
                    </form>
                    <footer class="program-finder-2023-popover__footer">
                        <a class="bm--cta program-finder-2023-popover__link ${filteredPrograms.length === 0 ? 'disabled' : ''}"
                           href="${this.getFullScreenUrl()}">
                            View Programs (${filteredPrograms.length})
                        </a>
                    </footer>
                </div>
            `;

            this.bindContentEvents();
        }

        bindContentEvents() {
            // Credential type buttons
            this.contentContainer.addEventListener('click', (e) => {
                if (e.target.dataset.filter === 'credential_types') {
                    e.preventDefault();
                    toggleFilter('credential_types', e.target.dataset.value);
                    this.updateContent();
                }
            });

            // Area of study checkboxes
            this.contentContainer.addEventListener('change', (e) => {
                if (e.target.name === 'areas_of_study') {
                    toggleFilter('areas_of_study', e.target.value);
                    this.updateContent();
                }
            });
        }

        updateContent() {
            const filteredPrograms = filterPrograms();
            const linkElement = this.contentContainer.querySelector('.program-finder-2023-popover__link');

            linkElement.href = this.getFullScreenUrl();
            linkElement.textContent = `View Programs (${filteredPrograms.length})`;
            linkElement.classList.toggle('disabled', filteredPrograms.length === 0);

            // Update credential type buttons
            this.contentContainer.querySelectorAll('[data-filter="credential_types"]').forEach(button => {
                const value = button.dataset.value;
                const isSelected = selectedFilters.credential_types.includes(value);
                button.classList.toggle('selected', isSelected);
                button.setAttribute('aria-pressed', isSelected);
            });

            // Update area of study checkboxes
            this.contentContainer.querySelectorAll('input[name="areas_of_study"]').forEach(checkbox => {
                checkbox.checked = selectedFilters.areas_of_study.includes(checkbox.value);
            });
        }

        getFullScreenUrl() {
            const url = new URL(this.fullScreenPath, window.location.origin);
            url.searchParams.delete('pf-aos');
            url.searchParams.delete('pf-ct');

            selectedFilters.areas_of_study.forEach(aos =>
                url.searchParams.append('pf-aos', aos));
            selectedFilters.credential_types.forEach(ct =>
                url.searchParams.append('pf-ct', ct));

            return url.toString();
        }

        bindEvents() {
            // Close button
            this.overlay.querySelector('.program-finder-2023-popover__close').addEventListener('click', () => {
                this.setOpen(false);
            });

            // Overlay click
            this.overlay.querySelector('.program-finder-2023-popover__overlay').addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    this.setOpen(false);
                }
            });

            // Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.setOpen(false);
                }
            });
        }

        setOpen(open) {
            this.isOpen = open;
            this.overlay.classList.toggle('isOpen', open);
            this.overlay.setAttribute('aria-hidden', !open);
        }

        destroy() {
            if (this.overlay && this.overlay.parentNode) {
                this.overlay.parentNode.removeChild(this.overlay);
            }
        }
    }

    /**
     * Toggle a filter
     */
    function toggleFilter(filterType, value) {
        const filters = selectedFilters[filterType];
        const index = filters.indexOf(value);

        if (index > -1) {
            filters.splice(index, 1);
        } else {
            filters.push(value);
        }

        updateURL();
    }

    /**
     * Update URL with current filters
     */
    function updateURL() {
        const url = new URL(window.location);
        url.searchParams.delete('pf-aos');
        url.searchParams.delete('pf-ct');

        selectedFilters.areas_of_study.forEach(aos =>
            url.searchParams.append('pf-aos', aos));
        selectedFilters.credential_types.forEach(ct =>
            url.searchParams.append('pf-ct', ct));

        history.pushState(null, '', url);
    }

    /**
     * Set up URL synchronization
     */
    function setupURLSync() {
        window.addEventListener('popstate', () => {
            loadInitialState();
            const mountPoint = document.getElementById('program-finder-mountpoint');
            if (mountPoint) {
                updateFullscreenFinder(mountPoint);
            }
        });
    }

    /**
     * Filter programs based on selected filters
     */
    function filterPrograms() {
        return programs.filter(program => {
            // Area of study filter
            if (selectedFilters.areas_of_study.length > 0) {
                const hasMatchingArea = program.areas_of_study?.some(area =>
                    selectedFilters.areas_of_study.includes(area));
                if (!hasMatchingArea) return false;
            }

            // Credential type filter
            if (selectedFilters.credential_types.length > 0) {
                const hasMatchingCredential = program.credential_types?.some(credential =>
                    selectedFilters.credential_types.includes(credential));
                if (!hasMatchingCredential) return false;
            }

            return true;
        }).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    }

    /**
     * Get unique credential types
     */
    function getUniqueCredentialTypes() {
        const types = new Set();
        programs.forEach(program => {
            if (program.credential_types) {
                program.credential_types.forEach(type => types.add(type));
            }
        });
        return Array.from(types);
    }

    /**
     * Get unique areas of study
     */
    function getUniqueAreasOfStudy() {
        const areas = new Set();
        programs.forEach(program => {
            if (program.areas_of_study) {
                program.areas_of_study.forEach(area => areas.add(area));
            }
        });
        return Array.from(areas).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    }

    /**
     * Update results (public method)
     */
    function updateResults() {
        const mountPoint = document.getElementById('program-finder-mountpoint');
        if (mountPoint) {
            updateFullscreenFinder(mountPoint);
        }
    }

    // Public API
    wheaton.programFinder = {
        init,
        openOverlay,
        closeOverlay,
        filterPrograms,
        updateResults
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window.wheaton = window.wheaton || {});