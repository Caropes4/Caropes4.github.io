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

        //initiate sessions storage
        public init():void {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;

            //Clear the session storage
            sessionStorage.clear();
            //For loops to initialize data in sessionStorage
            for(var x = 0; x < this.tracks; x++){
                for(var y = 0; y < this.sectors; y++){
                    for(var z = 0; z < this.blocks; z++){
                        var key = x+""+y+""+z;
                        sessionStorage.setItem(key,"0000000000000000000000000000000000000000000000000000000000000000");
                    }
                }
            }
        }

        //Will create a file
        public create(fileName:string):void{
            var done = false;
            //Loop thorough an find free space
            for(var x = 0; x < this.tracks; x++) {
                for (var y = 0; y < this.sectors; y++) {
                    for (var z = 0; z < this.blocks; z++) {
                        var key = x + "" + y + "" + z;
                        var meta = sessionStorage.getItem(key).substr(0, 1);
                        if (meta == "0") {
                            var data = "1---" + this.stringToHex(fileName);
                            while(data.length < 64){
                                data = data + "0";
                            }
                            //Place the file on the disk
                            sessionStorage.setItem(key, data);
                            _FileSystemDisplay.updateDisplay();
                            _success = true;
                            //If the file was created break out of the loop
                            done = true;
                            break;
                        }
                    }
                    //If the file was created break out of the loop
                    if(done){
                        break;
                    }
                }
                //If the file was created break out of the loop
                if(done){
                    break;
                }
            }
        }

        public read(fileName:string):void{
            
        }

        //Used to put a string into hex
        public stringToHex(str : string){
            var newString = "";
            var str1 = ""+ str;
            //Loop through the string and change it to hex
            for(var x = 0; str1.length > x; x++){
                var piece = str1.substr(x);
                newString = newString + piece.charCodeAt(0).toString(16).toUpperCase();
            }
            return newString;
        }






    }
}