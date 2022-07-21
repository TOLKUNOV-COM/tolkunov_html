/**
 * Embed
 */

const loadPortfolioCarousel = function (url) {
    console.log(('embed-portfolio-carousel').length);
    $('embed-portfolio-carousel').each(function () {
        let url = '/portfolio/embed-carousel';
        console.log('URL: ' + url);

        $.get(url, {}, (content) => {
            $(this).after(content);

            // loadPortfolio();
            initPortfoilioFancybox();
            loadPortfolioListVideo();
            initPortfolioCarousel();
        });
    });
}

const initPortfolioCarousel = function () {
    let swiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        // centeredSlides: true,
        // spaceBetween: 30,
        direction: 'horizontal',
        freeMode: true,
        navigation: {
            nextEl: '.b-portfolio-carousel__next',
            prevEl: '.b-portfolio-carousel__prev'
        }
    });

    let translateValue = 360;

    // Next arrow
    $('.b-portfolio-carousel__next').on('click', function () {
        let translate = swiper.getTranslate();

        swiper.$wrapperEl.css('transition-duration', '300ms');
        swiper.setTranslate(translate - translateValue);
        swiper.update();
    });

    // Prev arrow
    $('.b-portfolio-carousel__prev').on('click', function () {
        let translate = swiper.getTranslate();

        swiper.$wrapperEl.css('transition-duration', '300ms');
        swiper.setTranslate(Math.min(0, translate + translateValue));
        swiper.update();
    });
}

window.addEventListener('load', function () {
    loadPortfolioCarousel();
});
