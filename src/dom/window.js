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
})()