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
            //Will see if there is a program loaded into memory ar block 2 and write one in if there is not.
            else if(_block2Empty == true){
                //set the base and limit.
                _currentBase = _base2;
                _currentLimit = _limit2;
                //update that memory is currently occupied
                _block2Empty = false;
                _Memory.write();
                _MemoryCheckStatus = "Program successfully loaded.";
            }
            //Will see if there is a program loaded into memory ar block 3 and write one in if there is not.
            else if(_block3Empty == true) {
                //set the base and limit.
                _currentBase = _base3;
                _currentLimit = _limit3;
                //update that memory is currently occupied
                _block3Empty = false;
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