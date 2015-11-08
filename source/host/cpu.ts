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

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {}

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        //Load the accumulator with a constant
        public loadAccConst(){


            //Load the constant into the Accumulator
            this.Acc = _MemoryManager.hexToDec( _MemoryManager.getByte(1));
            //Add 2 to the program counter so we know where we are in memory.
            this.PC = this.PC +2;
            //console.log(_CPU.PC);
            //Test _Console.putText(""+_currentMemory[this.PC] +  " " + this.Acc);
            //_AccDisplay.value.
        }

        //Load the accumulator from memory
        public loadAccMem(){
            //Gets the next Byte
            var first = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Gets the second byte
            var second = _MemoryManager.hexToDec(_MemoryManager.getByte(2));
            //Translate into decimal
            var index = first+second + _currentPCB.base;
            //Put into accumulator
            this.Acc = _MemoryManager.hexToDec(_currentMemory[index]);
            //Add 3 because we used 2 bytes
            this.PC = this.PC +3;
            //console.log(_CPU.PC);
            //Test _Console.putText(""+_currentMemory[this.PC] +  " " + this.Acc);
        }

        //Store the accumulator in memory
        public storeAccMem(){
            //Gets the next Byte
            var first = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Gets the second byte
            var second = _MemoryManager.hexToDec(_MemoryManager.getByte(2));
            //Translate into decimal
            var index = first+second + _currentPCB.base;
            //Put the accumulator in hex and store it in the specified location in memory.
            _currentMemory[index] = this.Acc.toString(16);
            //Add 3 because we used 2 bytes
            this.PC = this.PC +3;
            //console.log(_CPU.PC);
            //Test _Console.putText(""+_currentMemory[index] +  " " + this.Acc);
        }

        //Add with carry
        public addCarry(){
            //Gets the next Byte
            var first = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Gets the second byte
            var second = _MemoryManager.hexToDec(_MemoryManager.getByte(2));
            //Translate into decimal
            var index = first+second  + _currentPCB.base;
            //add the value at the index to the accumulator and store it in the accumulator.
            this.Acc = this.Acc + _MemoryManager.hexToDec(_currentMemory[index]);
            //Add 3 because we used 2 bytes
            this.PC = this.PC +3;
            //console.log(_CPU.PC);

            //Test _Console.putText(""+_currentMemory[index] +  " " + this.Acc);
        }

        //Load the X register with a constant
        public loadXRegConst(){
            //Load the constant into the X register
            this.Xreg = _MemoryManager.hexToDec( _MemoryManager.getByte(1));
            //Add 2 to the program counter so we know where we are in memory.
            this.PC = this.PC +2;
            //console.log(_CPU.PC);
        }

        //Load the X register from memory
        public loadXRegMem(){
            //Gets the next Byte
            var first = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Gets the second byte
            var second = _MemoryManager.hexToDec(_MemoryManager.getByte(2));
            //Translate into decimal
            var index = first+second + _currentPCB.base;
            //Put into X register
            this.Xreg = _MemoryManager.hexToDec(_currentMemory[index]);
            //Add 3 because we used 2 bytes
            this.PC = this.PC +3;
            //console.log(_CPU.PC);
        }

        //Load the Y register with a constant
        public loadYRegConst(){
            //Load the constant into the Y register
            this.Yreg = _MemoryManager.hexToDec( _MemoryManager.getByte(1));
            //Add 2 to the program counter so we know where we are in memory.
            this.PC = this.PC +2;
            //console.log(_CPU.PC);
        }

        //Load the Y register from memory
        public loadYRegMem(){
            //Gets the next Byte
            var first = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Gets the second byte
            var second = _MemoryManager.hexToDec(_MemoryManager.getByte(2));
            //Translate into decimal
            var index = first+second + _currentPCB.base;
            //Put into Y register
            this.Yreg = _MemoryManager.hexToDec(_currentMemory[index]);
            //Add 3 because we used 2 bytes
            this.PC = this.PC +3;
            //console.log(_CPU.PC);
        }

        //No Operation
        public noOper(){
            //There is no operation here so move on
            this.PC = this.PC +1;
            //console.log(_CPU.PC);
        }

        //Break (which is really a system call)
        public breakOper(){
            _KernelInterruptQueue.enqueue(new Interrupt(BREAK_OPERATION_IRQ, false));
            //this.PC = this.PC +1;
            //console.log(_CPU.PC);
            //console.log(_CPU.Yreg);
        }

        //Compare a byte in memory to the X reg Sets the Z (zero) flag if equal
        public compareXReg(){
            //Gets the next Byte
            var first = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Gets the second byte
            var second = _MemoryManager.hexToDec(_MemoryManager.getByte(2));
            //Translate into decimal
            var index = first+second + _currentPCB.base;

            //If value in Xreg == value at memory Zflag = 1
            if(this.Xreg == _MemoryManager.hexToDec(_currentMemory[index])){
                this.Zflag = 1;
            }else{
                this.Zflag = 0;
            }
            //Add 3 because we used 2 bytes
            this.PC = this.PC +3;

            //console.log(_CPU.PC);
            //Test _Console.putText(""+_currentMemory[index] +  " " + this.Zflag);
        }

        //Branch n bytes if Z flag = 0
        public branch(){
            if(this.Zflag == 0){
                //Branch to where the byte after says.
                this.PC = this.PC + _MemoryManager.hexToDec(_MemoryManager.getByte(1));
                this.PC = this.PC+2;
                //Make sure we dont go over the limit
                if(this.PC > _currentLimit-1 ) {
                    this.PC = this.PC - 256;
                }
                //this.PC = this.PC+1;
                //Dont forget to increment for the 2 codes used.

            }else {
                //Add two to skip the D0 code and the information after it.
                this.PC = this.PC + 2;
            }
            //console.log(_CPU.PC);

        }

        //Increment the value of a byte
        public increment(){
            //Gets the next Byte
            var first = _MemoryManager.hexToDec(_MemoryManager.getByte(1));
            //Gets the second byte
            var second = _MemoryManager.hexToDec(_MemoryManager.getByte(2));
            //Translate into decimal
            var index = first+second + _currentPCB.base;
            //Increment place in memory
            _currentMemory[index] = (_MemoryManager.hexToDec(_currentMemory[index]) + 1).toString(16);
            //Add 3 because we used 2 bytes
            this.PC = this.PC + 3;

            //_Console.putText(""+_currentMemory[index] +  " " );

        }

        //System Call
        public systemCall(){
            //Print integer
            if(this.Xreg == 1){
                _KernelInterruptQueue.enqueue(new Interrupt(PRINT_INT_IRQ, this.Yreg));
            }
            //Print String
            else if(this.Xreg == 2){
                _KernelInterruptQueue.enqueue(new Interrupt(PRINT_STR_IRQ, this.Yreg));
            }
            else{
                this.breakOper();
            }
            //Did one op code add 1
            this.PC = this.PC +1;
            //console.log(_CPU.PC);
        }

        public decodeInstruction(instruction){
            if(instruction == "A9" || instruction == "a9"){
                this.loadAccConst();
            }
            else if(instruction == "AD" || instruction == "ad" || instruction == "Ad" || instruction == "aD"){
                this.loadAccMem();
            }
            else if(instruction == "8D" || instruction == "8d"){
                this.storeAccMem();
            }
            else if(instruction == "6D" || instruction == "6d"){
                this.addCarry();
            }
            else if(instruction == "A2" || instruction == "a2"){
                this.loadXRegConst();
            }
            else if(instruction == "AE" || instruction == "ae" || instruction == "Ae" || instruction == "aE"){
                this.loadXRegMem();
            }
            else if(instruction == "A0" || instruction == "a0"){
                this.loadYRegConst();
            }
            else if(instruction == "AC" || instruction == "ac" || instruction == "Ac" || instruction == "aC"){
                this.loadYRegMem();
            }
            else if(instruction == "EA" || instruction == "ea" || instruction == "Ea" || instruction == "eA"){
                this.noOper();
            }
            else if(instruction == "00") {
                this.breakOper();
            }
            else if(instruction == "EC" || instruction == "ec" || instruction == "Ec" || instruction == "eC"){
                this.compareXReg();
            }
            else if(instruction == "D0" || instruction == "d0"){
                this.branch();
            }
            else if(instruction == "EE" || instruction == "ee" || instruction == "Ee" || instruction == "eE") {
                this.increment();
            }
            else if(instruction == "FF" || instruction == "ff" || instruction == "Ff" || instruction == "fF") {
                this.systemCall();
            }
        }
        //Will update the information in CPU Status on index.html when called
        public updateCPUStatus(): void {
            _PCDisplay.innerHTML = "" + this.PC;
            _AccDisplay.innerHTML = "" + this.Acc;
            _XRegDisplay.innerHTML = "" + this.Xreg;
            _YRegDisplay.innerHTML ="" + this.Yreg;
            _ZFlagDisplay.innerHTML ="" + this.Zflag;
            //console.log("I RAN UPDATE");
        }

        //set up round robin.
        public roundRobin() : void{
            //If the quantum location = quantum then switch the current process to the next one waiting.
            if(_ReadyQueue.getSize!=0) {
                if (_quantumLocation == _quantum) {
                    //Save the current CPU registers in the current PCB
                    _currentPCB.programCounter = this.PC;
                    _currentPCB.acc = this.Acc;
                    _currentPCB.xReg = this.Xreg;
                    _currentPCB.yReg = this.Yreg;
                    _currentPCB.zFlag = this.Zflag;
                    //Place the PCB back in the ready queue.
                    if (_currentPCB.processState != "terminated") {
                        _currentPCB.processState = "waiting";
                        _ReadyQueue.enqueue(_currentPCB);
                    }
                    //Grab the next PCB
                    _currentPCB = _ReadyQueue.dequeue();
                    this.PC = _currentPCB.programCounter;
                    this.Acc = _currentPCB.acc;
                    this.Xreg = _currentPCB.xReg;
                    this.Yreg = _currentPCB.yReg;
                    this.Zflag = _currentPCB.zFlag;
                    _currentPCB.processState = "running";
                    //Set the quatumlocation back to 0 for the new process
                    _quantumLocation = 0;
                }
                //Add 1 to the quantum location
                _quantumLocation = _quantumLocation + 1;
            }
            else{
                this.breakOper();
            }
        }
        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            //console.log(_currentMemory);
            //aconsole.log(_CPU.Yreg.toString(16));


            if(this.isExecuting = true) {
                this.roundRobin();
                this.updateCPUStatus();
                _MemoryDisplay.updateDisplay();
                this.decodeInstruction(_currentMemory[this.PC]);
            }



            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }
    }
}
