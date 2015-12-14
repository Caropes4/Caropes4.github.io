/**
 * Created by CharlieRopes on 12/14/15.
 */
module TSOS {

    export class ReadyQueueDisplay {

        constructor(public table:HTMLTableElement) {
        }

        public init():void {
            this.table = _readyQueueTableDisplay;
        }

/*
        public initRows():void {
            var row = <HTMLTableRowElement> _readyQueueTableDisplay.insertRow(0);
            row.insertCell(0).innerHTML = "PID";
            row.insertCell(1).innerHTML = "State";
            row.insertCell(2).innerHTML = "PC";
            row.insertCell(3).innerHTML = "Acc";
            row.insertCell(4).innerHTML = "XReg";
            row.insertCell(5).innerHTML = "YReg";
            row.insertCell(6).innerHTML = "ZFlag";
            row.insertCell(7).innerHTML = "Location";
        }

        public updateDisplay():void {
            this.clearRows();
            var rowIndex = 1;
            //Loop through and update the Display
            for(var x = 1; x < _ReadyQueue.getSize()+1; x++) {
                var row = <HTMLTableRowElement> _readyQueueTableDisplay.insertRow(rowIndex);
                _PCBAtLocation = _ReadyQueue.getPCB(x-1);
                //Will update the cells in the row by removing the old ones and adding the new ones.
                row.insertCell(0).innerHTML = "" + _PCBAtLocation.pid;
                row.insertCell(1).innerHTML = "" + _PCBAtLocation.processState;
                row.insertCell(2).innerHTML = "" + _PCBAtLocation.programCounter;
                row.insertCell(3).innerHTML = "" + _PCBAtLocation.acc;
                row.insertCell(4).innerHTML = "" + _PCBAtLocation.xReg;
                row.insertCell(5).innerHTML = "" + _PCBAtLocation.yReg;
                row.insertCell(6).innerHTML = "" + _PCBAtLocation.zFlag;
                row.insertCell(7).innerHTML = "" + _PCBAtLocation.loc;
                rowIndex = rowIndex +1;
            }
        }

        public clearRows() {
            var rowIndex = _readyQueueTableDisplay.rows.length;
            for (var x = 1; rowIndex > x; x++) {
                _readyQueueTableDisplay.deleteRow(x);
            }
        }
        */
    }
}
