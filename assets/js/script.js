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

/**
 * AUTO-GROW (only expand)
 */
function autoGrowOnlyExpand(el) {
    const currentHeight = el.offsetHeight;

    // временно сбрасываем высоту, чтобы получить актуальный scrollHeight
    el.style.height = 'auto';
    const neededHeight = el.scrollHeight + 2;

    if (neededHeight > currentHeight) {
        el.style.height = neededHeight + 'px';
    } else {
        // откатываем к текущей высоте, чтобы не уменьшать
        el.style.height = currentHeight + 'px';
    }
}

$(function () {
    document.querySelectorAll('textarea[auto-grow]').forEach(textarea => {
        // Устанавливаем начальную высоту
        textarea.style.height = textarea.scrollHeight + 2 + 'px';

        textarea.addEventListener('input', () => autoGrowOnlyExpand(textarea));
    });
});

// Плавный скролл наверх
$(function () {
    $('.js-scroll-to-top').on('click', function(e) {
        e.preventDefault();
        
        $('html, body').animate({
            scrollTop: 0
        }, 500, 'swing');
    });
});

//! v.1.2.3, http://ilyabirman.net/projects/emerge/
jQuery&&(!function(t){t(function(){t.expr[":"].uncached=function(a){if(!t(a).is('img[src!=""]'))return!1;var e=new Image;return e.src=a.src,!e.complete};var a=[],e=500,i=!1,r=!1,o=["backgroundImage","borderImage","borderCornerImage","listStyleImage","cursor"],n=/url\(\s*(['"]?)(.*?)\1\s*\)/g,s=0,c=function(t,a,e,i,r){var o="emergeRotate"+ ++s;return"<style>@keyframes "+o+" { from { transform: rotate("+360*e+"deg) } to { transform: rotate("+360*!e+'deg) }  } </style><div style="position: absolute; transition: opacity '+r+'ms ease-out"><div style="position: absolute; left: 50%; top: 50%; margin: -'+t+'px"><svg width="'+2*t+'" height="'+2*t+'"viewBox="0 0 100 100"><defs><mask id="cut"><rect width="100" height="100" fill="white" /><circle r="40" cx="50" cy="50" fill="black" /><polygon points="50,50 100,25 150,50 100,75" fill="black" style="transform-origin: 50 50; animation: '+o+" "+i+'ms linear infinite" /></mask></defs><circle r="50" cx="50" cy="50" mask="url(#cut)" /></svg></div></div>'};if(window.navigator&&"preview"===window.navigator.loadPurpose)return t(".emerge").css("transition","none"),t(".emerge").css("opacity","1"),!1;var d=function(t){var a=Math.min(document.body.clientHeight,document.documentElement.clientHeight),e=t.offset().top,i=window.pageYOffset||document.documentElement.scrollTop;return a>e-i},l=function(t,a){var i=t.data("hold"),r=t.data("expose");if(r&&!d(t))return t.data("_waitingForView",!0),!1;if(i&&!t.data("_holding"))return t.data("_holding",!0),setTimeout(function(){l(t,!0)},i),!1;if(t.data("_holding")&&!a)return!1;var o=t.data("_spinner");o&&o.css("opacity",0),t.css("transition","opacity "+e+"ms ease-out"),t.css("opacity","1");var n=t.data("style-2");n&&t.attr("style",t.attr("style")+"; "+n),t.data("_fired",!0),f()},f=function(t){t&&a.push(t);for(var e in a){var i=a[e];if(i.data("_fired"));else{var r,o=!1;if(r=i.data("_waitFor")){for(;;){if(!r.data("_fired")){if(r[0]==i[0]){o=!0;break}if(r=r.data("_waitFor"))continue}break}(i.data("_waitFor").data("_fired")||o)&&l(i)}else l(i)}}},u=function(){for(var t in a){var e=a[t];e.data("_waitingForView")&&d(e)&&(e.data("_waitingForView",!1),l(e))}},p=function(){r||(t(window).on("scroll resize",u),r=!0)};t(".emerge").each(function(){var a=t(this),r={},s=!1,d=12,l=1333,u="#404040",g=0,m=e,v=0,w=0,y="",h="",b=e,_={};a.$prev=i;var k=function(){a.data("continue")&&a.data("_waitFor",a.$prev),a.data("await")&&a.data("_waitFor",t("#"+a.data("await"))),f(a)},x=function(){w++,w==v&&setTimeout(k,a.data("slow"))};if(a.data("opaque")&&a.css("opacity",1),_=a.data("effect")||!1,b=a.data("duration")||e,expose=a.data("expose"),p(),_){var z={},F=["","-webkit-"],I="transform",j="transform-origin",H=a.data("up")||0,O=a.data("down")||0,T=a.data("left")||0,V=a.data("right")||0,Y=a.data("angle")||"90",B=a.data("scale")||-1,E=a.data("origin")||"50% 50%";if(O&&(H="-"+O,"--"==H.substr(0,2)&&(H=H.substr(2))),V&&(T="-"+V,"--"==T.substr(0,2)&&(T=T.substr(2))),"relax"==_&&(-1==B&&(B=.92),"50% 50%"==E&&(E="top"),z={one:"scaleY("+B+")",two:"scaleY(1)",orn:E,crv:"cubic-bezier(0, 0, 0.001, 1)"}),"slide"==_&&(H||(H="20px"),z={one:"translate("+T+","+H+")",two:"translate(0,0)",crv:"cubic-bezier(0, 0.9, 0.1, 1)"}),"zoom"==_&&(-1==B&&(B=.5),z={one:"scale("+B+")",two:"scale(1)",orn:E,crv:"cubic-bezier(0, 0.75, 0.25, 1)"}),"screw"==_&&(-1==B&&(B=.5),Y||(Y=90),z={one:"scale("+B+") rotate("+Y+"deg)",two:"scale(1) rotate(0)",orn:E,crv:"cubic-bezier(0, 0.75, 0.25, 1)"}),z)for(var M=0;M<F.length;++M)y+=F[M]+I+": "+z.one+"; "+F[M]+j+": "+z.orn+"; ",h+=F[M]+I+": "+z.two+"; "+F[M]+"transition: opacity "+b+"ms ease-out, "+F[M]+I+" "+b+"ms "+z.crv+"; ";a.data("style-1",y),a.data("style-2",h)}if(y||(y=a.data("style-1")),y&&a.attr("style",a.attr("style")+"; "+y),a.find("*").addBack().each(function(){var a=t(this);a.is("img:uncached")&&a.attr("src")&&(r[a.attr("src")]=!0);for(var e=0;e<o.length;++e){var i,s=o[e],c=a.css(s),d=-1;if(c&&(d=c.indexOf("url("))>=0)for(;null!==(i=n.exec(c));)r[i[2]]=!0}}),Object.keys(r).length>0&&(s=a.data("spin"))){var Q=a.data("spin-element");if(Q)var $=t("#"+Q).clone().css({position:"absolute",display:"block"});else{a.data("spin-size")&&(d=a.data("spin-size")/2),a.data("spin-color")&&(u=a.data("spin-color")),a.data("spin-period")&&(l=a.data("spin-period")),a.data("spin-direction")&&(g="clockwise"==a.data("spin-direction")?0:1),m=b;var $=t(c(d,u,g,l,m))}$.css({width:"100%",height:Math.min(a.height(),document.body.clientHeight-a.offset().top)}),a.before($),a.data("_spinner",$)}for(var M in r){var q=new Image;q.src=M,v++,q.width>0?x():t(q).on("load error",x)}v++,x(),i=a})})}(jQuery),document.write("<style>.emerge { opacity: 0; }</style>"));
/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-smil-setclasses !*/
!function(e,n,s){function o(e,n){return typeof e===n}function a(){var e,n,s,a,t,r,f;for(var c in l)if(l.hasOwnProperty(c)){if(e=[],n=l[c],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(s=0;s<n.options.aliases.length;s++)e.push(n.options.aliases[s].toLowerCase());for(a=o(n.fn,"function")?n.fn():n.fn,t=0;t<e.length;t++)r=e[t],f=r.split("."),1===f.length?Modernizr[f[0]]=a:(!Modernizr[f[0]]||Modernizr[f[0]]instanceof Boolean||(Modernizr[f[0]]=new Boolean(Modernizr[f[0]])),Modernizr[f[0]][f[1]]=a),i.push((a?"":"no-")+f.join("-"))}}function t(e){var n=f.className,s=Modernizr._config.classPrefix||"";if(c&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+s+"no-js(\\s|$)");n=n.replace(o,"$1"+s+"js$2")}Modernizr._config.enableClasses&&(n+=" "+s+e.join(" "+s),c?f.className.baseVal=n:f.className=n)}var i=[],l=[],r={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var s=this;setTimeout(function(){n(s[e])},0)},addTest:function(e,n,s){l.push({name:e,fn:n,options:s})},addAsyncTest:function(e){l.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=r,Modernizr=new Modernizr;var f=n.documentElement,c="svg"===f.nodeName.toLowerCase(),u={}.toString;Modernizr.addTest("smil",function(){return!!n.createElementNS&&/SVGAnimate/.test(u.call(n.createElementNS("http://www.w3.org/2000/svg","animate")))}),a(),t(i),delete r.addTest,delete r.addAsyncTest;for(var d=0;d<Modernizr._q.length;d++)Modernizr._q[d]();e.Modernizr=Modernizr}(window,document);
$(function () {
    function initMasonry() {
        $('.b-blog__list').packery({
            itemSelector: '.b-blog__item',
            columnWidth: 320,
            gutter: 20,
            fitWidth: true,
            // no transitions
            transitionDuration: 0
        });
    }

    initMasonry();

    $(".b-blog__list img").one("load", function () {
        //$(this).closest('.b-reviews__item').fadeIn();

        initMasonry();
    }).each(function () {
        if (this.complete) $(this).trigger('load');
    });
});

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

$(function () {
    /* When iframe is loaded */
    $('#callbackFrame').ready(function () {
        setTimeout(function () {
            $('.b-call-widget').addClass('b-call-widget_state_ready');
            $('.b-call-widget__content').css('display', 'none');
            $('.b-call-widget__overlay').css('display', 'none');
            $('.b-call-widget__link').css('display', 'none');
        }, 1);
    });

    if (!isMobileDevice()) {
        $('.b-call-widget').addClass('b-call-widget_without-overlay');
    }
});

$(function () {
    $('.b-call-widget__button').on('click', function () {
        if (!$('.b-call-widget').hasClass('b-call-widget__collapsed')) {
            setTimeout(function () {
                $('.b-call-widget__content, .b-call-widget__overlay, .b-call-widget__link').css('display', 'none');
            }, 500);
        } else {
            $('.b-call-widget__content, .b-call-widget__overlay, .b-call-widget__link').css('display', 'block');
        }

        setTimeout(function () {
            $('.b-call-widget').toggleClass('b-call-widget__collapsed');
        }, 1);
    });
});

var loadCases = function (cb) {
    // $('.b-cases__list').each(function () {
    //     let itemsCount = $(this).find('.b-cases__item').length;
    //
    //     let mod2 = itemsCount % 2;
    //     let mod3 = itemsCount % 3;
    //
    //     $(this).addClass('b-cases__list_mod_2_' + mod2);
    //     $(this).addClass('b-cases__list_mod_3_' + mod3);
    // });

    cb && cb();

    loadCasesListVideo();
    window.lazyLoadingImages();
};

var loadCasesListVideo = function () {
    $('.js-cases-cover-video:visible').each(function () {
        // Check for already loaded
        if ($(this).next('video').length) {
            return true;
        }

        let ratio = $(this).data('ratio');

        var $video = $('<video>')
            .attr('preload', 'auto')
            .attr('playsinline', 'playsinline')
            .addClass('b-cases__video')
            .addClass('b-cases__video_' + ratio)
            .hide();

        let src = $(this).data('src');
        let sources = $(this).data('sources');

        if (src) {
            $video.attr('src', src);
        }

        if (sources) {
            for (let source of sources) {
                $('<source>').attr(source).appendTo($video);
            }
        }

        $video[0].preload = 'auto';
        $video[0].muted = true;
        $video[0].loop = true;
        $video[0].play();

        const onPlayed = function () {
            $video[0].currentTime = 0;
            $video.show();
            $video[0].removeEventListener('canplaythrough', onPlayed);
        };

        $video[0].addEventListener('canplaythrough', onPlayed);

        $($video).insertAfter($(this));
    });
};

/**
 * Embed
 */

const loadEmbedCaseCompilation = function () {
    $('embed-case-compilation').each(function () {
        let id = $(this).data('id');

        if (!id) {
            return;
        }

        let url = '/cases-compilations/embed/' + id;
        console.log('URL: ' + url);

        $.get(url, {}, (content) => {
            $(this).after(content);

            setTimeout(() => {
                loadCases();
            }, 1);
        });
    });
}

window.addEventListener('load', function () {
    loadCases();
    loadEmbedCaseCompilation();
});

$(window).on('resize', function () {
    loadCases();
});

var loadClients = function (cb) {
    function loadSprite(src) {
        var deferred = $.Deferred();
        var sprite = new Image();
        sprite.onload = function () {
            deferred.resolve();
        };
        sprite.src = src;
        return deferred.promise();
    }

    var loaders = [];

    $('.b-clients__list img').each(function () {
        loaders.push(loadSprite($(this).attr('src')));
    });

    $.when.apply(null, loaders).done(function () {
        $('.b-clients__item').addClass('b-clients__item_loaded');

        cb && cb();
    });

    $(".b-clients__list img").one("load", function () {
        $(this).closest('.b-clients__item').addClass('b-clients__item_loaded');
    }).each(function () {
        if (this.complete) $(this).trigger('load');
    });

    window.lazyLoadingImages();
};

$(function () {
    loadClients();
});

// AJAX формы заявок
$(function () {
    // Функция для управления состоянием кнопок
    function setButtonState(form, state) {
        const buttons = form.find('button[type="submit"]');

        buttons.each(function () {
            const button = $(this);
            const buttonState = button.data('state');

            if (buttonState === state) {
                button.show();
            } else {
                button.hide();
            }
        });
    }

    // Обработчик для всех форм заявок
    $('#request-order-form, #request-pr-form, #request-hr-form').on('submit', function (e) {
        e.preventDefault();

        const form = $(this);
        const formId = form.attr('id');

        // Очищаем предыдущие ошибки
        form.find('.error').removeClass('error');

        // Показываем состояние загрузки
        setButtonState(form, 'loading');

        // Выбрасываем событие начала отправки формы
        form.trigger('form:submit', { formId: formId });

        // Получаем URL действия из формы
        const actionUrl = form.attr('action');

        $.ajax({
            url: actionUrl,
            type: 'POST',
            data: form.serialize(),
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    // Успех - показываем состояние завершено
                    setButtonState(form, 'success');

                    // Выбрасываем событие успешной отправки формы
                    form.trigger('form:success', { formId: formId, response: response });

                    // Очищаем форму и возвращаем к исходному состоянию через некоторое время
                    setTimeout(function () {
                        form[0].reset();
                        setButtonState(form, 'default');
                        
                        // Выбрасываем событие сброса формы
                        form.trigger('form:reset', { formId: formId });
                    }, 5000);
                } else {
                    // Ошибки валидации
                    if (response.errors) {
                        // Проверяем наличие ошибки reCAPTCHA и показываем через alert
                        if (response.errors.recaptchaToken) {
                            const recaptchaError = response.errors.recaptchaToken[0] || 'Проверка безопасности не пройдена';
                            alert(recaptchaError);
                        }

                        // Получаем название модели из formId
                        let modelName = '';
                        switch (formId) {
                            case 'request-order-form':
                                modelName = 'RequestOrderForm';
                                break;
                            case 'request-pr-form':
                                modelName = 'RequestPrForm';
                                break;
                            case 'request-hr-form':
                                modelName = 'RequestHrForm';
                                break;
                        }

                        // Показываем ошибки для каждого поля
                        let firstErrorField = null;

                        $.each(response.errors, function (fieldName, messages) {
                            let fieldSelector = '';
                            let field = null;

                            // Стандартная обработка для всех форм (теперь все поля используют одинаковую конвенцию)
                            if (fieldName === 'tags') {
                                // Для массива tags
                                fieldSelector = `input[name="${modelName}[${fieldName}][]"]`;
                                field = form.find(fieldSelector).first(); // Берем первый чекбокс для подсвечивания группы
                            } else {
                                // Для обычных полей
                                fieldSelector = `input[name="${modelName}[${fieldName}]"], textarea[name="${modelName}[${fieldName}]"], select[name="${modelName}[${fieldName}]"]`;
                                field = form.find(fieldSelector);
                            }

                            if (field && field.length > 0) {
                                // Добавляем класс error к полю
                                field.addClass('error');

                                // Добавляем класс error к родительскому .form-row если есть
                                const formRow = field.closest('.form-row');
                                if (formRow.length > 0) {
                                    formRow.addClass('error');
                                }

                                // Запоминаем первое поле с ошибкой для фокуса
                                if (!firstErrorField) {
                                    // Для фокуса берем поле, которое можно сфокусировать
                                    if (field.is('input[type="text"], input[type="email"], textarea')) {
                                        firstErrorField = field;
                                    } else if (fieldName === 'tags' || fieldName === 'budget') {
                                        // Для чекбоксов и радиокнопок берем первый элемент
                                        firstErrorField = field.first();
                                    }
                                }
                            }
                        });

                        // Устанавливаем фокус на первое поле с ошибкой
                        if (firstErrorField && firstErrorField.length > 0) {
                            setTimeout(function () {
                                firstErrorField.focus();
                            }, 100);
                        }
                    }

                    // Выбрасываем событие ошибки валидации
                    form.trigger('form:validation-error', { formId: formId, errors: response.errors });

                    // Возвращаем кнопку в исходное состояние
                    setButtonState(form, 'default');
                }
            },
            error: function (xhr, status, error) {
                // Ошибка сети или сервера
                alert('Произошла ошибка при отправке формы. Попробуйте еще раз.');
                
                // Выбрасываем событие ошибки сети
                form.trigger('form:network-error', { formId: formId, xhr: xhr, status: status, error: error });
                
                setButtonState(form, 'default');
            }
        });
    });
});

$(function () {
    $('.contact-switcher__item').on('click', function () {
        // Проверяем, не активен ли уже этот таб
        if ($(this).attr('data-active') === 'true') {
            return; // Выходим, если таб уже активен
        }

        // Снимаем активность со всех переключателей
        $('.contact-switcher__item').attr('data-active', 'false');

        // Активируем выбранный переключатель
        $(this).attr('data-active', 'true');

        // Получаем целевой контакт
        const targetContact = $(this).data('target');

        // Скрываем все блоки контактов
        $('.contact-block').attr('data-active', 'false');

        $(`[data-contact="${targetContact}"]`).attr('data-active', 'true');
    });
});

$(function () {
    $(document).on('click', '.b-copy-button', function () {
        let successText = 'Скопировано';
        let defaultText = 'Скопировать';

        let $self = $(this);

        function copy() {
            let url = $self.data('url') ? $self.data('url') : location.href;

            let input = $('<input type="text">').val(url);

            input.appendTo('body');

            input.show().select();
            document.execCommand("copy");
            input.remove();

            $self.html(successText);

            setTimeout(() => {
                $self.html(defaultText);
            }, 1400);
        }

        copy();
    });
});

$(document).ready(function() {
    // Инициализируем каждый блок отдельно
    $('.footer-case__refresh').each(function() {
        const $refreshButton = $(this);
        const $container = $refreshButton.closest('.footer-case-container');
        let isLoading = false;
        
        function setLoadingState(loading) {
            isLoading = loading;
            const $icon = $refreshButton.find('.icon-refresh');
            
            if (loading) {
                $refreshButton.prop('disabled', true);
                $icon.addClass('animate-spin');
            } else {
                $refreshButton.prop('disabled', false);
                $icon.removeClass('animate-spin');
            }
        }
        
        function loadNewCase(url) {
            if (isLoading) return;
            
            setLoadingState(true);
            
            // Получаем ID текущего кейса в данном контейнере
            const $currentCase = $container.find('.footer-case').first();
            const currentId = $currentCase.attr('data-id');
            
            // Добавляем ID к URL если он найден
            let requestUrl = url;
            if (currentId) {
                const separator = url.includes('?') ? '&' : '?';
                requestUrl = url + separator + 'id=' + encodeURIComponent(currentId);
            }
            
            $.ajax({
                url: requestUrl,
                method: 'GET',
                dataType: 'html',
                timeout: 10000
            })
            .done(function(html) {
                // Получаем все текущие кейсы в данном контейнере
                const $oldCases = $container.find('.footer-case');
                
                // Парсим новый HTML и устанавливаем data-active
                const $newCase = $(html).attr('data-active', 'false');
                
                // Вставляем новый кейс в контейнер (пока скрытый)
                $container.append($newCase);

                // Шаг 1: Скрываем старые кейсы
                $oldCases.attr('data-active', 'false');
                
                // Шаг 2: Через 150ms (половина анимации) показываем новый кейс
                setTimeout(() => {
                    $newCase.attr('data-active', 'true');
                }, 150);
                
                // Шаг 3: Удаляем старые кейсы через полное время анимации (300ms)
                setTimeout(() => {
                    $oldCases.remove();
                }, 300);
            })
            .fail(function(xhr, status, error) {
                console.error('Ошибка загрузки нового кейса:', error);
            })
            .always(function() {
                setLoadingState(false);
            });
        }
        
        // Обработчик кнопки обновления для данного блока
        $refreshButton.on('click', function() {
            const refreshUrl = $(this).data('refresh-url');
            
            if (!refreshUrl) {
                console.error('Не указан URL для загрузки нового кейса');
                return;
            }
            
            loadNewCase(refreshUrl);
        });
    });
});

$(document).ready(function() {
    const $container = $('.footer-review-container');
    const $refreshButton = $('.footer-review__refresh');
    let isLoading = false;
    
    function setLoadingState(loading) {
        isLoading = loading;
        const $icon = $refreshButton.find('.icon-refresh');
        
        if (loading) {
            $refreshButton.prop('disabled', true);
            $icon.addClass('animate-spin');
        } else {
            $refreshButton.prop('disabled', false);
            $icon.removeClass('animate-spin');
        }
    }
    
    function loadNewReview(url) {
        if (isLoading) return;
        
        setLoadingState(true);
        
        // Получаем ID текущего отзыва
        const $currentReview = $container.find('.footer-review').first();
        const currentId = $currentReview.attr('data-id');
        
        // Добавляем ID к URL если он найден
        let requestUrl = url;
        if (currentId) {
            const separator = url.includes('?') ? '&' : '?';
            requestUrl = url + separator + 'id=' + encodeURIComponent(currentId);
        }
        
        $.ajax({
            url: requestUrl,
            method: 'GET',
            dataType: 'html',
            timeout: 10000
        })
        .done(function(html) {
            // Получаем все текущие отзывы
            const $oldReviews = $container.find('.footer-review');
            
            // Парсим новый HTML и добавляем необходимые классы
            const $newReview = $(html).attr('data-active', 'false');
            
            // Вставляем новый отзыв в контейнер (пока скрытый)
            $container.append($newReview);

            // Шаг 1: Скрываем старые отзывы
            $oldReviews.attr('data-active', 'false');
            
            // Шаг 2: Через 150ms (половина анимации) показываем новый отзыв
            setTimeout(() => {
                $newReview.attr('data-active', 'true');
            }, 150);
            
            // Шаг 3: Удаляем старые отзывы через полное время анимации (300ms)
            setTimeout(() => {
                $oldReviews.remove();
            }, 300);
        })
        .fail(function(xhr, status, error) {
            console.error('Ошибка загрузки нового отзыва:', error);
        })
        .always(function() {
            setLoadingState(false);
        });
    }
    
    // Обработчик кнопки обновления
    $refreshButton.on('click', function() {
        const refreshUrl = $(this).data('refresh-url');
        
        if (!refreshUrl) {
            console.error('Не указан URL для загрузки нового отзыва');
            return;
        }
        
        loadNewReview(refreshUrl);
    });
});

$(function () {
    function getSize(nBytes) {
        var sOutput = nBytes + " байт";
        // optional code for multiples approximation
        for (var aMultiples = ["кб", "мб", "гб", "Тб", "Пб", "Еб"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
            sOutput = nApprox.toFixed(2) + " " + aMultiples[nMultiple];
        }
        // end of optional code
        return sOutput;
    }

    $(document).on('change', '.b-form-upload input[type=file]', function () {
        $list = $(this).closest('.b-form-upload').prev();

        if (this.files.length) {
            for (var i = 0; i < this.files.length; i++) {
                var file = this.files[i];

                var e = $('<div>').addClass('b-form-files__item');

                $('<div>').addClass('b-form-files__name').text(file.name).appendTo(e);
                $('<div>').addClass('b-form-files__size').text(getSize(file.size)).appendTo(e);
                $('<div>').addClass('b-form-files__delete').appendTo(e);

                e.appendTo($list);
            }
        }

        var baseId = $(this).data('id');
        var i = 0;
        var id = baseId + '_' + i;

        while ($('#' + id).length) {
            i++;
            id = baseId + '_' + i;
        }

        $('<input type="file"/>')
            .attr('multiple', 'multiple')
            .attr('name', $(this).attr('name'))
            .attr('id', id)
            .attr('data-id', baseId)
            .insertAfter($(this));
    });

    $(document).on('click', '.b-form-files__delete', function () {
        $(this).closest('.b-form-files__item').addClass('hidden');
    });
});

$(function () {
    $(".b-gallery__item").fancybox({
        type: 'image',
        nextMethod: 'myIn',
        prevMethod: 'myOut',
        padding: 0,
        margin: [45, 0, 100, 0],
        fitToView: true,
        nextClick: true,
        //helpers: {
        //    thumbs: {
        //        width: 50,
        //        height: 50
        //    }
        //}
        beforeLoad: function () {
            if ($(window).width() < 768) {
                var url = $(this.element).attr('href');

                window.open(url, '_self');

                return false;
            }

            return true;
        }
    });
});

$(document).ready(function() {
    // Инициализируем каждый header отдельно
    $('.header').each(function() {
        const $header = $(this);
        const $toggle = $header.find('.header__toggle');
        const $container = $header.find('.header__container');
        
        // Локальное состояние для каждого экземпляра header
        let closeTimeout = null;
        let isManuallyOpened = false;
        let isOpening = false;
        let openingTimeout = null;
        
        function getScrollbarWidth() {
            // Вычисляем ширину скроллбара
            return window.innerWidth - document.documentElement.clientWidth;
        }
        
        function openExtra() {
            // Событие начала открытия
            $(document).trigger('header:open:start', { $header: $header });
            
            $header.attr('data-open', 'true');
            // Вычисляем ширину скроллбара и компенсируем её
            const scrollbarWidth = getScrollbarWidth();
            if (scrollbarWidth > 0) {
                $('body').css('padding-right', scrollbarWidth + 'px');
            }
            // Блокируем прокрутку страницы
            $('body').addClass('overflow-hidden');
            setOpeningState(true);
            
            // Событие завершения открытия (после небольшой задержки для CSS анимации)
            setTimeout(() => {
                $(document).trigger('header:open:end', { $header: $header });
            }, 300);
        }
        
        function closeExtra() {
            // Событие начала закрытия
            $(document).trigger('header:close:start', { $header: $header });
            
            $header.attr('data-open', 'false');
            // Разблокируем прокрутку страницы и убираем компенсацию
            $('body').removeClass('overflow-hidden').css('padding-right', '');
            isManuallyOpened = false;
            setOpeningState(false);
            
            // Событие завершения закрытия
            setTimeout(() => {
                $(document).trigger('header:close:end', { $header: $header });
            }, 300);
        }
        
        function setOpeningState(opening) {
            isOpening = opening;
            
            if (opening) {
                // Устанавливаем таймер завершения процесса opening
                if (openingTimeout) {
                    clearTimeout(openingTimeout);
                }
                openingTimeout = setTimeout(() => {
                    isOpening = false;
                    openingTimeout = null;
                }, 500);
            } else {
                // Сразу завершаем процесс opening при закрытии
                if (openingTimeout) {
                    clearTimeout(openingTimeout);
                    openingTimeout = null;
                }
                isOpening = false;
            }
        }
        
        function clearCloseTimeout() {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
        }
        
        // Обработчик клика на кнопку toggle
        $toggle.on('click', function() {
            clearCloseTimeout();
            
            const isOpen = $header.attr('data-open') === 'true';
            
            if (isOpening && isOpen) {
                // Если меню в процессе автоматического открытия - подтверждаем как ручное открытие
                isManuallyOpened = true;
                return;
            }
            
            if (isOpen) {
                closeExtra();
            } else {
                openExtra();
                isManuallyOpened = true;
            }
        });
        
        // Обработчик клика на свободное место в header__main
        $header.find('.header__main').on('click', function(event) {
            const $target = $(event.target);
            
            // Исключаем клики по активным элементам (упрощенная проверка)
            if (
                $target.closest('.header__link, .header__logo, .header__button_main, .header__button_float, .header__toggle').length
            ) {
                return; // Не открываем/закрываем меню при клике на активные элементы
            }
            
            // Очищаем таймеры
            clearCloseTimeout();
            
            const isOpen = $header.attr('data-open') === 'true';
            
            // Toggle логика - открываем/закрываем при клике на свободное место
            if (isOpen) {
                closeExtra();
            } else {
                openExtra();
                isManuallyOpened = true;
            }
        });
        
        // Обработчик клика на overlay - закрываем меню
        $header.find('.header__overlay').on('click', function() {
            clearCloseTimeout();
            if ($header.attr('data-open') === 'true') {
                closeExtra();
            }
        });
    });
});

$(document).ready(function() {
    // Инициализируем каждый header отдельно для sticky логики
    $('.header').each(function() {
        const $header = $(this);
        const $container = $header.find('.header__container');
        
        // Переменные для отслеживания скролла
        let lastScrollTop = 0;
        let isHidden = false;
        let currentDirection = null; // 'up' или 'down'
        let accumulatedScroll = 0; // накопленные пиксели в текущем направлении
        const scrollThreshold = 5; // минимальный порог для регистрации скролла
        const actionThreshold = 150; // 2 прокрутки по 100px = 200px для действия
        
        // Переменные для отслеживания мыши (только десктоп)
        let mouseY = 0;
        let showReason = null; // 'scroll' или 'mouse' - причина показа шапки
        const mouseThreshold = 100; // граница для показа шапки при наведении мыши
        const isDesktop = () => !('ontouchstart' in window || navigator.maxTouchPoints > 0);
        
        // Показываем header
        function showHeader(reason = 'scroll') {
            if (isHidden) {
                $container.removeClass('header_hidden');
                isHidden = false;
                showReason = reason; // запоминаем причину показа
            }
        }
        
        // Скрываем header
        function hideHeader(reason = 'scroll') {
            if (!isHidden) {
                $container.addClass('header_hidden');
                isHidden = true;
                showReason = null;
            }
        }
        
        // Обработчик скролла
        function handleScroll() {
            // Не обрабатываем скролл если меню открыто
            if ($header.attr('data-open') === 'true') {
                return;
            }
            
            const scrollTop = $(window).scrollTop();
            const scrollDelta = Math.abs(scrollTop - lastScrollTop);
            
            // Пропускаем если изменение меньше порога
            if (scrollDelta < scrollThreshold) {
                return;
            }
            
            const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
            
            // Если направление изменилось - сбрасываем накопитель
            if (currentDirection !== scrollDirection) {
                currentDirection = scrollDirection;
                accumulatedScroll = 0;
            }
            
            // Накапливаем прокрутку в текущем направлении
            accumulatedScroll += scrollDelta;
            
            // Проверяем, достигли ли порога в 150px (2 прокрутки)
            if (accumulatedScroll >= actionThreshold) {
                if (scrollDirection === 'down') {
                    // 2 прокрутки вниз - скрываем header
                    hideHeader('scroll');
                } else if (scrollDirection === 'up') {
                    // 2 прокрутки вверх - показываем header
                    showHeader('scroll');
                }
                
                // Сбрасываем накопитель после действия
                accumulatedScroll = 0;
            }
            
            lastScrollTop = scrollTop;
        }
        
        // Обработчик движения мыши (только для десктопа)
        function handleMouseMove(event) {
            if (!isDesktop() || $header.attr('data-open') === 'true') {
                return;
            }
            
            mouseY = event.clientY;
            
            if (mouseY <= mouseThreshold) {
                // Курсор в верхних 150px - показываем шапку
                if (isHidden) {
                    // showHeader('mouse'); // Временно отключено
                }
            } else {
                // Курсор ушел дальше 150px - скрываем только если показано от мыши
                if (!isHidden && showReason === 'mouse') {
                    // hideHeader('mouse'); // Временно отключено
                }
            }
        }
        
        // Слушаем изменения data-open атрибута
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-open') {
                    const isOpen = $header.attr('data-open') === 'true';
                    
                    if (isOpen) {
                        // Меню открыто - показываем header
                        showHeader('menu');
                    } else {
                        // Меню закрыто - восстанавливаем логику
                        setTimeout(() => {
                            handleScroll();
                        }, 100); // Небольшая задержка для корректной работы
                    }
                }
            });
        });
        
        observer.observe($header[0], {
            attributes: true,
            attributeFilter: ['data-open']
        });
        
        // Инициализация
        // Добавляем класс header_sticky постоянно для применения стилей
        $container.addClass('header_sticky');
        
        // Обработчик скролла с throttling
        let isScrolling = false;
        $(window).on('scroll', function() {
            if (!isScrolling) {
                requestAnimationFrame(function() {
                    handleScroll();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
        
        // Обработчик движения мыши для десктопа
        if (isDesktop()) {
            $(document).on('mousemove', handleMouseMove);
        }
        
        // Сбрасываем накопитель при изменении размера окна
        $(window).on('resize', function() {
            accumulatedScroll = 0;
            currentDirection = null;
            
            // Переключаем обработчик мыши в зависимости от размера экрана
            if (isDesktop()) {
                $(document).off('mousemove', handleMouseMove);
                $(document).on('mousemove', handleMouseMove);
            } else {
                $(document).off('mousemove', handleMouseMove);
            }
        });
        
        // Начальная проверка при загрузке
        handleScroll();
    });
});

$(document).ready(function() {
    // Инициализируем каждый header verticals swiper отдельно
    $('.header-verticals-swiper').each(function() {
        const $container = $(this);
        let headerVerticalsSwiper = null;
        let isInitialized = false; // флаг однократной инициализации
        
        function initHeaderVerticalsSwiper() {
            if ($(window).width() < 1024 && (!headerVerticalsSwiper || headerVerticalsSwiper.destroyed)) {
                headerVerticalsSwiper = new Swiper($container.find('.swiper-container')[0], {
                    slidesPerView: 'auto',
                    freeMode: {
                        enabled: true,
                        momentum: true,
                        momentumRatio: 0.6,
                        momentumBounce: false,
                        sticky: false
                    },
                    spaceBetween: 0,
                    grabCursor: true,
                    resistanceRatio: 0.85,
                    // Отключаем все навигационные элементы для чистого free mode
                    navigation: false,
                    pagination: false,
                    scrollbar: false,
                    // Настройки для оптимизации производительности
                    watchSlidesProgress: true,
                    watchSlidesVisibility: true,
                    // Настройки для корректной работы touch-событий
                    allowTouchMove: true,
                    preventClicks: false,
                    preventClicksPropagation: false,
                    simulateTouch: true,
                    touchStartPreventDefault: false,
                    touchMoveStopPropagation: true,
                    // Настройки для активных состояний на touch устройствах
                    touchEventsTarget: 'wrapper'
                });
                
                isInitialized = true;
            }
        }
        
        function destroyHeaderVerticalsSwiper() {
            if (headerVerticalsSwiper && !headerVerticalsSwiper.destroyed) {
                headerVerticalsSwiper.destroy(true, true);
                headerVerticalsSwiper = null;
            }
        }
        
        // Слушаем глобальное событие первого открытия header для инициализации
        $(document).on('header:open:end', function() {
            if (!isInitialized && $(window).width() < 1024) {
                initHeaderVerticalsSwiper();
            }
        });
        
        // Обработка изменения размера окна (только после первой инициализации)
        $(window).on('resize', function() {
            if (isInitialized) {
                if ($(window).width() < 1024) {
                    initHeaderVerticalsSwiper();
                } else {
                    destroyHeaderVerticalsSwiper();
                }
            }
        });
    });
});

/**
 * Video Modal Component
 * Handles opening/closing video modals and Plyr video playback
 * Also manages intelligent video preloading based on visibility
 */
$(function () {

    // Store Plyr instances
    var plyrInstances = {};

    // Intersection Observer for video preloading
    var videoPreloadObserver;

    // Initialize video modals
    function initVideoModals() {
        // Initialize Plyr for all video players
        initPlyrPlayers();

        // Initialize video preloading observer
        initVideoPreloadObserver();

        // Initialize contact switching observer
        initContactSwitchingObserver();

        // Handle play button clicks
        $(document).on('click', '[data-modal="video"]', function (e) {
            e.preventDefault();

            var $button = $(this);
            var targetSelector = $button.data('target');

            if (!targetSelector) {
                console.error('Missing data-target attribute');
                return;
            }

            var $modal = $(targetSelector);
            if ($modal.length === 0) {
                console.error('Modal not found: ' + targetSelector);
                return;
            }

            openVideoModal($modal);
        });

        // Handle close button clicks
        $(document).on('click', '[data-close]', function (e) {
            e.preventDefault();
            var $modal = $(this).closest('.video-modal');
            closeVideoModal($modal);
        });

        // Handle backdrop clicks
        $(document).on('click', '.video-modal__backdrop', function (e) {
            e.preventDefault();
            var $modal = $(this).closest('.video-modal');
            closeVideoModal($modal);
        });

        // Handle ESC key
        $(document).on('keydown', function (e) {
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
        $('.video-modal__player.plyr-js').each(function () {
            var videoElement = this;
            var modalId = $(videoElement).closest('.video-modal').attr('id');

            // Берём значение, если оно есть, или дефолт для дев-среды
            var mainAssets = (window.mainAssets || '');

            if (!plyrInstances[modalId]) {
                var player = new Plyr(videoElement, {
                    controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
                    invertTime: true,
                    keyboard: { focused: true, global: false },
                    tooltips: false,
                    autoplay: false,
                    hideControls: false,
                    iconUrl: mainAssets + '/assets/vendor/plyr/dist/plyr.svg',
                });

                plyrInstances[modalId] = player;

                player.on('ready', function () {
                    console.log('Plyr ready for: ' + modalId);
                });

                player.on('error', function (event) {
                    console.error('Plyr error: ' + event.detail);
                });
            }
        });
    }

    // Open video modal
    function openVideoModal($modal) {
        var modalId = $modal.attr('id');
        var player = plyrInstances[modalId];

        if (!player) {
            console.error('Plyr instance not found for modal: ' + modalId);
            return;
        }

        // Show modal
        $modal.attr('data-open', 'true');

        // Prevent body scroll
        $('body').addClass('overflow-hidden');

        // Focus on modal for accessibility
        $modal.focus();

        // Auto-play video (sources already preloaded in HTML)
        var playPromise = player.play();

        if (playPromise !== undefined) {
            playPromise
                .then(function () {
                    console.log('Plyr autoplay started successfully for: ' + modalId);
                })
                .catch(function (error) {
                    console.log('Plyr autoplay blocked by browser: ' + error);
                    // Fallback: video will be available for manual play
                });
        }

        console.log('Video modal opened: ' + modalId);
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
            // No need to clear source - it stays preloaded
        }

        // Restore body scroll
        $('body').removeClass('overflow-hidden');

        // Убираем фокус с активного элемента
        if (document.activeElement) {
            document.activeElement.blur();
        }

        console.log('Video modal closed: ' + modalId);
    }

    // Initialize video preloading observer  
    function initVideoPreloadObserver() {
        if ('IntersectionObserver' in window) {
            videoPreloadObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var $button = $(entry.target);
                        var $contactBlock = $button.closest('[data-contact]');
                        var dataTarget = $button.data('target');

                        // Проверяем что кнопка в активном контакте
                        if (dataTarget && $contactBlock.attr('data-active') === 'true') {
                            $(dataTarget + ' video')[0].setAttribute('preload', 'metadata');
                            console.log('Preloading video for:', dataTarget);

                            // Отключаем наблюдение за этой кнопкой
                            videoPreloadObserver.unobserve(entry.target);
                        }
                    }
                });
            }, {
                threshold: 0.5 // Запускаем только когда 50% кнопки видно
            });

            // Наблюдаем за всеми кнопками play
            $('.contact-block__play').each(function () {
                videoPreloadObserver.observe(this);
            });
        }
    }

    // Initialize contact switching observer
    function initContactSwitchingObserver() {
        if ('MutationObserver' in window) {
            var contactObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'data-active') {
                        var target = mutation.target;
                        if (target.getAttribute('data-active') === 'true' && target.hasAttribute('data-contact')) {
                            // Контакт стал активным - сразу делаем preload
                            var $playButton = $(target).find('.contact-block__play');
                            if ($playButton.length > 0) {
                                var dataTarget = $playButton.data('target');
                                if (dataTarget) {
                                    $(dataTarget + ' video')[0].setAttribute('preload', 'metadata');
                                    console.log('Preloading video on contact switch for:', dataTarget);

                                    // Отключаем наблюдение за этой кнопкой в основном observer
                                    if (videoPreloadObserver) {
                                        videoPreloadObserver.unobserve($playButton[0]);
                                    }
                                }
                            }
                        }
                    }
                });
            });

            // Наблюдаем за всеми контакт-блоками
            $('.contact-block[data-contact]').each(function () {
                contactObserver.observe(this, {
                    attributes: true,
                    attributeFilter: ['data-active']
                });
            });
        }
    }

    // Initialize on DOM ready
    initVideoModals();

    console.log('Video modals initialized');
});

