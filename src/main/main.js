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
const h3Resolution = 7;
let maxpersonsinhex = 1;
let nhits = 0;
let contornos = {};
let areas = {};

let hexagons = [];
let barcelona = '';
let info = '';
let previous_content = '';
let previousHexagonoClick = '';
let previousMunicipioClick = '';
// --------------- contenido para la DEMO ---------------------------------
const allHexCanarias = ["87344cd9affffff","87344cd9bffffff","87344cd99ffffff","87344cd9dffffff","873441369ffffff","87344ccb4ffffff","87344ccb5ffffff","87344cca6ffffff","87344cd8affffff","87344cd8effffff","87344cd83ffffff","87344cd82ffffff","87344136bffffff","87344ccb6ffffff","87344ccb0ffffff","87344ccb1ffffff","87344cca2ffffff","87344cd88ffffff","87344cd8cffffff","87344cd81ffffff","87344cd80ffffff","87344cd86ffffff","87344134cffffff","87344134dffffff","87344ccb2ffffff","87344ccb3ffffff","87344cdaaffffff","87344cd85ffffff","87344cd84ffffff","873441348ffffff","873441349ffffff","87344cc94ffffff","87344cdaeffffff","87344cda3ffffff","87344134bffffff","87344cc96ffffff","87344cc90ffffff","87344cd91ffffff","87344cd90ffffff","87344cd93ffffff","87344cd9effffff","87344cd9cffffff","87344cd95ffffff","87344cd94ffffff","87344cd96ffffff","87344cd98ffffff","87344cdb3ffffff","87344cd92ffffff","87344136dffffff","873441361ffffff","87344136cffffff","873441365ffffff","873441364ffffff","87344ccabffffff","87344ccaaffffff","87344cc8cffffff","87344cc8dffffff","87344ccf6ffffff","87344cca9ffffff","87344cca8ffffff","87344ccaeffffff","87344cc85ffffff","87344cc81ffffff","87344cc8effffff","87344cc88ffffff","87344cc89ffffff","87344ccf2ffffff","87344ccf0ffffff","87344ccf4ffffff","87344cc1affffff","87344ccadffffff","87344ccacffffff","87344cca1ffffff","87344cca3ffffff","87344cc84ffffff","87344cc80ffffff","87344ccd4ffffff","87344ccf3ffffff","87344ccf1ffffff","87344ccf5ffffff","87344cc1bffffff","87344cca0ffffff","87344cc86ffffff","87344ccd5ffffff","873441345ffffff","873441344ffffff","873441340ffffff","873441341ffffff","87344136affffff","87344136effffff","873441363ffffff","873441362ffffff","873441371ffffff","873441346ffffff","873441343ffffff","87344134effffff","873441368ffffff","873441360ffffff","873441366ffffff","873441375ffffff","87344cc13ffffff","87344cc12ffffff","87344cc1effffff","87344cc11ffffff","87344cc10ffffff","87344cca5ffffff","87344cc18ffffff","87344cc1cffffff","87344cca4ffffff","87344126dffffff","873441268ffffff","873441269ffffff","87344cc9affffff","87344cc9effffff","87344cc93ffffff","87344126bffffff","87344c534ffffff","87344cc91ffffff","87344cc33ffffff","87344cc32ffffff","87344cc14ffffff","87344cc15ffffff","87344cc06ffffff","87344cc31ffffff","87344cc30ffffff","87344cc36ffffff","87344cd8dffffff","87344cd89ffffff","87344cc16ffffff","87344cc02ffffff","87344cc00ffffff","87344cc04ffffff","87344cc22ffffff","87344cc35ffffff","87344cd8bffffff","873441275ffffff","873441274ffffff","873441270ffffff","873441271ffffff","873441262ffffff","873441266ffffff","87344135bffffff","87344135affffff","873441229ffffff","873441276ffffff","873441272ffffff","873441273ffffff","873441246ffffff","873441244ffffff","873441260ffffff","873441264ffffff","873441359ffffff","873441358ffffff","87344122bffffff","87344120dffffff","873441255ffffff","873441265ffffff","87344134affffff","87344135dffffff","87344cdb1ffffff","87344cda2ffffff","87344c524ffffff","87344cc99ffffff","87344c526ffffff","87344c520ffffff","87344c525ffffff","87344cc8bffffff","87344cc8affffff","87344cc9dffffff","87344cc98ffffff","87344cc9bffffff","87344c522ffffff","87344c523ffffff","87344c521ffffff","87344ccd2ffffff","87344ccd6ffffff","87344cc83ffffff","87344cc9cffffff","87344c504ffffff","87344c505ffffff","87344c52effffff","87344c52cffffff","87344ccd3ffffff","87344ccd0ffffff","87344cc82ffffff","87344c500ffffff","87344c52affffff","87344c528ffffff","87344cc95ffffff","873441355ffffff","873441342ffffff","873441373ffffff","873441370ffffff","87344130dffffff","87344cda9ffffff","87344cc34ffffff","87344cda8ffffff","87344cdabffffff","87344cc26ffffff","873441241ffffff","873441240ffffff","873441243ffffff","87344124effffff","87344124cffffff","87344126affffff","873441245ffffff","873441242ffffff","87344125dffffff","87344124affffff","873441248ffffff","87344126effffff","873441263ffffff","87344126cffffff","873441261ffffff","87344cc92ffffff","87344cda1ffffff","87344cda0ffffff","87344cdacffffff","873441354ffffff","873441309ffffff","873441356ffffff","873441350ffffff","873441372ffffff","873441351ffffff","87344135effffff","873441353ffffff","87344122dffffff","87344135cffffff","873441352ffffff","87344122cffffff","873441228ffffff","87344122effffff","87344122affffff","87344c531ffffff","87344c530ffffff","87344c506ffffff","87344c535ffffff","87344c502ffffff","87344cd18ffffff","87344cd1effffff","87344cd1affffff","87344cd1bffffff","87344cd19ffffff","87344cd1dffffff","87344cd1cffffff","87344cd11ffffff","87344cdadffffff","87344c516ffffff","87344124bffffff","87344c512ffffff","87344c510ffffff","87344c514ffffff","873441249ffffff","87344c5acffffff","87344c513ffffff","87344c511ffffff","87344c515ffffff","87344c533ffffff","87344c532ffffff","87344124dffffff","87344c51cffffff","87344c536ffffff"]
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
    // para crear regiones a mano:

    // allHexCanarias.push(h3.geoToH3(e.latlng.lat, e.latlng.lng, h3Resolution)); 
    // console.log(allHexCanarias);   
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
function entraHexagonoSave(e) {
    if (previousHexagonoClick != '') {
        saleHexagono(previousHexagonoClick);
    }
    previousHexagonoClick = e;
    entraHexagono(e);
}

 function entraHexagono(e) {
    //console.log('entraHexagono');
    var layer = e.target;

    layer.setStyle({
        //stroke: true,        
        //weight: 5,
        //opacity: 1,
        //color: '#ff0000',
        fillColor: '#ff0000',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    // info.update(layer.feature.properties);
}
function saleHexagono(e) {
    //console.log('saleHexagono');
    // barcelona.resetStyle(e.target);
    // info.update();
}
// function zoomToFeature(e) {
//    map.fitBounds(e.target.getBounds());
//}
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: entraHexagono,
        mouseout: saleHexagono,
        click: entraHexagonoSave
    });
}

