
//////////////////////////////////////////////////////////////////////
//   GRAPHRENDERER LIBRARY                                          //
//                                                                  //
//   Dependencies: D3js(>=3.3.11), jquery & jquery-ui(>=1.10)       //
//                 Raphaeljs                                        //
//                                                                  //
// Author: Stephane Cano <DL.RSupport@pmi.com>, PMP SA.             //
//                                                                  //
//  This program is distributed in the hope that it will be useful, //
//  but WITHOUT ANY WARRANTY; without even the implied warranty of  //
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the    //
//  GNU General Public License for more details.                    //
//////////////////////////////////////////////////////////////////////

/////////////////////////////////
// Successfully tested on      //
// IE 10+, FF 24+              //
// Firefox 21 is horribly slow //
/////////////////////////////////

//////////////////
// LOGGER CLASS //
//////////////////
function Logger(aName) {
    var name = aName;
    this.getName = function() {
        return name;
    };
}

Logger.prototype.log = function(message) {
    console.log("[" + this.getName() + "] " + message);
};

Logger.prototype.info = function(message) {
    console.info("[" + this.getName() + "] " + message);
};

Logger.prototype.warn = function(message) {
    console.warn("[" + this.getName() + "] " + message);
};

Logger.prototype.debug = function(message) {
    console.log("[" + this.getName() + "] " + message);
};

Logger.prototype.error = function(message) {
    console.error("[" + this.getName() + "] " + message);
};


////////////////////////////////////////////////////////////////////////
// Please declare somewhere in your web page inside the body element: //
// <div id="FontSizeGetter"                                           //
//      style="position: absolute;                                    //
//             visibility: hidden;                                    //
//             height: auto;                                          //
//             width: auto;                                           //
//             font-size: 10px;">                                     //
// </div>                                                             //
////////////////////////////////////////////////////////////////////////

var Util = {};
Util.getTextDim = function(aText, aFontFamily, aFontsize) {
    var fsg = document.getElementById("FontSizeGetter");
    fsg.innerHTML = aText;
    fsg.style.fontSize = aFontsize;
    fsg.style.fontFamily = aFontFamily;
    var dim = {width:(fsg.clientWidth), height:(fsg.clientHeight)};
    return(dim);
};

var RaphUtil = {};
/**
 * Draw a Raphael background
 *
 * paper           : Raphael's paper object
 * x               : z position of the top left corner
 * y               : y position of the top left corner
 * w               : width
 * h               : height
 * r               : radius for rounded corners
 * backgroundColor :
 * borderColor     :
 * borderSize      :
 */
RaphUtil.drawBackground = function(aPaper,aX,aY,aW,aH,aR,aBackgroundColor,
                                   aBorderColor,aBorderSize) {
    var background = aPaper.rect(aX,aY,aW,aH,aR);
    background.attr({'fill': aBackgroundColor, 'stroke': aBorderColor,
                     'stroke-width': aBorderSize});
    return background;
};

/**
 * Add a tooltip for the DOM element
 * tooltipContent can be html or plain text
 *
 * style: see http://qtip2.com/options#style
 */
RaphUtil.addTooltip = function(element, tooltipContent, delayms,
                               posx, posy, style) {
    if(delayms === undefined) {
        var delayms = 50;
    }
    if(posx === undefined) {
        var posx = 10;
    }
    if(posy === undefined) {
        var posy = 10;
    }
    if(style === undefined) {
        var style = 'qtip-youtube qtip-rounded';
    }
    $(element).qtip({
                        content: tooltipContent,
                        position: {
                            target: 'mouse',
                            my: 'top left',
                            at: 'bottom right',
                            viewport: $(window),
                            adjust: {
                                 screen: true,
                                method: 'flip shift',
                                 mouse: true,
                                 scroll: true,
                                 resize: true,
                                 y: posy,
                                 x: posx
                            }
                        },
                        show: {
                            delay: delayms,
                            solo: true
                        },
                        hide: {
                            effect: {
                                type: 'fade',
                                length: '150'
                            }
                        },
                        style: {
                            width: {
                                max: 800
                            },
                            classes: style
                        }
                    });
};

/**
 * Count occurences of 'aSubString' in 'aString'
 */
function countSubString(aString, aSubString) {
    return aString.match(new RegExp(aSubString, "g")).length;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * source: https://github.com/shybovycha/darken_color.js
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function HSL2RGB(h, s, l){
    var r, g, b;

    if (h < 0) h = 0;
    if (h > 1) h = 1;

    if (s < 0) s = 0;
    if (s > 1) s = 1;

    if (l < 0) l = 0;
    if (l > 1) l = 1;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = (l < 0.5) ? (l * (1 + s)) : (l + s - (l * s));
        var p = (2 * l) - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function RGB2HSL(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h, s: s, l: l };
}

function HEX2RGB(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                          return r + r + g + g + b + b;
                      });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function RGB2HEX(r, g, b) {
    return "#" + parseInt(((1 << 24)
           + (r << 16) + (g << 8) + b)).toString(16).slice(1);
}

function NAME2RGB(name) {
    var COLORS = {
        aliceblue: [240, 248, 255]
        , antiquewhite: [250, 235, 215]
        , aqua: [0, 255, 255]
        , aquamarine: [127, 255, 212]
        , azure: [240, 255, 255]
        , beige: [245, 245, 220]
        , bisque: [255, 228, 196]
        , black: [0, 0, 0]
        , blanchedalmond: [255, 235, 205]
        , blue: [0, 0, 255]
        , blueviolet: [138, 43, 226]
        , brown: [165, 42, 42]
        , burlywood: [222, 184, 135]
        , cadetblue: [95, 158, 160]
        , chartreuse: [127, 255, 0]
        , chocolate: [210, 105, 30]
        , coral: [255, 127, 80]
        , cornflowerblue: [100, 149, 237]
        , cornsilk: [255, 248, 220]
        , crimson: [220, 20, 60]
        , cyan: [0, 255, 255]
        , darkblue: [0, 0, 139]
        , darkcyan: [0, 139, 139]
        , darkgoldenrod: [184, 132, 11]
        , darkgray: [169, 169, 169]
        , darkgreen: [0, 100, 0]
        , darkgrey: [169, 169, 169]
        , darkkhaki: [189, 183, 107]
        , darkmagenta: [139, 0, 139]
        , darkolivegreen: [85, 107, 47]
        , darkorange: [255, 140, 0]
        , darkorchid: [153, 50, 204]
        , darkred: [139, 0, 0]
        , darksalmon: [233, 150, 122]
        , darkseagreen: [143, 188, 143]
        , darkslateblue: [72, 61, 139]
        , darkslategray: [47, 79, 79]
        , darkslategrey: [47, 79, 79]
        , darkturquoise: [0, 206, 209]
        , darkviolet: [148, 0, 211]
        , deeppink: [255, 20, 147]
        , deepskyblue: [0, 191, 255]
        , dimgray: [105, 105, 105]
        , dimgrey: [105, 105, 105]
        , dodgerblue: [30, 144, 255]
        , firebrick: [178, 34, 34]
        , floralwhite: [255, 255, 240]
        , forestgreen: [34, 139, 34]
        , fuchsia: [255, 0, 255]
        , gainsboro: [220, 220, 220]
        , ghostwhite: [248, 248, 255]
        , gold: [255, 215, 0]
        , goldenrod: [218, 165, 32]
        , gray: [128, 128, 128]
        , green: [0, 128, 0]
        , greenyellow: [173, 255, 47]
        , grey: [128, 128, 128]
        , honeydew: [240, 255, 240]
        , hotpink: [255, 105, 180]
        , indianred: [205, 92, 92]
        , indigo: [75, 0, 130]
        , ivory: [255, 255, 240]
        , khaki: [240, 230, 140]
        , lavender: [230, 230, 250]
        , lavenderblush: [255, 240, 245]
        , lawngreen: [124, 252, 0]
        , lemonchiffon: [255, 250, 205]
        , lightblue: [173, 216, 230]
        , lightcoral: [240, 128, 128]
        , lightcyan: [224, 255, 255]
        , lightgoldenrodyellow: [250, 250, 210]
        , lightgray: [211, 211, 211]
        , lightgreen: [144, 238, 144]
        , lightgrey: [211, 211, 211]
        , lightpink: [255, 182, 193]
        , lightsalmon: [255, 160, 122]
        , lightseagreen: [32, 178, 170]
        , lightskyblue: [135, 206, 250]
        , lightslategray: [119, 136, 153]
        , lightslategrey: [119, 136, 153]
        , lightsteelblue: [176, 196, 222]
        , lightyellow: [255, 255, 224]
        , lime: [0, 255, 0]
        , limegreen: [50, 205, 50]
        , linen: [250, 240, 230]
        , magenta: [255, 0, 255]
        , maroon: [128, 0, 0]
        , mediumaquamarine: [102, 205, 170]
        , mediumblue: [0, 0, 205]
        , mediumorchid: [186, 85, 211]
        , mediumpurple: [147, 112, 219]
        , mediumseagreen: [60, 179, 113]
        , mediumslateblue: [123, 104, 238]
        , mediumspringgreen: [0, 250, 154]
        , mediumturquoise: [72, 209, 204]
        , mediumvioletred: [199, 21, 133]
        , midnightblue: [25, 25, 112]
        , mintcream: [245, 255, 250]
        , mistyrose: [255, 228, 225]
        , moccasin: [255, 228, 181]
        , navajowhite: [255, 222, 173]
        , navy: [0, 0, 128]
        , oldlace: [253, 245, 230]
        , olive: [128, 128, 0]
        , olivedrab: [107, 142, 35]
        , orange: [255, 165, 0]
        , orangered: [255, 69, 0]
        , orchid: [218, 112, 214]
        , palegoldenrod: [238, 232, 170]
        , palegreen: [152, 251, 152]
        , paleturquoise: [175, 238, 238]
        , palevioletred: [219, 112, 147]
        , papayawhip: [255, 239, 213]
        , peachpuff: [255, 218, 185]
        , peru: [205, 133, 63]
        , pink: [255, 192, 203]
        , plum: [221, 160, 203]
        , powderblue: [176, 224, 230]
        , purple: [128, 0, 128]
        , red: [255, 0, 0]
        , rosybrown: [188, 143, 143]
        , royalblue: [65, 105, 225]
        , saddlebrown: [139, 69, 19]
        , salmon: [250, 128, 114]
        , sandybrown: [244, 164, 96]
        , seagreen: [46, 139, 87]
        , seashell: [255, 245, 238]
        , sienna: [160, 82, 45]
        , silver: [192, 192, 192]
        , skyblue: [135, 206, 235]
        , slateblue: [106, 90, 205]
        , slategray: [119, 128, 144]
        , slategrey: [119, 128, 144]
        , snow: [255, 255, 250]
        , springgreen: [0, 255, 127]
        , steelblue: [70, 130, 180]
        , tan: [210, 180, 140]
        , teal: [0, 128, 128]
        , thistle: [216, 191, 216]
        , tomato: [255, 99, 71]
        , turquoise: [64, 224, 208]
        , violet: [238, 130, 238]
        , wheat: [245, 222, 179]
        , white: [255, 255, 255]
        , whitesmoke: [245, 245, 245]
        , yellow: [255, 255, 0]
        , yellowgreen: [154, 205, 5]
    };

    var color = COLORS[name] || [0, 0, 0];

    return { r: color[0], g: color[1], b: color[2] };
}

function darken(color, amount) {
    var r_g_b;

    if (/^#/.test(color)) {
        r_g_b = HEX2RGB(color);
    } else {
        r_g_b = NAME2RGB(color);
    }

    var h_s_l = RGB2HSL(r_g_b.r, r_g_b.g, r_g_b.b);

    if (/^\d+\%$/.test(amount)) {
        amount = {
            type: '%',
            val: parseFloat(amount.replace(/(%)$/, ''))
        };
    } else if (/^\d+\.\d+$/.test(amount)) {
        amount = {
            type: 'f',
            val: parseFloat(amount) * 100.0
        };
    } else {
        amount = {
            type: 'i',
            val: parseFloat(amount)
        };
    }

    var val = amount.val / -100;

    if ('%' == amount.type) {
        val = val > 0
            ? (100 - h_s_l['l']) * val / 100
            : h_s_l['l'] * (val / 100);
    }

    h_s_l['l'] += val;

    r_g_b = HSL2RGB(h_s_l.h, h_s_l.s, h_s_l.l);

    return RGB2HEX(r_g_b.r, r_g_b.g, r_g_b.b);
}

function lighten(color, amount) {
    return darken(color, '-' + amount);
}

//////////////////////////////////////////
// Scale drawer tool based on RaphaelJS //
//////////////////////////////////////////
var Scale = {
    paper: undefined
};

/**
 * Clear the container and the RaphaelJs objects.
 */
Scale.clear = function() {
    this.paper.clear();
};

/**
 * Draw a scale with a color gradient and tick marks.
 *
 * The sopts object must have the following attributes:
 *  scaleId:               the div ID where to draw the scale
 *  scaleGradient:         [angle]-[color]:[position%]-[color]:[position%]-...
 *  scaleLabelsFontFamily:
 *  scaleLabelsFontSize:
 *  scaleWidth:
 *  scaleHeight:
 *  scaleTickWidth:
 *  scaleTicksPercents:    list the values in percents where ticks will be
 *                         drawn, for example: [20,40,60,80,100]
 */
Scale.drawScale = function(sopts) {
    // set width of the scale div
    $("#" + sopts.scaleId).css("width", sopts.scaleWidth);
    $("#" + sopts.scaleId).css("height", sopts.scaleHeight);

    if(sopts.scaleWidth > sopts.scaleHeight) {
        sopts['orientation'] = "horizontal";
    } else {
        sopts['orientation'] = "vertical";
    }

    sopts['scaleTextHeight'] = Util.getTextDim(
        "0.1",
        sopts.scaleLabelsFontFamily,
        sopts.scaleLabelsFontSize).height;
    sopts['scaleTextWidth'] = Util.getTextDim(
        "100%",
        sopts.scaleLabelsFontFamily,
        sopts.scaleLabelsFontSize).width;

    var scaleDiv = document.getElementById(sopts.scaleId);
    var paper = new Raphael(scaleDiv, sopts.scaleWidth,
                            sopts.scaleHeight);
    this.paper = paper;
    // draw the heatmap scale
    this.drawScaleRect(paper,sopts);
    this.drawScaleLabels(paper,sopts);
    this.drawScaleTicks(paper,sopts);
};

Scale.drawScaleRect = function(rPaper,sopts) {
    var xpos, ypos, width, height;
    if(sopts.orientation == "vertical") {
        xpos = sopts.scaleTickWidth + sopts.scaleTextHeight;
        ypos = sopts.scaleTextWidth;
        width = sopts.scaleWidth;
        height = sopts.scaleHeight - sopts.scaleTextWidth;
    } else {
        xpos = 0;
        ypos = sopts.scaleTickWidth + sopts.scaleTextHeight;
        width = sopts.scaleWidth - sopts.scaleTextWidth/2;
        height = sopts.scaleHeight - sopts.scaleTextHeight
            - sopts.scaleTickWidth;
    }
    var scale = rPaper.rect(xpos, ypos, width, height, 0);
    scale.attr({'fill': sopts.scaleGradient,
                'stroke': '#000000', 'stroke-width': 1});
    return scale;
};

/**
 * Returns the offset in term of x or y coordinate from the rect origin
 * (top left corner) of the scale glyph given a percentage number
 * [0.0,100.0].
 *
 * The offset is in term of x when the orientation is horizontal,
 * y otherwise. (See sopts.orientation)
 */
Scale.offsetScalePercent = function(percentage,sopts) {
    if(sopts.orientation == "vertical") {
        return (100-percentage)*((sopts.scaleHeight)/100);
    } else {
        return (percentage)*((sopts.scaleWidth
                              - sopts.scaleTextWidth/2)/100);
    }
};