var loadOffers = function () {
    function initMasonry() {
        $('.b-offers__list').packery({
            itemSelector: '.b-offers__item',
            columnWidth: 320,
            gutter: 20,
            fitWidth: true,
            // no transitions
            transitionDuration: 0
        });
    }

    $(".b-offers__list img").one("load", function () {
        //$(this).closest('.b-reviews__item').fadeIn();

        initMasonry();
    }).each(function () {
        if (this.complete) $(this).trigger('load');
    });

    initMasonry();
};

$(function () {
    loadOffers();
});

$(function () {
    $('.b-page__anchor').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            var hash = this.hash.slice(1);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 800, function () {
                    location.hash = hash;
                });
                return false;
            }
        }
    });
});

var portfolioBaseUrl = location.href;
var portfolioBaseState = null;
var needChangeState = true;

const checkPortfolioBackground = function () {
    // Find not loaded video in Portfolio item.
    var video = $('.b-portfolio-item__container:not(.b-portfolio-item_ready) .b-portfolio-item__bg');

    if (video.length) {
        console.log('There is a video in Portfolio header. Show it when ready.');

        let startPlaying = function () {
            $('.b-portfolio-item__container').addClass('b-portfolio-item_ready');

            $('.b-portfolio-item__background').fadeIn(300, function () {
                video[0].play();
            });
        };

        if (video[0].readyState === 4) {
            startPlaying();
        } else {
            video[0].addEventListener('canplaythrough', startPlaying);
        }
    } else {
        console.log('There is no video in Portfolio header.');
    }
};

