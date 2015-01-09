var BingLayer = L.TileLayer.extend({
    getTileUrl: function (tilePoint) {
        this._adjustTilePoint(tilePoint);
        return L.Util.template(this._url, {
            s: this._getSubdomain(tilePoint),
            q: this._quadKey(tilePoint.x, tilePoint.y, this._getZoomForUrl())
        });
    },
    _quadKey: function (x, y, z) {
        var quadKey = [];
        for (var i = z; i > 0; i--) {
            var digit = '0';
            var mask = 1 << (i - 1);
            if ((x & mask) != 0) {
                digit++;
            }
            if ((y & mask) != 0) {
                digit++;
                digit++;
            }
            quadKey.push(digit);
        }
        return quadKey.join('');
    }
});

var OSMLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
});

var CBLayer = new BingLayer('http://ecn.t{s}.tiles.virtualearth.net/tiles/r{q}?g=1567&lbl=l1&productSet=mmCB', {
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    attribution: '&copy; <a href="http://bing.com/maps">Bing Maps</a>',
    detectRetina: true
});

var OSLayer = new BingLayer('http://ecn.t{s}.tiles.virtualearth.net/tiles/r{q}?g=1567&lbl=l1&productSet=mmOS', {
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    attribution: '&copy; <a href="http://bing.com/maps">Bing Maps</a>',
    detectRetina: true
});

var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    detectRetina: true
});

var Thunderforest_OpenCycleMap = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});

var baseLayers = {
    "Ordnance Survey": OSLayer,
    "Collins Bartholomew": CBLayer,
    "OpenStreetMap": OSMLayer,
    "Satellite": Esri_WorldImagery,
    "OpenCycleMap": Thunderforest_OpenCycleMap
}

var map = new L.Map(document.querySelector('#map'), {
    layers: [CBLayer],
    center: new L.LatLng(51.7617353,-1.2427226),
    zoom: 11
});

var onLocationFound = function(e) {
  var radius = e.accuracy / 2;

  L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

map.locate({setView: true, maxZoom: 15});

L.control.layers(baseLayers).addTo(map);