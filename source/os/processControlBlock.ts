/**
 * Created by CharlieRopes on 10/18/15.
 */
module TSOS {

    export class PCB {

        //Do I need? CPU scheduling information, Memory-management information, Includes protection, Accounting information, I/O status information

        //Process ID
        public pid;
        //Process State
        //public procState;
        //Program Counter
        public programCounter;

        //CPU Registers
        public Acc;
        public XReg;
        public YReg;
        public ZFlag;

        public constructor(){
            //this.pid =

        }

        public getPID(){
            return this.pid;
        }

        //Set the process state
        //public set procState(state){
            //this.procState = state;
        //}
        //Get the process state
        //public get procState(){
           // return this.procState;
        //}
    }


}