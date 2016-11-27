let map;

function initMap() {
    
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

            let coords = position.coords;
            let currentPosition = { lat: coords.latitude, lng: coords.longitude };

            map = new google.maps.Map(document.getElementById('map'), {
                center: currentPosition,
                zoom: 16
            });

            let marker = new google.maps.Marker({
                position: currentPosition,
                map: map
            });
        });

    } else {

        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 41.341090, lng: -74.168289 },
            zoom: 16
        });
    }
}