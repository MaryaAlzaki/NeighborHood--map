'"use strict"';
// Create map and a new blank array for all the listing markers.
/* jshint undef: true, unused: true */
/* globals google,InfoWindow,ko,$,infowindow,vm */
// jshint unused:false

var map;
var markers = [];
var marker;
var locations = [{
        title: 'London',
        location: {
            lat: 51.5287368,
            lng: 0.1779031
        }
    },
    {
        title: 'Tower Of London',
        location: {
            lat: 51.5081157,
            lng: -0.0737606
        }
    },
    {
        title: 'National Gallery',
        location: {
            lat: 51.5089323,
            lng: -0.1261103
        }
    },
    {
        title: 'Buckingham Palace',
        location: {
            lat: 51.5007226,
            lng: -0.1398821
        }
    },
    {
        title: 'Big Ben',
        location: {
            lat: 51.5007325,
            lng: -0.1224421
        }
    },
    {
        title: 'London City Airport',
        location: {
            lat: 51.504847,
            lng: 0.0517067
        }
    }
]; //end of lcations array

//Start init map
function initMap() {

    var mapCanvus = document.getElementById('map');
    var mapOptions = {
        center: {
            lat: 51.5287368,
            lng: 0.1779031
        },
        zoom: 13
    }; //end of mapOptions
    map = new google.maps.Map(mapCanvus, mapOptions);
    //map constructor
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i

        }); //End of marker object
        // Push the marker to our array of markers

        markers.push(marker);

        vm.locationList()[i].marker = marker;
        bounds.extend(markers[i].position);
    } //End for loop
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);

} //End of initmap

function handelMarker(marker, largeInfowindow) {
    marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
    });
}

function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;
        var wikiLink;
        var wikiName;
        var content;

        var apiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
        $.ajax({
                url: apiUrl,
                dataType: 'jsonp'
            })
            .done(function(response) {

                console.log(wikiName = response[1][1]);
                console.log(wikiLink = response[3][1]);

                content = '<p>Go to Wikipedia Article:</p>' +
                    '<a href="' + wikiLink + '">' + wikiName + '</a>';


                infowindow.setContent(content);

                infowindow.open(map, marker);

                console.log(response);
            })
            .fail(function() {
                console.log("error:");
                infowindow.setContent("Sorry, We couldn't find this location");
                infowindow.open(map, marker);
            });

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


    this.searchterm = ko.observable('');
    self.filterList = ko.computed(function() {
        var result = [];
        var locationToCheck;
        for (var i = 0; i < self.locationList().length; i++) {

            locationToCheck = self.locationList()[i].title;

            if (locationToCheck.toLowerCase().includes(this.searchterm().toLowerCase())) {
                result.push(self.locationList()[i]);
                if (self.locationList()[i].marker) {

                    self.locationList()[i].marker.setVisible(true);
                }
            } else {
                if (self.locationList()[i].marker) {
                    self.locationList()[i].marker.setVisible(false);

                }
            }


        } //End for
        return result;
    }, this);

};
/* jshint ignore:start */
Error = function handelError() {
    alert("Couldn't Load Page, Please try again later");
};
/* jshint ignore:end */
/* jshint ignore:start */
var vm = new viewModel();
ko.applyBindings(vm);
/* jshint ignore:end */