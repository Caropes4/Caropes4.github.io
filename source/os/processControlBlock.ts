/**
 * Created by CharlieRopes on 10/18/15.
 */
module TSOS {

    //Process Control Blocks
    export class PCB {

        //Do I need? CPU scheduling information, Memory-management information, Includes protection, Accounting information, I/O status information

        //Process ID
        public pid;
        //Process State
        public processState;
        //Program Counter
        public programCounter;

        //CPU Registers
        public acc;
        public xReg;
        public yReg;
        public zFlag;

        public constructor(){
            this.pid = _nextProcessID;
            this.processState = "new";
        }

        public getPID(){
            return this.pid;
        }

        //Set the process state
        public setProcessState(state){
            this.processState = state;
        }
        //Get the process state
        public getProcessState(){
           return this.processState;
        }

        //Set the set program counter
        public setProgramCounter(counter){
            this.programCounter = counter;
        }
        //Get the program counter
        public getProgramCounter(){
            return this.programCounter;
        }

        //Set the Accumulator
        public setAcc(accumulator){
            this.acc = accumulator;
        }
        //Get the Accumulator
        public getAcc(){
            return this.acc;
        }

        //Set the X register
        public setXReg(reg){
            this.xReg = reg;
        }
        //Get the X register
        public getXReg(){
            return this.xReg;
        }

        //Set the Y register
        public setYReg(reg){
            this.yReg = reg;
        }
        //Get the Y register
        public getYReg(){
            return this.yReg;
        }

        //Set the Z Flag
        public setZFlag(reg){
            this.zFlag = reg;
        }
        //Get the Z Flag
        public getZFlag(){
            return this.zFlag;
        }


    }


}