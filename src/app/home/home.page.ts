import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import {
    BackgroundGeolocation,
    BackgroundGeolocationConfig,
    BackgroundGeolocationEvents,
    BackgroundGeolocationResponse,
} from '@ionic-native/background-geolocation/ngx';

const config: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 20,
    distanceFilter: 30,
    debug: false, //  enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: true, // enable this to clear background location settings when the app terminates
    interval: 3000,
    url: 'http://192.168.1.171:3000/coordenadas'
};

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    public lat: any;
    public lon: any;

    constructor(
        public platform: Platform,
        private backgroundGeolocation: BackgroundGeolocation
    ) {
        this.platform.ready().then(() => {
            this.obtenerCoordenadas();
        });
    }

    obtenerCoordenadas() {
        this.backgroundGeolocation.configure(config)
            .then(() => {
                this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
                    console.log(location);

                    // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                    // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
                    // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                    this.backgroundGeolocation.finish(); // FOR IOS ONLY
                });
            });

        // start recording location
        this.backgroundGeolocation.start();

        this.backgroundGeolocation.getCurrentLocation().then(location => {
            this.lat = location.latitude;
            this.lon = location.longitude;

            console.log(location);
            
        });

        // If you wish to turn OFF background-tracking, call the #stop method.
        //this.backgroundGeolocation.stop();
    }

}
