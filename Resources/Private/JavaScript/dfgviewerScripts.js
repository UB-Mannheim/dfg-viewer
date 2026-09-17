/**
 * Copyright notice
 *
 * (c) Saxon State and University Library Dresden <typo3@slub-dresden.de>
 * All rights reserved
 *
 * This script is part of the TYPO3 project. The TYPO3 project is
 * free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * The GNU General Public License can be found at
 * http://www.gnu.org/copyleft/gpl.html.
 *
 * This script is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * This copyright notice MUST APPEAR in all copies of the script!
 */

/*!

    Custom scripts
    ------------------------
    DFG viewer script for cookies, sidebar adaption eg.

!*/

$(document).ready(function() {

    // check mobile device to specify click events
    function mobileCheck() {
        var check = false;
        (function (a) {
            if (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }
    var mobileEvent = mobileCheck() ? 'touchend' : 'click';

    function touchSupport() {
        return 'ontouchstart' in window || navigator.maxTouchPoints; // Check for touch support
    }

    // menu toggles for offcanvas toc and metadata
    $('.offcanvas-toggle').on(mobileEvent, function(event) {
        // close nav on link or download if opend
        close_all_submenues();

        $(this).parent().toggleClass('open');
    });

    $('.control-bar .collapse-trigger').on(mobileEvent, function() {
        $('.main-wrapper').toggleClass('control-bar-collapsed');
    });

    // active toggle for submenus
    $('.document-functions li.submenu > a').on(mobileEvent, function(event) {
        // close nav on link or download if opend
        close_all_submenues('in-secondary-nav');

        // close secondary nav if click on link or download
        $('nav .secondary-nav').removeClass('open');

        $('li.submenu.open a').not(this).parent().removeClass('open');
        $(this).parent().toggleClass('open');
        return false;
    });

    // section toggle inside the sidebar on larger screens
    $('.control-bar .control-bar-container h3').on('click', function () {
        $(this).parent().toggleClass('section-hidden');
    });

    // toggle for full metadata display in sidebar
    if ($('.control-bar .metadata-basic dl.tx-dlf-metadata-titledata').length > 1) {
        var metadataToggleLabelMore = ($('html[lang^="de"]')[0]) ? 'mehr Metadaten anzeigen' : 'more Metadata';
        var metadataToggleLabelLess = ($('html[lang^="de"]')[0]) ? 'weniger Metadaten anzeigen' : 'less Metadata';
        $('.control-bar .metadata-basic').append('<div class="metadata-toggle">' + metadataToggleLabelMore + '</div>');
        if (Cookies.get('tx-dlf-allmetadata') === 'true') {
            $('.control-bar .metadata-basic').addClass('all-metadata').find('.metadata-toggle').text(metadataToggleLabelLess);
            $('.control-bar .metadata-basic').find('dl.tx-dlf-metadata-titledata:nth-child(n+3)').show();
        }
        $('.metadata-toggle').on('click', function () {
            if (!$('.control-bar .metadata-basic').hasClass('all-metadata')) {
                Cookies.set('tx-dlf-allmetadata', 'true', {sameSite: 'lax'});
                $(this).text(metadataToggleLabelLess);
            } else {
                Cookies.remove('tx-dlf-allmetadata');
                $(this).text(metadataToggleLabelMore);
            }
            $('.control-bar .metadata-basic').toggleClass('all-metadata').find('dl.tx-dlf-metadata-titledata:nth-child(n+3)').slideToggle();
        });
    }

    // extract title information from the metadata and add it to the top of the sidebar
    ($('.tx-dlf-metadata dl.tx-dlf-metadata-titledata dd.tx-dlf-title')[0]) && $('.tx-dlf-metadata').prepend('<div class="metadata-title"><h2>' + $('.tx-dlf-metadata dl.tx-dlf-metadata-titledata').first().find('dd.tx-dlf-title').text() + '</h2></div>');

    /*
    // if there is no title in the first metadata block, take it from table of contents and clone it to the header and first position
    let header = $('.tx-dlf-metadata .metadata-title h2');
    if (header.text().length < 1) {
        header.remove();
        let firstEntry = $('li.tx-dlf-tableofcontents-current a').first()[0];
        if (firstEntry) {
            let title = firstEntry.title;
            $('.tx-dlf-metadata').prepend('<div class="metadata-title"><h2>' + title + '</h2></div>');
            $('.tx-dlf-metadata dl.tx-dlf-metadata-titledata').first().prepend('<dt class="tx-dlf-title">' + (($('html[lang^="de"]')[0]) ? ' Titel' : ' Title') + '</dt><dd class="tx-dlf-title">' + title + '</dd>');
        }

    }
    */
    // TOC-Fallback entfernt: techn. Labels (z.B. "title_page") tauchten als Titel auf.
    // Ein leerer Header wird stattdessen komplett entfernt.
    let header = $('.tx-dlf-metadata .metadata-title h2');
    if (header.text().trim().length < 1) {
        header.closest('.metadata-title').remove();
    }    

    // add a toggle function for sub metadata "(+ n more)"
    $('dl.tx-dlf-metadata-titledata dd > dl').each(function () {
        $(this).parent().addClass('has-submetadata').prepend('<span class="submetadata-toggle">+' + $(this).find('dt').length + (($('html[lang^="de"]')[0]) ? ' weitere' : ' more') + '</span>').prev().addClass('has-submetadata');
    });
    $('.submetadata-toggle').on('click', function () {
        $(this).parent().toggleClass('open');
    });

    // insert dd tag between two dt tags if necessary
    $('dl.tx-dlf-metadata-titledata dt').each(function () {
        $(this).after($(this).next('dt').length > 0 && $('<dd/>'))
    });

    // secondary nav toggle
    $('nav .nav-toggle').on(mobileEvent, function(event) {
        $(this).toggleClass('active');
        $('nav .viewer-nav').toggleClass('open');

        // close subnav when primary nav if open
        close_all_submenues('in-primary-nav');
    });

    // calendar dropdowns
    $('.calendar-view .contains-issues').on(mobileEvent, function(event) {
        $('.calendar-view table td.open').not($(this).parent()).removeClass('open');
        $(this).parent().toggleClass('open');
    });

    // add body class if any calendar is present
    $('.tx-dfgviewer-newspaper-calendar').parents('body').addClass('calendar');
    $('.tx-dfgviewer-newspaper-years').parents('body').addClass('calendar');

    // Inject view switch functions for calendar/list view (initial show calendar)
    $('.tx-dfgviewer-newspaper-calendar .calendar-list-selection a.select-calendar-view, .tx-dfgviewer-newspaper-calendar .calendar-view').addClass('active');
    $('.tx-dfgviewer-newspaper-calendar .calendar-list-selection a').on(mobileEvent, function(event) {
        if(!$(this).hasClass('active')) {
        var targetElement = '.'+$(this).attr('class').replace('select-','');
        $('.tx-dfgviewer-newspaper-calendar .active').removeClass('active');
        $(this).addClass('active');
        $(targetElement).addClass('active');
        }
    });

    // Avoid broken image display if METS definitions are wrong
    $('.provider img').each(function() {
        if((typeof this.naturalWidth != "undefined" && this.naturalWidth == 0 ) || this.readyState == 'uninitialized' ) {
            $(this).parents('.document-functions').addClass('missing-provider-image');
        }
    });

    // Copy selected page number to mobile meta (in order to transform select field to ui button)
    if($('.tx-dlf-navigation-pages select option[selected]')[0]) {
        const pageNumberText = $('.tx-dlf-navigation-pages select option[selected]').text();
        $('dl.mobile-meta').append('<dt class="mobile-page-number">No.</dt><dd class="mobile-page-number"></dd>');
        $('dl.mobile-meta dd.mobile-page-number').text(pageNumberText);
    }

    // Copy some controls for mobile (page select, fullscreen)
    $('.provider').append('<div class="mobile-controls" />');
    $('.view-functions .tx-dlf-navigation-pages form, .view-functions .tx-dlf-tools-fullscreen, .fulltext-search-toggle').clone().appendTo('.provider .mobile-controls');

    // Shorten mobile meta title
    let shortenMobileMetaElement = $('.provider dl.mobile-meta dd.tx-dlf-title a');
    let shortenMobileMetaTitle = shortenMobileMetaElement.text();
    if(shortenMobileMetaTitle.length > 140) {
        shortenMobileMetaTitle = shortenMobileMetaTitle.substr(0,140) + '...';
        shortenMobileMetaElement.text(shortenMobileMetaTitle);
    }

    // Check if there are is a download list. Otherwise change a to span to disable button
    if(!$('.submenu.downloads ul li')[0]) {
        $("#tab-downloads").replaceWith(function () {
            // Create a new element using jQuery with sanitized content
            return $("<span/>", {
                "title": $(this).attr('title'),
                "class": $(this).attr('class'),
                "id": $(this).attr('id'),
                "text": $(this).html() // Use "text" to set the text content, escaping it
            });
        });
    }

    // if cookie for fullscreen view is present adapt initial page rendering
    if (Cookies.get('tx-dlf-pageview-zoomFullscreen') === 'true') {
        $('body').addClass('fullscreen static');
        $('li.tx-dlf-tools-fullscreen a').addClass('active');
    }

    // enable click on fullscreen button
    $('a.fullscreen, li.tx-dlf-tools-fullscreen a').on(mobileEvent, function(e) {
        // Ignore synthetic/programmatic activations: only a real user action may
        // toggle fullscreen. Otherwise a stray extension/double-tap event ends
        // fullscreen a few seconds after load and the top inset re-flows, making
        // the image-tools bar jump ~20px without the user doing anything.
        if (e && e.originalEvent && e.originalEvent.isTrusted === false) {
            return;
        }
        close_all_submenues('all');
        if($('body.fullscreen')[0]) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    });

    // Replace link for error message to add link to the volume
    function replaceLinkForVolume() {
        const $emptyContainer = $('.tx-dlf-pageview .tx-dlf-empty');

        // If the container with empty message replace link
        if ($emptyContainer.length > 0) {
            const firstVolHref = $('.tx-dlf-tableofcontents ul li ul li:first-child a').attr('href');
            $('.tx-dlf-emptyToFirstVol').attr('href', firstVolHref || '#');
        }
    }

    // Wait for 500ms to replace link
    setTimeout(replaceLinkForVolume, 500);

    // Complex page turning mechanism and check if a click on page control was made and unfold next/back navigation
    if (touchSupport()) {
        $('.tx-dlf-navigation-forward, .tx-dlf-navigation-backward')
            .on('touchstart', function () {
                $(this).addClass('over').siblings('[class$=' + $(this).attr('class').split(' ')[0].slice(1) + ']').addClass('over');
                triggeredElement = $(this);
                setTimeout(function () {
                    triggeredElement.addClass('enable-touchevent');
                }, 250);
            })
            .on('touchend', function () {
                localStorage.txDlfFromPage = $(this).attr('class').split(' ')[0];
            });
        $('body').on('touchstart', function (event) {
            let target = $(event.target);
            if (!target.closest('.page-control')[0]) {
                $('.tx-dlf-navigation-forward, .tx-dlf-navigation-backward').removeClass('over enable-touchevent').siblings('[class$=' + $(this).attr('class').split(' ')[0].slice(1) + ']').removeClass('over');
                localStorage.clear();
            }
        });
        if (localStorage.txDlfFromPage) {
            $('.' + localStorage.txDlfFromPage).addClass('no-transition over enable-touchevent');
            localStorage.clear();
        }
    } else {
        $('.tx-dlf-navigation-forward, .tx-dlf-navigation-backward')
            .on('mouseenter', function () {
                $(this).addClass('over').siblings('[class$=' + $(this).attr('class').split(' ')[0].slice(1) + ']').addClass('over');
            })
            .on('mouseleave', function () {
                $(this).removeClass('over').siblings('.measureBacks, .measureFwds').removeClass('over');
            })
            .on('click', function () {
                localStorage.txDlfFromPage = $(this).attr('class').split(' ')[0];
                showLoadingAnimation();
            });
        if (localStorage.txDlfFromPage) {
            $('.' + localStorage.txDlfFromPage).addClass('no-transition over');
            localStorage.clear();
        }
    }

    $('.measureBacks, .measureFwds').on('click', function (evt)
    {
        showLoadingAnimation();
    });

    // Finally all things are settled. Bring back animations a second later.
    setTimeout(function () {
        localStorage.clear();
        $('.tx-dlf-navigation-forward, .tx-dlf-navigation-backward').removeClass('no-transition');
        $('body').removeClass('static');
    }, 1000);

    // Closing open menus in different situations
    $('.tx-dlf-tools-imagetools').on('click', function (event) {
        close_all_submenues('all');
    });
    $('.page-control').on('click', function (event) {
        close_all_submenues('all');
    });
    $('.tx-dlf-map').on('click', function (event) {
        close_all_submenues('all');
    });

    // In calendar: if only one issue for this day: click on date open this issue
    $('.issues').each( function() {
        var nCountIssues = $(this).find("ul").find("li").length;
        if (nCountIssues > 1) {
            //$(this).addClass("testgt");
        } else {
            var cAnker = $(this).find("ul").find("li").find("a").attr("href");
            // Open day with click or touch if only one issue for this day
            $(this).parent().find(".contains-issues").on("click touch", function() {
                window.location.href = cAnker;
            });
        };
    });

    // Toggle and setup for the 'in document search'
    // from slub
    if ($('.tx-dlf-toolbox-searchindocument form')[0]) {
        $('.tx-dlf-toolbox-searchindocument-search-toggle').on('click', function () {
            $('body').toggleClass('tx-dlf-toolbox-searchindocument-search-active');
            //$('.tx-dlf-toolbox-searchindocument').css({top: ($(this).offset().top - 60) + 'px'});
            $('body.tx-dlf-toolbox-searchindocument-search-active #tx-dlf-toolbox-searchindocument-input-query').trigger('focus');
        });
    } else {
        $('.tx-dlf-toolbox-searchindocument-search-toggle').addClass('disabled');
    }


    // Add an error message if no map element in document viewer is given
    function checkForChild() {
        if (document.getElementById('NoImages')) {

            const emptyMessage = ($('html[lang^="de"]')[0])
                ? 'Kein Band ausgew&auml;hlt. Klicken Sie hier um zum ersten Band dieses Werks zu gelangen.'
                : 'No volume selected. Click to jump to the first available volume.';

            $('.tx-dlf-pageview').children('.tx-dlf-map').remove();
            //$('.tx-dlf-pageview').append('<div class="tx-dlf-empty"><a class="tx-dlf-emptyToFirstVol" href="' + $('.tx-dlf-toc ul li ul li:first-child a').attr('href') + '"><span class="error-arrow">&larr;</span>' + emptyMessage + '</a></div>');
            if ($('ul.toc li:first-child a').length) {
                console.log("ergänze empty hinweis");
                $('.tx-dlf-pageview').append('<div class="tx-dlf-empty ubma"><a class="tx-dlf-emptyToFirstVol" href="' + $('ul.toc li:first-child a').attr('href') + '"><span class="error-arrow ubma">&larr;</span>' + emptyMessage + '</a></div>');
                $('#NoImages').remove();
                $('.downloads').addClass("disabled");
                $('.doublepage').addClass("disabled");
                $('.doublepage a').on('click', function (e) { e.preventDefault(); });
                $('.document-submenu li.tx-dlf-tools-mets').addClass("disabled").on('click', function (e) { e.preventDefault(); });
                $('.document-submenu li.tx-dlf-tools-pdfdownload').addClass("disabled").addClass("hidden");
                $('.document-submenu li.tx-dlf-tools-fulltextdownload').addClass("disabled").addClass("hidden");
            } else {
                console.log("entferne #NoImages");
                $('#NoImages').remove();
            };
        };
    };

    // Wait for 500ms to give OpenLayers time to populate the .tx-dlf-map Element
    setTimeout(checkForChild, 500);


    // Der Viewer feuert "map-loadend", sobald Karte + Controls initialisiert sind.
    // Danach darf die Ansicht so nachjustiert werden, dass das Bild (Cover) in
    // den freien Bereich bleibt (außerhalb linke Navigation + geöffnetem Fulltext).
    $(window).on('map-loadend', function () {
        initCoverFreeAreaClamping();
    });

});

$(document).keyup(function(e) {

    // Check if ESC key is pressed. Then end fullscreen mode or close SRU form.
    if (e.keyCode == 27) {
        if($('body.fullscreen')[0]) {
            return exitFullscreen();
        }
        if($('.document-functions .search.open')[0]) {
            $('.document-functions .search').removeClass('open');
        }
    }
    // Check if the F key is pressed and no text input in SRU form is taking place.
    if (e.keyCode == 70 && !$('#tx-dfgviewer-sru-query').is(':focus')) {
        if (e.keyCode == 70 && !$('#tx-dlf-toolbox-searchindocument-input-query').is(':focus')) {
            return enterFullscreen();
        }
    }


});

// Activate fullscreen mode and set corresponding cookie
function enterFullscreen() {
    setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 220);
    $("body").addClass('fullscreen');
    $('li.tx-dlf-tools-fullscreen a').addClass('active');
    Cookies.set('tx-dlf-pageview-zoomFullscreen', 'true', { sameSite: 'lax' });
}

// Exit fullscreen mode and drop cookie
function exitFullscreen() {
    setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 220);
    $("body").removeClass('fullscreen');
    $('li.tx-dlf-tools-fullscreen a').removeClass('active');
    Cookies.remove('tx-dlf-pageview-zoomFullscreen');
}

function showLoadingAnimation() {
    $("#overlay").fadeIn(300);
}

function close_all_submenues(environment = '') {
    // close nav on link or download if opened
    if (environment !== 'in-secondary-nav') {
        // Not with in-seondary-nav otherwise menus can no longer be closed
        $('li.submenu.open a').parent().removeClass('open');
    };
    if ((environment === 'in-secondary-nav') || (environment === 'all') ) {
        // close subnav if opend
        $('nav .nav-toggle').removeClass('active');
        $('nav .secondary-nav').removeClass('open');
        $('nav ul.viewer-nav').removeClass('open');
    };
}
/**
 * Keeps the cover inside the free area of the viewport while zooming / panning.
 *
 * The cover is rendered by an OpenLayers map (tx_dlf_viewer.map). The left
 * sidebar (toc + metadata) and the opened fulltext overlay may be drawn on
 * top of the map, so both count as "not free" and the view is clamped to the
 * remaining (free) rectangle.
 *
 * Behavior:
 * - cover smaller than the free rect -> the cover has to stay completely
 *   inside the free rect (background margin may remain around it), i.e. it can
 *   never be moved underneath the sidebar or the fulltext overlay
 * - cover larger than the free rect  -> the cover has to cover the free rect,
 *   i.e. nothing under the sidebar / fulltext overlay may be revealed
 *
 * Both cases collapse into one constraint window. The view is clamped to that
 * window only at rest (no dragging, no running zoom animation), so the native
 * zoom / pan behavior and their "true" sizes stay untouched and no + / -
 * jump asymmetry can occur.
 *
 * Everything is measured at runtime in CSS pixels, so it adapts automatically
 * to all breakpoints, to mobile off-canvas layouts, collapsed sidebar and
 * fullscreen mode.
 */
function initCoverFreeAreaClamping() {
    if (typeof tx_dlf_viewer === 'undefined' || !tx_dlf_viewer.map || typeof ol === 'undefined') {
        return;
    }

    var map = tx_dlf_viewer.map;
    var view = map.getView();
    var mapEl = map.getTargetElement();
    if (!mapEl || !view || !mapEl.getBoundingClientRect) {
        return;
    }

    // left overlay (toc + metadata)
    var navEl = $('.control-bar')[0];

    function isFulltextOverlayOpen() {
        return document.body.classList && document.body.classList.contains('fulltext-visible');
    }

    // width of the overlay currently blocking the right side of the map,
    // 0 if the fulltext is closed
    function measureRightOverlayWidth() {
        if (!isFulltextOverlayOpen()) {
            return 0;
        }

        var rect = mapEl.getBoundingClientRect();
        var candidates = [
            document.getElementById('tx-dlf-toolbox-fulltext-selection'),
            document.querySelector('.tx-dlf-toolbox-fulltext-container')
        ];

        var width = 0;
        for (var i = 0; i < candidates.length; i++) {
            var el = candidates[i];
            if (!el || !el.getBoundingClientRect) {
                continue;
            }
            var r = el.getBoundingClientRect();
            if (r.left < rect.left) {
                // degenerated layout, ignore this candidate
                continue;
            }
            width = Math.max(width, rect.right - r.left);
        }
        return Math.max(0, width);
    }

    // free rectangle of the map viewport in CSS px (relative to the viewport)
    function measureFreeArea() {
        var rect = mapEl.getBoundingClientRect();
        if (!rect || rect.width < 20 || rect.height < 20) {
            return null;
        }

        // left overlay (toc + metadata) - only counts if it actually overlaps the map
        var left = 0;
        if (navEl && navEl.offsetWidth > 0 && navEl.getBoundingClientRect) {
            left = Math.max(0, navEl.getBoundingClientRect().right - rect.left);
        }

        // right overlay (fulltext) - only counts while it is opened
        var right = measureRightOverlayWidth();

        return {
            x: left,
            width: Math.max(0, rect.width - left - right),
            vpW: rect.width,
            vpH: rect.height
        };
    }

    var enforcing = false;
    function clampView() {
        if (enforcing) {
            return;
        }
        enforcing = true;

        try {
            // clamping is only defined for unrotated views
            if (view.getRotation() === undefined || Math.abs(view.getRotation()) > 1e-6) {
                return;
            }

            var resolution = view.getResolution();
            if (!resolution || resolution <= 0) {
                return;
            }

            // image extent in map units (1 map unit == 1 image pixel)
            var imgExtent = view.getProjection().getExtent();
            if (!imgExtent) {
                return;
            }

            var free = measureFreeArea();
            if (!free || free.width < 20) {
                return;
            }

            var center = view.getCenter();
            if (!center) {
                return;
            }

            var x0 = imgExtent[0];
            var w = imgExtent[2] - imgExtent[0];
            var fx = free.x;
            var fw = free.width;
            var vpW = free.vpW;
            var vpH = free.vpH;

            // The image's left/right edge as a function of the view center x
            // (cx), in CSS px relative to the top-left of the map viewport:
            //   leftPx  = vpW/2 - (cx - x0) / res
            //   rightPx = leftPx + w / res
            // The two "edge meets free-rect edge" positions give the center
            // bounds; min/max over them enforces "inside the free rect" when the
            // cover is narrower and "cover the free rect" when it is wider.
            //   A: leftPx  == fx            -> cx = x0 + res * (vpW/2 - fx)
            //   B: rightPx == fx + fw       -> cx = x0 + w - res * (fx + fw - vpW/2)
            var boundA = x0 + resolution * (vpW / 2 - fx);
            var boundB = x0 + w - resolution * (fx + fw - vpW / 2);
            var minCx = Math.min(boundA, boundB);
            var maxCx = Math.max(boundA, boundB);
            var targetX = Math.min(Math.max(center[0], minCx), maxCx);

            // vertical: the free rect spans the full map viewport height
            //   topPx = vpH/2 - (y0 - cy) / res   (y0 = imgExtent[3], the top)
            //   C: topPx  == 0            -> cy = y0 - res * (vpH/2)
            //   D: bottom == vpH          -> cy = y1 + res * (vpH/2)
            var boundC = imgExtent[3] - resolution * (vpH / 2);
            var boundD = imgExtent[1] + resolution * (vpH / 2);
            var minCy = Math.min(boundC, boundD);
            var maxCy = Math.max(boundC, boundD);
            var targetY = Math.min(Math.max(center[1], minCy), maxCy);

            // only move when the deviation is more than a fraction of a
            // screen pixel (avoids pointless updates / feedback loops)
            var eps = Math.max(1e-6, 0.2 * resolution);
            debugLastClamped.x = Math.abs(targetX - center[0]) > eps;
            debugLastClamped.y = Math.abs(targetY - center[1]) > eps;
            if (debugLastClamped.x || debugLastClamped.y) {
                view.setCenter([targetX, targetY]);
            }
        } finally {
            enforcing = false;
        }
    }
    var debugLastClamped = { x: false, y: false };
    var clampQueued = false;
    var debugEnabled = false;
    var debugOverlay = null;

    function isDebugEnabled() {
        var m = location.search.match(/[?&]coverdebug=([^&]*)/);
        return !!m && m[1] !== '0' && m[1] !== 'off';
    }

    function mkDebugEl(cssText) {
        var el = document.createElement('div');
        el.style.cssText = 'position:absolute;' + cssText;
        return el;
    }

    function createDebugOverlay() {
        debugOverlay = {
            root: mkDebugEl('inset:0;pointer-events:none;z-index:9999;font:11px/1.4 monospace;'),
            leftBlock: null,
            rightBlock: null,
            freeBox: null,
            coverBand: null,
            edgeL: null,
            edgeR: null,
            info: null
        };
        var o = debugOverlay;

        o.leftBlock = mkDebugEl('top:0;bottom:0;left:0;background:rgba(255,60,60,.15);border-right:2px solid rgba(255,60,60,.9);');
        o.leftBlock.appendChild(document.createTextNode(' Navigation '));
        o.rightBlock = mkDebugEl('top:0;bottom:0;right:0;background:rgba(255,150,0,.15);border-left:2px solid rgba(255,150,0,.9);');
        o.freeBox = mkDebugEl('top:0;bottom:0;border:2px dashed rgba(0,190,0,.85);');
        o.coverBand = mkDebugEl('top:0;bottom:0;background:rgba(0,90,255,.06);');
        o.edgeL = mkDebugEl('top:0;bottom:0;width:2px;background:rgba(0,90,255,.9);');
        o.edgeR = mkDebugEl('top:0;bottom:0;width:2px;background:rgba(0,90,255,.9);');
        o.info = mkDebugEl('bottom:8px;left:12px;z-index:10000;background:rgba(0,0,0,.72);color:#cfeecf;padding:6px 8px;white-space:pre;border-radius:3px;');
        o.freeBox.appendChild(o.coverBand);
        o.freeBox.appendChild(o.edgeL);
        o.freeBox.appendChild(o.edgeR);
        mapEl.appendChild(o.root);
        o.root.appendChild(o.leftBlock);
        o.root.appendChild(o.rightBlock);
        o.root.appendChild(o.freeBox);
        o.root.appendChild(o.info);
    }

    function removeDebugOverlay() {
        if (debugOverlay && debugOverlay.root && debugOverlay.root.parentNode) {
            debugOverlay.root.parentNode.removeChild(debugOverlay.root);
        }
        debugOverlay = null;
    }

    function drawDebugOverlay() {
        if (!debugEnabled || !debugOverlay) {
            return;
        }
        try {
            var resolution = view.getResolution();
            var imgExtent = view.getProjection().getExtent();
            var free = measureFreeArea();
            var center = view.getCenter();
            if (!resolution || !imgExtent || !free || !center) {
                return;
            }

            var o = debugOverlay;
            var vpW = free.vpW;
            var vpH = free.vpH;
            var coverW = (imgExtent[2] - imgExtent[0]) / resolution;
            var coverH = (imgExtent[3] - imgExtent[1]) / resolution;
            var leftPx = vpW / 2 + (imgExtent[0] - center[0]) / resolution;
            var topPx = vpH / 2 - (imgExtent[3] - center[1]) / resolution;

            o.freeBox.style.left = free.x + 'px';
            o.freeBox.style.width = free.width + 'px';

            o.leftBlock.style.display = free.x > 1 ? 'block' : 'none';
            if (free.x > 1) {
                o.leftBlock.style.width = free.x + 'px';
            }

            var rightPx = free.x + free.width;
            var rightWidth = vpW - rightPx;
            o.rightBlock.style.display = rightWidth > 1 ? 'block' : 'none';
            if (rightWidth > 1) {
                o.rightBlock.style.left = rightPx + 'px';
                o.rightBlock.style.width = rightWidth + 'px';
            }

            o.coverBand.style.display = Math.min(leftPx, leftPx + coverW) < vpW && Math.max(leftPx, leftPx + coverW) > 0 ? 'block' : 'none';
            o.coverBand.style.left = leftPx + 'px';
            o.coverBand.style.width = Math.min(leftPx + coverW, vpW) - Math.max(leftPx, 0) + 'px';
            o.edgeL.style.display = leftPx > 0 && leftPx < vpW ? 'block' : 'none';
            o.edgeL.style.left = Math.max(0, leftPx) + 'px';
            o.edgeR.style.display = leftPx + coverW > 0 && leftPx + coverW < vpW ? 'block' : 'none';
            o.edgeR.style.left = Math.max(0, leftPx + coverW) + 'px';

            o.info.textContent =
                (debugLastClamped.x ? 'CLAMP-X  ' : '         ') +
                (debugLastClamped.y ? 'CLAMP-Y  ' : '         ') + '\n' +
                'free : ' + Math.round(free.width) + 'x' + Math.round(vpH) + ' px' +
                ' (nav ' + Math.round(free.x) + ', ft ' + Math.round(rightWidth) + ')\n' +
                'cover: ' + Math.round(coverW) + 'x' + Math.round(coverH) + ' px\n' +
                'slack: x ' + (free.width - coverW).toFixed(0) + ' px' +
                '   y ' + (vpH - coverH).toFixed(0) + ' px\n' +
                'pos  : ' + Math.round(leftPx) + ',' + Math.round(topPx) + ' px (top-left)';
        } catch (e) {
            // debug helper must never break the viewer
        }
    }

    var tickQueued = false;
    function tick() {
        tickQueued = false;
        // skip clamping while a zoom/pan animation is still running: clamping
        // against an intermediate resolution would fight the animation and
        // cause the asymmetric + / - jumps. only clamp once the view is at
        // rest so the "true" size is settled.
        if (view.getAnimating && view.getAnimating()) {
            drawDebugOverlay();
            requestAnimationFrame(tick);
            return;
        }
        clampView();
        drawDebugOverlay();
    }
    function scheduleClamp() {
        if (tickQueued) {
            return;
        }
        tickQueued = true;
        requestAnimationFrame(tick);
    }

    var observer = null;
    function start() {
        view.on('change:center', scheduleClamp);
        view.on('change:resolution', scheduleClamp);
        window.addEventListener('resize', scheduleClamp);
        // re-measure when the overlay layout changes (fullscreen, nav collapse,
        // fulltext open/close, mobile off-canvas)
        observer = new MutationObserver(scheduleClamp);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });

        // debug overlay: enable via ?coverdebug=1 in the URL, or at runtime
        // with Ctrl/Cmd+Shift+D (console: window.__coverDebug(true/false))
        debugEnabled = isDebugEnabled();
        if (debugEnabled) {
            createDebugOverlay();
        }
        $(document).on('keydown.coverdebug', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.which === 68 || e.key === 'D' || e.key === 'd')) {
                e.preventDefault();
                toggleDebug(!debugEnabled);
            }
        });
        window.__coverDebug = function (on) {
            toggleDebug(on === undefined ? !debugEnabled : on);
        };

        scheduleClamp();
    }

    function toggleDebug(on) {
        debugEnabled = !!on;
        if (debugEnabled) {
            if (!debugOverlay) {
                createDebugOverlay();
            }
            debugOverlay.root.style.display = 'block';
            drawDebugOverlay();
        } else if (debugOverlay && debugOverlay.root) {
            debugOverlay.root.style.display = 'none';
        }
    }

    function stop() {
        view.un('change:center', scheduleClamp);
        view.un('change:resolution', scheduleClamp);
        window.removeEventListener('resize', scheduleClamp);
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        $(document).off('keydown.coverdebug');
        window.__coverDebug = undefined;
        removeDebugOverlay();
    }

    $(window).on('beforeunload', stop);
    start();
}
