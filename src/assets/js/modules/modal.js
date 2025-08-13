(function(wheaton) {
    'use strict';

    let dialog;
    let modalContentContainer;
    let isInitialized = false;

    function init() {
        if (isInitialized) return;
        
        const a11ymodal = document.getElementById('bm-modal-dialog');
        if (!a11ymodal) return;

        // Use global A11yDialog
        if (typeof A11yDialog === 'undefined') {
            console.error('A11yDialog is not loaded. Make sure to include a11y-dialog in your HTML.');
            return;
        }
        
        // Initialize A11yDialog with the modal element
        dialog = new A11yDialog(a11ymodal);
        modalContentContainer = document.querySelector('.bm--modal-content');
        isInitialized = true;

        if (!modalContentContainer) return;

        // Set up dialog events
        setupDialogEvents();

        // Handle clicks on modal triggers
        document.addEventListener('click', function(event) {
            const trigger = event.target.closest('[data-bm-modal]');
            if (!trigger) return;

            event.preventDefault();

            const mediaType = trigger.getAttribute('data-media-type') || 'image';
            const mediaUrl = trigger.getAttribute('data-src');
            
            if (!mediaUrl) return;

            // Clear previous content
            modalContentContainer.innerHTML = '';
            
            // Add new content based on media type
            if (mediaType === 'video') {
                modalContentContainer.appendChild(embedVideo(mediaUrl));
            } else {
                modalContentContainer.appendChild(embedImage(mediaUrl, trigger));
            }

            // Show the dialog
            try {
                dialog.show();
            } catch (error) {
                console.error('Error showing dialog:', error);
                // Fallback to opening in new tab if dialog fails
                window.open(mediaUrl, '_blank');
            }
        });
    }

    /**
     * Embed a video in the modal
     * @param {string} url - The video URL
     * @returns {HTMLElement} - The iframe element
     */
    function embedVideo(url) {
        const videoId = url.includes('youtu')
            ? url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)[1]
            : url.match(/vimeo\.com\/(?:.*\/)?([0-9]+)/)[1];

        const iframe = document.createElement('iframe');
        iframe.className = 'bm--modal-media';
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

    /**
     * Embed an image in the modal
     * @param {string} url - The image URL
            try {
                dialog.show();
            } catch (error) {
                console.error('Error showing dialog:', error);
                // Fallback to opening in new tab if dialog fails
                window.open(mediaUrl, '_blank');
            }
        });
    }

    /**
     * Embed a video in the modal
     * @param {string} url - The video URL
     * @returns {HTMLElement} - The iframe element
     */
    function embedVideo(url) {
        const videoId = url.includes('youtu')
            ? url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)[1]
            : url.match(/vimeo\.com\/(?:.*\/)?([0-9]+)/)[1];

        const iframe = document.createElement('iframe');
        iframe.className = 'bm--modal-media';
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

    /**
     * Embed an image in the modal
     * @param {string} url - The image URL
     * @param {HTMLElement} trigger - The element that triggered the modal
     * @returns {HTMLElement} - The figure element
     */
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

        // Copy caption if it exists
        const caption = sourceFigure.querySelector('figcaption');
        if (caption) {
            const newCaption = document.createElement('figcaption');
            newCaption.innerHTML = caption.innerHTML;
            figure.appendChild(newCaption);
        }

        return figure;
    }

    // Set up event listeners for dialog
    function setupDialogEvents() {
        if (!dialog) return;

        dialog
            .on('show', () => {
                document.documentElement.style.overflowY = 'hidden';
            })
            .on('hide', () => {
                document.documentElement.style.overflowY = '';
                if (modalContentContainer) {
                    while (modalContentContainer.firstChild) {
                        modalContentContainer.removeChild(modalContentContainer.firstChild);
                    }
                }
            });
    }

    // Public API
    wheaton.modal = {
        init
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window.wheaton = window.wheaton || {});
