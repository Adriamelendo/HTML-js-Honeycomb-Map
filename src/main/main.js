const config = ({
    lat: 41.390205,
    lng: 2.154007,
    zoom: 11,
    fillOpacity: 0.6,
    colorScale: [
        ['#deebf7', '#9ecae1', '#3182bd'],
        ['#e5f5e0', '#a1d99b', '#31a354'],
        ['#f0f0f0', '#bdbdbd', '#636363'],
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


const listanum = d3.range(16);


const h3Index = h3.geoToH3(37.3615593, -122.0553238, 7);
console.log(h3Index);

function getRandomIntInHex() {
    const maxpersonsinhex10 = 3;
    maxpersonsinhex = maxpersonsinhex10 * Math.pow(7, 10 - h3Resolution);
    return getRandomInt(0, maxpersonsinhex);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

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
    listanum.forEach((d) => {
        // console.log(hexagons[d]);
        if (hexagons[d] != undefined) {
            renderHexes(map, hexagons[d], d);
            renderAreas(map, hexagons[d], d);
        }
    })
}

function getColor(d,ngroup) {
    return d > Math.ceil(maxpersonsinhex*2/3)   ? config.colorScale[ngroup % 6][2] :
           d > Math.ceil(maxpersonsinhex*1/3)   ? config.colorScale[ngroup % 6][1] :
                                                  config.colorScale[ngroup % 6][0];
}


function stylefill(feature) {
    return {
        fill: true,
        fillColor: getColor(feature.properties.value,feature.properties.ngroup),
        stroke: false,
        fillOpacity: 0.7
    };
}
function stylecontour(feature) {
    return {
        stroke: true,
        fill: false,
        weight: 3,
        opacity: 1,
        color: getColor(maxpersonsinhex,2)
    };
}


function renderHexes(map, hexagons, ngroup) {

    // Transform the current hexagon map into a GeoJSON object
    const geojson = geojson2h3.h3SetToFeatureCollection(
        Object.keys(hexagons),
        hex => ({ value: hexagons[hex], ngroup: ngroup })
    );


    console.log(geojson);

    L.geoJson(geojson, {style: stylefill}).addTo(map);

    /*const sourceId = 'h3-hexes-' + colorscale;
    const layerId = sourceId + '-layer';
    let source = map.getSource(sourceId);

    // Add the source and layer if we haven't created them yet
    if (!source) {
        console.log('adding source: ' + sourceId);
        console.log(geojson);
        map.addSource(sourceId, {
            type: 'geojson',
            data: geojson
        });
        map.addLayer({
            id: layerId,
            source: sourceId,
            type: 'fill',
            interactive: false,
            paint: {
                'fill-outline-color': 'rgba(0,0,0,0)',
            }
        });
        // source = map.getSource(sourceId);
    } else {
        // Update the geojson data
        source.setData(geojson);
    }
    // Update the layer paint properties, using the current config values
    map.setPaintProperty(layerId, 'fill-color', {
        property: 'value',
        stops: [
            [0, config.colorScale[colorscale % 6][0]],
            [Math.ceil(maxpersonsinhex / 2), config.colorScale[colorscale % 6][1]],
            [maxpersonsinhex, config.colorScale[colorscale % 6][2]]
        ]
    });

    map.setPaintProperty(layerId, 'fill-opacity', config.fillOpacity);
    */
}
function renderAreas(map, hexagons, ngroup) {

    console.log()

    // Transform the current hexagon map into a GeoJSON object
    const geojson = geojson2h3.h3SetToFeature(
        Object.keys(hexagons)
    );

    L.geoJson(geojson, {style: stylecontour}).addTo(map);

    /* const sourceId = 'h3-hex-areas-' + colorscale;
    const layerId = sourceId + '-layer';
    let source = map.getSource(sourceId);

    // Add the source and layer if we haven't created them yet
    if (!source) {
        console.log('adding source: ' + sourceId);
        console.log(geojson);
        map.addSource(sourceId, {
            type: 'geojson',
            data: geojson
        });
        map.addLayer({
            id: layerId,
            source: sourceId,
            type: 'line',
            interactive: false,
            paint: {
                'line-width': 3,
                'line-color': config.colorScale[colorscale % 6][2],
            }
        });
        // source = map.getSource(sourceId);
    } else {
        // Update the geojson data
        source.setData(geojson);
    }
    */
}
function mouseover(lng, lat) {
    const centerHex = h3.geoToH3(lat, lng, h3Resolution);
    const info = document.getElementById("info");
    info.innerHTML = centerHex;
}