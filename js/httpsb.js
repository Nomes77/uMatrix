/*******************************************************************************

    uMatrix - a Chromium browser extension to black/white list requests.
    Copyright (C) 2014-2016 Raymond Hill

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uMatrix
*/

'use strict';

/******************************************************************************/

{
    const µm = µMatrix;
    µm.pMatrix = new µm.Matrix();
    // https://discourse.mozilla.org/t/support-umatrix/5131/157
    µm.pMatrix.setSwitch('matrix-off', 'wyciwyg-scheme', 1);
    µm.pMatrix.setSwitch('https-strict', 'behind-the-scene', 2);
    // Global rules
    µm.pMatrix.setSwitch('referrer-spoof', '*', 2);
    µm.pMatrix.setSwitch('noscript-spoof', '*', 1);
    µm.pMatrix.setSwitch('cname-reveal', '*', 1);
    µm.pMatrix.setCell('*', '*', '*', µm.Matrix.Red);
    µm.pMatrix.setCell('*', '*', 'image', µm.Matrix.Green);
    // 1st-party rules
    µm.pMatrix.setCell('*', '1st-party', '*', µm.Matrix.Green);

    µm.tMatrix = new µm.Matrix();
    µm.tMatrix.assign(µm.pMatrix);
}

/******************************************************************************/

µMatrix.hostnameFromURL = function(url) {
    var hn = this.URI.hostnameFromURI(url);
    return hn === '' ? '*' : hn;
};

/******************************************************************************/

µMatrix.mustBlock = function(srcHostname, desHostname, type) {
    return this.tMatrix.mustBlock(srcHostname, desHostname, type);
};

µMatrix.mustAllow = function(srcHostname, desHostname, type) {
    return this.mustBlock(srcHostname, desHostname, type) === false;
};

/******************************************************************************/

µMatrix.formatCount = function(count) {
    if ( typeof count !== 'number' ) {
        return '';
    }
    var s = count.toFixed(0);
    if ( count >= 1000 ) {
        if ( count < 10000 ) {
            s = '>' + s.slice(0,1) + 'K';
        } else if ( count < 100000 ) {
            s = s.slice(0,2) + 'K';
        } else if ( count < 1000000 ) {
            s = s.slice(0,3) + 'K';
        } else if ( count < 10000000 ) {
            s = s.slice(0,1) + 'M';
        } else {
            s = s.slice(0,-6) + 'M';
        }
    }
    return s;
};