const initPortfolioFancybox = function () {
    $('.b-portfolio__item').fancybox({
        type: 'ajax',
        openEasing: 'easeOutExpo',
        closeEasing: 'easeOutExpo',
        nextEasing: 'easeInOutQuint',
        prevEasing: 'easeInOutQuint',
        openSpeed: 250,
        closeSpeed: 250,
        nextSpeed: 200,
        prevSpeed: 200,
        //closeEffect: 'none',
        //nextEffect: 'none',
        //prevEffect: 'none',
        openMethod: 'myOpen',
        closeMethod: 'myClose',
        nextMethod: 'myIn',
        prevMethod: 'myOut',
        padding: [0, 0, 0, 0],
        margin: [0, 0, 0, 0],
        // margin: [45, 0, 100, 0],
        fitToView: false,
        helpers: {
            overlay: {
                locked: true // Заблокировать фон за оверлеем
            }
        },
        beforeLoad: function () {
            function isMobileDevice() {
                return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
            }

            if ($(window).width() < 1080 || isMobileDevice()) {
                var url = $(this.element).attr('href');

                window.open(url, '_self');

                return false;
            }

            return true;
        },
        beforeShow: function () {
            var path = $.fancybox.current.href;

            var state = { action: 'portfolioItem', path: path };
            var currentState = history.state;

            console.log('beforeShow', state, history);

            // Change URL in browser
            if (needChangeState) {
                if ($($.fancybox.current.element).closest('.fancybox-inner').length) {
                    history.replaceState(state, document.title, path);
                } else {
                    history.pushState(state, document.title, path);
                }
            }
            needChangeState = true;

            checkPortfolioBackground();

            // Add custom overlay
            if (!$('.b-fancybox-overlay').length) {
                $('<div>')
                    .addClass('b-fancybox-overlay')
                    .hide()
                    .appendTo('body')
                    .fadeIn('fast')
                    .click(() => {
                        $.fancybox.close();
                    });
            }

            $('html').addClass('fancybox-margin').addClass('fancybox-lock');

            if ($('.fancybox-wrap').length && $('.fancybox-overlay').length) {
                $('.fancybox-overlay').append($('.fancybox-wrap'));
            }
        },
        afterShow: function () {
            if (typeof window.showIframe == "function") {
                setTimeout(showIframe, 1);
            }

            $('.fancybox-close').appendTo('.b-fancybox-overlay');
            $('.fancybox-close:eq(1)').remove();
        },
        beforeClose: function () {
            var currentstate = history.state;

            console.log('beforeClose', currentstate, history);

            if (window.previousTitle) {
                document.title = window.previousTitle;
                window.previousTitle = null;
            }

            if (currentstate && currentstate.action === 'portfolioItem' && needChangeState) {
                history.pushState(portfolioBaseState, document.title, portfolioBaseUrl);
            }

            $('html').removeClass('fancybox-margin').removeClass('fancybox-lock');
        },
        //width: 1082
        //tpl: {
        //    image: '<div class="b-review-image"><div class="b-review-image__container"><img class="" src="{href}" alt="" /></div></div>'
        //}
    });
}

