// 背景地図の表示
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json',
    center: [137.0, 38.0],
    zoom: 4,
    pitch: 80
});

// ナビゲーションボタン
map.addControl(new maplibregl.NavigationControl(), 'top-right');

// 地図データの追加
map.on('load', () => {
    map.addSource('senkyo', {
        type: 'geojson',
        data: 'election_district.geojson'
    });

    map.addLayer({
        id: 'senkyo-3d',
        type: 'fill-extrusion',
        source: 'senkyo',
        paint: {
            'fill-extrusion-color': '#CCCCCC',
            'fill-extrusion-height': ['*',['get', 'vote_ratio'], 100000],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.8
        }
    });

    // ポップアップ
    map.on('click', 'senkyo-3d', (e) => {
        const props = e.features[0].properties;
        new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
            <strong>${props.dist_name}</strong><br/>
            有権者数：${props.voters}人<br/>
            議席数：${props.seats}席<br/>
            1席あたりの有権者数：${props.voters_ps}人<br/>
            1票の格差（福井県=1）：${props.vote_ratio}倍<br/>
        `)
        .addTo(map);
    });
});