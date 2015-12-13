/**
 * Created by CharlieRopes on 12/11/15.
 */
module TSOS {

    export class FileSystemDisplay {

        constructor(public table:HTMLTableElement) {
        }

        public init():void {
            this.table = _fileSystemTableDisplay;
        }


        public initRows(): void {
            var row = <HTMLTableRowElement> _fileSystemTableDisplay.insertRow(0);
            row.insertCell(0).innerHTML = "T:S:B";
            row.insertCell(1).innerHTML = "DATA";
            var rowIndex = 1;
            //Will generate the rows and cells to display memory
            for (var x = 0; x < 4; x++) {
                for(var y = 0; y < 8; y++){
                    for(var z = 0; z < 8; z++){
                        //Inserts a row
                        var row = <HTMLTableRowElement> _fileSystemTableDisplay.insertRow(rowIndex);
                        //Will insert the cells in the row. First cell is a label.
                        row.insertCell(0).innerHTML = x+":"+y+":"+z ;
                        row.insertCell(1).innerHTML = "0000000000000000000000000000000000000000000000000000000000000000";
                        rowIndex = rowIndex+1;
                        //this.updateDisplay();
                    }
                }
            }
        }

        public updateDisplay():void {
            var rowIndex = 1;
            //Loop through and update the Display
            for(var x = 0; x < _krnFileSystemDeviceDriver.tracks; x++){
                for(var y = 0; y < _krnFileSystemDeviceDriver.sectors; y++){
                    for(var z = 0; z < _krnFileSystemDeviceDriver.blocks; z++){
                        var row = <HTMLTableRowElement> _fileSystemTableDisplay.rows[rowIndex];
                        var key = x+""+y+""+z;
                        //Remove and update the row
                        row.deleteCell(1);
                        row.insertCell(1).innerHTML = sessionStorage.getItem(key);
                        rowIndex = rowIndex + 1;
                    }
                }
            }
        }
    }
}