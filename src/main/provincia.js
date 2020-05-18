var speed = 'slow';

$(document).ready(function() {
    $('html, body').fadeIn(speed, function() {
        $('a[href], button[href]').click(function(event) {
            var url = $(this).attr('href');
            if (url.indexOf('#') == 0 || url.indexOf('javascript:') == 0) return;
            event.preventDefault();
            $('html, body').fadeOut(speed, function() {
                window.location = url;
            });
        });
    });
});
/*       ___ _       _           _                   _       _     _           
 *      / _ \ | ___ | |__   __ _| | __   ____ _ _ __(_) __ _| |__ | | ___  ___ 
 *     / /_\/ |/ _ \| '_ \ / _` | | \ \ / / _` | '__| |/ _` | '_ \| |/ _ \/ __|
 *    / /_\\| | (_) | |_) | (_| | |  \ V / (_| | |  | | (_| | |_) | |  __/\__ \
 *    \____/|_|\___/|_.__/ \__,_|_|   \_/ \__,_|_|  |_|\__,_|_.__/|_|\___||___/                                                                             
 */

const config = ({
    lat: 28.261146,
    lng: -16.595508,
    zoom: 10,
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
let nhits = 0;
let contornos = {};
let areas = {};

let hexagons = [];
let barcelona = '';
let info = '';
// --------------- contenido para la DEMO ---------------------------------
// con bujeros const allHexCanarias = ["863441587ffffff", "86344c517ffffff", "863441657ffffff", "86344159fffffff", "863443267ffffff", "863443247ffffff", "86344165fffffff", "863441677ffffff", "86344cc17ffffff", "86344cc1fffffff", "86344025fffffff", "86344cd1fffffff", "86346a69fffffff", "86344cd27ffffff", "86346a68fffffff", "863441357ffffff", "86344cd07ffffff", "86344e9a7ffffff", "86344164fffffff", "86344e937ffffff", "86344166fffffff", "86344c537ffffff", "86344122fffffff", "863441347ffffff", "86344136fffffff", "863441367ffffff", "86346a6d7ffffff", "86346a6f7ffffff", "86346a6e7ffffff", "86344130fffffff", "86344cc07ffffff", "86344cc37ffffff", "863441247ffffff", "86344124fffffff", "863441647ffffff", "863441667ffffff", "86344cd37ffffff", "86344c527ffffff", "86344cc9fffffff", "86344c507ffffff", "86344c52fffffff", "86344ccd7ffffff", "86344ccafffffff", "86344cca7ffffff", "86344cc87ffffff", "86344cc8fffffff", "86344ccf7ffffff", "86344ccb7ffffff", "86344cd8fffffff", "86344cd87ffffff", "86344134fffffff", "86344cc97ffffff", "863441377ffffff", "863443257ffffff", "8634432e7ffffff", "86344325fffffff", "86344cd97ffffff", "86344cd9fffffff", "863441497ffffff", "8634402c7ffffff", "8634402dfffffff", "8634402cfffffff", "8634402efffffff", "863441227ffffff", "86344131fffffff", "863443967ffffff", "863443947ffffff", "86344cd17ffffff", "86344cda7ffffff", "86344396fffffff", "8634414b7ffffff", "863441597ffffff", "8634415b7ffffff", "86344cdafffffff", "86344149fffffff", "86344126fffffff", "863441487ffffff", "8634414a7ffffff", "86344394fffffff", "863441277ffffff"]
// centro tenerife const allHexCanarias = ["86344ccb7ffffff", "86344cd8fffffff", "86344cd87ffffff", "86344134fffffff", "86344cc97ffffff", "86344cd97ffffff", "86344cd9fffffff", "86344ccafffffff", "86344cca7ffffff", "86344cc87ffffff", "86344cc8fffffff", "86344ccf7ffffff", "863441347ffffff", "86344136fffffff", "863441367ffffff", "86344cc17ffffff", "86344cc1fffffff", "86344126fffffff", "86344cc07ffffff", "86344cc37ffffff", "863441277ffffff", "863441267ffffff", "86344135fffffff", "86344c527ffffff", "86344cc9fffffff", "86344c507ffffff", "86344c52fffffff", "86344ccd7ffffff", "863441377ffffff", "86344cdafffffff", "863441247ffffff", "86344124fffffff", "86344cda7ffffff", "863441357ffffff", "86344122fffffff", "86344c537ffffff", "86344cd1fffffff", "86344c517ffffff"]
const allHexCanarias = ["86344ccb7ffffff", "86344cd8fffffff", "86344cd87ffffff", "86344134fffffff", "86344cc97ffffff", "86344cd97ffffff", "86344cd9fffffff", "86344ccafffffff", "86344cca7ffffff", "86344cc87ffffff", "86344cc8fffffff", "86344ccf7ffffff", "863441347ffffff", "86344136fffffff", "863441367ffffff", "86344cc17ffffff", "86344cc1fffffff", "86344126fffffff", "86344cc07ffffff", "86344cc37ffffff", "863441277ffffff", "863441267ffffff", "86344135fffffff", "86344c527ffffff", "86344cc9fffffff", "86344c507ffffff", "86344c52fffffff", "86344ccd7ffffff", "863441377ffffff", "86344cdafffffff", "863441247ffffff", "86344124fffffff", "86344cda7ffffff", "863441357ffffff", "86344122fffffff", "86344c537ffffff", "86344cd1fffffff", "86344c517ffffff", "86344cd07ffffff", "86344cd17ffffff", "86344cd37ffffff", "86344cd27ffffff", "86346a68fffffff", "86346a6f7ffffff", "86344130fffffff", "863441227ffffff", "86346a6d7ffffff", "86346a6e7ffffff", "86346a69fffffff", "86344131fffffff"]
function styleallHexCanarias(feature) {
    // we can use feature.properties.colorscale
    return {
        stroke: true,
        fill: false,
        weight: 5,
        opacity: 1,
        color: '#0000ff'        
    };
}

function onMapClick(e) {
    allHexCanarias.push(h3.geoToH3(e.latlng.lat, e.latlng.lng, h3Resolution)); 
    console.log(allHexCanarias);   
}




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
    // info.update(layer.feature.properties);
}
function resetHighlight(e) {
    barcelona.resetStyle(e.target);
    // info.update();
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
    // const centerHex = h3.geoToH3(lat, lng, h3Resolution);
    // const info = document.getElementById("sidebar3");
    // info.innerHTML = centerHex;
}

/*                  _           ___                          _ 
 *      /\/\   __ _(_)_ __     / _ \___ _ __   ___ _ __ __ _| |
 *     /    \ / _` | | '_ \   / /_\/ _ \ '_ \ / _ \ '__/ _` | |
 *    / /\/\ \ (_| | | | | | / /_\\  __/ | | |  __/ | | (_| | |
 *    \/    \/\__,_|_|_| |_| \____/\___|_| |_|\___|_|  \__,_|_|
 */

// const url = 'https://data.opendatasoft.com/api/records/1.0/search/?dataset=espana-municipios%40public&facet=communidad_autonoma&facet=provincia&facet=municipio&refine.provincia=Barcelona'

// Este va centro tenerife
// const url = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=espana-municipios%40public&rows=313&facet=communidad_autonoma&facet=provincia&facet=municipio&geofilter.distance=28.261146%2C-16.595508%2C20000"

// const url = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=espana-municipios%40public&rows=53&facet=communidad_autonoma&facet=provincia&facet=municipio&refine.communidad_autonoma=Islas+Canarias&refine.provincia=Santa+Cruz+de+Tenerife&geofilter.distance=28.261146%2C-16.595508%2C10000"


// const url = './data/listaMunicipios10barcelona.json'
// const url = './data/listaMunicipios.json'
// const url = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=espana-municipios%40public&rows=53&facet=communidad_autonoma&facet=provincia&facet=municipio&refine.communidad_autonoma=Islas+Canarias&refine.provincia=Santa+Cruz+de+Tenerife"
const url = './data/tenerife20km.json'


d3.json(url).then(function (data) {
    calculate(data);
});

function calculate(listaMunicipios) {
    nhits = listaMunicipios.nhits;
    nhits = 1;
    let municipios = [];    
    for (let d = 0; d < nhits; d++) {
        municipios.push({
            type: 'Feature',
            recordid: listaMunicipios.records[d].recordid,
            colorscale: (parseInt(listaMunicipios.records[d].recordid, 16) % 5 + 1),
            municipio: listaMunicipios.records[d].fields.municipio,
            provincia: listaMunicipios.records[d].fields.provincia,
            communidad_autonoma: listaMunicipios.records[d].fields.communidad_autonoma,
            pais: listaMunicipios.records[d].fields.pais,
            geo_point_2d: listaMunicipios.records[d].fields.geo_point_2d,
            geometry: listaMunicipios.records[d].fields.geo_shape,
            dist: (listaMunicipios.records[d].fields.dist) ? listaMunicipios.records[d].fields.dist : 0
        });
    }

    // normal
    /*let listhexagons = [];
    for (let d = 0; d < nhits; d++) {
        listhexagons.push(geojson2h3.featureToH3Set(municipios[d], h3Resolution));
    }*/

    // quitando repeticion
    let listhexagons = [];
    
       for (let d = 0; d < nhits; d++) {
           const templist = geojson2h3.featureToH3Set(municipios[d], h3Resolution);
           const unique = [...new Set(templist)];
           listhexagons.push(unique);
       }
    // if (listhexagons[d] == undefined) { ... }
    //let juntado = [];
    //for (let d = 0; d < nhits; d++) {
    //    juntado = juntado.concat(listhexagons[d]);
    //}
    //console.log(juntado);


    // test ring
    //    const centerHex = h3.geoToH3(config.lat, config.lng, h3Resolution);
    //    listhexagons[0] = h3.kRing(centerHex, 9);
    // end test
    listhexagons[0] = allHexCanarias;

   
    for (let d = 0; d < nhits; d++) {
        contornos[municipios[d].recordid] = geojson2h3.h3SetToFeature(
            listhexagons[d],
            {
                colorscale: municipios[d].colorscale,
                municipio: municipios[d].municipio,
                provincia: municipios[d].provincia,
                communidad_autonoma: municipios[d].communidad_autonoma,
                pais: municipios[d].pais,
                geo_point_2d: municipios[d].geo_point_2d,
                dist: municipios[d].dist
            }
        );        
    }

    for (let d = 0; d < nhits; d++) {
        // Reduce hexagon list to a map with random values
        hexagons.push(listhexagons[d].reduce((res, hexagon) => ({ ...res, [hexagon]: getRandomIntInHex() }), {}));
    }
    // if (hexagons[d] == undefined) { ... }    
    
    for (let d = 0; d < nhits; d++) {
        areas[municipios[d].recordid] = geojson2h3.h3SetToFeatureCollection(
            Object.keys(hexagons[d]),
            hex => ({ value: hexagons[d][hex], colorscale: municipios[d].colorscale, municipioid: municipios[d].recordid })
        );
    }

    // console.log(hexagons);
    // info inside map addinfo();    
    for (let d = 0; d < nhits; d++) {
        // renderContorno(municipios[d].recordid);
        renderArea(municipios[d].recordid);        
    } 
    
        
    L.geoJson(geojson2h3.h3SetToFeature(allHexCanarias), { style: styleallHexCanarias }).addTo(map);

    map.on('click', onMapClick);
}

/* function addinfo() {
    info = L.control();
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this._side1 = document.getElementById("sidebar1");
        this._side2 = document.getElementById("sidebar2");
        this._side3 = document.getElementById("sidebar3");
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Information</h4>' + (props ?
            props.value + ' people<br>4 city associations<br>1 national association'
            : 'Hover over map');
        this._side3.innerHTML = '<h4>Information</h4>' + (props ?
            props.value + ' people<br>4 city associations<br>1 national association'
            : 'Hover over map');
    };
    info.addTo(map);
} */

function getColor(d, colorscale) {
    return d > Math.ceil(maxpersonsinhex * 2 / 3) ? config.colorScale[colorscale][2] :
           d > Math.ceil(maxpersonsinhex * 1 / 3) ? config.colorScale[colorscale][1] :
                                                    config.colorScale[colorscale][0];
}
//---------------------------------------------------------------------------------------------------------
/*  Asi se ilumina toda el area 
function entraMunicipio(e) {
    console.log(e.layer.feature.properties.municipioid);
    // test zoom out
    areas[e.layer.feature.properties.municipioid ].map.setStyle({
         fillOpacity: 1
    });
    // contornos[id].map.setStyle({
    //     color: config.colorScale[contornos[id].properties.colorscale]
    // });
}
function saleMunicipio(e) {
    areas[e.layer.feature.properties.municipioid].map.resetStyle();
}
 */
function entraMunicipio(e) {
    console.log(e.layer.feature.properties.municipioid);
    // test zoom out
    e.layer.setStyle({
        stroke: true,        
        weight: 5,
        opacity: 1,
        color: '#ff0000',
        fillOpacity: 1
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        e.target.bringToFront();
    }

    const info = document.getElementById("sidebar");
    info.innerHTML = '<img src="./data/side_provincia.png">';

    console.log( 'area: '+
    h3.hexArea(h3Resolution, 'km2') + 'km2, edge: '+    
    h3.edgeLength(h3Resolution, 'km') + 'km'
    );
//size 6 -> area: 36.1290521km2, edge: 3.229482772km
//size 8 -> 
//size 8 -> 

    // contornos[id].map.setStyle({
    //     color: config.colorScale[contornos[id].properties.colorscale]
    // });
}
function saleMunicipio(e) {    
    areas[e.layer.feature.properties.municipioid].map.resetStyle(e.layer);    
}

function stylecontour(feature) {
    // we can use feature.properties.colorscale
    return {
        stroke: true,
        fill: false,
        weight: 3,
        opacity: 1,
        color: '#636363'        
    };
}
function renderContorno(id) {
    console.log('renderContorno');
    console.log(id);
    contornos[id].map=L.geoJson(contornos[id], { style: stylecontour }).addTo(map);
}
function stylefill(feature) {
    //getColor(feature.properties.value, feature.properties.colorscale),
    return {
        fill: true,
        fillColor: getColor(feature.properties.value, feature.properties.colorscale),
        stroke: false,
        // fillOpacity: 0.2
        fillOpacity: 0.6
    };
}
function renderArea(id) {
    areas[id].map = L.geoJson(areas[id], { style: stylefill }).on({
        mouseover: entraMunicipio,
        mouseout: saleMunicipio,
        // click: zoomToFeature
    }).addTo(map);
}

/*                  _           _                      
 *      /\/\   __ _(_)_ __     /_\  _ __ ___  __ _ ___ 
 *     /    \ / _` | | '_ \   //_\\| '__/ _ \/ _` / __|
 *    / /\/\ \ (_| | | | | | /  _  \ | |  __/ (_| \__ \
 *    \/    \/\__,_|_|_| |_| \_/ \_/_|  \___|\__,_|___/
 */
/* function incrementOpacity() {
    barcelona.setStyle({
        fillOpacity: 1
    });
}
function resetOpacity() {
    barcelona.resetStyle();
}

// function stylefill(feature) {
//     return {
//         fill: true,
//         fillColor: getColor(feature.properties.value, feature.properties.ngroup),
//         stroke: false,
//         fillOpacity: 0.2
//     };
// }

function renderHexes(map, hexagons, ngroup) {

    // Transform the current hexagon map into a GeoJSON object
    const geojson = geojson2h3.h3SetToFeatureCollection(
        Object.keys(hexagons),
        hex => ({ value: hexagons[hex], ngroup: ngroup })
    );

    console.log('geojson');
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
} */

/*                  _           ___            _                             
 *      /\/\   __ _(_)_ __     / __\___  _ __ | |_ ___  _ __ _ __   ___  ___ 
 *     /    \ / _` | | '_ \   / /  / _ \| '_ \| __/ _ \| '__| '_ \ / _ \/ __|
 *    / /\/\ \ (_| | | | | | / /__| (_) | | | | || (_) | |  | | | | (_) \__ \
 *    \/    \/\__,_|_|_| |_| \____/\___/|_| |_|\__\___/|_|  |_| |_|\___/|___/
 */

/* function stylecontour(feature) {
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

    // console.log()

    // Transform the current hexagon map into a GeoJSON object
    const geojson = geojson2h3.h3SetToFeature(
        Object.keys(hexagons)
    );
    geojson.properties.ngroup = ngroup;

    // console.log(geojson);

    L.geoJson(geojson, { style: stylecontour }).addTo(map);
}
*/
/* http://patorjk.com/software/taag/#p=display&c=c&f=Ogre&t=Global%20variables%0A */ 