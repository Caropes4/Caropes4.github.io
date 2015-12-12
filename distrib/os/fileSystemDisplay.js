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
            var row = _fileSystemTableDisplay.insertRow(x);
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
            var memoryLocation = 0;
            for (var x = 0; x < 96; x++) {
                //Will update the rows and cells to display memory
                var row = _fileSystemTableDisplay.rows[x];
                //Will update the cells in the row by removing the old ones and adding the new ones. Traces where it is in memory by adding to the memory location var.
                row.deleteCell(1);
                row.insertCell(1).innerHTML = _currentMemory[memoryLocation];
                memoryLocation = memoryLocation + 1;
                row.deleteCell(2);
                row.insertCell(2).innerHTML = _currentMemory[memoryLocation];
                memoryLocation = memoryLocation + 1;
            }
        };
        return FileSystemDisplay;
    })();
    TSOS.FileSystemDisplay = FileSystemDisplay;
})(TSOS || (TSOS = {}));
