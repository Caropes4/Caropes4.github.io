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
            //Will see if there is a program loaded into memory ar block 1 and write one in if there is not.
            if (_block1Empty == true) {
                //set the base and limit.
                _currentBase = _base1;
                _currentLimit = _limit1;
                //update that memory is currently occupied
                _block1Empty = false;
                _Memory.write();
                _MemoryCheckStatus = "Program successfully loaded.";
            }
            else if (_block2Empty == true) {
                //set the base and limit.
                _currentBase = _base2;
                _currentLimit = _limit2;
                //update that memory is currently occupied
                _block2Empty = false;
                _Memory.write();
                _MemoryCheckStatus = "Program successfully loaded.";
            }
            else if (_block3Empty == true) {
                //set the base and limit.
                _currentBase = _base3;
                _currentLimit = _limit3;
                //update that memory is currently occupied
                _block3Empty = false;
                _Memory.write();
                _MemoryCheckStatus = "Program successfully loaded.";
            }
        };
        //Will update the memory partitions to say if they are free or occupied
        MemoryManager.prototype.updateMemoryPartitionStatus = function () {
            //Figure out what the memory partition was and mark it as empty
            if (_currentPCB.base == _base1) {
                _block1Empty = true;
            }
            else if (_currentPCB.base == _base2) {
                _block2Empty = true;
            }
            else if (_currentPCB.base == _base3) {
                _block3Empty = true;
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
        //Will get the memory segment bassed on the base and limit provided
        MemoryManager.prototype.getMemorySeg = function (base, limit) {
            var array = new Array();
            console.log(_currentMemory.slice(base, limit));
            return _currentMemory.slice(base, limit);
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
