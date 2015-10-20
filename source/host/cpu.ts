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
        public loadAccConst(){}

        //Load the accumulator from memory
        public loadAccMem(){}

        //Store the accumulator in memory
        public storeAccMem(){}

        //Add with carry
        public addCarry(){}

        //Load the X register with a constant
        public loadXRegConst(){}

        //Load the X register from memory
        public loadXRegMem(){}

        //Load the Y register with a constant
        public loadYRegConst(){}

        //Load the Y register from memory
        public loadYRegMem(){}

        //No Operation
        public noOper(){}

        //Break (which is really a system call)
        public breakOper(){}

        //Compare a byte in memory to the X reg Sets the Z (zero) flag if equal
        public compareXReg(){}

        //Branch n bytes if Z flag = 0
        public branch(){}

        //Increment the value of a byte
        public increment(){}

        //System Call
        public systemCall(){}

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

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            //this.decodeInstruction();
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }
    }
}
