var helper = helper || {};

(function ($) {
    helper.getContentHeight = function() {
        //let main = $('.main');
        let totaleHeight = $(window).height();

        let usableHeight = totaleHeight
            - $('header').outerHeight()
            - $('footer').outerHeight()
            - 10;

        return usableHeight;
    };

    helper.positionAroundFather = function(k, baseX, baseY) {
        // ALGORITMOOOOOOO
        let f = 0;
        if (k < 2)
            f = k;
        else {
            let j = Math.floor(Math.log2(k));
            if (k % 2) {
                // funzione B (dispari)
                let denom = Math.pow(2,j);
                f = k / denom;
            }else{
                let denom = Math.pow(2,j);
                f = (1 + k - denom) / denom;
            }
        }
        let angolo = f * Math.PI;
        let constant = 170;
        let posX = Math.cos(angolo) * constant + baseX;
        let posY = (-1 * (Math.sin(angolo) * constant)) + baseY;
        return {posX : posX, posY: posY};
    };

    helper.areLinkable = function(element1, element2) {
        t1 = element1.model.getType();
        t2 = element2.model.getType();
        return (t1 === 'actor' && t2 === 'boundary') || (t2 === 'actor' && t1 === 'boundary') || (t1 === 'boundary' && t2 === 'control') || (t2 === 'boundary' && t1 === 'control') ||
            (t1 === 'control' && t2 === 'control') || (t1 === 'entity' && t2 === 'control') || (t1 === 'control' && t2 === 'entity' || (t1 === 'entity' && t2 === 'subEntity') || (t1 === 'subEntity' && t2 === 'entity'));

    }

    helper.isLegal = function(string){
        let letters = /^$|^[0-9a-zA-Z]+$/;
        return letters.test(string);
    }

    helper.isInt = function(string) {
        let letters = /^[-+]?\d*$/;
        return letters.test(string);
    }

    helper.setLegal = function(illegalString) {
        let legalstr= illegalString.replace(/[\<\>!@#\$%^\\\&(=£"'|?{<>})/\*,]+/i, '');
        return this.deleteWhiteSpace(legalstr);
    } 
    helper.deleteWhiteSpace = function(illegalString){
        var RegexWhiteSpace = /\s/g;
        return illegalString.replace(RegexWhiteSpace,'');
    }

})(jQuery);