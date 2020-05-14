const config = ({    
    lat: 41.390205,
    lng: 2.154007,
    zoom: 7,
    fillOpacity: 0.6,
    colorScale: [
        ['#ffffcc', '#78c679', '#006837'],
        ['#ccffff', '#c67879', '#683700'],
        ['#ffccff', '#7879c6', '#680037'],
        ['#ffcccc', '#78c6c6', '#006800'],
        ['#ccffcc', '#c6c679', '#000068'],
        ['#ccccff', '#c679c6', '#680000'],
        ['#cccccc', '#c6c6c6', '#376837'],
        ['#ffffff', '#787979', '#000037'],
        ['#ffff55', '#78aa79', '#376837'],
        ['#ffff55', '#7879aa', '#686837']
    ]
});
const h3Resolution = 7;
let hexagons = [];

const listanum = d3.range(16);


const h3Index = h3.geoToH3(37.3615593, -122.0553238, 7);
console.log(h3Index);



// const url = 'https://data.opendatasoft.com/api/records/1.0/search/?dataset=espana-municipios%40public&facet=communidad_autonoma&facet=provincia&facet=municipio&refine.provincia=Barcelona'
const url = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=espana-municipios%40public&rows=313&facet=communidad_autonoma&facet=provincia&facet=municipio&refine.provincia=Barcelona&geofilter.distance=41.390205%2C2.154007%2C10000"
// const url = "'./data/listaMunicipios.json'"

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
        hexagons.push(listhexagons[d].reduce((res, hexagon) => ({ ...res, [hexagon]: Math.random() }), {}));
    });

    // console.log(hexagons);
}

function rendermap() {
    listanum.forEach((d) => {
        console.log(hexagons[d]);
        if (hexagons[d] != undefined) {
            renderHexes(map, hexagons[d], d);
            renderAreas(map, hexagons[d], d, 0);
        }
    })
}

function renderHexes(map, hexagons, colorscale) {

    // Transform the current hexagon map into a GeoJSON object
    const geojson = geojson2h3.h3SetToFeatureCollection(
        Object.keys(hexagons),
        hex => ({ value: hexagons[hex] })
    );

    const sourceId = 'h3-hexes-' + colorscale;
    const layerId = sourceId + '-layer';
    let source = map.getSource(sourceId);

    // Add the source and layer if we haven't created them yet
    if (!source) {
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
        source = map.getSource(sourceId);
    } else {
        // Update the geojson data
        source.setData(geojson);
    }
    // Update the layer paint properties, using the current config values
    map.setPaintProperty(layerId, 'fill-color', {
        property: 'value',
        stops: [
            [0, config.colorScale[colorscale % 10][0]],
            [0.5, config.colorScale[colorscale % 10][1]],
            [1, config.colorScale[colorscale % 10][2]]
        ]
    });

    map.setPaintProperty(layerId, 'fill-opacity', config.fillOpacity);
}
function renderAreas(map, hexagons, colorscale, threshold) {

    // Transform the current hexagon map into a GeoJSON object
    const geojson = geojson2h3.h3SetToFeature(
        Object.keys(hexagons).filter(hex => hexagons[hex] > threshold)
    );

    const sourceId = 'h3-hex-areas-' + colorscale;
    const layerId = sourceId + '-layer';
    let source = map.getSource(sourceId);

    // Add the source and layer if we haven't created them yet
    if (!source) {
        console.log('adding source: ' + sourceId);
        map.addSource(sourceId, {
            type: 'geojson',
            data: geojson
        });
        console.log('adding layer: ' + layerId);
        map.addLayer({
            id: layerId,
            source: sourceId,
            type: 'line',
            interactive: false,
            paint: {
                'line-width': 3,
                'line-color': config.colorScale[colorscale % 10][2],
            }
        });
        source = map.getSource(sourceId);
    } else {

        // Update the geojson data
        source.setData(geojson);
    }
}