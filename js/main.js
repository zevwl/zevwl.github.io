let map;
let watchEnabled = false;
let watchId;

let showLocationButton = document.getElementById('show-location');
let watchLocationButton = document.getElementById('watch-location');

function showMarkerOnCurrentLocation(position) {

    let coords = position.coords;
    let currentPosition = { lat: coords.latitude, lng: coords.longitude };

    let marker = new google.maps.Marker({
        position: currentPosition,
        map: map
    });
    map.setCenter(currentPosition);
}

function showCurrentLocation() {
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showMarkerOnCurrentLocation);
    } else {
        console.error('navigator.geolocation is not available ');
    }
}

function watchCurrentLocation() {

    if (!watchEnabled) {

         if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(showMarkerOnCurrentLocation);
            this.textContent = 'Disable Watch';
            this.className += 'watch-enabled';
            watchEnabled = true;
        } else {
            console.error('navigator.geolocation is not available ');
        }
    } else {
        // disable watch
        navigator.geolocation.clearWatch(watchId);
        watchEnabled = false;
        this.textContent = 'Watch Current Location';
        this.className = '';
    }
}

function initMap() {
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.341090, lng: -74.168289 },
        zoom: 16
    });

    showLocationButton.addEventListener('click', showCurrentLocation, false);
    watchLocationButton.addEventListener('click', watchCurrentLocation, false);
}