const initPortfolioSlider = function () {
    if (window.disablePortfolioFancybox) {
        return;
    }

    var F = $.fancybox;
    var getScalar = function (orig, dim) {
            var value = parseInt(orig, 10) || 0;

            if (dim && isPercentage(orig)) {
                value = F.getViewport()[dim] / 100 * value;
            }

            return Math.ceil(value);
        },
        getValue = function (value, dim) {
            return getScalar(value, dim) + 'px';
        };

    $.fancybox.transitions.myOpen = function () {

        var current = F.current,
            effect = current.nextEffect,
            startPos = current.pos,
            endPos = { opacity: 1 },
            direction = F.direction,
            distance = $(window).height() * 0.8,
            field;

        startPos.opacity = 1;

        if (effect === 'elastic') {
            field = 'top';

            startPos[field] = getValue(getScalar(startPos[field]) + distance);
            endPos[field] = '-=' + distance + 'px';
        }

        // Workaround for http://bugs.jquery.com/ticket/12273
        if (effect === 'none') {
            F._afterZoomIn();
        } else {
            F.wrap.css(startPos).animate(endPos, {
                duration: current.openSpeed,
                easing: current.openEasing,
                complete: function () {
                    $('.fancybox-overlay').addClass('fancybox-overlay_bg_white');
                    F._afterZoomIn();
                }
            });
        }
    };

    $.fancybox.transitions.myClose = function () {

        var current = F.current,
            effect = current.nextEffect,
            startPos = current.pos,
            endPos = { opacity: 1 },
            direction = F.direction,
            distance = $(window).height(),
            field;

        startPos.opacity = 1;

        if (effect === 'elastic') {
            field = 'top';

            startPos[field] = getValue(getScalar(startPos[field]));
            endPos[field] = '+=' + distance + 'px';
        }

        // Workaround for http://bugs.jquery.com/ticket/12273
        if (effect === 'none') {
            F._afterZoomOut();
        } else {
            $('.fancybox-overlay').removeClass('fancybox-overlay_bg_white');

            // Remove custom overlay
            $('.b-fancybox-overlay').fadeOut({
                duration: 50,
                complete: function () {
                    $(this).remove();
                },
                easing: 'easeOutExpo'
            });

            F.wrap.css(startPos).animate(endPos, {
                duration: current.closeSpeed,
                easing: current.closeEasing,
                complete: function () {
                    F._afterZoomOut();
                }
            });
        }
    };

    $.fancybox.transitions.myIn = function () {

        // Для того, чтобы не отображался горизонтальный скрол во время анимации. Нельзя задавать через css, т.к. на маленьких экранах не будет скрола, когда он нужен (ширина всплывающего окна ~1000px)
        $('.fancybox-lock .fancybox-overlay').css('overflow-x', 'hidden');

        var current = F.current,
            effect = current.nextEffect,
            startPos = current.pos,
            endPos = { opacity: 1 },
            direction = F.direction,
            distance = $(window).width(),
            field;

        startPos.opacity = 1;

        if (effect === 'elastic') {
            field = direction === 'down' || direction === 'up' ? 'top' : 'left';

            if (direction === 'down' || direction === 'right') {
                startPos[field] = getValue(getScalar(startPos[field]) - distance);
                endPos[field] = '+=' + distance + 'px';

            } else {
                startPos[field] = getValue(getScalar(startPos[field]) + distance);
                endPos[field] = '-=' + distance + 'px';
            }
        }

        // Workaround for http://bugs.jquery.com/ticket/12273
        if (effect === 'none') {
            F._afterZoomIn();

        } else {
            F.wrap.css(startPos).animate(endPos, {
                duration: current.nextSpeed,
                easing: current.nextEasing,
                complete: function () {
                    $('.fancybox-lock .fancybox-overlay').css('overflow-x', 'auto');
                    F._afterZoomIn();
                }
            });
        }
    };

    $.fancybox.transitions.myOut = function () {

        // Для того, чтобы не отображался горизонтальный скрол во время анимации. Нельзя задавать через css, т.к. на маленьких экранах не будет скрола, когда он нужен (ширина всплывающего окна ~1000px)
        $('.fancybox-lock .fancybox-overlay').css('overflow-x', 'hidden');

        var previous = F.previous,
            effect = previous.prevEffect,
            endPos = { opacity: 1 },
            direction = F.direction,
            distance = $(window).width();

        if (effect === 'elastic') {
            endPos[direction === 'down' || direction === 'up' ? 'top' : 'left'] = (direction === 'up' || direction === 'left' ? '-' : '+') + '=' + distance + 'px';
        }

        previous.wrap.animate(endPos, {
            duration: effect === 'none' ? 0 : previous.prevSpeed,
            easing: previous.prevEasing,
            complete: function () {
                $('.fancybox-lock .fancybox-overlay').css('overflow-x', 'auto');
                $(this).trigger('onReset').remove();
            }
        });
    };

    initPortfolioFancybox();
};

