/**
 * Created by CharlieRopes on 10/18/15.
 */
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
        }
        MemoryManager.prototype.init = function () {
            this.memory = _currentMemory;
        };
        //Check to see if a program is already in memory.
        MemoryManager.prototype.memoryCheck = function () {
            if (_memoryEmpty != true) {
                _MemoryCheckStatus = "A program is currently loaded into memory.";
            }
            else {
                _Memory.write();
                _MemoryCheckStatus = "Program successfully loaded.";
            }
        };
        //Return the selected byte in memory
        MemoryManager.prototype.getByte = function (x) {
            return _currentMemory[_CPU.PC + x];
        };
        //Change a number from hex to decimal and return it.
        MemoryManager.prototype.hexToDec = function (hexNumber) {
            return parseInt(hexNumber, 16);
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
