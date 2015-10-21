/**
 * Created by CharlieRopes on 10/18/15.
 */
module TSOS {

    export class MemoryManager {

        public memory: any[]

        constructor(){}

        public init(): void{
            this.memory = _currentMemory;
        }

        //Check to see if a program is already in memory.
        public memoryCheck(): void {

            if (_memoryEmpty != true) {
                _MemoryCheckStatus = "A program is currently loaded into memory.";
            }
            else {
                _Memory.write();
                _MemoryCheckStatus = "Program successfully loaded.";
            }
        }


        //Return the selected byte in memory
        public getByte(x : number) : string{
            return _currentMemory[_CPU.PC +x];
        }

        //Change a number from hex to decimal and return it.
        public hexToDec(hexNumber : string) : number{
            return parseInt(hexNumber, 16);
        }

    }
}