$(function () {
    if ($('embed-portfolio-list').length === 0) {
        initPortfolioSlider();
    }
});

// Listen for history state changes
window.addEventListener('popstate', function (e) {
    var state = history.state;

    console.log('popstate', state, history);
    // back button pressed. close popup
    if (!state || state.action === 'popup') {
        if ($.fancybox.isOpened) {
            console.log("Fancybox opened. Let's close it.");
            $.fancybox.close();
        } else {
            console.log('There is no fancybox opened. Nothing to close.');

            return false;
        }
    } else {
        // Forward button pressed, reopen popup
        if (state.action === 'portfolioItem') {
            window.needChangeState = false;
            console.log('dont need state change');

            var link = $('a.b-portfolio__item[href=\"' + state.path + '\"]');

            if (link.length) {
                link.trigger('click');
            } else {
                console.error('!!! There is no with href "' + state.path + '". Need to navigate manually.');
            }
        }

        // Forward button pressed, reopen popup
        if (state.action === 'reviewItem') {
            window.needChangeState = false;
            console.log('dont need state change');

            var link = $('a.b-reviews__item[href=\"' + state.path + '\"]');

            if (link.length) {
                link.trigger('click');
            } else {
                console.error('!!! There is no with href "' + state.path + '". Need to navigate manually.');
            }
        }
    }
});

