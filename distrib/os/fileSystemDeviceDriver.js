/**
 * Created by CharlieRopes on 12/11/15.
 */
var TSOS;
(function (TSOS) {
    var FileSystemDeviceDriver = (function () {
        function FileSystemDeviceDriver() {
        }
        FileSystemDeviceDriver.prototype.init = function () {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
            //Clear the session storage
            sessionStorage.clear();
            //For loops to initialize data in sessionStorage
            for (var x = 0; x < this.tracks; x++) {
                for (var y = 0; y < this.sectors; y++) {
                    for (var z = 0; z < this.blocks; z++) {
                        var key = x + "" + y + "" + z;
                        sessionStorage.setItem(key, "hi0000000000000000000000000000000000000000000000000000000000000000");
                    }
                }
            }
        };
        return FileSystemDeviceDriver;
    })();
    TSOS.FileSystemDeviceDriver = FileSystemDeviceDriver;
})(TSOS || (TSOS = {}));
