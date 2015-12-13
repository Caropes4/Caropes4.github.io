/**
 * Created by CharlieRopes on 12/11/15.
 */
var TSOS;
(function (TSOS) {
    var FileSystemDisplay = (function () {
        function FileSystemDisplay(table) {
            this.table = table;
        }
        FileSystemDisplay.prototype.init = function () {
            this.table = _fileSystemTableDisplay;
        };
        FileSystemDisplay.prototype.initRows = function () {
            var row = _fileSystemTableDisplay.insertRow(0);
            row.insertCell(0).innerHTML = "T:S:B";
            row.insertCell(1).innerHTML = "DATA";
            var rowIndex = 1;
            //Will generate the rows and cells to display memory
            for (var x = 0; x < 4; x++) {
                for (var y = 0; y < 8; y++) {
                    for (var z = 0; z < 8; z++) {
                        //Inserts a row
                        var row = _fileSystemTableDisplay.insertRow(rowIndex);
                        //Will insert the cells in the row. First cell is a label.
                        row.insertCell(0).innerHTML = x + ":" + y + ":" + z;
                        row.insertCell(1).innerHTML = "0000000000000000000000000000000000000000000000000000000000000000";
                        rowIndex = rowIndex + 1;
                    }
                }
            }
        };
        FileSystemDisplay.prototype.updateDisplay = function () {
            var rowIndex = 1;
            //Loop through and update the Display
            for (var x = 0; x < _tracks; x++) {
                for (var y = 0; y < _sectors; y++) {
                    for (var z = 0; z < _blocks; z++) {
                        var row = _fileSystemTableDisplay.rows[rowIndex];
                        var key = x + "" + y + "" + z;
                        //Remove and update the row
                        row.deleteCell(1);
                        row.insertCell(1).innerHTML = sessionStorage.getItem(key);
                        rowIndex = rowIndex + 1;
                    }
                }
            }
        };
        return FileSystemDisplay;
    })();
    TSOS.FileSystemDisplay = FileSystemDisplay;
})(TSOS || (TSOS = {}));
