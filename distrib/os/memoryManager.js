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
        //Cheack to see if a program is already in memory.
        MemoryManager.prototype.memoryCheck = function () {
            var x = 0;
            while (x < 256) {
                if (_currentMemory[x] == "00") {
                    x = x + 1;
                }
                else {
                    _MemoryCheckStatus = "A program is currently loaded into memory.";
                    break;
                }
            }
            _Memory.write();
            _MemoryCheckStatus = "Program successfully loaded.";
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
