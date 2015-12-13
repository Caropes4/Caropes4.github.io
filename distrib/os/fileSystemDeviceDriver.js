var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by CharlieRopes on 12/11/15.
 */
var TSOS;
(function (TSOS) {
    var FileSystemDeviceDriver = (function (_super) {
        __extends(FileSystemDeviceDriver, _super);
        function FileSystemDeviceDriver() {
            // Override the base method pointers.
            _super.call(this, this.krnFileSystemDeviceDriverEntry);
        }
        FileSystemDeviceDriver.prototype.krnFileSystemDeviceDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        //Will format
        FileSystemDeviceDriver.prototype.format = function () {
            //Clear the session storage
            sessionStorage.clear();
            //For loops to initialize data in sessionStorage
            for (var x = 0; x < _tracks; x++) {
                for (var y = 0; y < _sectors; y++) {
                    for (var z = 0; z < _blocks; z++) {
                        var key = x + "" + y + "" + z;
                        sessionStorage.setItem(key, "0000000000000000000000000000000000000000000000000000000000000000");
                    }
                }
            }
        };
        //Will create a file
        FileSystemDeviceDriver.prototype.create = function (fileName) {
            //Make sure file does not already exist
            if (this.doesFileExist(fileName) == false) {
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
        };
        //Will read the file and display the filename and data associated with it.
        FileSystemDeviceDriver.prototype.read = function (fileName) {
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
        };
        FileSystemDeviceDriver.prototype.write = function (fileName, data) {
            if (this.doesFileExist(fileName)) {
                //get the key of the file so we can change the meta
                var fileKey = this.findFileKey(fileName);
                //Get the next free data block
                var dataKey = this.nextFreeDataBlock();
                //if(this.stringToHex(data).length > 60){
                //}
                //Set up the data
                var data = "1---" + this.stringToHex(data);
                while (data.length < 64) {
                    data = data + "0";
                }
                //Place data in storage
                sessionStorage.setItem(dataKey, data);
                //Fix data in the fileKey
                var currentKey = fileKey;
                while (this.doesKeyHaveData(currentKey) == true) {
                    currentKey = sessionStorage.getItem(currentKey).substr(1, 3);
                }
                if (!this.doesKeyHaveData(currentKey)) {
                    var newData = sessionStorage.getItem(currentKey).replace("1---", "1" + dataKey);
                    sessionStorage.setItem(currentKey, newData);
                    _success = true;
                }
            }
        };
        //Will delete the file that is specified
        FileSystemDeviceDriver.prototype.delete = function (fileName) {
            //Get the key of the file name
            var key = this.findFileKey(fileName);
            //If no file exists failure
            if (key == "000") {
                _success = false;
            }
            else {
                _success = true;
                this.deleteRecursive(key);
                _FileSystemDisplay.updateDisplay();
            }
        };
        FileSystemDeviceDriver.prototype.deleteRecursive = function (key) {
            if (this.doesKeyHaveData(key)) {
                this.deleteRecursive(sessionStorage.getItem(key).substr(1, 3));
            }
            sessionStorage.setItem(key, "0000000000000000000000000000000000000000000000000000000000000000");
        };
        //will tell us if the file contains data or not false = no data true = data
        FileSystemDeviceDriver.prototype.doesKeyHaveData = function (key) {
            var meta = sessionStorage.getItem(key).substr(0, 4);
            //Check if meta has an address in it
            if (meta == "1---") {
                //file has no data
                return false;
            }
            else {
                //file has data
                return true;
            }
        };
        //Will let us know if a file name is already in use true = inuse false = unused
        FileSystemDeviceDriver.prototype.doesFileExist = function (fileName) {
            var done = false;
            //Loop through and find the file in 000 - 077
            for (var x = 0; x <= 0; x++) {
                for (var y = 0; y < _sectors; y++) {
                    for (var z = 0; z < _blocks; z++) {
                        var key = x + "" + y + "" + z;
                        if (key != "000") {
                            //Make sure meta is in use
                            var meta = sessionStorage.getItem(key).substr(0, 1);
                            if (meta == "1") {
                                var compare = this.getFileName(key);
                                var fileName1 = "" + fileName;
                                //Make sure file names match
                                if (compare === fileName1) {
                                    return true;
                                    done = true;
                                    break;
                                }
                            }
                        }
                    }
                    //If the file was created break out of the loop
                    if (done) {
                        break;
                    }
                }
                //If the file was created break out of the loop
                if (done) {
                    break;
                }
            }
            if (!done) {
                return false;
            }
        };
        //Will get the file name from the key provided
        FileSystemDeviceDriver.prototype.getFileName = function (key) {
            //Get the file name.
            var fileName = sessionStorage.getItem(key);
            fileName = fileName.replace(/0+$/, "");
            if (fileName.length % 2) {
                fileName = fileName + 0;
            }
            //return the file name
            return this.hexToString(fileName);
        };
        //Will find the key of a specified file
        FileSystemDeviceDriver.prototype.findFileKey = function (fileName) {
            var done = false;
            //Loop through and find the file in 000 - 077
            for (var x = 0; x <= 0; x++) {
                for (var y = 0; y < _sectors; y++) {
                    for (var z = 0; z < _blocks; z++) {
                        var key = x + "" + y + "" + z;
                        if (key != "000") {
                            //Make sure meta is in use
                            var meta = sessionStorage.getItem(key).substr(0, 1);
                            if (meta == "1") {
                                var compare = this.getFileName(key);
                                var fileName1 = "" + fileName;
                                //Make sure file names match
                                if (compare === fileName1) {
                                    return key;
                                    done = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if (!done) {
                return "000";
            }
        };
        //Return the keys of all files on disk
        FileSystemDeviceDriver.prototype.filesOnDisk = function () {
            var done = false;
            var keysArray = new Array();
            //Loop through and find the file in 000 - 077
            for (var x = 0; x <= 0; x++) {
                for (var y = 0; y < _sectors; y++) {
                    for (var z = 0; z < _blocks; z++) {
                        var key = x + "" + y + "" + z;
                        if (key != "000") {
                            //Make sure meta is in use
                            var meta = sessionStorage.getItem(key).substr(0, 1);
                            if (meta == "1") {
                                keysArray.push(key);
                            }
                        }
                    }
                }
            }
            console.log(keysArray);
            return keysArray;
        };
        //Will find the next free block in the directory
        FileSystemDeviceDriver.prototype.nextFreeDirectoryBlock = function () {
            //Loop though and find the next open block and return the key
            for (var x = 0; x <= 0; x++) {
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
        };
        //Will find the next free block for data
        FileSystemDeviceDriver.prototype.nextFreeDataBlock = function () {
            //Loop though and find the next open block and return the key
            for (var x = 1; x < 4; x++) {
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
        };
        //Used to put a string into hex
        FileSystemDeviceDriver.prototype.stringToHex = function (str) {
            var newString = "";
            var str1 = "" + str;
            //Loop through the string and change it to hex
            for (var x = 0; str1.length > x; x++) {
                var piece = str1.substr(x);
                newString = newString + piece.charCodeAt(0).toString(16).toUpperCase();
            }
            return newString;
        };
        //Will take hex and make it a string
        FileSystemDeviceDriver.prototype.hexToString = function (hexStr) {
            var newString = "";
            var hexStr1 = "" + hexStr;
            //Loop through the hex and change it to string
            for (var x = 4; hexStr1.length > x; x = x + 2) {
                if (hexStr1.length > x + 1) {
                    var piece1 = String.fromCharCode(_MemoryManager.hexToDec(hexStr1.substr(x, 2)));
                    newString = newString + piece1;
                }
            }
            //return the string
            return newString;
        };
        return FileSystemDeviceDriver;
    })(TSOS.DeviceDriver);
    TSOS.FileSystemDeviceDriver = FileSystemDeviceDriver;
})(TSOS || (TSOS = {}));
