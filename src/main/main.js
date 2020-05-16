/*       ___ _       _           _                   _       _     _           
 *      / _ \ | ___ | |__   __ _| | __   ____ _ _ __(_) __ _| |__ | | ___  ___ 
 *     / /_\/ |/ _ \| '_ \ / _` | | \ \ / / _` | '__| |/ _` | '_ \| |/ _ \/ __|
 *    / /_\\| | (_) | |_) | (_| | |  \ V / (_| | |  | | (_| | |_) | |  __/\__ \
 *    \____/|_|\___/|_.__/ \__,_|_|   \_/ \__,_|_|  |_|\__,_|_.__/|_|\___||___/                                                                             
 */

const config = ({
    lat: 41.390205,
    lng: 2.154007,
    zoom: 11,
    fillOpacity: 0.6,
    colorScale: [
        ['#f0f0f0', '#bdbdbd', '#636363'],
        ['#deebf7', '#9ecae1', '#3182bd'],
        ['#e5f5e0', '#a1d99b', '#31a354'],        
        ['#fee6ce', '#fdae6b', '#e6550d'],
        ['#efedf5', '#bcbddc', '#756bb1'],
        ['#fee0d2', '#fc9272', '#de2d26']
    ]
});

// tamaño más pequeño h3Resolution = 10 (es bloque de edificios), quizas 9 por privacidad
// min: 10
// Mundo max: 2
// España max: 3
// Provincia max: 5
const h3Resolution = 8;
let maxpersonsinhex = 1;
let hexagons = [];
let barcelona = '';
const listanum = d3.range(16);
let info = '';
/*       _                  ___                 _   _                 
 *      /_\  _   ___  __   / __\   _ _ __   ___| |_(_) ___  _ __  ___ 
 *     //_\\| | | \ \/ /  / _\| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 *    /  _  \ |_| |>  <  / /  | |_| | | | | (__| |_| | (_) | | | \__ \
 *    \_/ \_/\__,_/_/\_\ \/    \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
 */
function getRandomIntInHex() {
    const maxpersonsinhex10 = 2;
    maxpersonsinhex = maxpersonsinhex10 * Math.pow(7, 10 - h3Resolution);
    return getRandomInt(0, maxpersonsinhex);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/*       __                 _       ___                 _   _                 
 *      /__\_   _____ _ __ | |_    / __\   _ _ __   ___| |_(_) ___  _ __  ___ 
 *     /_\ \ \ / / _ \ '_ \| __|  / _\| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 *    //__  \ V /  __/ | | | |_  / /  | |_| | | | | (__| |_| | (_) | | | \__ \
 *    \__/   \_/ \___|_| |_|\__| \/    \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
 */
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        fillColor: '#666',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}
function resetHighlight(e) {
    barcelona.resetStyle(e.target);
    info.update();
}
// function zoomToFeature(e) {
//    map.fitBounds(e.target.getBounds());
//}
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        // click: zoomToFeature
    });
}

function mouseover(lng, lat) {
    const centerHex = h3.geoToH3(lat, lng, h3Resolution);
    const info = document.getElementById("outinfo");
    info.innerHTML = centerHex;
}

/*                  _           ___                          _ 
 *      /\/\   __ _(_)_ __     / _ \___ _ __   ___ _ __ __ _| |
 *     /    \ / _` | | '_ \   / /_\/ _ \ '_ \ / _ \ '__/ _` | |
 *    / /\/\ \ (_| | | | | | / /_\\  __/ | | |  __/ | | (_| | |
 *    \/    \/\__,_|_|_| |_| \____/\___|_| |_|\___|_|  \__,_|_|
 */

// const url = 'https://data.opendatasoft.com/api/records/1.0/search/?dataset=espana-municipios%40public&facet=communidad_autonoma&facet=provincia&facet=municipio&refine.provincia=Barcelona'
// const url = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=espana-municipios%40public&rows=313&facet=communidad_autonoma&facet=provincia&facet=municipio&refine.provincia=Barcelona&geofilter.distance=41.390205%2C2.154007%2C10000"
const url = './data/listaMunicipios10barcelona.json'
// const url = './data/listaMunicipios.json'

d3.json(url).then(function (data) {
    calculate(data);
});

