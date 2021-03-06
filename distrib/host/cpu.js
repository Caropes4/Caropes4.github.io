///<reference path="../globals.ts" />
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        //Load the accumulator with a constant
        Cpu.prototype.loadAccConst = function () {
            //Load the constant into the Accumulator
            this.Acc = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Add 2 to the program counter so we know where we are in memory.
            this.PC = this.PC + 2;
            //console.log(_CPU.PC);
            //Test _Console.putText(""+_currentMemory[this.PC] +  " " + this.Acc);
            //_AccDisplay.value.
        };
        //Load the accumulator from memory
        Cpu.prototype.loadAccMem = function () {
            //Gets the next Byte
            var first = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Gets the second byte
            var second = _MemoryManager.hexToDec(_MemoryManager.getByte(2));
            //Translate into decimal
            var index = first + second + _currentPCB.base;
            //Put into accumulator
            this.Acc = _MemoryManager.hexToDec(_currentMemory[index]);
            //Add 3 because we used 2 bytes
            this.PC = this.PC + 3;
            //console.log(_CPU.PC);
            //Test _Console.putText(""+_currentMemory[this.PC] +  " " + this.Acc);
        };
        //Store the accumulator in memory
        Cpu.prototype.storeAccMem = function () {
            //Gets the next Byte
            var first = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Gets the second byte
            var second = _MemoryManager.hexToDec(_MemoryManager.getByte(2));
            //Translate into decimal
            var index = first + second + _currentPCB.base;
            //check to make sure that it doesnt store data outside its partition.
            if (index > _currentPCB.limit - 1) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MEMORY_OUT_OF_BOUNDS_IRQ, false));
            }
            else {
                if (this.Acc.toString(16).length < 2) {
                    _currentMemory[index] = "0" + this.Acc.toString(16);
                    this.PC = this.PC + 3;
                }
                else {
                    //Put the accumulator in hex and store it in the specified location in memory.
                    _currentMemory[index] = this.Acc.toString(16);
                    //Add 3 because we used 2 bytes
                    this.PC = this.PC + 3;
                }
            }
        };
        //Add with carry
        Cpu.prototype.addCarry = function () {
            //Gets the next Byte
            var first = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Gets the second byte
            var second = _MemoryManager.hexToDec(_MemoryManager.getByte(2));
            //Translate into decimal
            var index = first + second + _currentPCB.base;
            //add the value at the index to the accumulator and store it in the accumulator.
            this.Acc = this.Acc + _MemoryManager.hexToDec(_currentMemory[index]);
            //Add 3 because we used 2 bytes
            this.PC = this.PC + 3;
            //console.log(_CPU.PC);
            //Test _Console.putText(""+_currentMemory[index] +  " " + this.Acc);
        };
        //Load the X register with a constant
        Cpu.prototype.loadXRegConst = function () {
            //Load the constant into the X register
            this.Xreg = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Add 2 to the program counter so we know where we are in memory.
            this.PC = this.PC + 2;
            //console.log(_CPU.PC);
        };
        //Load the X register from memory
        Cpu.prototype.loadXRegMem = function () {
            //Gets the next Byte
            var first = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Gets the second byte
            var second = _MemoryManager.hexToDec(_MemoryManager.getByte(2));
            //Translate into decimal
            var index = first + second + _currentPCB.base;
            //Put into X register
            this.Xreg = _MemoryManager.hexToDec(_currentMemory[index]);
            //Add 3 because we used 2 bytes
            this.PC = this.PC + 3;
            //console.log(_CPU.PC);
        };
        //Load the Y register with a constant
        Cpu.prototype.loadYRegConst = function () {
            //Load the constant into the Y register
            this.Yreg = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Add 2 to the program counter so we know where we are in memory.
            this.PC = this.PC + 2;
            //console.log(_CPU.PC);
        };
        //Load the Y register from memory
        Cpu.prototype.loadYRegMem = function () {
            //Gets the next Byte
            var first = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Gets the second byte
            var second = _MemoryManager.hexToDec(_MemoryManager.getByte(2));
            //Translate into decimal
            var index = first + second + _currentPCB.base;
            //Put into Y register
            this.Yreg = _MemoryManager.hexToDec(_currentMemory[index]);
            //Add 3 because we used 2 bytes
            this.PC = this.PC + 3;
            //console.log(_CPU.PC);
        };
        //No Operation
        Cpu.prototype.noOper = function () {
            //There is no operation here so move on
            this.PC = this.PC + 1;
            //console.log(_CPU.PC);
        };
        //Break (which is really a system call)
        Cpu.prototype.breakOper = function () {
            this.PC = this.PC + 1;
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(BREAK_OPERATION_IRQ, false));
            //console.log(_CPU.PC);
            //console.log(_CPU.Yreg);
        };
        //Compare a byte in memory to the X reg Sets the Z (zero) flag if equal
        Cpu.prototype.compareXReg = function () {
            //Gets the next Byte
            var first = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Gets the second byte
            var second = _MemoryManager.hexToDec(_MemoryManager.getByte(2));
            //Translate into decimal
            var index = first + second + _currentPCB.base;
            //If value in Xreg == value at memory Zflag = 1
            if (this.Xreg == _MemoryManager.hexToDec(_currentMemory[index])) {
                this.Zflag = 1;
            }
            else {
                this.Zflag = 0;
            }
            //Add 3 because we used 2 bytes
            this.PC = this.PC + 3;
            //console.log(_CPU.PC);
            //Test _Console.putText(""+_currentMemory[index] +  " " + this.Zflag);
        };
        //Branch n bytes if Z flag = 0
        Cpu.prototype.branch = function () {
            if (this.Zflag == 0) {
                //Branch to where the byte after says.
                this.PC = this.PC + _MemoryManager.hexToDec(_MemoryManager.getByte(1));
                this.PC = this.PC + 2;
                //console.log(this.PC);
                //Make sure we dont go over the limit
                if (this.PC > _currentPCB.limit - 1) {
                    this.PC = this.PC - 256;
                }
            }
            else {
                //Add two to skip the D0 code and the information after it.
                this.PC = this.PC + 2;
            }
            //console.log(_CPU.PC);
        };
        //Increment the value of a byte
        Cpu.prototype.increment = function () {
            //Gets the next Byte
            var first = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Gets the second byte
            var second = _MemoryManager.hexToDec(_MemoryManager.getByte(2));
            //Translate into decimal
            var index = first + second + _currentPCB.base;
            if ((_MemoryManager.hexToDec(_currentMemory[index]) + 1).toString(16).length < 2) {
                _currentMemory[index] = "0" + (_MemoryManager.hexToDec(_currentMemory[index]) + 1).toString(16);
                this.PC = this.PC + 3;
            }
            else {
                //Increment place in memory
                _currentMemory[index] = (_MemoryManager.hexToDec(_currentMemory[index]) + 1).toString(16);
                //Add 3 because we used 2 bytes
                this.PC = this.PC + 3;
            }
            //_Console.putText(""+_currentMemory[index] +  " " );
        };
        //System Call
        Cpu.prototype.systemCall = function () {
            //Print integer
            if (this.Xreg == 1) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(PRINT_INT_IRQ, this.Yreg));
            }
            else if (this.Xreg == 2) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(PRINT_STR_IRQ, this.Yreg));
            }
            //else{
            //    this.breakOper();
            //}
            //Did one op code add 1
            this.PC = this.PC + 1;
            //console.log(_CPU.PC);
        };
        Cpu.prototype.decodeInstruction = function (instruction) {
            if (instruction == "A9" || instruction == "a9") {
                this.loadAccConst();
            }
            else if (instruction == "AD" || instruction == "ad" || instruction == "Ad" || instruction == "aD") {
                this.loadAccMem();
            }
            else if (instruction == "8D" || instruction == "8d") {
                this.storeAccMem();
            }
            else if (instruction == "6D" || instruction == "6d") {
                this.addCarry();
            }
            else if (instruction == "A2" || instruction == "a2") {
                this.loadXRegConst();
            }
            else if (instruction == "AE" || instruction == "ae" || instruction == "Ae" || instruction == "aE") {
                this.loadXRegMem();
            }
            else if (instruction == "A0" || instruction == "a0") {
                this.loadYRegConst();
            }
            else if (instruction == "AC" || instruction == "ac" || instruction == "Ac" || instruction == "aC") {
                this.loadYRegMem();
            }
            else if (instruction == "EA" || instruction == "ea" || instruction == "Ea" || instruction == "eA") {
                this.noOper();
            }
            else if (instruction == "00") {
                this.breakOper();
            }
            else if (instruction == "EC" || instruction == "ec" || instruction == "Ec" || instruction == "eC") {
                this.compareXReg();
            }
            else if (instruction == "D0" || instruction == "d0") {
                this.branch();
            }
            else if (instruction == "EE" || instruction == "ee" || instruction == "Ee" || instruction == "eE") {
                this.increment();
            }
            else if (instruction == "FF" || instruction == "ff" || instruction == "Ff" || instruction == "fF") {
                this.systemCall();
            }
            else {
            }
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            //console.log(_currentMemory);
            //console.log(_CPU.Yreg.toString(16));
            //this.roundRobin();
            _Kernel.updateCPUStatus();
            _MemoryDisplay.updateDisplay();
            this.decodeInstruction(_currentMemory[this.PC]);
            //console.log(""+_ReadyQueue.getSize());
            //console.log(""+_ResidentQueue.getSize());
            //If Ready queue is not empty continue round robin
            if (_ReadyQueue.getSize() != 0) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CPU_SCHEDULER_IRQ, false));
            }
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