Scale.drawScaleTicks = function(rPaper,sopts) {
    var percents = sopts.scaleTicksPercents;
    var x = 0;
    var y = 0;
    var rowticks = new Array(percents.length);
    if(sopts.orientation == "vertical") {
        for (i=0 ; i<percents.length ; i++) {
            y = this.offsetScalePercent(percents[i],sopts)
                + sopts.scaleTextWidth;
            rowticks[i] = rPaper.path(
                "M " + (x+sopts.scaleTextHeight)
                    + ","
                    + (y) + " l " + sopts.scaleTickWidth + ",0 Z");
            rowticks[i].attr({'stroke': '#000'});
        }
    } else {
        for (i=0 ; i<percents.length ; i++) {
            x = this.offsetScalePercent(percents[i],sopts);
            rowticks[i] = rPaper.path("M " + (x) + ","
                                      + (sopts.scaleTextHeight)
                                      + " l 0," + sopts.scaleTickWidth
                                      + " Z");
            rowticks[i].attr({'stroke': '#000'});
        }
    }
    return rowticks;
};

Scale.drawScaleLabels = function(rPaper,sopts) {
    var percents = sopts.scaleTicksPercents;
    var x = sopts.scaleTextHeight/2;
    var y = 0;
    var labels = new Array(percents.length);
    if(sopts.orientation == "vertical") {
        for (i=0 ; i<percents.length ; i++) {
            y = this.offsetScalePercent(percents[i],sopts)
                + sopts.scaleTextWidth;
            labels[i] = rPaper.text(x, y, percents[i] + '%');
            labels[i].attr({'font-family': sopts.scaleLabelsFontFamily,
                            'font-size': sopts.scaleLabelsFontSize});
            labels[i].rotate(-90, x, y);
        }
    } else {
        y = sopts.scaleTextHeight/2;
        for (i=0 ; i<percents.length ; i++) {
            x = this.offsetScalePercent(percents[i],sopts);
            labels[i] = rPaper.text(x, y, percents[i] + '%');
            labels[i].attr({'font-family': sopts.scaleLabelsFontFamily,
                            'font-size': sopts.scaleLabelsFontSize});
        }
    }
    return labels;
};

//////////////////////////////////////
// Starplot tool based on RaphaelJS //
//////////////////////////////////////

 /////////////////////////////////////////////////////////////////////
 // Initialize the Starplot with a resolution of (width x height).  //
 //                                                                 //
 // title            : chart title                                  //
 // width            : chart width in pixels                        //
 // height           : chart height in pixels                       //
 // labels[]         : the label for each sector                    //
 // values[]         : sector values                                //
 // colors[]         : sector colors                                //
 // originX          : (Optional) specify the origin of the drawing //
 // originY          : (Optional) specify the origin of the drawing //
 // radius           : (Optional) the radius of the starplot circle //
 /////////////////////////////////////////////////////////////////////

function StarPlot(aTitle, aWidth, aHeight, aCategories, aLabels,
                  aTooltipTexts, aValues, aColors, opts,
                  originX, originY, radius) {
    // options
    this.opts = opts;

    // raphael objects
    this.raphs = {
        background: null,
        circle: null,
        circleSectorTicks: null,
        sectorLabels: null,
        sectors: null
    };

    this.title = aTitle;
    this.width = aWidth;
    this.height = aHeight;
    this.labels = aLabels;
    this.values = aValues;
    this.colors = aColors;
    this.categories = aCategories;
    this.nbCategories = aCategories.length;
    this.tooltiptext = aTooltipTexts ;

    if(this.opts.drawRadialLabels === undefined) {
        this.opts.drawRadialLabels = false;
    }

    this.titleWidth = Util.getTextDim(
        this.title, this.opts.titleFontFamily,
        this.opts.titleFontSize).width;
    this.titleHeight = Util.getTextDim(
        this.title, this.opts.titleFontFamily,
        this.opts.titleFontSize).height * (countSubString("\n")+1);

    if(originX === undefined
       || originY === undefined
       || radius === undefined) {
        this.originX = this.width/2;
        this.originY = this.height/2;
        // compute the radius of the circle
        var circleRadiusH = (this.height - this.titleHeight
                             - this.opts.titlechartspacing
                             - this.opts.topmargin
                             - this.opts.bottommargin)/2;
        var circleRadiusW = (this.width - this.opts.leftmargin
                             - this.opts.rightmargin)/2;
        this.circleRadius = Math.min(circleRadiusW,circleRadiusH);
    } else {
        this.originX = originX;
        this.originY = originY;
        this.circleRadius = radius;
    }

    // compute the gap between the sector labels and the circle
    var currentTextWidth = 0;
    this.sectorlabelspacing = 0;
    for(i=0 ; i<this.labels.length ; i++) {
        currentTextWidth = Util.getTextDim(
            this.labels[i],
            this.labelsFontFamily,
            this.opts.labelsFontSize).width;
        if(currentTextWidth > this.sectorlabelspacing) {
            this.sectorlabelspacing = currentTextWidth;
        }
    }


    /**
     * Draw the main title
     */
    this.drawTitle = function() {
        var title = null;
        var text_xpos,text_ypos = 0;
        if(this.opts.drawTitle) {
            text_xpos = this.originX;
            text_ypos = this.opts.topmargin; //+ this.titleHeight/2;
            title = this.paper.text(text_xpos, text_ypos, this.title);
            title.attr({'font-size': this.opts.titleFontSize});
        }
        return title;
    };

    this.drawCircle = function() {
        var circle = this.paper.circle(
            this.originX, this.originY, this.circleRadius);
        circle.attr({'fill': this.opts.circleFillColor,
                     'opacity': this.opts.circleFillOpacity,
                     'stroke': this.opts.circleStrokeColor,
                     'stroke-width': this.opts.circleStrokeWidth});
        return circle;
    };

    this.drawCircleShadow = function() {
        var circle = this.paper.circle(
            this.originX+4, this.originY+4, this.circleRadius);
        circle.attr({'fill': '#aaaaaa',
                     'stroke': '#aaaaaa'});
        return circle;
    };

    this.getLabelPositionForCategory = function(i) {
        var deltaRad = (2*Math.PI/this.nbCategories);
        var aRad = this.opts.sectorStartRad + i*deltaRad;
        var aX = this.originX;
        var aY = this.originY;
        var aR = this.circleRadius + this.sectorlabelspacing/2;
        var xpos = aX + aR * Math.cos(aRad);
        var ypos = aY + aR * Math.sin(-aRad);
        return {'x':xpos,'y':ypos, 'rad':aRad};
    };

    this.drawLabels = function() {
        var sectorLabels = new Array(this.nbCategories);
        var pos = null;
        if(this.opts.drawSectorLabels) {
            for(var i=0 ; i<this.nbCategories ; i++) {
                pos = this.getLabelPositionForCategory(i);
                sectorLabels[i] = this.paper.text(
                    pos.x, pos.y, this.labels[i]);
                sectorLabels[i].attr(
                    {'font-family': this.opts.labelsFontFamily,
                     'font-size': this.opts.labelsFontSize,
                     'fill': this.opts.labelsColor});
                if(this.opts.drawRadialLabels) {
                    var rad = pos.rad;
                    var deg = (180/Math.PI) * rad;
                    if(Math.cos(rad) > 0 && Math.sin(rad) > 0) {
                        // Q I
                        deg = -deg;
                    } else if(Math.cos(rad) < 0 && Math.sin(rad) > 0) {
                        // Q II
                        deg = -(deg - 180);
                    } else if(Math.cos(rad) < 0 && Math.sin(rad) < 0) {
                        // Q III
                        deg = -(deg + 180);
                    } else if(Math.cos(rad) > 0 && Math.sin(rad) < 0) {
                        // Q IV
                        deg = -deg;
                    } else {
                        // ||cos|| && ||sin|| are 1
                        deg = 0;
                    }
                    sectorLabels[i].rotate(deg, pos.x, pos.y);
                }
            }
        }
        this.raphs.sectorLabels = sectorLabels;
        return sectorLabels;
    };

    this.drawCircleSectorTicks = function() {
        var ox = this.originX;
        var oy = this.originY;
        var px,py = 0;
        var circleSectors = new Array(this.nbCategories);
        var deltaRad = (2*Math.PI/this.nbCategories);
        for(var i=0 ; i<this.nbCategories ; i++) {
            circleSectors[i] = this.paper.path(
                "M" + ox + "," + oy
                    + "l" + (this.circleRadius
                             * Math.cos(
                                 this.opts.sectorStartRad + i*deltaRad))
                    + "," + (-this.circleRadius *
                             Math.sin(
                                 this.opts.sectorStartRad + i*deltaRad))
                    +"Z");
            circleSectors[i].attr(
                {'stroke': this.opts.circleSectorTickColor,
                 'stroke-width': this.opts.circleSectorTickStrokeWidth,
                 'stroke-dasharray': this.opts.circleSectorTickDashArray});
        }
        this.raphs.circleSectorTicks = circleSectors;
        return circleSectors;
    };

    this.drawSector = function(aX,aY,aR,aStartRad,aEndRad) {
        var x1 = aX + aR * Math.cos(-aStartRad),
        x2 = aX + aR * Math.cos(-aEndRad),
        y1 = aY + aR * Math.sin(-aStartRad),
        y2 = aY + aR * Math.sin(-aEndRad);
        return this.paper.path(
            ["M", aX, aY,
             "L", x1, y1,
             "A", aR, aR, 0, +(aEndRad - aStartRad > Math.PI),
             0, x2, y2, "z"]);
    };

    this.drawCircleSectors = function() {
        var sectors = new Array(this.nbCategories);
        var ox = this.originX;
        var oy = this.originY;
        var deltaRad = (2*Math.PI/this.nbCategories);
        var startRad,endRad,radius = 0;
        for(var i=0 ; i<this.nbCategories ; i++) {
            if(this.values[i] > 0) {
                radius = this.circleRadius*this.values[i];
            } else {
                // put a small number, so that IE won't draw ugly lines
                radius = this.circleRadius*0.001;
            }
            startRad = this.opts.sectorStartRad + i*deltaRad - 0.5*deltaRad;
            endRad = startRad + deltaRad;
            sectors[i] = this.drawSector(ox,oy,radius,startRad,endRad);
            sectors[i].attr(
                {'stroke': darken(this.colors[i], '5'),
                 'stroke-width': '1',
                 'fill': this.colors[i],
                 'fill-opacity': this.opts.circleSectorFillOpacity});
        }
        this.raphs.sectors = sectors;
        return sectors;
    };

    this.getCategoriesCoordinates = function(radiusGap) {
        var coordinates = new Array(this.nbCategories);
        var deltaRad = (2*Math.PI/this.nbCategories);
        var aX = this.originX;
        var aY = this.originY;
        var aR = this.circleRadius + radiusGap;
        var aRad = 0;
        var x,y;
        for(var i=0 ; i<this.nbCategories ; i++) {
            aRad = this.opts.sectorStartRad + i*deltaRad;
            x = aX + aR * Math.cos(aRad);
            y = aY + aR * Math.sin(-aRad);
            coordinates[i] = {x:x, y:y, rad:aRad};
        }
        return coordinates;
    };

    this.addMouseOverSectors = function() {
        var inOpacity = this.opts.inCircleSectorFillOpacity;
        var outOpacity = this.opts.circleSectorFillOpacity;
        var inTickColor = this.opts.highlightColor;
        var outTickColor = this.opts.circleSectorTickColor;
        var inSectorStrokeColor = this.opts.highlightColor;
        var outSectorStrokeColor = null;
        var inCircleSectorTickDashArray = this.opts.inCircleSectorTickDashArray;
        var outCircleSectorTickDashArray = this.opts.circleSectorTickDashArray;
        var inLabelColor = this.opts.highlightColor;
        var outLabelColor = this.opts.labelsColor;
        var sectors = this.raphs.sectors;
        var ticks = this.raphs.circleSectorTicks;
        var labels = this.raphs.sectorLabels;
        var drawSectorLabels = this.opts.drawSectorLabels;
        var sector = null;
        var tick = null;
        var label = null;
        var mouseover = false; // *** workaround for IE
        var pos = null;
        var deltaRad = (2*Math.PI/this.nbCategories);
        for(var i=0 ; i<this.nbCategories ; i++) {
            sector = sectors[i];
            tick = ticks[i];
            label = labels[i];
            outSectorStrokeColor = this.colors[i];
            (function (sector,inOpacity,outOpacity,tick, inTickColor,
                       outTickColor,inSectorStrokeColor,
                       outSectorStrokeColor,inCircleSectorTickDashArray,
                       outCircleSectorTickDashArray,pos,label,inLabelColor,
                       outLabelColor,drawSectorLabels) {
                 sector.hover(
                     function() {
                         // *** workaround for IE
                         if(!mouseover) {
                             // sector.toFront();
                             sector.stop();
                             sector.attr(
                                 {'fill-opacity': inOpacity,
                                  'stroke': inSectorStrokeColor});
                             tick.attr(
                                 {'stroke': inTickColor,
                                  'stroke-dasharray': inCircleSectorTickDashArray
                                 }
                             );
                             // if(drawSectorLabels) {
                             //     label.attr(
                             //         {'stroke': inLabelColor,
                             //          'stroke-width': 1});
                             // }
                             // *** workaround for IE
                             mouseover = true;
                         }
                     },
                     function() {
                         sector.stop();
                         sector.attr(
                             {'fill-opacity': outOpacity,
                              'stroke': darken(outSectorStrokeColor,'5')});
                         tick.attr(
                             {'stroke': outTickColor,
                              'stroke-dasharray': outCircleSectorTickDashArray
                             });
                         // if(drawSectorLabels) {
                         //     label.attr(
                         //         {'stroke': outLabelColor,
                         //          'stroke-width': 1});
                         // }
                         // *** workaround for IE
                         mouseover = false;
                     });
            })(sector,inOpacity,outOpacity,tick,inTickColor,outTickColor,
               inSectorStrokeColor,outSectorStrokeColor,
               inCircleSectorTickDashArray,outCircleSectorTickDashArray,
               pos,label,inLabelColor,outLabelColor,drawSectorLabels);
        }
    };

    this.addMouseClickSectors = function() {
        if(this.opts.sectorUrlLinks !== undefined) {
            for(var i=0 ; i<this.nbCategories ; i++) {
                var url = this.opts.sectorUrlLinks[i];
                var sector = this.raphs.sectors[i];
                var category = this.categories[i];
                (function (url, category) {
                     sector.click( function() {
                                       //if ( $("#popup_content").length ) {
                                           // set the popup window title
                                           //$("#popup").attr(
                                           //    'title',
                                           //    'Leading Nodes: '
                                           //    + category);
                                           // set its content
                                           //$("#popup_content").attr(
                                           //    'src', url);
                                           // popup window properties
                                           //$("#popup").dialog(
                                           //    {width: 500,
                                           //     height: 400,
                                           //     modal: true,
                                           //     close: function () {
                                           //         $("#popup_content").attr(
                                           //             'src',
                                           //             "about:blank");
                                           //                       }
                                           //     }
                                           //);
                                           window.open(
                                               url, '_blank',
                                               'config=width=800,height=800');
                                           return false;
                                       //} else {
                                       //    return true;
                                       //}
                                   } );
                 })(url, category);
            }
        }
    };

    /**
     * Add a tooltip for every sector
     */
    this.addSectorTooltips = function() {
        var sectors = this.raphs.sectors;
        var sector = null;
        for (i=0 ; i<this.nbCategories ; i++) {
            sector = sectors[i];
            RaphUtil.addTooltip(
                sector.node,
                "<font size='2px'>" + this.categories[i] + '<br>'
                    + this.labels[i] + '<br>' + this.tooltiptext[i]
                    + "</font>");
            RaphUtil.addTooltip(sector.node, this.tooltiptext[i]);
        }
    };
}

StarPlot.prototype.draw = function(id, paper) {

    // use an existing paper
    this.paper = paper;

    this.drawTitle();
    this.drawCircle();
    this.drawCircleSectorTicks();
    this.drawCircleSectors();
    this.drawLabels();

    // event and animations
    this.addSectorTooltips();
    this.addMouseOverSectors();
};


