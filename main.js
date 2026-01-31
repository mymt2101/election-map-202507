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
        data: 'election_prefectures.geojson'
    });

    map.addLayer({
        id: 'senkyo-3d',
        type: 'fill-extrusion',
        source: 'senkyo',
        paint: {
            'fill-extrusion-color': '#CCCCCC',
            'fill-extrusion-height': [
                '*',
                ['coalesce', ['get', 'wt_ratio'], 1],
                100000
            ],
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
            <strong>${props.pref_name}</strong><br/>
            有権者数：約${Math.round(props.voters)/10}万人<br/>
            議席数：${props.seats}席<br/>
            1席あたりの有権者数：${Math.round(props.vpt_seat)/10}万人<br/>
            一票の価値（埼玉県を1とした場合）：${props.wt_ratio}倍<br/>
        `)
        .addTo(map);
    });
});