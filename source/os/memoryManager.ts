/**
 * Created by CharlieRopes on 10/18/15.
 */
module TSOS {

    export class MemoryManager {

        //public memory = _currentMemory;
        public PCB = _currentPCB;

       // public


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


        public getInstruction(indexLocation : number): string {
            return _currentMemory[indexLocation];
        }


    }
}