var loadPortfolio = function (cb) {
    $('.b-portfolio__list').each(function () {
        var $grid = $(this).packery({
            itemSelector: '.b-portfolio__item',
            horizontal: $(this).hasClass('b-portfolio__list_horizontal'),
            // use element for option
            //columnWidth: '.grid-sizer',
            //percentPosition: true
            //columnWidth: $(window).width() < 670 ? 160 : 224,
            //columnWidth: 224,
            //gutter: 20,
            //fitWidth: true,
            // no transitions
            stagger: 0,
            // no transitions
            transitionDuration: 0,
            initLayout: false
        });

        // bind event
        $grid.packery('on', 'layoutComplete', function () {
            cb && cb();
        });

        // trigger initial layout
        $grid.packery();

        loadPortfolioListVideo();
        window.lazyLoadingImages();
    });

    $(".b-portfolio__list img").one("load", function () {
        $(this).closest('.b-portfolio__item').addClass('b-portfolio__item_loaded');
    }).each(function () {
        if (this.complete) $(this).trigger('load');
    });
};

var loadPortfolioListVideo = function () {
    $('.js-portfolio-video').each(function () {
        // Check for already loaded
        // if ($(this).parent().find('video').length) {
        //     return false;
        // }

        var $video = $('<video>')
            .attr('preload', 'auto')
            .attr('playsinline', 'playsinline')
            .addClass('b-portfolio__video')
            .hide();

        let src = $(this).data('src');
        let sources = $(this).data('sources');

        if (src) {
            $video.attr('src', src);
        }

        if (sources) {
            for (let source of sources) {
                $('<source>').attr(source).appendTo($video);
            }
        }

        $video[0].preload = 'auto';
        $video[0].muted = true;
        $video[0].loop = true;
        $video[0].play();

        const onPlayed = function () {
            $video[0].currentTime = 0;
            $video.show();
            $video[0].removeEventListener('canplaythrough', onPlayed);
        };

        $video[0].addEventListener('canplaythrough', onPlayed);

        $($video).insertAfter($(this));

        $(this).remove();
    });
};

