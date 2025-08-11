/**
 * Video Modal Component
 * Handles opening/closing video modals and Plyr video playback
 */
$(function() {
    
    // Store Plyr instances
    var plyrInstances = {};
    
    // Initialize video modals
    function initVideoModals() {
        // Initialize Plyr for all video players
        initPlyrPlayers();
        
        // Handle play button clicks
        $(document).on('click', '[data-modal="video"]', function(e) {
            e.preventDefault();
            
            var $button = $(this);
            var targetSelector = $button.data('target');
            var videoSource = $button.data('video');
            
            if (!targetSelector || !videoSource) {
                console.error('Missing data-target or data-video attributes');
                return;
            }
            
            var $modal = $(targetSelector);
            if ($modal.length === 0) {
                console.error('Modal not found: ' + targetSelector);
                return;
            }
            
            openVideoModal($modal, videoSource);
        });
        
        // Handle close button clicks
        $(document).on('click', '[data-close]', function(e) {
            e.preventDefault();
            var $modal = $(this).closest('.video-modal');
            closeVideoModal($modal);
        });
        
        // Handle backdrop clicks
        $(document).on('click', '.video-modal__backdrop', function(e) {
            e.preventDefault();
            var $modal = $(this).closest('.video-modal');
            closeVideoModal($modal);
        });
        
        // Handle ESC key
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                var $openModal = $('.video-modal[data-open="true"]');
                if ($openModal.length > 0) {
                    closeVideoModal($openModal);
                }
            }
        });
    }
    
    // Initialize Plyr players
    function initPlyrPlayers() {
        $('.video-modal__player.plyr-js').each(function() {
            var videoElement = this;
            var modalId = $(videoElement).closest('.video-modal').attr('id');
            
            if (!plyrInstances[modalId]) {
                var player = new Plyr(videoElement, {
                    controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
                    invertTime: true,
                    keyboard: { focused: true, global: false },
                    tooltips: false,
                    autoplay: false,
                    hideControls: false,
                    iconUrl: 'assets/vendor/plyr/dist/plyr.svg'
                });
                
                plyrInstances[modalId] = player;
                
                player.on('ready', function() {
                    console.log('Plyr ready for: ' + modalId);
                });
                
                player.on('error', function(event) {
                    console.error('Plyr error: ' + event.detail);
                });
            }
        });
    }
    
    // Open video modal
    function openVideoModal($modal, videoSource) {
        var modalId = $modal.attr('id');
        var player = plyrInstances[modalId];
        
        if (!player) {
            console.error('Plyr instance not found for modal: ' + modalId);
            return;
        }
        
        // Set video source using Plyr API
        player.source = {
            type: 'video',
            sources: [{
                src: videoSource,
                type: getVideoType(videoSource)
            }]
        };
        
        // Show modal
        $modal.attr('data-open', 'true');
        
        // Prevent body scroll
        $('body').addClass('overflow-hidden');
        
        // Focus on modal for accessibility
        $modal.focus();
        
        // Auto-play video when ready
        player.once('ready', function() {
            var playPromise = player.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(function() {
                        console.log('Plyr autoplay started successfully for: ' + modalId);
                    })
                    .catch(function(error) {
                        console.log('Plyr autoplay blocked by browser: ' + error);
                        // Fallback: video will be available for manual play
                    });
            }
        });
        
        console.log('Video modal opened: ' + modalId + ' with source: ' + videoSource);
    }
    
    // Close video modal
    function closeVideoModal($modal) {
        var modalId = $modal.attr('id');
        var player = plyrInstances[modalId];
        
        // Hide modal
        $modal.attr('data-open', 'false');
        
        // Stop video using Plyr API
        if (player) {
            player.pause();
            player.currentTime = 0;
            // Clear source
            player.source = {
                type: 'video',
                sources: []
            };
        }
        
        // Restore body scroll
        $('body').removeClass('overflow-hidden');
        
        console.log('Video modal closed: ' + modalId);
    }
    
    // Helper function to determine video type from URL
    function getVideoType(url) {
        var extension = url.split('.').pop().toLowerCase();
        switch (extension) {
            case 'mp4':
                return 'video/mp4';
            case 'webm':
                return 'video/webm';
            case 'ogg':
                return 'video/ogg';
            default:
                return 'video/mp4'; // fallback
        }
    }
    
    // Initialize on DOM ready
    initVideoModals();
    
    console.log('Video modals initialized');
});
