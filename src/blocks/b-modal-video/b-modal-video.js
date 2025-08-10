/**
 * Video Modal Component
 * Handles opening/closing video modals and video playback
 */
$(function() {
    
    // Initialize video modals
    function initVideoModals() {
        // Handle play button clicks
        $(document).on('click', '[data-modal="video"]', function(e) {
            e.preventDefault();
            
            const $button = $(this);
            const targetSelector = $button.data('target');
            const videoSource = $button.data('video');
            
            if (!targetSelector || !videoSource) {
                console.error('Missing data-target or data-video attributes');
                return;
            }
            
            const $modal = $(targetSelector);
            if ($modal.length === 0) {
                console.error('Modal not found:', targetSelector);
                return;
            }
            
            openVideoModal($modal, videoSource);
        });
        
        // Handle close button clicks
        $(document).on('click', '[data-close]', function(e) {
            e.preventDefault();
            const $modal = $(this).closest('.video-modal');
            closeVideoModal($modal);
        });
        
        // Handle backdrop clicks
        $(document).on('click', '.video-modal__backdrop', function(e) {
            e.preventDefault();
            const $modal = $(this).closest('.video-modal');
            closeVideoModal($modal);
        });
        
        // Handle ESC key
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                const $openModal = $('.video-modal[data-open="true"]');
                if ($openModal.length > 0) {
                    closeVideoModal($openModal);
                }
            }
        });
    }
    
    // Open video modal
    function openVideoModal($modal, videoSource) {
        const $video = $modal.find('.video-modal__player');
        const video = $video[0];
        
        // Set video source
        $video.attr('src', videoSource);
        
        // Show modal
        $modal.attr('data-open', 'true');
        
        // Prevent body scroll
        $('body').addClass('overflow-hidden');
        
        // Focus on modal for accessibility
        $modal.focus();
        
        // Auto-play video when ready
        if (video) {
            // Try to play immediately if possible
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Video autoplay started successfully');
                    })
                    .catch((error) => {
                        console.log('Video autoplay blocked by browser:', error);
                        // Fallback: video will be available for manual play
                    });
            }
        }
        
        console.log('Video modal opened:', $modal.attr('id'), 'with source:', videoSource);
    }
    
    // Close video modal
    function closeVideoModal($modal) {
        const $video = $modal.find('.video-modal__player');
        
        // Hide modal
        $modal.attr('data-open', 'false');
        
        // Stop video and clear source
        if ($video.length > 0) {
            $video[0].pause();
            $video[0].currentTime = 0;
            $video.removeAttr('src');
        }
        
        // Restore body scroll
        $('body').removeClass('overflow-hidden');
        
        console.log('Video modal closed:', $modal.attr('id'));
    }
    
    // Initialize on DOM ready
    initVideoModals();
    
    console.log('Video modals initialized');
});
