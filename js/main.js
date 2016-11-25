let map;

function initMap() {

    let currentPosition;

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var coords = position.coords;
            currentPosition = { lat: coords.latitude, lng: coords.longitude };
        });
    } else {
        currentPosition = { lat: 41.341090, lng: -74.168289 };
    }

    map = new google.maps.Map(document.getElementById('map'), {
        center: currentPosition,
        zoom: 16
    });
}