StarPlot.prototype.draw = function(id) {

    // initialize a Raphael canvas where the chart will be drawn
    this.paper = new Raphael(document.getElementById(id), this.width,
                             this.height);

    // draw canvas background and border
    if(this.opts.drawBackground) {
        RaphUtil.drawBackground(
            this.paper, 0, 0, this.width, this.height, 10,
            this.opts.backgroundColor, this.opts.borderColor,
            this.opts.border);
    }

    this.drawTitle();
    // this.circleShadow = this.drawCircleShadow();
    this.circle = this.drawCircle();
    this.drawCircleSectorTicks();
    this.drawCircleSectors();
    this.drawLabels();

    // event and animations
    this.addSectorTooltips();
    this.addMouseOverSectors();
    this.addMouseClickSectors();

};


//////////////////////
// Global functions //
//////////////////////

// disable the right click (for the whole page)
$(this).bind("contextmenu",
                       function(e) {
                           e.preventDefault();
                       });

var uid = function() {
    var uniq = '' + (new Date()).getTime();
    return uniq;
};

var arrayMinMax = function(a) {
    var min = a[0];
    var max = min;
    for (var x = 0 ; x < a.length ; x++) {
        if (a[x] < min) {
            min = a[x];
        }
        if (a[x] > max) {
            max = a[x];
        }
    }
    return {"min":min, "max":max};
};

var barplotMinMax = function(json) {
    var min = json.nodes[0].barplotValues[0];
    var max = min;
    var amm = 0;
    for (var i=0 ; i<json.nodes.length ; i++) {
        amm = arrayMinMax(json.nodes[i].barplotValues);
        if (amm.min < min) {
            min = amm.min;
        }
        if (amm.max > max) {
            max = amm.max;
        }
    }
    return {"min":min, "max":max};
};

/////////////////////////
// GRAPHRENDERER CLASS //
/////////////////////////
/**
 * Create a new Network.
 *
 * Parameters:
 * ===========
 *   data            object, the input data in JSON format
 *   aOpts           object, various display related options for the graph
 *   aContainers     object, dom ids list to use
 *
 * Details:
 * ========
 * Please specify either a url to the json data
 * or a json vaiable holding the input data
 * data = {
 *     "jsonUrl" : "network2.json"
 *     // "jsonVar" : jsonVariable
 * };
 *
 * aOpts = {
 *     w : 860,
 *     h : 540,
 *     nodeSize : 50,
 *     nodeRoundedCornerPixels : 10,
 *     layout_forceLinkDistance : 160,
 *     layout_linkStrength : 1,
 *     layout_friction : 0.9,
 *     layout_forceCharge : -900,
 *     layout_chargeDistance : undefined,
 *     layout_theta : 0.8,
 *     layout_gravity : 0.1,
 *     maxLayoutIterations : 300,
 *     // 0 to display only on layout completion
 *     displayNetworkEveryNLayoutIterations : 10,
 *     optimizeDisplayWhenLayoutRunning: true,
 *     displayNodeLabels : false,
 *     nodeBorderColor : "#777777",
 *     leadingNodeBorderColor : "#000000",
 *     noneLeadingNodeOpacity : 0.5,
 *     nodeLabelsColor: "#444444",
 *     nodeLabelsFont: "6px sans-serif",
 *     dragNodeBorderColor: "#ff8400",
 *     selectNodeBorderColor: "#ff0000",
 *     minZoomFactor : 0.4,
 *     maxZoomFactor : 10,
 *     barplotInNodeTooltips: true,
 *     barplotInNodeTooltipsFontSize: "2px",
 *     barplotInsideNodeBorderColor = "#000000",
 *     barplotInsideNodeBorderWidth = "1px",
 *     displayBarPlotsInsideNodes : true,
 *     barplotInsideNodeFontSize : "0.8px";
 *     nodeTooltipOpacity : 0.8,          // for link tooltips as well
 *     nodeTooltipActivationDelay : 0,    // for link tooltips as well
 *     displayBarplotTooltips : false,
 *     nodeTooltipDeactivationDelay : 200,
 *     jsFunctionToCallOnNodeClick: "onNodeClick",
 *     displayColorScale: true,
 *     scaleGradient: "0-#000080:12-#0000ff:25-#ffffff:60-#ffa500:75-#cd0000:100",
 *     scaleLabelsFontFamily: 'monospace',
 *     scaleLabelsFontSize: 10,
 *     scaleHeight: 25,
 *     scaleTickSize: 4,
 *     scaleTicksPercents: [20,40,60,80,100],
 *     imagesUrl: "images",
 *     exportCGI: false
 * };
 *
 * aContainers = {
 *     networkDivId : "network",
 *     dialogAboutButtonId : "dialog_about_opener",
 *     messageDivId : "message",
 *     progressbarDivId : "progressbar",
 *     progressbarLabelDivId : "progressbar-label",
 *     spinnerDivId : "spinner",
 *     displayLayoutProgressbar : true,
 *     searchInputId : "search",
 *     highlightLNsInputId : "highlightLNs",
 *     dragModeButtonId : "dragMode",
 *     neighborsButtonId : "neighbors",
 *     tooltipsButtonId : "tooltips",
 *     magnifyButtonId : "magnify",
 *     contrastSliderBarDivId : "sliderbar",
 *     contrastSliderDivId : "slider",
 *     contrastSeekerPrevious : "seek_previous",
 *     contrastSeekerNext : "seek_next",
 *     currentContrastDivId : "currentContrast",
 *     scaleDivId : "scale",  // if undefined or not set it won't be used
 *     currentNodeInfoDivId : "sidepane_currentnode",  // NOT USED YET
 *     exportButtonId : "export",
 *     zoominButtonId: "zoomin",
 *     zoomoutButtonId: "zoomout",
 *     reloadButtonId: "reload",
 *     layoutChargeRangeId: "layoutChargeRange",
 *     labelLayoutCharge: "charge",
 *     layoutLinkDistanceRangeId: "layoutLinkDistance",
 *     labelLayoutLinkDistance: "linkDistance",
 *     layoutParametersPane: "layoutParameters",
 *     settingsButtonId: "settings"
 * };
 *
 * Expected JSON format
 * ====================
 * {"nodes": [ {} , {} , ... ], "links": [ {} , {} , ... ]}
 * where each element can have the following attributes:
 *
 * a node:
 * {
 *    "shape": "rect",  // rect, circle, lozenge, triangle
 *    "color": "#bbbbbb",
 *    "borderWidth": 1,
 *    "leadingNode": [1, 0, 1, 0, 0, 0],
 *    "contrastNames": ["Contrast1", "Contrast2", "Contrast3",
 *                      "Contrast4", "Contrast5", "Contrast6"],
 *    "id": "Thing",
 *    "barplotTooltips": ["NPA value=..<br>LN 1", "NPA value=..<br>LN 2",
 *                        "NPA value=..<br>LN 3", "NPA value=..<br>LN 4",
 *                        "NPA value=..<br>LN 5", "NPA value=..<br>LN 6"],
 *    "nodeTooltipHtmlContent": "<center>centered text</center><br><ul>
 *                               <li>toto1</li><li>toto2</li></ul>",
 *    "urlLink": "http://www.freebsd.org",
 *    "name": "Thing",
 *    "barplotColors": ["#ff0000", "#ef459e", "#e46045", "#0967f6",
 *                      "#492751", "#44ff00"],
 *    "barplotValues": [0.5, 0.33, 0.2, -0.85, 0.1, -0.4],
 *    "barplotTexts": ["LN 1", "LN 2", "LN 3", "LN 4", "LN 5", "LN 6"],
 *    "contrastColors": ["#ff0000", "#ef459e", "#e46045", "#0967f6",
 *                       "#492751", "#44ff00"]
 *    "starplotValues" : [0.057,0.384,0.706,0.177,0.329,0.953,0.623,0.225]
 *    "starplotColors" : ["#FF0000","#FFBF00","#80FF00","#00FF40","#00FFFF",
 *                        "#0040FF","#8000FF","#FF00BF"]
 *    "starplotLabels" : ["Cell Stress","Cell Proliferation","Nocroptosis",
 *                        "IPN","Apoptosis","Autophagy","Senescence",
 *                        "DNA Damage"]
 *    "starplotTooltips" : ["Cell Stress","Cell Proliferation","Nocroptosis",
 *                          "IPN","Apoptosis","Autophagy","Senescence",
 *                          "DNA Damage"]
 *    "starplotUrlLinks" : ["about:blank","about:blank","about:blank",
 *                          "about:blank","about:blank","about:blank",
 *                          "about:blank","about:blank"]
 *    "starplotSectorStartRad" : 0 // [0,2*PI]
 *    "starplotCircleFillColor" : "#0000ff"
 *    "starplotCircleFillOpacity" : 0.5 // "0" means fully transparent
 *    "x" : // used with 'fixed':true to pin nodes at precise coordinates
 *    "y" : // used with 'fixed':true to pin nodes at precise coordinates
 *    "fixed" : false // the layout engine will ignore it otherwise
 * }
 *
 * a link:
 * {
 *    "color": "#888888",
 *    "source": 84,
 *    "direction": "->",
 *    "target": 95,
 *    "width": "1",
 *    "linkTooltipHtmlContent": "<center>Edge</center><br><ul><li>toto1</li>
 *                               <li>toto2</li></ul>"
 * }
 *
 */
