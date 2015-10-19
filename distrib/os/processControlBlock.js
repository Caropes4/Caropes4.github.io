/**
 * Created by CharlieRopes on 10/18/15.
 */
var TSOS;
(function (TSOS) {
    //Process Control Blocks
    var PCB = (function () {
        function PCB() {
            this.pid = _nextProcessID;
            this.processState = "new";
        }
        PCB.prototype.getPID = function () {
            return this.pid;
        };
        //Set the process state
        PCB.prototype.setProcessState = function (state) {
            this.processState = state;
        };
        //Get the process state
        PCB.prototype.getProcessState = function () {
            return this.processState;
        };
        //Set the set program counter
        PCB.prototype.setProgramCounter = function (counter) {
            this.programCounter = counter;
        };
        //Get the program counter
        PCB.prototype.getProgramCounter = function () {
            return this.programCounter;
        };
        //Set the Accumulator
        PCB.prototype.setAcc = function (accumulator) {
            this.acc = accumulator;
        };
        //Get the Accumulator
        PCB.prototype.getAcc = function () {
            return this.acc;
        };
        //Set the X register
        PCB.prototype.setXReg = function (reg) {
            this.xReg = reg;
        };
        //Get the X register
        PCB.prototype.getXReg = function () {
            return this.xReg;
        };
        //Set the Y register
        PCB.prototype.setYReg = function (reg) {
            this.yReg = reg;
        };
        //Get the Y register
        PCB.prototype.getYReg = function () {
            return this.yReg;
        };
        //Set the Z Flag
        PCB.prototype.setZFlag = function (reg) {
            this.zFlag = reg;
        };
        //Get the Z Flag
        PCB.prototype.getZFlag = function () {
            return this.zFlag;
        };
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
