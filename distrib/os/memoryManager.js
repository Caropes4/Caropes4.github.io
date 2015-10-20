/**
 * Created by CharlieRopes on 10/18/15.
 */
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            //public memory = _currentMemory;
            this.PCB = _currentPCB;
        }
        // public
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
        MemoryManager.prototype.getInstruction = function (indexLocation) {
            return _currentMemory[indexLocation];
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
