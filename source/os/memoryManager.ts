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

        //Cheack to see if a program is already in memory.
        public memoryCheck(): void{
            var x =0;
            while(x < 256){
                if(_currentMemory[x] == "00"){
                    x=x+1;
                }
                else {
                    _MemoryCheckStatus = "A program is currently loaded into memory.";
                    break;
                }
            }
            _Memory.write();
            _MemoryCheckStatus = "Program successfully loaded.";
        }

        //Return the selected byte in memory
        public getNextByte(x : number) : string{
            return _currentMemory[_CPU.PC +x];
        }

        //Change a number from hex to decimal and return it.
        public hexToDec(hexNumber : string) : number{
            return parseInt(hexNumber, 16);
        }

    }
}