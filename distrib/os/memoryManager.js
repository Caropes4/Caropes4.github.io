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
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