function calculate(listaMunicipios) {
    let municipios = []
    listanum.forEach(function (d) {
        municipios.push({ type: 'Feature', geometry: listaMunicipios.records[d].fields.geo_shape });
    });



    let listhexagons = [];
    listanum.forEach(function (d) {
        listhexagons.push(geojson2h3.featureToH3Set(municipios[d], h3Resolution));
    });

    listanum.forEach(function (d) {
        // Reduce hexagon list to a map with random values
        hexagons.push(listhexagons[d].reduce((res, hexagon) => ({ ...res, [hexagon]: getRandomIntInHex() }), {}));
    });

    // console.log(hexagons);
    rendermap();
}

function rendermap() {
    console.log("rendermap");

    addinfo();

    listanum.forEach((d) => {
        // console.log(hexagons[d]);
        if (hexagons[d] != undefined) {
            renderHexes(map, hexagons[d], d);
            renderAreas(map, hexagons[d], d);
        }
    })
}
function addinfo() {
    info = L.control();
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Information</h4>' + (props ?
            props.value + ' people<br>4 city associations<br>1 national association'
            : 'Hover over map');
    };

    info.addTo(map);
}

function getColor(d, ngroup) {
    return d > Math.ceil(maxpersonsinhex * 2 / 3) ? config.colorScale[ngroup % 5+1][2] :
        d > Math.ceil(maxpersonsinhex * 1 / 3) ? config.colorScale[ngroup % 5+1][1] :
            config.colorScale[ngroup % 5 +1][0];
}

/*                  _           _                      
 *      /\/\   __ _(_)_ __     /_\  _ __ ___  __ _ ___ 
 *     /    \ / _` | | '_ \   //_\\| '__/ _ \/ _` / __|
 *    / /\/\ \ (_| | | | | | /  _  \ | |  __/ (_| \__ \
 *    \/    \/\__,_|_|_| |_| \_/ \_/_|  \___|\__,_|___/
 */
function incrementOpacity(){    
    barcelona.setStyle({        
        fillOpacity: 1
    }); 
}
function resetOpacity() {
    barcelona.resetStyle();
}

function stylefill(feature) {
    return {
        fill: true,
        fillColor: getColor(feature.properties.value, feature.properties.ngroup),
        stroke: false,
        fillOpacity: 0.2
    };
}

function renderHexes(map, hexagons, ngroup) {

    // Transform the current hexagon map into a GeoJSON object
    const geojson = geojson2h3.h3SetToFeatureCollection(
        Object.keys(hexagons),
        hex => ({ value: hexagons[hex], ngroup: ngroup })
    );


    console.log(geojson);

    if (barcelona == '') {
        barcelona = L.geoJson(geojson, { style: stylefill, onEachFeature: onEachFeature }).on({
            mouseover: incrementOpacity,
            mouseout: resetOpacity,
            // click: zoomToFeature
        }).addTo(map);
    } else {
        L.geoJson(geojson, { style: stylefill }).addTo(map);
    }
}

/*                  _           ___            _                             
 *      /\/\   __ _(_)_ __     / __\___  _ __ | |_ ___  _ __ _ __   ___  ___ 
 *     /    \ / _` | | '_ \   / /  / _ \| '_ \| __/ _ \| '__| '_ \ / _ \/ __|
 *    / /\/\ \ (_| | | | | | / /__| (_) | | | | || (_) | |  | | | | (_) \__ \
 *    \/    \/\__,_|_|_| |_| \____/\___/|_| |_|\__\___/|_|  |_| |_|\___/|___/
 */

function stylecontour(feature) {
    return {
        stroke: true,
        fill: false,
        weight: 3,
        opacity: 1,
        color: '#636363'
        //color: getColor(maxpersonsinhex, feature.properties.ngroup)
    };
}
function renderAreas(map, hexagons, ngroup) {

    console.log()

    // Transform the current hexagon map into a GeoJSON object
    const geojson = geojson2h3.h3SetToFeature(
        Object.keys(hexagons)
    );
    geojson.properties.ngroup = ngroup;

    L.geoJson(geojson, { style: stylecontour }).addTo(map);
}

/* http://patorjk.com/software/taag/#p=display&c=c&f=Ogre&t=Global%20variables%0A */