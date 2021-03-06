'use strict'
// Create map and a new blank array for all the listing markers.

var map;
var markers = [];
var marker;
var CLIENTID, CLIENTSECRET;

//Function to initialize the map within the map div
var locations = [{
        title: 'Park Ave Penthouse',
        location: {
            lat: 40.7713024,
            lng: -73.9632393
        }
    },
    {
        title: 'Chelsea Loft',
        location: {
            lat: 40.7444883,
            lng: -73.9949465
        }
    },
    {
        title: 'Union Square Open Floor Plan',
        location: {
            lat: 40.7347062,
            lng: -73.9895759
        }
    },
    {
        title: 'East Village Hip Studio',
        location: {
            lat: 40.7281777,
            lng: -73.984377
        }
    },
    {
        title: 'TriBeCa Artsy Bachelor Pad',
        location: {
            lat: 40.7195264,
            lng: -74.0089934
        }
    },
    {
        title: 'Chinatown Homey Space',
        location: {
            lat: 40.7180628,
            lng: -73.9961237
        }
    }
]; //end of lcations array
function initMap() {

    var mapCanvus = document.getElementById('map');
    var mapOptions = {
        center: {
            lat: 40.7413549,
            lng: -73.9980244
        },
        zoom: 13
    } //end of mapOptions
    map = new google.maps.Map(mapCanvus, mapOptions);
    //map constructor


    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        //console.log(position);
        var title = locations[i].title;

        // Create a marker per location, and put into markers array.
        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i

        }); //End of marker object
        // Push the marker to our array of markers.
        markers.push(marker);

        vm.locationList()[i].marker = marker;



        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        }, function() {

        });
        //markers.addListener('click',function(){ toggleBounce(this)});
        bounds.extend(markers[i].position);
    } //End for loop

    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
}

function toggleBounce() {
    if (markers.getAnimation() !== null) {
        markers.setAnimation(null);
    } else {
        markers.setAnimation(google.maps.Animation.BOUNCE);
    }
} //End of initmap

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        /*
                var apiUrl='http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker()[1].title + '&format=json&callback=wikiCallback';
             $.ajax({
                url: apiUrl,
                dataType: 'jsonp',
              })
             .done ( function( response ){
                console.log(response);
             });*/

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker = null;
        });
    }
}

var viewModel = function() {
    var self = this;
    self.locationList = ko.observableArray(locations);

    self.locationList().forEach(
        function(locations) {
            locations.visible = ko.observable(true);
        });

    //this.searchterm = ko.observable(result);

    this.searchterm = ko.observable('');

    //self.myObservableString=ko.observable('');
    self.filterList = ko.computed(function() {
        var result = [];
        var locationToCheck;
        for (var i = 0; i < self.locationList().length; i++) {
            //locationToCheck = locations[i].title;
            locationToCheck = self.locationList()[i].title;
            // console.log(locations.length);
            // console.log(locationToCheck);
            if (locationToCheck.toLowerCase().includes(this.searchterm().toLowerCase())) {
                result.push(self.locationList()[i]);
                //  this.marker[i].setVisible(true);
                if (self.locationList()[i].marker) self.locationList()[i].marker.setVisible(true);
            } else {
                if (self.locationList()[i].marker) self.locationList()[i].marker.setVisible(false);
                //  this.marker[i].setVisible(false);
                // result.push(locationToCheck);
                // console.log(result.title);
            }

        }
        console.log("result:", result)
        console.log("searchterm:", self.searchterm())
        return result;
    }, this);

};

var vm = new viewModel();
ko.applyBindings(vm);