function mouseover(lng, lat) {
    const centerHex = h3.geoToH3(lat, lng, h3Resolution);
    // const info = document.getElementById("sidebar3");
    info.innerHTML = centerHex;
}

/*                  _           ___                          _ 
 *      /\/\   __ _(_)_ __     / _ \___ _ __   ___ _ __ __ _| |
 *     /    \ / _` | | '_ \   / /_\/ _ \ '_ \ / _ \ '__/ _` | |
 *    / /\/\ \ (_| | | | | | / /_\\  __/ | | |  __/ | | (_| | |
 *    \/    \/\__,_|_|_| |_| \____/\___|_| |_|\___|_|  \__,_|_|
 */

// const url = 'https://data.opendatasoft.com/api/records/1.0/search/?dataset=espana-municipios%40public&facet=communidad_autonoma&facet=provincia&facet=municipio&refine.provincia=Barcelona'

// Este va centro tenerife
//const url = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=espana-municipios%40public&rows=313&facet=communidad_autonoma&facet=provincia&facet=municipio&geofilter.distance=28.261146%2C-16.595508%2C20000"
const url = './data/presentacion_cerca.json'

// const url = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=espana-municipios%40public&rows=53&facet=communidad_autonoma&facet=provincia&facet=municipio&refine.communidad_autonoma=Islas+Canarias&refine.provincia=Santa+Cruz+de+Tenerife&geofilter.distance=28.261146%2C-16.595508%2C10000"