function GraphRenderer(aData, aOpts, aContainers) {

    var log = new Logger("GraphRenderer");
    this.getLog = function() {
        return log;
    };

    log.debug("--> constructor");
    var data = aData;
    this.getData = function() {
        return data;
    };

    var opts = {
        w : (("w" in aOpts) ? aOpts.w : 860),
        h : (("h" in aOpts) ? aOpts.h : 540),
        nodeSize : (("nodeSize" in aOpts) ? aOpts.nodeSize : 50),
        nodeRoundedCornerPixels : (("nodeRoundedCornerPixels" in aOpts)
                                   ? aOpts.nodeRoundedCornerPixels : 10),
        layout_forceLinkDistance : (("layout_forceLinkDistance" in aOpts)
                                    ? aOpts.layout_forceLinkDistance : 160),
        layout_forceCharge : (("layout_forceCharge" in aOpts)
                              ? aOpts.layout_forceCharge : -900),
        layout_chargeDistance : (("layout_chargeDistance" in aOpts)
                                 ? aOpts.layout_chargeDistance : undefined),
        layout_linkStrength : (("layout_linkStrength" in aOpts)
                               ? aOpts.layout_linkStrength : 1),
        layout_friction : (("layout_friction" in aOpts)
                           ? aOpts.layout_friction : 0.9),
        layout_theta : (("layout_theta" in aOpts)
                        ? aOpts.layout_theta : 0.8),
        layout_gravity : (("layout_gravity" in aOpts)
                          ? aOpts.layout_gravity : 0.1),
        maxLayoutIterations : (("maxLayoutIterations" in aOpts)
                               ? aOpts.maxLayoutIterations : 900),
        displayNetworkEveryNLayoutIterations : (
            ("displayNetworkEveryNLayoutIterations" in aOpts)
                // 0 to display only on layout completion
                ? aOpts.displayNetworkEveryNLayoutIterations : 20),
        optimizeDisplayWhenLayoutRunning : (
            ("optimizeDisplayWhenLayoutRunning" in aOpts)
                ? aOpts.optimizeDisplayWhenLayoutRunning : false),
        displayLayoutProgressbar : true,
        displayNodeLabels : (("displayNodeLabels" in aOpts)
                             ? aOpts.displayNodeLabels : false),
        nodeBorderColor : (("nodeBorderColor" in aOpts)
                           ? aOpts.nodeBorderColor : "#777777"),
        leadingNodeBorderColor : (("leadingNodeBorderColor" in aOpts)
                                  ? aOpts.leadingNodeBorderColor : "#000000"),
        noneLeadingNodeOpacity : (("noneLeadingNodeOpacity" in aOpts)
                                  ? aOpts.noneLeadingNodeOpacity : 0.5),
        nodeLabelsColor: (("nodeLabelsColor" in aOpts)
                          ? aOpts.nodeLabelsColor : "#444444"),
        nodeLabelsFont: (("nodeLabelsFont" in aOpts)
                         ? aOpts.nodeLabelsFont : "6px sans-serif"),
        dragNodeBorderColor: (("dragNodeBorderColor" in aOpts)
                              ? aOpts.dragNodeBorderColor : "#ff8400"),
        selectNodeBorderColor: (("selectNodeBorderColor" in aOpts)
                                ? aOpts.selectNodeBorderColor : "#ff8400"),
        minZoomFactor : (("minZoomFactor" in aOpts)
                         ? aOpts.minZoomFactor : 0.4),
        maxZoomFactor : (("maxZoomFactor" in aOpts)
                         ? aOpts.maxZoomFactor : 10),
        barplotInNodeTooltips : (("barplotInNodeTooltips" in aOpts)
                                 ? aOpts.barplotInNodeTooltips : true),
        barplotInNodeTooltipsFontSize : (
            ("barplotInNodeTooltipsFontSize" in aOpts)
                ? aOpts.barplotInNodeTooltipsFontSize : "10px"),
        barplotInsideNodeFontSize : (
            ("barplotInsideNodeFontSize" in aOpts)
                ? aOpts.barplotInsideNodeFontSize : "1px"),
        displayBarPlotsInsideNodes : (
            ("displayBarPlotsInsideNodes" in aOpts)
                ? aOpts.displayBarPlotsInsideNodes : true),
        barplotInsideNodeBorderColor : (
            ("barplotInsideNodeBorderColor" in aOpts)
                ? aOpts.barplotInsideNodeBorderColor : "#000000"),
        barplotInsideNodeBorderWidth : (
            ("barplotInsideNodeBorderWidth" in aOpts)
                ? aOpts.barplotInsideNodeBorderWidth : "1px"),
        nodeTooltipOpacity : (("nodeTooltipOpacity" in aOpts)
                              ? aOpts.nodeTooltipOpacity : 0.8),
        nodeTooltipActivationDelay : (
            ("nodeTooltipActivationDelay" in aOpts)
                ? aOpts.nodeTooltipActivationDelay : 0),
        displayBarplotTooltips : (("displayBarplotTooltips" in aOpts)
                                  ? aOpts.displayBarplotTooltips : false),
        displayColorScale : (("displayColorScale" in aOpts)
                             ? aOpts.displayColorScale : false),
        nodeTooltipDeactivationDelay : (
            ("nodeTooltipDeactivationDelay" in aOpts)
                ? aOpts.nodeTooltipDeactivationDelay : 200),
        enableNodeDragging : (("enableNodeDragging" in aOpts)
                              ? aOpts.enableNodeDragging : true),
        jsFunctionToCallOnNodeClick : (
            ("jsFunctionToCallOnNodeClick" in aOpts)
                ? aOpts.jsFunctionToCallOnNodeClick : undefined),
        scaleGradient: (
            ("scaleGradient" in aOpts)
                ? aOpts.scaleGradient : "0-#000080:12-#0000ff:"
                + "25-#ffffff:60-#ffa500:75-#cd0000:100"),
        scaleLabelsFontFamily: (("scaleLabelsFontFamily" in aOpts)
                                ? aOpts.scaleLabelsFontFamily : 'monospace'),
        scaleLabelsFontSize: (("scaleLabelsFontSize" in aOpts)
                              ? aOpts.scaleLabelsFontSize :10),
        scaleHeight: (("scaleHeight" in aOpts) ? aOpts.scaleHeight : 25),
        scaleTickSize: (("scaleTickSize" in aOpts) ? aOpts.scaleTickSize : 4),
        scaleTicksPercents: (("scaleTicksPercents" in aOpts)
                             ? aOpts.scaleTicksPercents : [20,40,60,80,100]),
        imagesUrl: (("imagesUrl" in aOpts) ? aOpts.imagesUrl : "images"),
        exportCGI: (("exportCGI" in aOpts) ? aOpts.exportCGI : false)
    };
    this.getOpts = function() {
        return opts;
    };

    var containers = aContainers;
    this.getContainers = function() {
        return containers;
    };

    var nodeOverlayRadius = opts.nodeSize + 0.2 * opts.nodeSize;

    var mouseEventsEnabled = true;
    var half_nodeSize = opts.nodeSize/2;
    var half_forceLinkDistance = opts.layout_forceLinkDistance/2;

    var showNeighbors = $("#" + containers.neighborsButtonId)
        .attr("class") == "button_on";
    var showTooltips = $("#" + containers.tooltipsButtonId)
        .attr("class") == "button_on";
    var nodeDragging = false;  // true if a node is being dragged

    // Default values used when not set
    var defaultValues = {
        "linkWidth" : 1,
        "linkColor" : "#bbbbbb",
        "nodeColor" : "#bbbbbb",
        "nodeBorderWidth" : 1,
        "dragNodeBorderColor" : "#ff8400",
        "selectNodeBorderColor" : "#ff0000"
    };

    var validation = {
        "has_node_id" : true,
        "has_node_name" : true,
        "has_node_shape" : true,
        "has_node_urlLink" : true,
        "has_node_color" : true,
        "has_node_borderWidth" : false,
        "has_node_barplotValues" : true,
        "has_node_barplotColors" : true,
        "has_node_barplotTexts" : true,
        "has_node_barplotTooltips" : true,
        "has_node_leadingNode" : true,
        "has_node_contrastNames" : true,
        "has_node_contrastColors" : true,
        "has_links_source" : true,
        "has_links_target" : true,
        "has_links_color" : true,
        "has_links_width" : true,
        "has_links_direction" : true,
        "has_every_nodes_fixed_xy" : false,
        "has_node_starplot_labels" : false,
        "has_node_starplot_values" : false,
        "has_node_starplot_colors" : false,
        "has_node_starplot_tooltips" : false,
        "has_node_starplot_urlLinks" : false,
        "has_node_starplot_sectorStartRad" : false,
        "has_node_starplot_circleFillColor" : false,
        "has_node_starplot_circleFillOpacity" : false
    };

    /**
     * All recognized shapes are defined here by their name
     * and the library will translate them to svg paths.
     */
    var valid_shapes = ["rect", "circle", "lozenge", "triangle"];

    /**
     * Display javascript exception on the webpage.
     */
    this.error = function(e) {
        log.error("Unexpected Error !\n"
                  + "Description:\n" + e.description
                  + "\n"
                  + "Stack:\n" + e.stack);
        return message("<font color='red' style='font-size: 18px;'>"
                       + "<b>Unexpected Error !</b>"
                       + "</font>"
                       + "<br><br>"
                       + "<font style='font-size: 16px;'>"
                       + "<u>Description</u>"
                       + "</font>"
                       + "<br>"
                       + "<font style='font-size: 12px;'>"
                       + e.description
                       + "</font>"
                       + "<br><br>"
                       + "<font style='font-size: 16px;'>"
                       + "<u>Stack</u>"
                       + "</font>"
                       + "<br>"
                       + "<font style='font-size: 12px;'>"
                       + (e.stack).replace(new RegExp('\n', 'g'), '<br>')
                       + "</font>"
                      );
    };

    /**
     * Read the provided JSON object and check if we have
     * the necessary keys to draw the network.
     *
     * Returns an object {"isValid": true/false, "message": "..."}
     */
    this.validateJson = function(json) {
        log.debug("--> validateJson()");
        message("Validating the network...");
        // "nodes" and "links" keys are mandatory in all cases
        if(!"nodes" in json) {
            return {
                "isValid": false,
                "message": "No \"nodes\" key found in the input data."
            };
        }
        if(!"links" in json) {
            return {
                "isValid": false,
                "message": "No \"links\" key found in the input data."
            };
        }
        if(!json["nodes"] instanceof Array) {
            return {
                "isValid": false,
                "message": "The \"nodes\" key must be an array."
            };
        }
        if(!json["links"] instanceof Array) {
            return {
                "isValid": false,
                "message": "The \"links\" key must be an array."
            };
        }

        // "nodes" specific attributes
        validation.has_node_id = ("id" in json["nodes"][0]);
        validation.has_node_name = ("name" in json["nodes"][0]);
        validation.has_node_shape = ("shape" in json["nodes"][0]);
        validation.has_node_urlLink = ("urlLink" in json["nodes"][0]);
        validation.has_node_color = ("color" in json["nodes"][0]);
        validation.has_node_borderWidth = ("borderWidth" in json["nodes"][0]);
        validation.has_node_barplotValues = (
            "barplotValues" in json["nodes"][0]);
        validation.has_node_barplotColors = (
            "barplotColors" in json["nodes"][0]);
        validation.has_node_barplotTexts = (
            "barplotTexts" in json["nodes"][0]);
        validation.has_node_barplotTooltips = (
            "barplotTooltips" in json["nodes"][0]);
        validation.has_node_leadingNode = ("leadingNode" in json["nodes"][0]);
        validation.has_node_contrastNames = (
            "contrastNames" in json["nodes"][0]);
        validation.has_node_contrastColors = (
            "contrastColors" in json["nodes"][0]);
        validation.has_node_starplot_labels = (
            "starplotLabels" in json["nodes"][0]);
        validation.has_node_starplot_values = (
            "starplotValues" in json["nodes"][0]);
        validation.has_node_starplot_colors = (
            "starplotColors" in json["nodes"][0]);
        validation.has_node_starplot_tooltips = (
            "starplotTooltips" in json["nodes"][0]);
        validation.has_node_starplot_urlLinks = (
            "starplotUrlLinks" in json["nodes"][0]);
        validation.has_node_starplot_sectorStartRad = (
            "starplotSectorStartRad" in json["nodes"][0]);
        validation.has_node_starplot_circleFillColor = (
            "starplotCircleFillColor" in json["nodes"][0]);
        validation.has_node_starplot_circleFillOpacity = (
            "starplotCircleFillOpacity" in json["nodes"][0]);

        // "links" specific attributes
        validation.has_links_source = ("source" in json["links"][0]);
        validation.has_links_target = ("target" in json["links"][0]);
        validation.has_links_color = ("color" in json["links"][0]);
        validation.has_links_width = ("width" in json["links"][0]);
        validation.has_links_direction = ("direction" in json["links"][0]);

        // check if the 'shape' type is valid
        if(validation.has_node_shape) {
            for(var i=0 ; i<json["nodes"].length ; i++) {
                var shape = json["nodes"][i].shape;
                if($.inArray(shape, valid_shapes) < 0) {
                    // if any invalid shape is found,
                    // do not take the 'shape' key into account at all
                    validation.has_node_shape = false;
                    return {"isValid": false, "message": "\"" + shape
                            + "\" is not a valid shape type."};
                }
            }
        }

        // check if we have fixed coordinated for every node
        // by default, set it to true: the first none fixed node
        // will set it to false
        validation.has_every_nodes_fixed_xy = true;
        for(var i=0 ; i<json["nodes"].length; i++) {
            var has_x = ("x" in json["nodes"][i]);
            var has_y = ("y" in json["nodes"][i]);
            var has_fixed = ("fixed" in json["nodes"][i]);
            if(has_fixed && has_x && has_y) {
                if(!json["nodes"][i].fixed) {
                    validation.has_every_nodes_fixed_xy = false;
                    break;
                }
            } else {
                validation.has_every_nodes_fixed_xy = false;
                break;
            }
        }

        // check that the minimal keys are there
        // if(!has_node_id) {
        //     return {
        //         "isValid": false,
        //         "message": "No \"id\" key found in the nodes list."
        //     };
        // }
        if(!validation.has_node_name) {
            return {
                "isValid": false,
                "message": "No \"name\" key found in the nodes list."
            };
        }
        if(!validation.has_links_source) {
            return {
                "isValid": false,
                "message": "No \"source\" key found in the links list."
            };
        }
        if(!validation.has_links_target) {
            return {
                "isValid": false,
                "message": "No \"target\" key found in the links list."
            };
        }

        // if we have barplot values, the rest must be defined
        if(validation.has_node_barplotValues) {
            if(!validation.has_node_barplotColors) {
                return {
                    "isValid": false,
                    "message": "The \"barplotColors\" key is mandatory "
                        + "when \"barplotValues\" is defined in "
                        + "the nodes list."
                };
            }
        }

        // check if we have a valid value
        if(!json["nodes"][0].starplotValues) {
            validation.has_node_starplot_labels = false;
            validation.has_node_starplot_values = false;
            validation.has_node_starplot_colors = false;
            validation.has_node_starplot_tooltips = false;
            validation.has_node_starplot_urlLinks = false;
            validation.has_node_starplot_sectorStartRad = false;
            validation.has_node_starplot_circleFillColor = false;
            validation.has_node_starplot_circleFillOpacity = false;
        }

        // if we have starplot values, the rest must be defined
        if(validation.has_node_starplot_values) {
            if(!validation.has_node_starplot_colors
               || !validation.has_node_starplot_labels
               || !validation.has_node_starplot_tooltips) {
                return {
                    "isValid": false,
                    "message": "The \"starplot(Colors,Labels,Tooltips)\" "
                        + "keys are mandatory when \"starplotValues\" is "
                        + "defined in the nodes list."
                };
            }
        }

        log.debug("validation : \n" + (JSON.stringify(validation, null, 4)));
        return {"isValid": true, "message": ""};
    };

    //fill = d3.scale.category20();

    var panningZoomingBahavior = d3.behavior.zoom()
        .scaleExtent([opts.minZoomFactor, opts.maxZoomFactor])
        .on("zoom", panZoom);

    function setCursor(cursorStyle) {
        $("#" + containers.networkDivId).css("cursor", cursorStyle);
    }

    var svgNetworkId = "network_svg_" + uid();
    var vis = d3.select("#" + containers.networkDivId)
        .append("svg:svg")
        .attr("id", svgNetworkId)
        // IE10 draws outside the container otherwise!
        .attr("overflow", "hidden")
        .attr("width", opts.w)
        .attr("height", opts.h)
        .attr("pointer-events", "all")
        // .attr("viewBox", "-300 -100 " + opts.w + " " + opts.h )
        // .attr("preserveAspectRatio", "xMidYMid meet")
        .append('svg:g')
        // .attr("transform", "scale(0.3)")
        // .call(panningZoomingBahavior)
        .append('svg:g');

    d3.select("#" + containers.networkDivId)
        .call(panningZoomingBahavior);


    // DOES NOT WORK
    // d3.select("#" + containers.networkDivId)
    //      .on("ondragstart", setCursor("all-scroll"));

    // d3.select("#" + containers.networkDivId)
    //      .on("ondragend", setCursor("auto"));

    var myTooltipBarDivId = "tooltip_bar_"+uid();
    var div_bar = d3.select("body").append("div")
        .attr("class", "tooltip_bar")
        .attr("id", myTooltipBarDivId)
        .style("opacity", 1e-6);

    var myTooltipNodeDivId = "tooltip_node_"+uid();
    var div_node = d3.select("body").append("div")
        .attr("class", "tooltip_node")
        .attr("id", myTooltipNodeDivId)
        .style("opacity", 1e-6);

    if("dialogAboutButtonId" in containers) {
        if($("#" + containers.dialogAboutButtonId).length) {
            // create the dialog box "About"
            var html_about = "<center><img src=\""
                + opts.imagesUrl + "/pmintl.png\" />"
                + "<p style=\""
                + "font: 26px sans-serif;"
                + "font-weight: bold; "
                + "color: #ffffff;"
                + "text-shadow: 0 0 2px #0166B1, 0 0 2px #0166B1, "
                + "0 0 2px #0166B1, 0 0 2px #0166B1, 0 0 2px #0166B1;"
                + "\">"
                + "RGraph2js"
                + "</p>"
                + "<p style=\"font: 14px sans-serif;\">"
                + "A Graph visualization tool based on D3"
                + "</p>"
                + "<br>"
                + "<hr>"
                + "<p style=\"font: 10px sans-serif;\">"
                + "Written by Stephane Cano, Sylvain Gubian, "
                + "Florian Martin, PMP S.A."
                + "<br>&copy;2015 PMP S.A."
                + "</p>"
                + "</center>";
            var myDialogAboutDivId = "dialog_about_"+uid();
            var div_dialog_about = d3.select("body").append("div")
            // .attr("class", "tooltip_node")
                .attr("id", myDialogAboutDivId)
                .style("background", "#efefef")
                .style("border", "1px solid #cdcdcd")
                .style("font", "Helvetica 11px normal");
            // .style("background-repeat", "no-repeat");
            $("#"+myDialogAboutDivId).empty();
            $("#"+myDialogAboutDivId).append(html_about);
            $("#"+myDialogAboutDivId).dialog({
                                           autoOpen: false,
                                           show: {
                                               effect: "fade",
                                               duration: 1000
                                           },
                                           hide: {
                                               effect: "fade",
                                               duration: 1000
                                           },
                                           title: "About",
                                           closeOnEscape: true,
                                           resizable: false,
                                           width: 400,
                                           height: 500
                                       });
            $("#" + containers.dialogAboutButtonId).click(
                function() {
                    $("#"+myDialogAboutDivId).dialog("open");
                });
        }
    }

    var div_node_contextmenu_id = "node_contextmenu_" + uid();
    var div_node_contextmenu = d3.select("body").append("div")
        .attr("class", "node_contextmenu")
        .attr("id", div_node_contextmenu_id)
        .style("opacity", 1e-6);

    var div_export_contextmenu_id = "export_contextmenu_" + uid();
    var div_export_contextmenu = d3.select("body").append("div")
        .attr("class", "export_contextmenu")
        .attr("id", div_export_contextmenu_id)
        .style("opacity", 1e-6);


    if(opts.displayLayoutProgressbar
       && $( "#" + containers.progressbarDivId ).length) {
        $( "#" + containers.progressbarDivId ).progressbar(
            {
                value: 0,
                change: function()
                {
                    if($( "#" + containers.progressbarLabelDivId ).length) {
                        $( "#" + containers.progressbarLabelDivId )
                            .text( $( "#" + containers.progressbarDivId )
                                   .progressbar( "value" ) + "%" );
                    }
                }
            }
        );
    }

    function panZoom() {
        vis.attr("transform",
                 "translate(" + d3.event.translate + ")"
                 + " scale(" + d3.event.scale + ")");
    }

    // utils
    function setProgressBarValue(val) {
        if(opts.displayLayoutProgressbar
           && $( "#" + containers.progressbarDivId ).length) {
            $( "#" + containers.progressbarDivId ).progressbar( {value: val} );
        }
    };
    function setProgressBarComplete() {
        if(opts.displayLayoutProgressbar
           && $( "#" + containers.progressbarDivId ).length) {
            $( "#" + containers.progressbarDivId ).progressbar(
                {value: parseInt(100)} );
        }
    };

    function hide_progressbar(delay_ms) {
        if(opts.displayLayoutProgressbar
           && $( "#" + containers.progressbarDivId ).length) {
            setTimeout(function() {
                           $("#" + containers.progressbarDivId).hide();
                       }, delay_ms);
        }
    };

    function show_progressbar() {
        $("#" + containers.progressbarDivId).show();
    };

    function message(html) {
        $("#" + containers.messageDivId).empty();
        $("#" + containers.messageDivId).append(html);
        show_message();
    };
    this.message = message;

    function hide_message(delay_ms) {
        setTimeout(function() {
                       $("#" + containers.messageDivId).hide();
                   }, delay_ms);
    };
    this.hide_message = hide_message;

    function show_message() {
        $("#" + containers.messageDivId).show();
    };
    this.show_message = show_message;

    function hide_spinner() {
        if( $( "#" + containers.spinnerDivId ).length ) {
            $("#"+containers.spinnerDivId).css({ opacity : 1e-6 });
        }
    };
    this.hide_spinner = hide_spinner;

    function show_spinner() {
        if( $( "#" + containers.spinnerDivId ).length ) {
            $("#"+containers.spinnerDivId).css({ opacity : 1 });
        }
    };
    this.show_spinner = show_spinner;

    /*
    function currentnode(html) {
        $("#" + containers.currentNodeInfoDivId).empty();
        $("#" + containers.currentNodeInfoDivId).append(html);
    }

    function hide_currentnode() {
        $("#" + containers.currentNodeInfoDivId).hide();
    }

    function show_currentnode() {
        $("#" + containers.currentNodeInfoDivId).show();
    }
    */

    function openLink(url) {
        var params = "location=yes,height=570,width=520,"
            + "scrollbars=yes,status=yes";
        var win = window.open(url, "_blank", params);
    }


    /**
     * Get the svg path representation of a shape type/name.
     */
    function getShape(shapeType, x, y, size) {

        ///////////////////////////////////////////////////////////
        // The following commands are available for path data:   //
        //                                                       //
        // M = moveto                                            //
        // L = lineto                                            //
        // H = horizontal lineto                                 //
        // V = vertical lineto                                   //
        // C = curveto                                           //
        // S = smooth curveto                                    //
        // Q = quadratic Bézier curve                            //
        // T = smooth quadratic Bézier curveto                   //
        // A = elliptical Arc                                    //
        // Z = closepath                                         //
        //                                                       //
        // Note:                                                 //
        // All of the commands above can also be expressed       //
        // with lower letters. Capital letters means absolutely  //
        // positioned, lower cases means relatively positioned.  //
        //                                                       //
        // Source:                                               //
        // http://www.w3schools.com/svg/svg_path.asp             //
        ///////////////////////////////////////////////////////////

        if(shapeType == "rect") {
            return "M0 0 "
                + "L " + size + " 0 "
                + "L " + size + " " + size
                + " L 0 " + size
                + " L 0 0 Z";
        } else if(shapeType == "circle") {
            var r = Math.sqrt( (size*size)/2 );
            var s = size/2;
            return "M " + s + " " + s
                + " m " + (-r) + " 0 "
                + "a " + r + " " + r + " 0 1 1 " + (2*r) + " 0 "
                + "a " + r + " " + r + " 0 1 1 " + (-2*r) + " 0 Z";
        } else if(shapeType == "lozenge") {
            var s = size/2;
            return "M " + s + " " + (-s)
                + " L " + (3*s) + " " + s
                + " L " + s + " " + (3*s)
                + " L " + (-s) + " " + s
                + " L " + s + " " + (-s) + " Z";
        } else if(shapeType == "triangle") {
            var s = size/2;
            return "M " + (-s) + " " + size + " "
                + "L " + (3*s) + " " + size + " "
                + "L " + s + " " + (-size) + " "
                + "L " + (-s) + " " + size + " Z";
        }
        // a rect is the default
        return "M0 0 "
            + "L " + size + " 0 "
            + "L " + size + " " + size
            + " L 0 " + size
            + " L 0 0 Z";
    }

    //////////////////////
    // BARPLOT TOOLTIPS //
    //////////////////////

    if(showTooltips) {
        $( document ).tooltip({
            tooltipClass: "ui-tooltip",
            track: true,
            // content: function () {
            //     return $(this).prop('title');
            // },
            position: {
                my: "left top",
                at: "right+10 top+10"
            }
        });
    }

    $("#" + containers.contrastSliderBarDivId).hide();

    /**
     * Automatically called by the draw() function.
     */
    this.drawScale = function() {
        if(opts.displayColorScale && $("#" + containers.scaleDivId).length) {
            log.debug("--> drawScale()");
            Scale.drawScale(
                {
                    scaleId: containers.scaleDivId,
                    scaleGradient: opts.scaleGradient,
                    scaleLabelsFontFamily: opts.scaleLabelsFontFamily,
                    scaleLabelsFontSize: opts.scaleLabelsFontSize,
                    scaleWidth: opts.w,
                    scaleHeight: opts.scaleHeight,
                    scaleTickWidth: opts.scaleTickSize,
                    scaleTicksPercents: opts.scaleTicksPercents
                });
        }
    };

    /**
     * Automatically called by the draw() function
     * to render the network.
     */
    this.drawGraph = function(json) {
        log.debug("--> drawGraph()");
        // build the arrow
        vis.append("svg:defs").selectAll("marker")
            // Different link/path types can be defined here
            .data(["arrow"])
            .enter().append("svg:marker")
            .attr("id", String)
            .attr("viewBox", "0 0 15 15")
            .attr("stroke-width", 1)
            .attr("markerWidth", 15)
            .attr("markerHeight", 15)
            .attr("orient", "auto")
            .attr("refX", 0)
            .attr("refY", 4.5)
            // http://www.w3c.org/TR/SVG11/painting.html#MarkerUnitsAttribute
            .attr("markerUnits", "userSpaceOnUse")
            .append("svg:path")
            .attr("d", "M0,0 L0,9 L13.5,4.5 z");
        vis.append("svg:defs").selectAll("marker")
            .data(["point"])
            .enter().append("svg:marker")
            .attr("id", String)
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 5)
            .attr("refY", 5)
            .attr("stroke-width", 1)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("orient", "auto")
            // http://www.w3c.org/TR/SVG11/painting.html#MarkerUnitsAttribute
            .attr("markerUnits", "userSpaceOnUse")
            .append("svg:circle")
            .attr("cx", 5)
            .attr("cy", 5)
            .attr("r", 5);

        var link = vis.append("g").selectAll("path")
            .data(json.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("stroke", function(d) {
                      if(validation.has_links_color) {
                          return d.color;
                      } else {
                          return defaultValues.linkColor;
                      }
                  })
            .attr("stroke-width", function(d) {
                      if(validation.has_links_width) {
                          return d.width;
                      } else {
                          return defaultValues.linkWidth;
                      }
                  })
            .attr("fill", function(d) {
                  if(validation.has_links_color) {
                          return d.color;
                      } else {
                          return defaultValues.linkColor;
                      }
                  })
            .attr("marker-mid", function(d) {
                      if(validation.has_links_direction) {
                          if(d.direction == "->") {
                              return "url(#arrow)";
                          } else if(d.direction == "-|") {
                              return "url(#point)";
                          } else if(d.direction == "--") {
                              return "url()";
                          } else {
                              return "url()";
                          }
                      } else {
                          return "url()";
                      }
                  })
            .on('mouseover', function(d){
                    mouseover_link(d);
                })
            .on('mouseout', function(d){
                    mouseout_link(d);
                });;

        // node group
        var node = vis.selectAll("node")
            .data(json.nodes)
            .enter()
            .append("g")
            .attr("id", function(d) { return d.id; })
            .attr("class", "node");

        if(!validation.has_node_shape) {
            // Use a rect by default, when no shape are specified
            node.append("rect")
                .attr("width", opts.nodeSize)
                .attr("height", opts.nodeSize)
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; })
                .attr("rx", opts.nodeRoundedCornerPixels)
                .attr("ry", opts.nodeRoundedCornerPixels)
                .attr("stroke", opts.nodeBorderColor)
                .attr("stroke-width", function(d){
                           if(validation.has_node_borderWidth) {
                               return d.borderWidth;
                           } else {
                               return defaultValues.nodeBorderWidth;
                           }
                       })
                .style("fill", function(d){
                           if(validation.has_node_color) {
                               return d.color;
                           } else {
                               return defaultValues.nodeColor;
                           }
                       });
        } else {
            // Use the specified shape
            // We can't use a function inside append() to return d.shapeType()
            // for example. To solve this we can use paths instead of standard
            // shapes like rect or circle.
            node.append("path")
                .attr('d', function(d)
                      {
                          return getShape(d.shape, d.x, d.y,
                                          opts.nodeSize);
                      })
                .attr('x', function(d) { return d.x; })
                .attr('y', function(d) { return d.y; })
                .attr("stroke", opts.nodeBorderColor)
                .attr("stroke-width", function(d){
                           if(validation.has_node_borderWidth) {
                               return d.borderWidth;
                           } else {
                               return defaultValues.nodeBorderWidth;
                           }
                       })
                .style("fill", function(d) {
                       if(validation.has_node_color) {
                               return d.color;
                           } else {
                               return defaultValues.nodeColor;
                           }
                       });
        }

        // node.on("dblclick", function (d) {
        //             openLink_node(d);
        //         })
        node.on("contextmenu", function(d) {
                    contextmenu_node(d);
                })
            .on('mouseover', function(d){
                    mouseover_node(d);
                })
            .on("mousemove", function(d){
                    mousemove_node(d);
                })
            .on("mouseout", function(d){
                    mouseout_node(d);
                })
            .on("click", function(d) {
                    if(opts.jsFunctionToCallOnNodeClick !== undefined) {
                        if(opts.enableNodeDragging
                           && $("#" + containers.dragModeButtonId).length) {
                            if( !$("#" + containers.dragModeButtonId)
                                .prop("checked") ) {

                                // get the right d3Element
                                // (where we will change the border style)
                                var d3Element = this;
                                // there may be a svg path <path>
                                if(this.childElementCount == 1) {
                                    d3Element = this.childNodes[0];
                                }

                                var selectNodeBorderColor = defaultValues
                                    .selectNodeBorderColor;

                                // save current border width and color
                                var savedNodeBorderColor = d3.select(d3Element)
                                    .style("stroke");
                                var savedNodeBorderWidth = d3.select(d3Element)
                                    .style("stroke-width");

                                // highlight the node border with a color
                                // effect and get back to the original style
                                d3.select(d3Element)
                                    .transition()
                                    .duration(500)
                                    .style("stroke-width", 8)
                                    .style("stroke", selectNodeBorderColor)
                                    .each("end", function()
                                          {
                                              d3.select(this)
                                                  .transition()
                                                  .duration(500)
                                                  .style(
                                                      "stroke-width",
                                                      savedNodeBorderWidth)
                                                  .style(
                                                      "stroke",
                                                      savedNodeBorderColor);
                                          });

                                // we can use eval() or window() here
                                window[opts.jsFunctionToCallOnNodeClick ](d);
                                // eval(
                                //     opts.jsFunctionToCallOnNodeClick
                                //         + "(d);"
                                // );
                            }
                        }
                    }
                });

        // node overlay
        // var nodeOverlay = vis.selectAll("nodeOverlay")
        //     .data(json.nodes)
        //     .enter().append("g")
        //     .attr("class", "nodeOverlay")
        //     .append("circle")
        //     .attr("cx", function(d) { return d.x+(half_nodeSize); })
        //     .attr("cy", function(d) { return d.y+(half_nodeSize); })
        //     .attr("r", nodeOverlayRadius)
        //     .attr("stroke", "#000000")
        //     .style("fill", function(d){ return "#000000"; })
        //     .style("opacity", 1e-6);

        // compute the min and max values
        // accross all barplots
        var bpMinMax;
        var barHeightRatio;
        if(validation.has_node_barplotValues) {
            bpMinMax = barplotMinMax(json);
            barHeightRatio = half_nodeSize / Math.max(
                Math.abs(bpMinMax.min),
                Math.abs(bpMinMax.max)
            );
        }

        // Draw a Starplot inside the node
        if(validation.has_node_starplot_values
           && validation.has_node_starplot_labels
           && validation.has_node_starplot_colors
           && validation.has_node_starplot_tooltips) {
            var starplots = [];
            // iterate over nodes to append a div where
            // the starplots are going to be drawn
            for(var i=0 ; i<json.nodes.length ; i++) {
                starplots[i] = vis.selectAll("starplot" + i)
                    .data(json.nodes)
                    .enter()
                    .append("g")
                    .attr("id", function(d) { return "starplot_" + d.id; })
                    .attr("x", function(d) { return 0; })
                    .attr("y", function(d) { return 0; })
                    .attr("transform", function(d) { return "";});

                var categories = json.nodes[i].starplotLabels;
                var radLabels = [];
                var radValues = json.nodes[i].starplotValues;
                var radColors = json.nodes[i].starplotColors;
                var starplotUrlLinks = [];
                if(validation.has_node_starplot_urlLinks) {
                    starplotUrlLinks = json.nodes[i].starplotUrlLinks;
                }
                var starplotSectorStartRad = 0;
                if(validation.has_node_starplot_sectorStartRad) {
                    starplotSectorStartRad = json.nodes[i]
                        .starplotSectorStartRad;
                }
                var starplotCircleFillColor = '#000000';
                if(validation.has_node_starplot_circleFillColor) {
                    starplotCircleFillColor = json.nodes[i]
                        .starplotCircleFillColor;
                }
                var starplotCircleFillOpacity = 0.0;
                if(validation.has_node_starplot_circleFillOpacity) {
                    starplotCircleFillOpacity = json.nodes[i]
                        .starplotCircleFillOpacity;
                }

                var starplotOpts = {
                    titleFontFamily: 'monospace',
                    titleFontSize: 10,
                    labelsFontFamily: 'monospace',
                    labelsFontSize: 5,
                    labelsColor: '#6d6d6d',
                    backgroundColor: '#efefef',
                    border: 1,
                    borderColor: '#000',
                    leftmargin : 20,
                    rightmargin : 20,
                    topmargin : 20,
                    titlechartspacing: 60,
                    bottommargin : 20,
                    sectorLabelsFontFamily: 'monospace',
                    sectorLabelsFontSize: 5,
                    sectorUrlLinks: starplotUrlLinks,
                    circleStrokeColor: '#6d6d6d',
                    circleFillColor: starplotCircleFillColor,
                    circleFillOpacity: starplotCircleFillOpacity,
                    sectorStartRad: starplotSectorStartRad,
                    circleStrokeWidth: 1,
                    circleSectorTickColor: '#6d6d6d',
                    circleSectorTickStrokeWidth: 1,
                    circleSectorTickDashArray: '.',
                    inCircleSectorTickDashArray: '-',
                    circleSectorFillOpacity: '0.5',
                    inCircleSectorFillOpacity: '1.0',
                    highlightColor: '#ff0000',
                    drawTitle: false,
                    drawSectorLabels: false,
                    drawSecorValues: false,
                    drawBackground: false
                };

                var title = "";
                var paperWidth = opts.nodeSize;
                var paperHeigth = opts.nodeSize;
                var originX = opts.nodeSize/2;
                var originY = opts.nodeSize/2;
                var radius = opts.nodeSize/2.2;
                var starplot = new StarPlot(
                    title, paperWidth, paperHeigth,
                    categories, radLabels, categories,
                    radValues, radColors, starplotOpts,
                    originX, originY, radius);

                starplot.draw("starplot_" + json.nodes[i].id);
            }
        }

        if(opts.displayBarPlotsInsideNodes && validation.has_node_barplotValues) {
            // We assume the number of bars is the same in every barplot!
            var numOfBars = json.nodes[0].barplotValues.length;
            var barWidth = opts.nodeSize/numOfBars;
            var barHeight;
            var barplots = [];
            var barplottexts = [];

            for(var i=0 ; i<numOfBars ; i++) {
                barplots[i] = vis.selectAll("bar" + i)
                    .data(json.nodes)
                    .enter()
                    .append("g")
                    .attr("id", function(d) { return "bar_" + d.id; })
                    .attr("class", "bar")
                    // tooltip with jquery-ui
                    .attr("title", 
                          function(d) {
                              if(opts.displayBarplotTooltips
                                 && validation.has_node_barplotTooltips) {
                                  return d.barplotTooltips[i]
                                      .replace('<br>','<br/>')
                                      .replace('<BR>','<BR/>');
                              } else {
                                  return "";
                              }
                          })
                    .append("rect")
                    .attr("width", barWidth)
                    .attr("height", function(d) {
                        return Math.abs(d.barplotValues[i])
                            * barHeightRatio;
                    })
                    .attr("x", function(d) { return 0; })
                    .attr("y", function(d) { return 0; })
                    .attr("stroke", opts.barplotInsideNodeBorderColor)
                    .attr("stroke-width", opts.barplotInsideNodeBorderWidth)
                    .style("fill", function(d) {
                               if(validation.has_node_barplotColors) {
                                   return d.barplotColors[i];
                               } else {
                                   // should not happen
                                   return "#000000";
                               }
                           });

                if(validation.has_node_barplotTexts) {
                    barplottexts[i] = vis.selectAll("bartext" + i)
                        .data(json.nodes)
                        .enter()
                        .append("g")
                        .attr("id", function(d) { return "bartext_" + d.id; })
                        .append("svg:text")
                        .style("font-family", "sans serif")
                        .style("font-size", opts.barplotInsideNodeFontSize)
                        .style("font-style", "normal")
                        .attr("dx", 0)
                        .attr("dy", 0)
                        .attr("stroke", "#000000")
                        .attr("stroke-width", ".1px")
                        .attr("fill", function(d) {
                                  if(validation.has_node_barplotColors) {
                                      return d.barplotColors[i];
                                  } else {
                                      // should not happen
                                      return "#000000";
                                  }
                              })
                        .text(function(d) {
                                  return d.barplotTexts[i];
                              })
                        .attr("transform", function(d) {
                                  return "rotate(-90)";
                              });
                }
            }

        }
        // node labels
        if(opts.displayNodeLabels) {
            var nodeLabel = vis.selectAll("nodetext")
                .data(json.nodes)
                .enter()
                .append("g")
                .append("svg:text")
                .attr("fill", opts.nodeLabelColor)
                .text(function(d) { return d.name; })
                .style("font", opts.nodeLabelsFont);
        }

        // vis.style("opacity", 1e-6)
        //     .transition()
        //     .duration(2000)
        //     .style("opacity", 1);

        // SLOW !
        // function linkArc(d) {
        //     var dx = d.target.x - d.source.x,
        //     dy = d.target.y - d.source.y,
        //     dr = Math.sqrt(dx * dx + dy * dy);
        //     return "M" + source_x + "," + source_y
        //         + "A" + dr + "," + dr
        //         + " 0 0,1 " + target_x + "," + target_y;
        // }

        /**
         * Generate a partial SVG path with absolute coordinates to draw
         * a line (L) between the source point and the target one given
         * the parameter t which is [0.0, 1.0] : 0.0 means "at the source"
         * and 1.0 "at the target".
         */
        function getSVGPositionOnStraightLine(source_x, source_y,
                                              target_x, target_y, t) {
            return "L" + (source_x + (target_x - source_x)*t)
                + "," + (source_y + (target_y - source_y)*t) + " ";
        }

        function getPosOnLinkFromSymbol(symbol) {
            if(symbol == "--") return 0.5;
            else if(symbol == "->") return 0.5;
            else if(symbol == "-|") return 0.75;
            else return 0.5;
        }

        // FASTER !
        function linkStraightLine(d) {
            // if(d.source.x == d.target.x && d.source.y == d.target.y) {
            //     // the connection is a loopback: the node connects with itself
            //     var a_x = parseFloat(d.source.x);
            //     var a_y = parseFloat(d.source.y + half_nodeSize);
            //     var b_x = parseFloat(d.target.x - opts.nodeSize);
            //     var b_y = parseFloat(d.target.y - opts.nodeSize);
            //     var c_x = parseFloat(d.target.x + half_nodeSize);
            //     var c_y = parseFloat(d.target.y);
            //     // var posOnLink = getPosOnLinkFromSymbol(d.direction);
            //     return "M" + a_x + "," + a_y
            //         + "q" + (b_x - a_x) + "," + (b_y - a_y)
            //         + "," + (c_x - a_x) + "," + (c_y - a_y);
            // } else {
            // we want the links/edges to go from 1 node center to another
            var source_x = parseFloat(d.source.x + half_nodeSize);
            var source_y = parseFloat(d.source.y + half_nodeSize);
            var target_x = parseFloat(d.target.x + half_nodeSize);
            var target_y = parseFloat(d.target.y + half_nodeSize);
            var posOnLink = getPosOnLinkFromSymbol(d.direction);
            return "M" + source_x + "," + source_y + " "
            // we add a connection in the line to offer the possibility
            // to use the marker-mid to position the edges arrow/marks
            // precisely
                + getSVGPositionOnStraightLine(
                    source_x, source_y, target_x, target_y, posOnLink)
                + "L" + target_x + "," + target_y;
            // }
        }

        function transform(d) {
            return "translate(" + d.x + "," + d.y + ")";
        }

        /**
         * Gives the coordinates of the border for keeping the nodes
         * inside a frame.
         */
        // function transform_boxed(d) {
        //     d.x =  Math.max(
        //         opts.nodeSize,
        //         Math.min(w - opts.nodeSize, d.x));
        //     d.y =  Math.max(
        //         opts.nodeSize,
        //         Math.min(h - opts.nodeSize, d.y));
        //     return "translate(" + d.x + "," + d.y + ")";
        // }

        var force = d3.layout.force()
            .charge(opts.layout_forceCharge)
            .linkDistance(opts.layout_forceLinkDistance)
            .linkStrength(opts.layout_linkStrength)
            .friction(opts.layout_friction)
            .nodes(json.nodes)
            .links(json.links)
            .theta(opts.theta)
            .size([opts.w, opts.h]);
        if(opts.layout_chargeDistance !== undefined) {
            force.chargeDistance(opts.layout_chargeDistance);
        }

        // var img = opts.imagesUrl + "/spinner.gif";
        // message("<img src=\""+img+"\" \> Optimizing the layout...");
        show_spinner();
        message("Optimizing the layout...");

        force.on("tick", force_tick);
        // force.on("end", force_end);

        function reload() {
            // node coordinates reinitialization
            for(var i=0 ; i<json.nodes.length ; i++) {
                json.nodes[i].x = 0;
                json.nodes[i].y = 0;
            }
            // reinitialization done
            log.debug("Reload");
            // forceActive = true;
            // iters = 0;
            // force.resume();
            restartForceLayout();
        }
        $("#" + containers.reloadButtonId).on("click", reload);

        log.debug("Starting the force layout algorithm "
                  + "(maxIters=" + opts.maxLayoutIterations + ")");
        force.start();
        var forceActive = true;

        var tick_x = 0;
        var tick_y = 0;

        // var min_x = 0;
        // var min_y = 0;
        // var max_x = 0;
        // var max_y = 0;

        var tick_barHeight = 0;
        var tick_barWidthRatio = opts.nodeSize/numOfBars;
        var iters = 0;
        var previousAlpha = -1;

        function fullRenderingOnForceActive() {
            if(opts.optimizeDisplayWhenLayoutRunning) {
                return !forceActive;
            }
            return true;
        }

        function force_tick(t) {
            // message("layout iters = " + iters
            //         + "<br>"
            //         + "&alpha; = " + t.alpha);

            if(t.alpha < 0.006
               || iters > opts.maxLayoutIterations
               || validation.has_every_nodes_fixed_xy) {

                setProgressBarComplete();
                log.debug("Stopping the force layout algorithm, "
                    + iters + " iterations done, " + t.alpha + " alpha");
                force.stop();  // STOP the force layout
                forceActive = false;
                tick();  // adjust the position of the glyphs
                // clear and hide the message area
                message("");
                hide_spinner();
                hide_message(1000);
                hide_progressbar(1000);
            } else if(opts.displayNetworkEveryNLayoutIterations > 0) {
                if(iters % opts.displayNetworkEveryNLayoutIterations == 0) {
                    tick();  // adjust the position of the glyphs
                }
            }
            if(forceActive) {
                setProgressBarValue(
                    parseInt(100 * iters / opts.maxLayoutIterations)
                );
            }

            previousAlpha = t.alpha;
            iters++;

            // message("layout iters = " + iters
            //         + "<br>"
            //         + "&alpha; = " + t.alpha);
        }

        function tick() {
            // link.attr("d", linkArc);
            link.attr("d", linkStraightLine);

            // WORKAROUND FOR IE10 WHICH DOES NOT RENDER THE PATHS
            link.each(
                function() {
                    this.parentNode.insertBefore(this, this);
                }
            );

            node.attr("transform", transform);
            // nodeOverlay.attr("transform", transform);
            if(opts.displayNodeLabels && fullRenderingOnForceActive()) {
                nodeLabel.attr("x", function(d) {
                                   return d.x + opts.nodeSize;
                               })
                    .attr("y", function(d) {
                              return d.y;
                          });
                nodeLabel.attr("transform", function(d) {
                                   return "rotate(-45,"
                                       + (d.x + opts.nodeSize)
                                       +","+ d.y +")";
                               });
            }
            if(validation.has_node_starplot_values
               && validation.has_node_starplot_labels
               && validation.has_node_starplot_colors
               && validation.has_node_starplot_tooltips) {
                for(var i=0 ; i<starplots.length ; i++) {
                    starplots[i].attr(
                        "transform", function(d) {
                            tick_x = d.x;
                            tick_y = d.y;
                            return "translate(" + tick_x + "," + tick_y + ")";
                        });
                }
            }
            if(opts.displayBarPlotsInsideNodes
               && validation.has_node_barplotValues
               && fullRenderingOnForceActive()) {
                for(var i=0 ; i<barplots.length ; i++) {
                    barplots[i].attr(
                        "transform",
                        function(d) {
                            if(d.barplotValues[i] > 0) {
                                barHeight = d.barplotValues[i];
                                tick_x = d.x + i * tick_barWidthRatio;
                                tick_y = d.y + half_nodeSize
                                    - barHeight*barHeightRatio;
                            } else {
                                tick_barHeight = Math.abs(d.barplotValues[i]);
                                tick_x = d.x + i * tick_barWidthRatio;
                                tick_y = d.y + half_nodeSize;
                            }
                            return "translate(" + tick_x + "," + tick_y + ")";
                        });
                    if(validation.has_node_barplotTexts) {
                        barplottexts[i].attr(
                            "transform",
                            function(d) {
                                if(d.barplotValues[i] > 0) {
                                    barHeight = d.barplotValues[i];
                                    tick_x = d.x + i * tick_barWidthRatio;
                                    tick_y = d.y + 2*half_nodeSize;
                                } else {
                                    tick_barHeight = Math.abs(
                                        d.barplotValues[i]);
                                    tick_x = d.x + i * tick_barWidthRatio;
                                    tick_y = d.y + 2*half_nodeSize;
                                }
                                return "translate("
                                    + (tick_x+tick_barWidthRatio/2)
                                    + "," + tick_y + ")"
                                    + " rotate(-90)";
                            });
                    }
                }
            }
        }

        // function force_end(t) {

        // }

        /////////////////////////
        // MOUSE EVENTS ON BAR //
        /////////////////////////
        // function mouseover_bar(d) {
        //     div_bar.transition()
        //         .duration(1000)
        //         .style("opacity", 0.8);
        // }

        // function mousemove_bar(d) {
        //     $("#"+myTooltipBarDivId).empty();
        //     div_bar.style("left", (d3.event.pageX + 10) + "px")
        //         .style("top", (d3.event.pageY + 10) + "px")
        //         .style("height", "auto")
        //     var html = "";
        //     $("#"+myTooltipBarDivId).append(html);
        // }

        // function mouseout_bar(d) {
        //     d3.select(this).style("stroke","#ffffff");

        //     div_bar.transition()
        //         .duration(1000)
        //         .style("opacity", 1e-6);
        // }

        //////////////////////
        // MOUSE EVENT NODE //
        //////////////////////
        var temp_mouse_x = -1;
        var temp_mouse_y = -1;

        function mouseover_node(d) {
            if(mouseEventsEnabled) {
                // node
                // node.style('stroke-width', function(n) {
                //                if (d === n) return 2;
                //                else return 1;
                //            });
                // node.style('stroke', function(n) {
                //                if (d === n) return "#ff0000";
                //                else return opts.nodeBorderColor;
                //            });
                // neighbors
                if(showNeighbors) {
                    link.style('stroke', function(l) {
                                   if (d === l.source || d === l.target) {
                                       return "#ff0000";
                                   } else {
                                       return l.color;
                                   }
                               });
                }
            }
            // tooltip
            if(showTooltips) {
                $("#"+myTooltipNodeDivId).empty();
                div_node.style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY + 10) + "px")
                    .style("height", "auto");

                var generatedTooltipBarPlotDivId = "tooltip_barplot"+uid();

                // Define the html content of the tooltip
                var html = "";
                if(d.nodeTooltipHtmlContent) {
                    html = "<table><tr><td>" + d.name + "</td></tr><tr><td>"
                        + d.nodeTooltipHtmlContent
                        + "</td></tr><tr><td>"
                        + "<div id=\""
                        + generatedTooltipBarPlotDivId
                        + "\"></div>"
                        + "</tr></td></table>";

                } else {
                    html = "<table><tr><td>" + d.name + "</td></tr><tr><td>"
                        + "<div id=\""
                        + generatedTooltipBarPlotDivId
                        + "\"></div>"
                        + "</tr></td></table>";
                }
                $("#"+myTooltipNodeDivId).append(html);

                if(opts.barplotInNodeTooltips
                   && validation.has_node_barplotValues) {
                    var tt_width = 200;
                    var tt_height = 200;

                    // recompute the barplot height ratio
                    // for the node tooltips
                    var ratio = barHeightRatio
                        * (tt_height*0.5 / half_nodeSize);

                    var vis_barplot = d3.select(
                        "#" + generatedTooltipBarPlotDivId)
                        .append("svg:svg")
                        .attr("id", "tooltip_barplot_svg"+uid())
                        // IE10 draws outside the container otherwise!
                        .attr("overflow", "hidden")
                        .attr("width", tt_width)
                        .attr("height", tt_height)
                        .append('svg:g');

                    var numBars = d.barplotValues.length;
                    var barWidthRatio = tt_width/numBars;
                    for(var i=0 ; i<numBars ; i++) {
                        // barplot bars
                        vis_barplot.selectAll("tt_bar" + i + uid())
                            .data(json.nodes)
                            .enter()
                            .append("g")
                            .attr("class", "bar")
                            .append("rect")
                            .attr("width", barWidthRatio)
                            .attr("height",
                                  function(n) {
                                      if(n == d) {
                                          return Math.abs(n.barplotValues[i])
                                              * ratio;
                                      }
                            })
                            .attr("stroke", opts.barplotInsideNodeBorderColor)
                            .attr("stroke-width", opts.barplotInsideNodeBorderWidth)
                            .style(
                                "fill",
                                function(n) {
                                    if(n == d) {
                                        if(validation.has_node_barplotColors) {
                                            return n.barplotColors[i];
                                        } else {
                                            // should not happen
                                            return "#000000";
                                        }
                                    }
                                })
                            .attr(
                                "transform",
                                function(n) {
                                    if(n == d) {
                                        if(d.barplotValues[i] > 0) {
                                            tick_x = i * barWidthRatio;
                                            tick_y = (tt_height/2)
                                                - n.barplotValues[i]*ratio;
                                        } else {
                                            tick_x = i * barWidthRatio;
                                            tick_y = (tt_height/2);
                                        }
                                        return "translate(" + tick_x
                                            + "," + tick_y + ")";
                                    }
                                });
                        // barplot texts
                        if(validation.has_node_barplotTexts) {
                            vis_barplot.selectAll("tt_bartext" + i + uid())
                                .data(json.nodes)
                                .enter()
                                .append("g")
                                .append("svg:text")
                                .attr("fill", function(n) {
                                          if(n == d) {
                                              return n.barplotColors[i];
                                          }
                                      })
                                .style("font-family", "sans serif")
                                .style("font-size",
                                       opts.barplotInNodeTooltipsFontSize)
                                .style("font-style", "normal")
                                .attr("stroke", "#ffffff")
                                .attr("stroke-width", ".4px")
                                .text(function(n) {
                                          if(n == d) {
                                              return n.barplotTexts[i];
                                          }
                                      })
                                .attr(
                                    "transform",
                                    function(n) {
                                        if(n == d) {
                                            if(n.barplotValues[i] > 0) {
                                                barHeight = n.barplotValues[i];
                                                tick_x = i * barWidthRatio;
                                                // tick_y = tt_width/2
                                                //     + Math.abs(bpMinMax.min)
                                                //     *ratio;
                                                tick_y = tt_width;
                                              } else {
                                                  tick_barHeight = Math.abs(
                                                      d.barplotValues[i]);
                                                  tick_x = i * barWidthRatio;
                                                  // tick_y = tt_width/2
                                                  //     + Math.abs(bpMinMax.min)
                                                  //     *ratio;
                                                  tick_y = tt_width;
                                              }
                                            return "translate("
                                                + (tick_x + barWidthRatio/2)
                                                + ","
                                                + (tick_y - barWidthRatio/5)
                                                + ")" + " rotate(-90)";
                                        }
                                    });
                        }
                    }
                }

                div_node.transition()
                    .duration(opts.nodeTooltipActivationDelay)
                    .style("opacity", opts.nodeTooltipOpacity);

                temp_mouse_x = d3.event.pageX;
                temp_mouse_y = d3.event.pageY;
            }
        }

        function mousemove_node(d) {
            if(mouseEventsEnabled) {

            }
            // tooltip
            if(showTooltips) {
                // distance > 20 pixels
                if( Math.pow(Math.abs(d3.event.pageX - temp_mouse_x), 2)
                    + Math.pow(Math.abs(d3.event.pageY - temp_mouse_y), 2)
                    > 400) {
                    // log.info("mouseover_node tooltip="
                    //          + d3.event.pageX + "," + d3.event.pageY);
                    div_node.style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY + 10) + "px")
                        .style("height", "auto");
                    temp_mouse_x = d3.event.pageX;
                    temp_mouse_y = d3.event.pageY;
                }
            }
        }

        function mouseout_node(d) {
            if(mouseEventsEnabled) {
                // node
                node.style('stroke', opts.nodeBorderColor);
                // node.style('stroke-width', 1);
                // neighbors
                if(showNeighbors) {
                    // link.style('stroke-width', 1);
                    link.style('stroke', function(l) {
                                   return l.color;
                               });
                }
            }
            // tooltip
            if(showTooltips) {
                close_node_tooltip();
            }
        }

        function close_node_tooltip() {
            temp_mouse_x = -1;
            temp_mouse_y = -1;
            div_node.transition()
                .duration(opts.nodeTooltipDeactivationDelay)
                .style("opacity", 1e-6);
        }

        function openLink_node(d) {
            if(d.urlLink) {
                // TODO: find a way to disable the zoom behavior
                // disable the pan-zoom behavior
                // d3.select("#" + containers.networkDivId)
                //     .call(d3.behavior.zoom().on("zoom", null));

                openLink(d.urlLink);

                // inhibits the browser's native context menu
                // d3.event.preventDefault();

                // re-activate the pan-zoom behavior
                // d3.select("#" + containers.networkDivId)
                //     .call(panningZoomingBahavior);
            }
        }

        function contextmenu_node(d) {
            d3.select("#" + div_node_contextmenu_id)
                .style('position', 'absolute')
                .style('left', (d3.event.pageX - 5) + "px")
                .style('top', (d3.event.pageY - 5) + "px")
                .style("height", "auto")
                .style('display', 'block');
            $("#" + div_node_contextmenu_id).css("z-index", 3000);

            $("#" + div_node_contextmenu_id).empty();

            // we use an attribute 'action' which contains the name of the
            // js function to call on the corresponding menu-item selection
            var node_menu_id = "node_menu_" + uid();
            var html = "<ul id='" + node_menu_id + "'>"
                + "<li style='text-align:center;color: white;"
                + "background-color: blue;'>" + d.name + "</li>"
                + "<li>-</li>";

            // Open Url Link
            if(validation.has_node_urlLink) {
                html += "<li><a href='#' action='openLink_node'>"
                    + "Open URL link</a></li>";
            } else {
                html += "<li class='ui-state-disabled'><a href='#'>"
                    + "Open URL link</a></li>";
            }

            // Select
            if(opts.jsFunctionToCallOnNodeClick !== undefined) {
                html += "<li><a href='#' action='"
                    + opts.jsFunctionToCallOnNodeClick
                    + "'>Select</a></li>";
            } else {
                html += "<li class='ui-state-disabled'>"
                    + "<a href='#'>Select</a></li>";
            }

            html += "<ul>";

            $("#" + div_node_contextmenu_id).append(html);

            $("#" + node_menu_id).menu(
                {
                    select: function(event, ui) {
                        var action = ui.item.children().attr('action');
                        close_contextmenu_node();
                        eval(action + "(d);");
                    }
                }
            );

            $("#" + div_node_contextmenu_id).css(
                "opacity", opts.nodeTooltipOpacity);

            // inhibits the browser's native context menu
            d3.event.preventDefault();
        }

        function close_contextmenu_node() {
            d3.select("#" + div_node_contextmenu_id)
                .style("opacity", 1e-6);
            $("#" + div_node_contextmenu_id).css("z-index", -3000);
        }

        // use mouseleave instead of mouseout since we have child elements
        $( "#" + div_node_contextmenu_id ).mouseleave(
            function(event) {
                close_contextmenu_node();
            });

        //////////////////////
        // MOUSE EVENT LINK //
        //////////////////////
        function mouseover_link(d) {
            // tooltip
            if(showTooltips && d.linkTooltipHtmlContent) {
                // re-use the node's tooltip component
                $("#"+myTooltipNodeDivId).empty();
                div_node.style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY + 10) + "px")
                    .style("height", "auto");

                // Define the html content of the tooltip
                var html = d.linkTooltipHtmlContent;

                $("#"+myTooltipNodeDivId).append(html);

                div_node.transition()
                    .duration(opts.nodeTooltipActivationDelay)
                    .style("opacity", opts.nodeTooltipOpacity);
            }
        }

        function mouseout_link(d) {
            // tooltip
            if(showTooltips) {
                div_node.transition()
                    .duration(opts.nodeTooltipDeactivationDelay)
                    .style("opacity", 1e-6);
            }
        }

        /////////////////
        // SEARCH TOOL //
        /////////////////
        function updateSearch(searchTerm, node) {
            var searchRegEx = new RegExp(searchTerm.toLowerCase());
            node.each(function(d,i) {
                          // this is a svg group <g>
                          var element = d3.select(this);
                          // there may be a svg path <path>
                          if(this.childElementCount == 1) {
                            var shape = d3.select(this.childNodes[0]);
                          }
                          var match = d.name.toLowerCase().search(searchRegEx);
                          if(searchTerm.length > 0 && match >= 0) {
                              d.searched = true;
                              element.style("stroke-width", 8.0);
                              element.style("stroke", "#ff0000");
                              if(this.childElementCount == 1) {
                                shape.style("stroke-width", 8.0);
                                shape.style("stroke", "#ff0000");
                              }
                          } else {
                              d.searched = false;
                              element.style("stroke-width", 1.0);
                              element.style("stroke", opts.nodeBorderColor);
                              if(this.childElementCount == 1) {
                                shape.style("stroke-width", 1.0);
                                shape.style("stroke", opts.nodeBorderColor);
                              }
                          }
                      });
        };

        $("#" + containers.searchInputId).keyup(function() {
                               var searchTerm = $(this).val();
                               updateSearch(searchTerm, node);
                               if(!searchTerm.length > 0) {
                                   mouseEventsEnabled = true;
                                   $("#" + containers.searchInputId).css(
                                       "border", "none");
                               } else {
                                   mouseEventsEnabled = false;
                                   $("#" + containers.searchInputId).css(
                                       "border", "1px solid red");
                               }
                           });

        /////////////////////
        // CONTRAST SLIDER //
        /////////////////////
        function selectContrast() {
            var contrastNumber = $(
                "#" + containers.contrastSliderDivId).slider( "value" );
            var contrastName = "";
            if(validation.has_node_contrastNames) {
                contrastName = json.nodes[0].contrastNames[contrastNumber];
            }
            $("#" + containers.currentContrastDivId).empty();
            $("#" + containers.currentContrastDivId).append(
                "Contrast: "
                    + contrastName
                    + " (" + (contrastNumber+1) + ")");
            node.each(function(d,i) {
                          // this is a svg group <g>
                          var element = d3.select(this);
                          // there may be a svg path <path>
                          if(this.childElementCount == 1) {
                            var shape = d3.select(this.childNodes[0]);
                          }
                          var match = d.leadingNode[contrastNumber] == 1;
                          if(match) {
                              // d.highlighted = true;
                              element.style("stroke-width", 8.0);
                              element.style("stroke",
                                            opts.leadingNodeBorderColor);
                              element.style("opacity", 1);
                              if(this.childElementCount == 1) {
                                shape.style("stroke-width", 8.0);
                                shape.style("stroke",
                                            opts.leadingNodeBorderColor);
                                shape.style("opacity", 1);
                              }
                          } else {
                              // d.highlighted = false;
                              element.style("stroke-width", 1.0);
                              element.style("stroke", opts.nodeBorderColor);
                              element.style("opacity",
                                            opts.noneLeadingNodeOpacity);
                              if(this.childElementCount == 1) {
                                shape.style("stroke-width", 1.0);
                                shape.style("stroke", opts.nodeBorderColor);
                                shape.style("opacity",
                                            opts.noneLeadingNodeOpacity);
                              }
                          }
                          if(validation.has_node_contrastColors) {
                              element.style("fill",
                                            d.contrastColors[contrastNumber]);
                              if(this.childElementCount == 1) {
                                shape.style("fill",
                                            d.contrastColors[contrastNumber]);
                              }
                          }
                      });
        }

        function unselectContrast() {
            $("#" + containers.currentContrastDivId).empty();
            node.each(function(d,i) {
                          var element = d3.select(this);
                          // there may be a svg path <path>
                          if(this.childElementCount == 1) {
                            var shape = d3.select(this.childNodes[0]);
                          }
                          // d.highlighted = false;
                          element.style("stroke-width", 1.0);
                          element.style("stroke", opts.nodeBorderColor);
                          element.style("fill", d.color);
                          element.style("opacity", 1);
                          if(this.childElementCount == 1) {
                            shape.style("stroke-width", 1.0);
                            shape.style("stroke", opts.nodeBorderColor);
                            shape.style("fill", d.color);
                            shape.style("opacity", 1);
                          }
                      });
        }


        function toggleHighlightLNs() {
            if($("#" + containers.highlightLNsInputId)
               .attr("class") == "button_off") {
                $("#" + containers.highlightLNsInputId)
                    .attr("class", "button_on");
                mouseEventsEnabled = false;
                $("#" + containers.contrastSliderBarDivId).show();
                selectContrast();
            } else {
                $("#" + containers.highlightLNsInputId)
                    .attr("class", "button_off");
                mouseEventsEnabled = true;
                $("#" + containers.contrastSliderBarDivId).hide();
                unselectContrast();
            }
        }

        if(validation.has_node_leadingNode) {
            $("#" + containers.highlightLNsInputId).on("click",
                                                       toggleHighlightLNs);
        } else {
            if( $("#" + containers.highlightLNsInputId).length ) {
                $("#" + containers.highlightLNsInputId).detach();
            }
        }

        // var toggleHighlightLNs = function () {
        //     if( $("#" + containers.highlightLNsInputId).prop("checked") ) {
        //         mouseEventsEnabled = false;
        //         $("#" + containers.contrastSliderBarDivId).show();
        //         selectContrast();
        //     } else {
        //         mouseEventsEnabled = true;
        //         $("#" + containers.contrastSliderBarDivId).hide();
        //         unselectContrast();
        //     }
        // };

        // if(validation.has_node_leadingNode) {
        //     if( $("#" + containers.highlightLNsInputId).length ) {
        //         $("#" + containers.highlightLNsInputId)
        //              .on("click", toggleHighlightLNs);
        //     }
        // } else {
        //     if( $("#" + containers.highlightLNsInputId).length ) {
        //         $("#" + containers.highlightLNsInputId).detach();
        //     }
        // }

        // function setSliderTicks(el) {
        //     var $slider =  $(el);
        //     var max =  $slider.slider("option", "max");
        //     var min =  $slider.slider("option", "min");
        //     var spacing =  100 / (max - min);

        //     $slider.find('.ui-slider-tick-mark').remove();
        //     for (var i = 0; i < max-min ; i++) {
        //            $('<span class="ui-slider-tick-mark"></span>')
        //                .css('left', (spacing * i) +  '%')
        //                .appendTo($slider);
        //     }
        // }

        if(validation.has_node_leadingNode) {
            if( $("#" + containers.contrastSliderDivId).length ) {
                $("#" + containers.contrastSliderDivId).slider(
                    {
                        min: 0,
                        max: json.nodes[0].leadingNode.length-1,
                        range: "min",
                        slide: selectContrast,
                        change: selectContrast
                        // create: function( event, ui ) {
                        //     setSliderTicks(event.target);
                        // }
                    });
            }
        } else {
            if( $("#" + containers.contrastSliderDivId).length ) {
                $("#" + containers.contrastSliderDivId).detach();
            }
        }

        // seek buttons to slide across contrasts
        var contrastSeekPrevious = function () {
            var element = $("#" + containers.contrastSliderDivId);
            var current_value = element.slider("value");
            element.slider("value", current_value - 1);
        };
        var contrastSeekNext = function () {
            var element = $("#" + containers.contrastSliderDivId);
            var current_value = element.slider("value");
            element.slider("value", current_value + 1);
        };

        if(validation.has_node_leadingNode) {
            if($("#" + containers.contrastSliderDivId).length
               && $("#" + containers.contrastSeekerPrevious.length)
               && $("#" + containers.contrastSeekerNext).length) {
                $("#" + containers.contrastSeekerPrevious).button(({
                                text: false,
                                icons: {
                                         primary: "ui-icon-seek-prev"
                                }
                             }))
                    .on("click", contrastSeekPrevious);
                $("#" + containers.contrastSeekerNext).button(({
                                text: false,
                                icons: {
                                         primary: "ui-icon-seek-next"
                                }
                             }))
                    .on("click", contrastSeekNext);
            }
        }

        /////////////////////////
        // ZOOM IN/OUT BUTTONS //
        /////////////////////////
        // var panningZoomingBahavior = d3.behavior.zoom()
        //     .scaleExtent([opts.minZoomFactor, opts.maxZoomFactor])
        //     .on("zoom", panZoom);

        function zoomByFactor(factor) {
            var scale = panningZoomingBahavior.scale();
            var extent = panningZoomingBahavior.scaleExtent();
            var newScale = scale * factor;
            if (extent[0] <= newScale && newScale <= extent[1]) {
                var t = panningZoomingBahavior.translate();
                var c = [opts.w / 2, opts.h / 2];
                panningZoomingBahavior.scale(newScale)
                    .translate(
                        [c[0] + (t[0] - c[0]) / scale * newScale,
                         c[1] + (t[1] - c[1]) / scale * newScale])
                    .event(vis.transition().duration(350));
            }
        }

        function zoomin() {
            zoomByFactor(1.2);
        }
        $("#" + containers.zoominButtonId).on("click", zoomin);

        function zoomout() {
            zoomByFactor(0.8);
        }
        $("#" + containers.zoomoutButtonId).on("click", zoomout);


        ////////////////////
        // SHOW NEIGHBORS //
        ////////////////////
        function toggleShowNeighbors() {
            if($("#" + containers.neighborsButtonId)
               .attr("class") == "button_off") {
                $("#" + containers.neighborsButtonId)
                    .attr("class", "button_on");
                showNeighbors = true;
            } else {
                $("#" + containers.neighborsButtonId)
                    .attr("class", "button_off");
                showNeighbors = false;
            }
        }

        $("#" + containers.neighborsButtonId)
            .on("click", toggleShowNeighbors);

        ///////////////////
        // SHOW TOOLTIPS //
        ///////////////////
        function toggleShowTooltips() {
            if($("#" + containers.tooltipsButtonId)
               .attr("class") == "button_off") {
                $("#" + containers.tooltipsButtonId)
                    .attr("class", "button_on");
                showTooltips = true;
                $( document ).tooltip(
                    {
                        tooltipClass: "ui-tooltip",
                        track: true,
                        // content: function () {
                        //     return $(this).prop('title');
                        // },
                        position: {
                            my: "left top",
                            at: "right+10 top+10"
                        }
                    });
                $( document ).tooltip("enable");
            } else {
                $("#" + containers.tooltipsButtonId)
                    .attr("class", "button_off");
                showTooltips = false;
                $( document ).tooltip("disable");
            }
        }

        $("#" + containers.tooltipsButtonId).on("click", toggleShowTooltips);

        //////////////////////////////
        // MAGNIFY THE NETWORK VIEW //
        //////////////////////////////
        function getWindowWidth() {
            var x = 0;
            if (self.innerHeight) {
                x = self.innerWidth;
            } else if (document.documentElement
                       && document.documentElement.clientHeight) {
                x = document.documentElement.clientWidth;
            } else if (document.body) {
                x = document.body.clientWidth;
            }
            return x;
        }

        function getScreenWidth() {
            return screen.width;
        }

        function getWindowHeight() {
            var y = 0;
            if (self.innerHeight) {
                y = self.innerHeight;
            } else if (document.documentElement
                       && document.documentElement.clientHeight) {
                y = document.documentElement.clientHeight;
            } else if (document.body) {
                y = document.body.clientHeight;
            }
            return y;
        }

        function getScreenHeight() {
            return screen.height;
        }

        function toggleMagnify() {
            if($("#" + containers.magnifyButtonId)
               .attr("class") == "button_off") {
                $("#" + containers.magnifyButtonId)
                    .attr("class", "button_on");
                var new_w = getWindowWidth()-50;
                var new_h = getWindowHeight()-200;
                $("#"+svgNetworkId).attr("width", new_w);
                $("#"+svgNetworkId).attr("height", new_h);
                // redraw the scale
                if(opts.displayColorScale 
                   && $("#" + containers.scaleDivId).length) {
                    Scale.clear();
                    Scale.drawScale(
                        {
                            scaleId: containers.scaleDivId,
                            scaleGradient: opts.scaleGradient,
                            scaleLabelsFontFamily: opts.scaleLabelsFontFamily,
                            scaleLabelsFontSize: opts.scaleLabelsFontSize,
                            scaleWidth: new_w,
                            scaleHeight: opts.scaleHeight,
                            scaleTickWidth: opts.scaleTickSize,
                            scaleTicksPercents: opts.scaleTicksPercents
                        });
                }

            } else {
                $("#" + containers.magnifyButtonId)
                    .attr("class", "button_off");
                $("#"+svgNetworkId).attr("width", opts.w);
                $("#"+svgNetworkId).attr("height", opts.h);
                // redraw the scale
                if(opts.displayColorScale
                   && $("#" + containers.scaleDivId).length) {
                    Scale.clear();
                    Scale.drawScale(
                        {
                            scaleId: containers.scaleDivId,
                            scaleGradient: opts.scaleGradient,
                            scaleLabelsFontFamily: opts.scaleLabelsFontFamily,
                            scaleLabelsFontSize: opts.scaleLabelsFontSize,
                            scaleWidth: opts.w,
                            scaleHeight: opts.scaleHeight,
                            scaleTickWidth: opts.scaleTickSize,
                            scaleTicksPercents: opts.scaleTicksPercents
                        });
                }
            }
        }

        if($("#" + containers.magnifyButtonId).length) {
            $("#" + containers.magnifyButtonId).on("click", toggleMagnify);
        }

        ////////////
        // EXPORT //
        ////////////
        function exportAs(format) {
            // if(format == 'json') {
            //     var json_text = JSON.stringify(json, null, 4);
            //     $("#" + containers.jsonExportDivId).html(json_text);
            // } else {
                // Prepare the parameters for the server-side exporter
                var svg = document.getElementById(svgNetworkId);
                var svg_xml = (new XMLSerializer).serializeToString(svg);

                // Call the server-side converter if available
                if(opts.exportCGI) {
                    var form = document.getElementById("svg_converter_form");
                    form['output_format'].value = format;
                    form['data'].value = svg_xml;
                    form.submit();
                }
            // }
        }

        if($("#" + containers.exportButtonId).length) {
            var menu_export_id = "menu_export_" + uid();
            // we use an attribute 'action' which contains the name
            // of the js function to call on the corresponding menu-item
            // selection
            var menu_export_html = "<ul id='" + menu_export_id + "'>"
                + "<li style='text-align:center;color: white;"
                + "background-color: blue;'>Export As...</li>"
                + "<li>-</li>";
            menu_export_html += "<li> <a href='#' action='svg'> <img src='"
                + opts.imagesUrl
                + "/svg.png' align='absmiddle'></img>SVG </a> </li>";
            if(opts.exportCGI) {
                // add extra formats when the perl CGI is enabled
                menu_export_html += "<li> <a href='#' action='png'> <img src='"
                    + opts.imagesUrl
                    + "/png.png' align='absmiddle'></img>PNG </a> </li>";
                menu_export_html += "<li> <a href='#' action='pdf'> <img src='"
                    + opts.imagesUrl
                    + "/pdf.png' align='absmiddle'></img>PDF </a> </li>";
                // menu_export_html += "<li> <a href='#' action='json'> <img src='" 
                //     + opts.imagesUrl
                //     + "/json.png' align='absmiddle'></img>JSON </a> </li>";
            }
            menu_export_html += "<ul>";

            $("#" + containers.exportButtonId).bind(
                'click', function(e) {
                    $("#" + div_export_contextmenu_id)
                        .css("position", "absolute");
                    $("#" + div_export_contextmenu_id)
                        .css("z-index", 3000);
                    $("#" + div_export_contextmenu_id)
                        .css('left', (e.pageX - 5) + "px");
                    $("#" + div_export_contextmenu_id)
                        .css('top', (e.pageY - 5) + "px");
                    $("#" + div_export_contextmenu_id)
                        .css("height", "auto");
                    $("#" + div_export_contextmenu_id)
                        .css('display', 'block');

                    $("#" + div_export_contextmenu_id).empty();

                    $("#" + div_export_contextmenu_id)
                        .append(menu_export_html);

                    $( "#" + menu_export_id )
                        .menu(
                            {
                                select: function(event, ui) {
                                    close_export_contextmenu_node();
                                      if(opts.exportCGI) {
                                          var action = ui.item.children()
                                              .attr('action');
                                          eval("exportAs('" + action + "');");
                                      } else {
                                          // THE FOLLOWING IS COMPATIBLE
                                          // WITH FF AND IE 11+
                                          // fetch the generated SVG
                                          var svg = document
                                              .getElementById(svgNetworkId);
                                          var svg_xml = (new XMLSerializer)
                                              .serializeToString(svg);
                                          var svgExportUrl = "data:image/svg;"
                                              + "charset=utf-8,"
                                              + encodeURIComponent(svg_xml);
                                          // set the link
                                          ui.item.children()
                                              .attr('href', svgExportUrl);
                                          ui.item.children()
                                              .attr('download', "network.svg");
                                      }
                                }
                            });

                    $("#" + div_export_contextmenu_id)
                        .css("opacity", opts.nodeTooltipOpacity);
                });
        }

        function close_export_contextmenu_node() {
            $("#" + div_export_contextmenu_id).css("opacity", 1e-6);
            $("#" + div_export_contextmenu_id).css("z-index", -3000);
        }

        // use mouseleave instead of mouseout since we have child elements
        $( "#" + div_export_contextmenu_id ).mouseleave(
            function(event) {
                close_export_contextmenu_node();
            });


        ////////////
        // LAYOUT //
        ////////////
        function restartForceLayout() {
            show_spinner();
            message("Optimizing the layout...");
            setProgressBarValue(0);
            show_progressbar();
            log.debug("Restarting the force layout algorithm "
                      + "(maxIters=" + opts.maxLayoutIterations + ")");
            iters = 0;
            previousAlpha = -1;
            force.start();
            forceActive = true;
        }
        function toggleLayoutParameters() {
            if($("#" + containers.settingsButtonId)
               .attr("class") == "button_off") {
                $("#" + containers.settingsButtonId)
                    .attr("class", "button_on");
            } else {
                $("#" + containers.settingsButtonId)
                    .attr("class", "button_off");
            }
            $("#" + containers.layoutParametersPane)
                .slideToggle();
        }
        $("#" + containers.layoutParametersPane).hide();
        $("#" + containers.settingsButtonId).on(
            "click", toggleLayoutParameters);
        ///////////////////////////////
        // LinkDistance
        function layoutLinkDistance() {
            var distance = $( "#" + containers.layoutLinkDistanceRangeId )
                .slider( "value" );
            updateLayoutLinkDistanceLabel();
            opts.layout_forceLinkDistance = distance;
            force = force.linkDistance(distance);
            // node coordinates reinitialization
            for(var i=0 ; i<json.nodes.length ; i++) {
                json.nodes[i].x = 0;
                json.nodes[i].y = 0;
            }
            // reinitialization done
            log.debug("Layout link distance change: "
                      + opts.layout_forceLinkDistance);
            restartForceLayout();
        }
        function updateLayoutLinkDistanceLabel() {
            if($( "#" + containers.labelLayoutLinkDistance ).length > 0) {
                $( "#" + containers.labelLayoutLinkDistance ).text(
                    "Link distance "
                        + $( "#" + containers.layoutLinkDistanceRangeId )
                        .slider( "value" ));
            }
        }
        $( "#" + containers.layoutLinkDistanceRangeId )
            .slider(
                {
                    orientation: "horizontal",
                    width: "100%",
                    range: false,
                    min: 0,
                    max: 500,
                    value: opts.layout_forceLinkDistance,
                    slide: updateLayoutLinkDistanceLabel,
                    change: layoutLinkDistance
                }
            );
        updateLayoutLinkDistanceLabel();

        ///////////////////////////////
        // Charge
        function layoutCharge() {
            var charge = $( "#" + containers.layoutChargeRangeId )
                .slider( "value" );
            updateLayoutChargeLabel();
            opts.layout_forceCharge = charge;
            force = force.charge(charge);
            // node coordinates reinitialization
            for(var i=0 ; i<json.nodes.length ; i++) {
                json.nodes[i].x = 0;
                json.nodes[i].y = 0;
            }
            // reinitialization done
            log.debug("Layout charge change: " + opts.layout_forceCharge);
            restartForceLayout();
        }
        function updateLayoutChargeLabel() {
            if($( "#" + containers.labelLayoutCharge ).length > 0) {
                $( "#" + containers.labelLayoutCharge ).text(
                    "Charge " + $( "#" + containers.layoutChargeRangeId )
                        .slider( "value" ));
            }
        }
        $( "#" + containers.layoutChargeRangeId ).slider(
            {
                orientation: "horizontal",
                width: "100%",
                range: false,
                min: -40000,
                max: 0,
                value: opts.layout_forceCharge,
                slide: updateLayoutChargeLabel,
                change: layoutCharge
            }
        );
        updateLayoutChargeLabel();

        ///////////////
        // DRAG MODE //
        ///////////////
        var savedNodeBorderColor = opts.nodeBorderColor;
        var savedNodeBorderWidth = 1;
        var showTooltips_temp = showTooltips;

        if(opts.enableNodeDragging
           && $("#" + containers.dragModeButtonId).length) {
            function dragstart(d, i) {
                // save the showTooltips state
                showTooltips_temp = showTooltips;
                // disable tooltips while dragging
                showTooltips = false;
                close_node_tooltip();
                $("#" + containers.tooltipsButtonId)
                    .attr("class", "button_off");

                setCursor("move");
                d3.event.sourceEvent.stopPropagation();
                // d3.select(this).classed("dragging", true);
                var dragNodeBorderColor = defaultValues.dragNodeBorderColor;
                if("dragNodeBorderColor" in opts) {
                    dragNodeBorderColor = opts.dragNodeBorderColor;
                }
                // there may be a svg path <path>
                if(this.childElementCount == 1) {
                    // save the previous border color & width
                    savedNodeBorderColor = d3.select(this.childNodes[0])
                        .style("stroke");
                    savedNodeBorderWidth = d3.select(this.childNodes[0])
                        .style("stroke-width");
                    // highlight
                    d3.select(this.childNodes[0]).style(
                        "stroke", dragNodeBorderColor);
                    d3.select(this.childNodes[0]).style("stroke-width", 8);
                } else {
                    // save the previous border color & width
                    savedNodeBorderColor = d3.select(this)
                        .style("stroke");
                    savedNodeBorderWidth = d3.select(this)
                        .style("stroke-width");
                    // highlight
                    d3.select(this).style("stroke", dragNodeBorderColor);
                    d3.select(this).style("stroke-width", 8);
                }
                // make sure the force layout is stopped before dragging
                force.stop();
            }

            function dragmove(d, i) {
                d.px += d3.event.dx;
                d.py += d3.event.dy;
                d.x += d3.event.dx;
                d.y += d3.event.dy;
                tick();
            }

            function dragend(d, i) {
                // restore the tooltip state
                showTooltips = showTooltips_temp;
                if(showTooltips_temp) {
                    $("#" + containers.tooltipsButtonId)
                        .attr("class", "button_on");
                }

                setCursor("auto");
                // d3.select(this).classed("dragging", false);
                // there may be a svg path <path>
                if(this.childElementCount == 1) {
                    // restore previous border color & width
                    d3.select(this).style(
                        "stroke", savedNodeBorderColor);
                    d3.select(this).style(
                        "stroke-width", savedNodeBorderWidth);
                    d3.select(this.childNodes[0]).style(
                        "stroke", savedNodeBorderColor);
                    d3.select(this.childNodes[0]).style(
                        "stroke-width", savedNodeBorderWidth);
                } else {
                    // restore the previous border color & width
                    d3.select(this).style(
                        "stroke", savedNodeBorderColor);
                    d3.select(this).style(
                        "stroke-width", savedNodeBorderWidth);
                }
                // d.fixed = true; // exclude the node from the force layout
                tick();
            }

            var nodeDragBehavior = d3.behavior.drag()
                .on("dragstart", dragstart)
                .on("drag", dragmove)
                .on("dragend", dragend);

            var dragMode = function () {
                if($("#" + containers.dragModeButtonId)
                   .attr("class") == "button_off") {
                // if( $("#" + containers.dragModeButtonId).prop("checked") ) {
                    nodeDragging = true;
                    $("#" + containers.dragModeButtonId)
                        .attr("class", "button_on");
                    // disable the pan-zoom behavior
                    d3.select("#" + containers.networkDivId)
                        .call(d3.behavior.zoom().on("zoom", null));
                    // enable the node dragging
                    node.call(nodeDragBehavior);
                } else {
                    nodeDragging = false;
                    $("#" + containers.dragModeButtonId)
                        .attr("class", "button_off");
                    // activate the pan-zoom behavior
                    d3.select("#" + containers.networkDivId)
                        .call(panningZoomingBahavior);
                    // disable the node dragging
                    node.call(d3.behavior.drag()
                              .on("dragstart", null)
                              .on("drag", null)
                              .on("dragend", null));
                }
            };

            $("#" + containers.dragModeButtonId)
                .on("click", dragMode);
        }

    };

}

