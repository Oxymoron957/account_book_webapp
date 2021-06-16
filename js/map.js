// 현재 위치 
var latitude = 0;
var longitude = 0;

function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(latitude);
}

function error() {
alert('Sorry, no position available.');
}

const options = {
enableHighAccuracy: false,
maximumAge: 30000,
timeout: 27000
};


function initMap() {

    var payLoc = getLoc();
    console.log(payLoc);

    setTimeout(() => {
    demoCenter = new google.maps.LatLng(payLoc[0][1],payLoc[0][2]);
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: demoCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var marker, 
    i,
    infowindow = new google.maps.InfoWindow();

    for (i = 0; i < payLoc.length; i++) {  
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(payLoc[i][1], payLoc[i][2]),
            map: map,
            title: payLoc[i][0]
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(payLoc[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
    }, 1000);
}
