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
        //Read from memory pass the program counter
        Memory.prototype.read = function (indexLocation) {
            return _currentMemory[indexLocation];
        };
        //Write the user input to memory if it is Valid
        Memory.prototype.write = function () {
            //Clear memory
            this.clearMemory();
            var code = _loadedCode;
            var mem = _currentMemory;
            //Code location
            var x = 0;
            //Array location
            var y = 0;
            //Loop through the instructions and place them in memory
            while (x < _loadedCode.length && y < 256) {
                _currentMemory[y] = _loadedCode.substring(x, x + 2);
                x = x + 2;
                y = y + 1;
            }
        };
        //Clear the memory for a new program
        Memory.prototype.clearMemory = function () {
            this.memory = [];
            for (var x = 0; x < 256; x++) {
                _currentMemory[x] = "00";
            }
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
