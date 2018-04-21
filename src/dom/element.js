(function () {
   var ELEMENT_TYPE = 1;


    function isElement(object) {
        return !!(object && object.nodeType == ELEMENT_TYPE)
    }
})()