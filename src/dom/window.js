(function () {

    function addStyleSheet(url, media) {
        media = media || 'screen';
        var link = document.createElement('LINK');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', url);
        link.setAttribute('media', media);
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    function removeStyleSheet(url, media) {
        var styles = getStyleSheet(url, media);
        for (var i = 0, length = styles.length; i < length; i++) {
            var node = styles[i].ownerNode || styles[i].owningElement;
            // Disable the stylesheet
            styles[i].disabled = true;
            // Remove the node
            node.parentNode.removeChild(node);
        }
    }

    function getStyleSheet(url, media) {
        var sheets = [];
        for (var i = 0, length = document.styleSheets.length; i < length; i++) {
            if (url && document.styleSheets[i].href.indexOf(url) == -1) continue;

            if (media) {
                // Normalize the media strings
                media = media.replace(/,\s*/, ',');
                var sheetMedia;

                if (document.styleSheets[i].media.mediaText) {
                    sheetMedia = document.styleSheets[i].media.mediaText.replace(/,\s*/, ',');
                    sheetMedia = sheetMedia.replace(/,\s*$/, '');
                } else {
                    // MSIE
                    sheetMedia = document.styleSheets[i].media.replace(/,\s*/, ',');
                }
                // Skip it if the media don't match
                if (media != sheetMedia ) continue;
            }
            sheets.push(document.styleSheets[i])
        }
        return sheets;
    }

    /**
     * 介绍 ： https://developer.mozilla.org/zh-CN/docs/Web/Events/DOMContentLoaded
     * 来源 ： https://github.com/dperini/ContentLoaded/blob/master/src/contentloaded.js
     * @type {string[]}
     * 看看 ready 和 load 是一样的吗，到时候看看 jQuery 的
     */
    function contentLoaded(win, fn) {
        var done = false, top = true,

            doc = win.document,
            root = doc.documentElement,
            modern = doc.addEventListener,

            add = modern ? 'addEventListener' : 'attachEvent',
            rem = modern ? 'removeEventListener' : 'detachEvent',
            pre = modern ? '' : 'on',

            init = function(e) {
                if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
                (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                if (!done && (done = true)) fn.call(win, e.type || e);
            },

            // IE 的检测方法
            poll = function() {
                try { root.doScroll('left'); } catch (e) { setTimeout( poll, 50); return; }
                init('poll');
            };

        if (doc.readyState == 'complete') {
            fn.call(win, 'lazy')
        } else {
            if (!modern && root.doScroll) {
                try {
                    top = !win.frameElement;
                } catch (e) {

                }
            }
            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            win[add](pre + 'load', init, false)
        }
    }


    /**
     * 检测 DOMContentLoaded 是否已完成
     * https://github.com/nefe/You-Dont-Need-jQuery/blob/master/README.zh-CN.md#events
     */
    if (document.readyState !== 'loading') {
        eventHandler()
    } else {
        document.addEventListener('DOMContentLoaded', eventHanlder);
    }
})()