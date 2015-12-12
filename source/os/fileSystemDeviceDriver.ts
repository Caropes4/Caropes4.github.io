/**
 * Created by CharlieRopes on 12/11/15.
 */
module TSOS {

    export class FileSystemDeviceDriver {

        public tracks;
        public sectors;
        public blocks;


        constructor() {
        }

        public init():void {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;

            //Clear the session storage
            sessionStorage.clear();
            //For loops to initialize data in sessionStorage
            for(var x; x < this.tracks; x++){
                for(var y; y < this.sectors; y++){
                    for(var z; z < this.blocks; z++){
                        var key = x+""+y+""+z;
                        sessionStorage.setItem(key,"0000000000000000000000000000000000000000000000000000000000000000");
                    }
                }
            }



        }





    }
}