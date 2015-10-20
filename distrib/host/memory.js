/**
 * Created by CharlieRopes on 10/18/15.
 */
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(memory) {
            this.memory = memory;
        }
        Memory.prototype.init = function () {
            this.memory = [];
            for (var x = 0; x < 256; x++) {
                this.memory[x] = "00";
            }
            _currentMemory = this.memory;
        };
        //public read(): void{}
        Memory.prototype.write = function () {
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
