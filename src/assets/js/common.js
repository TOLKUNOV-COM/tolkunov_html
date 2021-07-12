$(function () {
    $('.js-fancybox-video').fancybox({
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        margin: [45, 0, 100, 0],
        helpers: {
            media: {}
        },
        beforeLoad: function () {
            if ($(window).width() < 768) {
                var url = $(this.element).attr('href');

                window.open(url, '_self');

                return false;
            }

            return true;
        }
    });

    $('.js-fancybox-inline').fancybox({
        type: 'inline',
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        margin: [45, 0, 100, 0],
        fitToView: false
    });

    $('.b-portfolio-item__scroll').scrollbar();
});

var mySwiper;

$(function () {
    var initMySwiper = function () {
        mySwiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto',
            freeMode: true
        });
    };

    var destroyMySwiper = function () {
        mySwiper.destroy();
    };

    $(window).on('resize', function () {
        if ($(window).width() < 990 && (!mySwiper || mySwiper.destroyed)) {
            initMySwiper();
        } else if ($(window).width() >= 990 && mySwiper && mySwiper.initialized === true) {
            destroyMySwiper();
        }
    }).trigger('resize');
});

// Lazy loading
window.lazyLoadingImages = function () {
    let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

    let releaseLazyImage = function (lazyImage) {
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.srcset = lazyImage.dataset.srcset;
        lazyImage.classList.remove("lazy");
    }

    let releaseAllLazyImages = function () {
        console.log('release all lazy loading images');
        lazyImages.forEach(releaseLazyImage);
    }

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    releaseLazyImage(lazyImage);
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function (lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });

        window.addEventListener('load', function () {
            setTimeout(() => {
                let waitForVideos = function () {
                    return new Promise(resolve => {
                        let videos = document.getElementsByTagName('video');
                        let promises = [];

                        if (videos.length === 0) {
                            resolve();
                        }

                        for (let video of videos) {
                            promises.push(video.canplaythrough);
                        }

                        Promise.all(promises).then(resolve);
                    });
                }

                waitForVideos().then(releaseAllLazyImages);
            }, 1);
        });
    } else {
        // Possibly fall back to event handlers here
        releaseAllLazyImages();
    }
}
document.addEventListener("DOMContentLoaded", window.lazyLoadingImages);
