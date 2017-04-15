var React = require('react');
var ReactDom = require('react-dom');

var Search = require('./Search');
var Map = require("./Map");
var CurrentLocation = require('./CurrentLocation');
var LocationList = require('./LocationList');

var App = React.createClass({

    getInitialState(){

      // Extract the favorite locations from local storage

      var favorites = [];

      if(localStorage.favorites){
          favorites = JSON.parse(localStorage.favorites);
      }

      // Nobody would get mad if we center it on Paris by default

      return {
        favorites: favorites,
        currentAddress: 'Paris, France',
        mapCoodinates: {
          lat: 48.856614,
          lng: 2.3522219
        }
      };
    },

    toggleFavorite(address){
      if(this.isAddressInFavorites(address)){
            this.removeFromFavorites(address);
        } else {
            this.addToFavorites(address);
          }
    },

    addToFavorites(address){
      var favorites = this.state.favorites;

      favorites.push({
          address: address,
          timestamp: Date.now()
      });

      localStorage.favorites = JSON.stringify(favorites);
    },

    removeFromFavorites(address){
      var favorites = this.state.favorites;
      var index = -1;

      for(var i = 0; i < favorites.length; i++) {
          if(favorites[i].address == address) {
              index = i;
              break;
          }
      }

      // If it was found, remove it from the favorites array

      if(index !== -1) {
        favorites.splice(index, 1);

        this.setState({
            favorites: favorites
        });

        localStorage.favorites = JSON.stringify(favorites);
      }

    },

    isAddressInFavorites(address) {
      var favorites = this.state.favorites;

      for(var i=0; i < favorites.length; i++) {
          if(favorites[i].address == address) {
              return true;
          }
      }

        return false;
    },

    searchForAddress(address){

        var self = this;

        //we will use the GMaps' geocode functionality

        GMaps.geocode({
            address: address,
            callback: function(result, status) {

                if(status !== "OK") return;

                var latlng = results[0].geometry.location;

                self.setState({
                    currentAddress: results[0].formatted_address,
                    mapCoodinates: {
                      lat: latlng.lat(),
                      lng: latlng.lng()
                    }
                });
            }
        });
    },

    render(){
        return (
          <div>
            <h1>Your Google Maps Locations</h1>
            <Map lat={this.state.mapCoodinates.lat} lng={this.state.mapCoodinates.lng} />

            <CurrentLocation address={this.state.currentAddress}
                            favorite={this.isAddressInFavorites(this.state.currentAddress)}
                            onFavoriteToggle={this.toggleFavorite} />

            <LocationList Locations={this.state.favorites} activeLocationAddress={this.state.currentAddress}
                              onClick={this.searchAddress} />

          </div>



        );
    }
});

module.exports = App;
