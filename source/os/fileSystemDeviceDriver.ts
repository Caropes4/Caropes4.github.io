/**
 * Created by CharlieRopes on 12/11/15.
 */
module TSOS {

    export class FileSystemDeviceDriver extends DeviceDriver{

        public tracks;
        public sectors;
        public blocks;



        constructor() {
            // Override the base method pointers.
            super(this.krnFileSystemDeviceDriverEntry);
        }

        public krnFileSystemDeviceDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        //Will format
        public format():void{
            //Clear the session storage
            sessionStorage.clear();
            //For loops to initialize data in sessionStorage
            for(var x = 0; x < _tracks; x++){
                for(var y = 0; y < _sectors; y++){
                    for(var z = 0; z < _blocks; z++){
                        var key = x+""+y+""+z;
                        sessionStorage.setItem(key,"0000000000000000000000000000000000000000000000000000000000000000");
                    }
                }
            }
        }

        //Will create a file
        public create(fileName:string):void{
            //Make sure file does not already exist
            if(this.doesFileExist(fileName) == false){
                var data = "1---" + this.stringToHex(fileName);
                while (data.length < 64) {
                    data = data + "0";
                }
                //Get next free directory block
                var key = this.nextFreeDirectoryBlock();
                //Place the file on the disk
                sessionStorage.setItem(key, data);
                //Update the display
                _FileSystemDisplay.updateDisplay();
                _success = true;
            }
        }

        //Will read the file and display the data associated with it.
        public read(fileName:string):void{
            if(this.doesFileExist(fileName)) {
                //Get the key
                var key = this.findFileKey(fileName);
                var string = "";
                if (this.doesKeyHaveData(key) == false) {
                    _success = false;
                }
                else {
                    //Loop and check meta for keys.
                    while (this.doesKeyHaveData(key) == true) {
                        //Grab the next key
                        key = sessionStorage.getItem(key).substr(1, 3);
                        //Add the data to the string
                        string = string + this.hexToString(sessionStorage.getItem(key));
                    }
                    //Display the string
                    _Console.putText(string);
                    _Console.advanceLine();
                    _success = true;
                }
            }
            else{
                _success = false;
            }
        }

        public write(fileName:string, data:string):void {
            if (this.doesFileExist(fileName)) {
                //get the key of the file so we can change the meta
                var fileKey = this.findFileKey(fileName);
                //Get the next free data block
                var dataKey = this.nextFreeDataBlock();
                //Set up the data
                var data1 = "1---" + this.stringToHex(data);
                while (data1.length < 64) {
                    data1 = data1 + "0";
                }
                //Fix data in the fileKey
                var currentKey = fileKey;
                while (this.doesKeyHaveData(currentKey) == true) {
                    currentKey = sessionStorage.getItem(currentKey).substr(1, 3);
                }
                if (this.doesKeyHaveData(currentKey) == false) {
                    var newData = sessionStorage.getItem(currentKey).replace("1---", "1" + dataKey);
                    sessionStorage.setItem(currentKey, newData);
                }
                if (data1.length > 64) {
                    var dataHalf1 = "1---" + data1.substr(4, 60);
                    var dataHalf2 = data1.substr(64, (data1.length - 60));
                    sessionStorage.setItem(dataKey, dataHalf1);
                    _success = true;
                    this.write(fileName, this.hexToString(dataHalf2));
                }
                else {
                    //Place data in storage
                    sessionStorage.setItem(dataKey, data1);
                    _success = true;
                }
            }
        }

        //Will delete the file that is specified
        public delete(fileName:string):void{
            //Get the key of the file name
            var key = this.findFileKey(fileName);
            //If no file exists failure
            if(key == "000"){
                _success = false;
            }
            //If the key exists delete the file and success
            else{
                _success = true;
                this.deleteRecursive(key);
                _FileSystemDisplay.updateDisplay();
            }

        }

        public deleteRecursive(key:string){
            if(this.doesKeyHaveData(key)){
                this.deleteRecursive(sessionStorage.getItem(key).substr(1,3))
            }
            sessionStorage.setItem(key, "0000000000000000000000000000000000000000000000000000000000000000")
        }

        //Will read the file and data associated with it in Hex.
        public readHex(fileName:string){
            //Get the key
            var key = this.findFileKey(fileName);
            var string = "";
            //Loop and check meta for keys.
            while (this.doesKeyHaveData(key) == true) {
                //Grab the next key
                key = sessionStorage.getItem(key).substr(1, 3);
                //Add the data to the string
                string = string + sessionStorage.getItem(key).substr(4,60);
            }
            //Return the string
            while(string.length < 255){
                string=string+"0";
            }
            return string.substr(0,255);
        }