/**
 * To be called after the constructor to render the network.
 */
GraphRenderer.prototype.draw = function() {
    var logger = this.getLog();
    var message = this.message;
    var hide_spinner = this.hide_spinner;

    logger.debug("--> draw()");
    var drawFunction = this.drawGraph;
    var drawScaleFunction = this.drawScale;
    var validateFunction = this.validateJson;
    var errorFunction = this.error;
    var validateJsonResult = {};
    // Check if we have a json variable or a json url
    if("jsonUrl" in this.getData()) {
        // Get network data from a file
        logger.debug("Using the json url: " + this.getData().jsonUrl);
        d3.json(this.getData().jsonUrl, function(error, json) {
            if (error) {
                hide_spinner();
                logger.error(
                    "Can't access \""
                        + this.getData().jsonUrl  + "\"");
                return message(
                    "<font color='red'>Could not load the data!</font>"
                        + "<br>Can't access \""
                        + this.getData().jsonUrl  + "\".");
            } else {
                // TODO externalize
                validationResult = validateFunction(json);
                if(validationResult.isValid) {
                    try {
                        drawScaleFunction();
                        drawFunction(json);
                    } catch(e) {
                        hide_spinner();
                        errorFunction(e);
                    }
                } else {
                    hide_spinner();
                    logger.error(
                        "The validation of the input data failed: "
                            + validationResult.message);
                    return message(
                        "<font color='red'>Validation error!</font>"
                            + "<br>" + validationResult.message);
                }
            }
        });
    } else if("jsonVar" in this.getData()) {
        logger.debug("Using the json variable: " + this.getData().jsonVar);
        // TODO externalize
        validationResult = validateFunction(this.getData().jsonVar);
        if(validationResult.isValid) {
            try {
                drawScaleFunction();
                drawFunction(this.getData().jsonVar);
            } catch(e) {
                hide_spinner();
                errorFunction(e);
            }
        } else {
            hide_spinner();
            logger.error("The validation of the input data failed: "
                                + validationResult.message);
            return message("<font color='red'>Validation error!</font>"
                                + "<br>" + validationResult.message);
        }
    } else {
        hide_spinner();
        logger.error(
            "Incorrect input data: please specify either "
                + "'jsonVar' or 'jsonUrl' in the input data object");
        return message(
            "<font color='red'>Incorrect input data!</font>"
                + "<br>please specify either "
                + "'jsonVar' or 'jsonUrl' in the input data object");
    }
};