document.addEventListener('DOMContentLoaded', function () {
    loadPortfolio();
    checkPortfolioBackground();
});

/**
 * Embed
 */

const loadPortfolioCarousel = function (url) {
    $('embed-portfolio-carousel').each(function () {
        let url = '/portfolio/embed-carousel';
        console.log('URL: ' + url);

        $.get(url, {}, (content) => {
            $(this).after(content);

            setTimeout(() => {
                // loadPortfolio();
                // initPortfolioFancybox();
                loadPortfolioListVideo();
                initPortfolioCarousel();
            }, 1);
        });
    });
}

const initPortfolioCarousel = function () {
    let swiper = new Swiper('.b-portfolio-carousel .swiper-container', {
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

window.initPortfolioPreview = function () {
    const fixArrowsTop = function () {
        let top =
            $('.b-portfolio-item__head:visible').height()
            + parseInt($('.b-portfolio-item__head:visible').css('padding-bottom'))
            + $('.b-size-tabs:visible').height()
            + parseInt($('.b-size-tabs:visible').css('padding-top'))
            + parseInt($('.b-size-tabs:visible').css('padding-bottom'))
            + parseInt($('.tab-pane.active .b-portfolio-item__view .tab-pane.active').css('padding-top'))
            + ($('.tab-pane.active .b-portfolio-item__view .tab-pane.active').height() / 2)
            - ($('.b-portfolio-preview__next').height() / 2);

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

    window.portfolioPreviewNext = function () {
        if (portfolioPreviewUrlIndex + 1 >= portfolioPreviewUrls.length) {
            return;
        }

        portfolioPreviewUrlIndex++;

        loadPortfolioPreview(portfolioPreviewUrls[portfolioPreviewUrlIndex]);
    };

    window.portfolioPreviewPrev = function () {
        if (portfolioPreviewUrlIndex <= 0) {
            return;
        }

        portfolioPreviewUrlIndex--;

        loadPortfolioPreview(portfolioPreviewUrls[portfolioPreviewUrlIndex]);
    };

    $('.b-portfolio-preview__next').on('click', window.portfolioPreviewNext);
    $('.b-portfolio-preview__prev').on('click', window.portfolioPreviewPrev);
}

;(function(){
	$(function(){
		$(document).on('mouseenter','.js-portfolio-tag', function(){
				var $that = $(this),
				    css = {},
				    data = $that.data();
				
				if(data['tagBackgroundHover'])
				{
					css.background = data['tagBackgroundHover'];
				}
				if(data['tagColorHover'])
				{
					css.color = data['tagColorHover'];
				}
				$that.css(css);
				
				var $img = $that.children('img');
				$img.data('originSrc', $img.attr('src'));
				$img.attr('src',$img.data('hoverSrc'));
			}).on('mouseleave','.js-portfolio-tag', function(){
				var $that = $(this),
				    css = {
					    background:'',
					    color     :''
				    },
				    data  = $that.data();
				
				if(data['tagBackground'])
				{
					css.background = data['tagBackground'];
				}
				if(data['tagColor'])
				{
					css.color = data['tagColor'];
				}
				$that.css(css);
				
				var $img = $that.children('img');
				$img.attr('src', $img.data('originSrc'));
			}
		);
		$('.js-portfolio-tag').each(function(){
			var img = new Image();
			img.style.display = 'none';
			img.src = $(this).children('img').data('hoverSrc');
			$(this).append(img);
		});
	});
})();

$(function () {
    $('.b-prices__link').fancybox({
        type: 'inline',
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        margin: [45, 0, 100, 0],
        fitToView: false
    });
});

$(function () {
    $('[data-toggle="popover"]').popover({
        html: true,
        placement: 'top',
        trigger: 'hover'
    })
});

const reviewToggler = function () {
    const reviewTextMaxHeight = 600;

    $('.b-review__collapse:not(.b-review__collapse__collapsed)').each(function () {
        if ($(this).height() > reviewTextMaxHeight) {
            $(this).addClass('b-review__collapse__collapsed');
            $(this).next('.b-review__toggle').removeClass('hidden');
        }
    });

    $('.b-review__button').on('click', function (e) {
        e.preventDefault();

        var collapser = $(this).closest('.b-review').find('.b-review__collapse');
        var contentHeight = $(this).closest('.b-review').find('.b-review__text').height();

        if (collapser.hasClass('b-review__collapse__collapsed')) {
            collapser.css('max-height', contentHeight);

            setTimeout(function () {
                collapser.css('max-height', 'none');
            }, 200);
        } else {
            collapser.css('max-height', collapser.find('.b-review__text').height());
        }

        setTimeout(function () {
            collapser.toggleClass('b-review__collapse__collapsed');
        }, 1);

        // Toggle buttons after container slideDown.
        setTimeout(function () {
            collapser.next('.b-review__toggle').find('.b-review__button').toggleClass('hidden');
        }, 200);
    });
};

window.reviewToggler = reviewToggler;

$(function () {
    // $('.b-review_video .b-review__link').fancybox({
    //     openEffect: 'none',
    //     closeEffect: 'none',
    //     padding: 0,
    //     margin: [45, 0, 100, 0],
    //     helpers: {
    //         media: {}
    //     },
    //     beforeLoad: function () {
    //         if ($(window).width() < 768) {
    //             var url = $(this.element).attr('href');
    //
    //             window.open(url, '_self');
    //
    //             return false;
    //         }
    //
    //         return true;
    //     }
    // });

    // $('.b-review_image .b-review__link').fancybox({
    //     type: 'inline',
    //     openEffect: 'none',
    //     closeEffect: 'none',
    //     padding: 0,
    //     margin: [45, 0, 100, 0],
    //     fitToView: false,
    //     beforeLoad: function () {
    //         if ($(window).width() < 900) {
    //             var url = $(this.element).data('url');
    //
    //             window.open(url, '_self');
    //
    //             return false;
    //         }
    //
    //         return true;
    //     }
    //     //tpl: {
    //     //    image: '<div class="b-review-image"><div class="b-review-image__container"><img class="" src="{href}" alt="" /></div></div>'
    //     //}
    // });
});

var reviewsBaseUrl = location.href;
var reviewsBaseState = null;

$(function () {
    $('.b-reviews__item').fancybox({
        type: 'ajax',
        openEasing: 'easeOutExpo',
        closeEasing: 'easeOutExpo',
        nextEasing: 'easeInOutQuint',
        prevEasing: 'easeInOutQuint',
        openSpeed: 250,
        closeSpeed: 250,
        nextSpeed: 200,
        prevSpeed: 200,
        //closeEffect: 'none',
        //nextEffect: 'none',
        //prevEffect: 'none',
        openMethod: 'myOpen',
        closeMethod: 'myClose',
        nextMethod: 'myIn',
        prevMethod: 'myOut',
        padding: [0, 0, 0, 0],
        margin: [0, 0, 0, 0],
        fitToView: false,
        beforeLoad: function () {
            function isMobileDevice() {
                return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
            }

            if ($(window).width() < 1080 || isMobileDevice()) {
                var url = $(this.element).attr('href');

                window.open(url, '_self');

                return false;
            }

            return true;
        },
        beforeShow: function () {
            var path = $.fancybox.current.href;

            var state = {action: 'reviewItem', path: path};
            var currentState = history.state;

            // Change URL in browser
            if (window.needChangeState) {
                if ($($.fancybox.current.element).closest('.fancybox-inner').length) {
                    history.replaceState(state, document.title, path);
                } else {
                    history.pushState(state, document.title, path);
                }
            }

            window.needChangeState = true;

            // Add custom overlay
            if (!$('.b-fancybox-overlay').length) {
                $('<div>')
                    .addClass('b-fancybox-overlay')
                    .hide()
                    .appendTo('body')
                    .fadeIn('fast')
                    .click(() => {
                        $.fancybox.close();
                    });
            }
        },
        afterShow: function () {
            $('.fancybox-close').appendTo('.b-fancybox-overlay');
            $('.fancybox-close:eq(1)').remove();
            loadPortfolio();
        },
        beforeClose: function () {
            var currentstate = history.state;

            console.log('beforeClose', currentstate, history);

            if (window.previousTitle) {
                document.title = window.previousTitle;
                window.previousTitle = null;
            }

            if (currentstate && currentstate.action == 'reviewItem' && needChangeState) {
                history.pushState(reviewsBaseState, document.title, reviewsBaseUrl);
            }
        }
        //width: 1082
        //tpl: {
        //    image: '<div class="b-review-image"><div class="b-review-image__container"><img class="" src="{href}" alt="" /></div></div>'
        //}
    });
});

var loadReviews = function (cb) {
    function initMasonry(cb) {
        var $grid = $('.b-reviews__list').packery({
            itemSelector: '.b-reviews__item',
            columnWidth: '.b-reviews__item',
            gutter: '.b-reviews__gutter',
            // no transitions
            transitionDuration: 0,
            initLayout: false
        });

        // bind event
        $grid.packery('on', 'layoutComplete', function () {
            cb && cb();
        });

        // trigger initial layout
        $grid.packery();
    }

    function loadSprite(src) {
        var deferred = $.Deferred();
        var sprite = new Image();
        sprite.onload = function () {
            deferred.resolve();
        };
        sprite.src = src;
        return deferred.promise();
    }

    var loaders = [];

    $('.b-reviews__list img').each(function () {
        // loaders.push(loadSprite($(this).attr('src')));
        loadSprite($(this).attr('src')).done(function () {
            //$(this).closest('.b-reviews__item').fadeIn();
            $('.b-reviews__item').addClass('b-reviews__item_loaded');

            initMasonry(cb);
        });
    });

    // $.when.apply(null, loaders);

    $(".b-reviews__list img").one("load", function () {
        //$(this).closest('.b-reviews__item').fadeIn();
        $('.b-reviews__item').addClass('b-reviews__item_loaded');

        initMasonry();
    }).each(function () {
        if (this.complete) $(this).trigger('load');
    });

    // if (!$('.b-reviews__list img').length) {
    $('.b-reviews__item').addClass('b-reviews__item_loaded');
    initMasonry(cb);
    // }
};

$(function () {
    loadReviews();
});

$(function () {
    $('.b-blog-menu__item_search>.b-blog-menu__link').on('click', function (e) {
        e.preventDefault();

        $(this).next('.b-search-form').removeClass('hidden');
    });

    $('.b-search-form__close').on('click', function (e) {
        e.preventDefault();

        $(this).closest('.b-search-form').addClass('hidden');
    });
});

$(function () {
    $('.b-size-filter__list').each(function () {
        if ($(this).height() > 92) {
            $(this).css('max-height', $('.b-size-filter').height());
            $(this).addClass('b-size-filter__list_collapsed');
            $(this).next('.b-size-filter__toggle').removeClass('hidden');
        }
    });

    $('.b-size-filter__toggle').on('click', function (e) {
        e.preventDefault();

        $(this).prev('.b-size-filter__list').toggleClass('b-size-filter__list_collapsed');
        $(this).find('.b-size-filter__toggle-text').toggleClass('hidden');
        $(this).blur(); // Leave focus from toggle link

        $('html, body').animate({
            scrollTop: $(".b-size-filter__list").offset().top
        }, 200);
    });
});

$(function () {
    $('.b-slider').slick({
        infinite: true,
        dots: false,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    dots: true,
                    arrows: false
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });
});

$(function () {
    $('.b-vacancies__title').on('click', function (e) {
        e.preventDefault();

        $(this).closest('.b-vacancies__item').toggleClass('b-vacancies__item_collapsed');
    });

    $('.b-vacancies__button').fancybox({
        type: 'inline',
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        margin: [45, 0, 100, 0],
        fitToView: false
    });
});