        //Used to put a program in hex in storage
        public writeHex(fileName:string, data:string):void {
            //console.log(data);
            if (this.doesFileExist(fileName)) {
                //get the key of the file so we can change the meta
                var fileKey = this.findFileKey(fileName);
                //Get the next free data block
                var dataKey = this.nextFreeDataBlock();
                //Set up the data
                var data1 = "1---" + data;
                data1 = data1.replace(" ", "");
                for(var x = 0; data1.length > x; x++) {
                    data1 = data1.replace(",", "");
                }
                //data1 = data1.replace(/0+$/,"");
                //console.log(data1);
                while (data1.length < 64) {
                    data1 = data1 + "0";
                }
                //Fix data in the fileKey
                var currentKey = fileKey;
                while (this.doesKeyHaveData(currentKey) == true) {
                    currentKey = sessionStorage.getItem(currentKey).substr(1, 3);
                }
                if (this.doesKeyHaveData(currentKey) == false) {
                    var newData = sessionStorage.getItem(currentKey).replace("1---", "1" + dataKey);
                    sessionStorage.setItem(currentKey, newData);
                }
                if (data.length > 64) {
                    var dataHalf1 = "1---" + data1.substr(4, 60);
                    var dataHalf2 = data1.substr(64, (data.length - 60));
                    sessionStorage.setItem(dataKey, dataHalf1);
                    this.writeHex(fileName, dataHalf2);
                }
                else {
                    //Place data in storage
                    sessionStorage.setItem(dataKey, data1);
                }
            }
        }

        //will tell us if the file contains data or not false = no data true = data
        public doesKeyHaveData(key:string){
                var meta = sessionStorage.getItem(key).substr(0, 4);
                //Check if meta has an address in it
                if (meta == "1---") {
                    //file has no data
                    return false
                }
                else{
                    //file has data
                    return true;
                }
        }

        //Will let us know if a file name is already in use true = inuse false = unused
        public doesFileExist(fileName:string){
            var done = false;
            //Loop through and find the file in 000 - 077
            for(var x = 0; x <=0; x++) {
                for (var y = 0; y < _sectors; y++) {
                    for (var z = 0; z < _blocks; z++) {
                        var key = x + "" + y + "" + z;
                        if(key != "000") {
                            //Make sure meta is in use
                            var meta = sessionStorage.getItem(key).substr(0, 1);
                            if(meta == "1"){
                                var compare = this.getFileName(key);
                                var fileName1 = ""+fileName;
                                //Make sure file names match
                                if(compare === fileName1) {
                                    return true;
                                    done = true;
                                    break;
                                }
                            }
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
            if(!done){
                return false;
            }
        }

        //Will get the file name from the key provided
        public getFileName(key){
            //Get the file name.
            var fileName = sessionStorage.getItem(key);
            fileName = fileName.replace(/0+$/,"");
            if(fileName.length % 2){
                fileName = fileName + 0;
            }
            //return the file name
            return this.hexToString(fileName);
        }

        //Will find the key of a specified file
        public findFileKey(fileName:string){
            var done = false;
            //Loop through and find the file in 000 - 077
            for(var x = 0; x <=0; x++) {
                for (var y = 0; y < _sectors; y++) {
                    for (var z = 0; z < _blocks; z++) {
                        var key = x + "" + y + "" + z;
                        if(key != "000") {
                            //Make sure meta is in use
                            var meta = sessionStorage.getItem(key).substr(0, 1);
                            if(meta == "1"){
                                var compare = this.getFileName(key);
                                var fileName1 = ""+fileName;
                                //Make sure file names match
                                if(compare === fileName1) {
                                    return key;
                                    done = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if(!done){
                return "000";
            }
        }

        //Return the keys of all files on disk
        public filesOnDisk(){
            var done = false;
            var keysArray = new Array();
            //Loop through and find the file in 000 - 077
            for(var x = 0; x <=0; x++) {
                for (var y = 0; y < _sectors; y++) {
                    for (var z = 0; z < _blocks; z++) {
                        var key = x + "" + y + "" + z;
                        if (key != "000") {
                            //Make sure meta is in use
                            var meta = sessionStorage.getItem(key).substr(0, 1);
                            if(meta == "1") {
                                keysArray.push(key);
                            }
                        }
                    }
                }
            }
            //console.log(keysArray);
            return keysArray;
        }

        //Will find the next free block in the directory
        public nextFreeDirectoryBlock(){
            //Loop though and find the next open block and return the key
            for(var x = 0; x <=0; x++) {
                for (var y = 0; y < _sectors; y++) {
                    for (var z = 0; z < _blocks; z++) {
                        var key = x + "" + y + "" + z;
                        if (key != "000") {
                            //Make sure meta is not in use
                            var meta = sessionStorage.getItem(key).substr(0, 1);
                            if (meta == "0") {
                                return key;
                                break;
                            }
                        }
                    }
                }
            }
        }

        //Will find the next free block for data
        public nextFreeDataBlock(){
            //Loop though and find the next open block and return the key
            for(var x = 1; x <4; x++) {
                for (var y = 0; y < _sectors; y++) {
                    for (var z = 0; z < _blocks; z++) {
                        var key = x + "" + y + "" + z;
                        //Make sure meta is not in use
                        var meta = sessionStorage.getItem(key).substr(0, 1);
                        if (meta == "0") {
                            return key;
                            break;
                        }
                    }
                }
            }
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

        //Will take hex and make it a string
        public hexToString(hexStr : string){
            var newString = "";
            var hexStr1 = ""+hexStr;
            //Loop through the hex and change it to string
            for(var x = 4; hexStr1.length > x; x = x+2){
                if(hexStr1.length > x+1) {
                    var piece1 = String.fromCharCode(_MemoryManager.hexToDec(hexStr1.substr(x, 2)));
                    newString = newString + piece1;
                }
            }
            //return the string
            return newString;
        }

    }
}