(function(wheaton) {
    'use strict';

    let dialog;
    let modalContentContainer;

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

        // Clone the figcaption if it exists
        const sourceCaption = sourceFigure.querySelector('figcaption');
        if (sourceCaption) {
            const figcaption = sourceCaption.cloneNode(true);
            figure.appendChild(figcaption);
        }

        return figure;
    }

    /**
     * Initialize the modal
     */
    function init() {
        const a11ymodal = document.getElementById('bm-modal-dialog');
        if (!a11ymodal) return;

        dialog = new A11yDialog(a11ymodal);
        modalContentContainer = document.querySelector('.bm--modal-content');
        
        if (!modalContentContainer) return;

        // Set up media triggers
        document.querySelectorAll('[data-bm-modal]').forEach((trigger) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();

                // Get the media URL either from href (for links) or data-src (for buttons)
                let url = trigger.tagName.toLowerCase() === 'a'
                    ? trigger.getAttribute('href')
                    : trigger.getAttribute('data-src');

                if (!url) {
                    console.warn('No media URL provided for modal trigger');
                    return;
                }

                // Clear previous content
                while (modalContentContainer.firstChild) {
                    modalContentContainer.removeChild(modalContentContainer.firstChild);
                }


                let mediaType = trigger.getAttribute('data-media-type') || 'video';
                let mediaElement = mediaType === 'image' 
                    ? embedImage(url, trigger) 
                    : embedVideo(url);
                    
                modalContentContainer.appendChild(mediaElement);
                dialog.show();
            });
        });

        // Clear contents on hide
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
