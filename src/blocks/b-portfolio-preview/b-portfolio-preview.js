window.initPortfolioPreview = function () {
    const fixArrowsTop = function () {
        let top = $('.b-portfolio-item__head:visible').height() + parseInt($('.b-portfolio-item__head:visible').css('padding-bottom')) + $('.b-size-tabs:visible').height() + parseInt($('.b-size-tabs:visible').css('padding-top')) + parseInt($('.b-size-tabs:visible').css('padding-bottom')) + parseInt($('.tab-pane.active .tab-pane.active .b-portfolio-item__view').css('padding-top')) + ($('.tab-pane.active .tab-pane.active .b-portfolio-item__view').height() / 2) - ($('.b-portfolio-preview__next').height() / 2);

        $('.b-portfolio-preview__prev').css('top', top);
        $('.b-portfolio-preview__next').css('top', top);
    }

    $(window).on('resize', fixArrowsTop);
    $('body').on('resize', fixArrowsTop);

    const loadPortfolioPreview = function (url) {
        let container = $('.b-portfolio-preview__content');

        $('.b-portfolio-preview').addClass('loading');

        let content = '';

        let animatePromise = new Promise(resolve => {
            container.animate({opacity: 0}, 200, resolve);
        });

        let loadPromise = new Promise(resolve => {
            $.ajax({
                type: 'get',
                url: url,
                success: function (data) {
                    content = data;

                    // container.animate({opacity: 0}, 200, () => {
                    // });
                },
                complete: function () {
                    $('.b-portfolio-preview').removeClass('loading');
                    checkPortfolioPreviewButtons();

                    resolve();
                }
            });
        });

        Promise.all([animatePromise, loadPromise]).then(() => {
            container.html(content);
            container.animate({opacity: 1}, 150);

            if (typeof window.showIframe == "function") {
                setTimeout(showIframe, 1);
            }

            let i = 0;

            let interval = setInterval(() => {
                console.log('check');
                fixArrowsTop();

                if (i++ > 20) {
                    clearInterval(interval);
                }
            }, 100);
        });
    }

    const checkPortfolioPreviewButtons = function () {
        if (portfolioPreviewUrlIndex + 1 >= portfolioPreviewUrls.length) {
            $('.b-portfolio-preview__next').hide();
        } else {
            $('.b-portfolio-preview__next').show();
        }

        if (portfolioPreviewUrlIndex <= 0) {
            $('.b-portfolio-preview__prev').hide();
        } else {
            $('.b-portfolio-preview__prev').show();
        }
    }

    loadPortfolioPreview(portfolioPreviewUrls[portfolioPreviewUrlIndex]);

    $('.b-portfolio-preview__next').on('click', function () {
        if (portfolioPreviewUrlIndex + 1 >= portfolioPreviewUrls.length) {
            return;
        }

        portfolioPreviewUrlIndex++;

        loadPortfolioPreview(portfolioPreviewUrls[portfolioPreviewUrlIndex]);
    });

    $('.b-portfolio-preview__prev').on('click', function () {
        if (portfolioPreviewUrlIndex <= 0) {
            return;
        }

        portfolioPreviewUrlIndex--;

        loadPortfolioPreview(portfolioPreviewUrls[portfolioPreviewUrlIndex]);
    });
}
