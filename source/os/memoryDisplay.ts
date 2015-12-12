/**
 * Created by CharlieRopes on 10/20/15.
 */
module TSOS {

    export class MemoryDisplay {

        constructor(public table : HTMLTableElement) {
        }

        public init():void {
            this.table = _memoryTableDisplay;
        }

        public initRows(): void {
            var rowIndex = 0;
            //Will generate the rows and cells to display memory
            for (var x = 0; x < 96; x++) {
                //Inserts a row
                var row = <HTMLTableRowElement> _memoryTableDisplay.insertRow(x);
                //Will insert the cells in the row. First cell is a label.
                row.insertCell(0).innerHTML = "0x" + rowIndex.toString(16);
                row.insertCell(1).innerHTML = "00";
                row.insertCell(2).innerHTML = "00";
                row.insertCell(3).innerHTML = "00";
                row.insertCell(4).innerHTML = "00";
                row.insertCell(5).innerHTML = "00";
                row.insertCell(6).innerHTML = "00";
                row.insertCell(7).innerHTML = "00";
                row.insertCell(8).innerHTML = "00";

                rowIndex= rowIndex + 8;
            }
        }

        public updateDisplay():void {
            var memoryLocation = 0;
            for (var x = 0; x < 96; x++) {
                //Will update the rows and cells to display memory
                var row = <HTMLTableRowElement> _memoryTableDisplay.rows[x];
                //Will update the cells in the row by removing the old ones and adding the new ones. Traces where it is in memory by adding to the memory location var.
                row.deleteCell(1);
                row.insertCell(1).innerHTML = _currentMemory[memoryLocation];
                memoryLocation = memoryLocation + 1;
                row.deleteCell(2);
                row.insertCell(2).innerHTML = _currentMemory[memoryLocation];
                memoryLocation = memoryLocation + 1;
                row.deleteCell(3);
                row.insertCell(3).innerHTML = _currentMemory[memoryLocation];
                memoryLocation = memoryLocation + 1;
                row.deleteCell(4);
                row.insertCell(4).innerHTML = _currentMemory[memoryLocation];
                memoryLocation = memoryLocation + 1;
                row.deleteCell(5);
                row.insertCell(5).innerHTML = _currentMemory[memoryLocation];
                memoryLocation = memoryLocation + 1;
                row.deleteCell(6);
                row.insertCell(6).innerHTML = _currentMemory[memoryLocation];
                memoryLocation = memoryLocation + 1;
                row.deleteCell(7);
                row.insertCell(7).innerHTML = _currentMemory[memoryLocation];
                memoryLocation = memoryLocation + 1;
                row.deleteCell(8);
                row.insertCell(8).innerHTML = _currentMemory[memoryLocation];
                memoryLocation = memoryLocation + 1;
            }
        }
    }
}