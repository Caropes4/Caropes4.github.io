/**
 * Created by CharlieRopes on 10/18/15.
 */
var TSOS;
(function (TSOS) {
    //Process Control Blocks
    var PCB = (function () {
        //Do I need? CPU scheduling information, Memory-management information, Includes protection, Accounting information, I/O status information
        function PCB(
            //Process ID
            pid, 
            //Process State
            processState, 
            //Program Counter
            programCounter, 
            //CPU Registers
            acc, xReg, yReg, zFlag, isExecuting, 
            // Base and limit to keep track of where the code for the pcb is stored in memory
            base, limit) {
            if (pid === void 0) { pid = 0; }
            if (processState === void 0) { processState = ""; }
            if (programCounter === void 0) { programCounter = 0; }
            if (acc === void 0) { acc = 0; }
            if (xReg === void 0) { xReg = 0; }
            if (yReg === void 0) { yReg = 0; }
            if (zFlag === void 0) { zFlag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (base === void 0) { base = 0; }
            if (limit === void 0) { limit = 0; }
            this.pid = pid;
            this.processState = processState;
            this.programCounter = programCounter;
            this.acc = acc;
            this.xReg = xReg;
            this.yReg = yReg;
            this.zFlag = zFlag;
            this.isExecuting = isExecuting;
            this.base = base;
            this.limit = limit;
        }
        PCB.prototype.init = function () {
            this.pid = _nextProcessID;
            this.processState = "new";
            this.programCounter = 0;
            this.acc = 0;
            this.xReg = 0;
            this.yReg = 0;
            this.zFlag = 0;
            this.isExecuting = false;
            this.base = 0;
            this.limit = 0;
        };
        PCB.prototype.getPID = function () {
            return this.pid;
        };
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