// const url = './data/listaMunicipios10barcelona.json'
// const url = './data/listaMunicipios.json'
// const url = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=espana-municipios%40public&rows=53&facet=communidad_autonoma&facet=provincia&facet=municipio&refine.communidad_autonoma=Islas+Canarias&refine.provincia=Santa+Cruz+de+Tenerife"

d3.json(url).then(function (data) {
    calculate(data);
});

function calculate(listaMunicipios) {
    nhits = listaMunicipios.nhits;
    //ToSmall nhits = 1;
    let municipios = [];    
    for (let d = 0; d < nhits; d++) {
        let color= 1;
        if(listaMunicipios.records[d].fields.municipio == "La Orotava") color =3;
        municipios.push({
            type: 'Feature',
            recordid: listaMunicipios.records[d].recordid,
            colorscale: color,// ((parseInt(listaMunicipios.records[d].recordid, 16)+3) % 5 + 1),
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
    /* let juntado = [];
    for (let d = 0; d < nhits; d++) {
        juntado = juntado.concat(listhexagons[d]);
    }
    console.log(juntado); 
//download:
var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(juntado));
var dlAnchorElem = document.getElementById('sidebar');
var link = document.createElement("a");
link.setAttribute("href", dataStr);
link.setAttribute("download", "juntado.json");
dlAnchorElem.appendChild(link);
*/
//end

    // test ring
    //    const centerHex = h3.geoToH3(config.lat, config.lng, h3Resolution);
    //    listhexagons[0] = h3.kRing(centerHex, 9);
    // end test

    //ToSmall
    // listhexagons[0] = allHexCanarias;

   
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
    // addinfo();    
    for (let d = 0; d < nhits; d++) {
        renderContorno(municipios[d].recordid);
        renderArea(municipios[d].recordid);        
    } 
    
        
    L.geoJson(geojson2h3.h3SetToFeature(allHexCanarias), { style: styleallHexCanarias }).addTo(map);

    map.on('click', onMapClick);
}

/* function addinfo() {
    info = L.control();
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        //this._side1 = document.getElementById("sidebar1");
        //this._side2 = document.getElementById("sidebar2");
        //this._side3 = document.getElementById("sidebar3");
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
function entraMunicipioSave(e) {
    
    if (previousMunicipioClick != '') {
        saleMunicipio(previousMunicipioClick);
    }
    previousMunicipioClick = e;
    entraMunicipio(e);
}


function entraMunicipio(e) {
    //console.log('entraMunicipio');
    // console.log(e.layer.feature.properties.municipioid);
    /* // test zoom out
    e.layer.setStyle({
        stroke: true,        
        weight: 5,
        opacity: 1,
        color: '#ff0000',
        fillOpacity: 1
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        e.target.bringToFront();
    } */
    /* areas[e.layer.feature.properties.municipioid].map.setStyle({
        fillColor: getColor(areas[e.layer.feature.properties.municipioid].features[0].properties.value, 3)
    })  */   

    const info = document.getElementById("sidebar");
    previous_content = info.innerHTML;
    info.innerHTML = '<img src="./data/side_mun2.png">';

    // console.log( 'area: '+
    // h3.hexArea(h3Resolution, 'km2') + 'km2, edge: '+    
    // h3.edgeLength(h3Resolution, 'km') + 'km'
    // );

    // console.log(areas[e.layer.feature.properties.municipioid]);
    contornos[e.layer.feature.properties.municipioid].map.setStyle({
        stroke: true,        
        weight: 5,
        opacity: 1,
        // color: config.colorScale[contornos[e.layer.feature.properties.municipioid].properties.colorscale]
        color: '#e6550d'
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        contornos[e.layer.feature.properties.municipioid].map.bringToFront();
    }
}
function saleMunicipio(e) {   
    //console.log('saleMunicipio'); 
    
    contornos[e.layer.feature.properties.municipioid].map.resetStyle();
    areas[e.layer.feature.properties.municipioid].map.resetStyle(e.layer);  
    
    const info = document.getElementById("sidebar");
    info.innerHTML = previous_content;
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
    areas[id].map = L.geoJson(areas[id], { style: stylefill, onEachFeature: onEachFeature }).on({
        mouseover: entraMunicipio,
        mouseout: saleMunicipio,
        click: entraMunicipioSave
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