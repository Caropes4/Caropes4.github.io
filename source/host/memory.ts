/**
 * Created by CharlieRopes on 10/18/15.
 */
module TSOS {

    export class Memory {

        constructor(public memory : any []) {}

        public init(): void {
            this.memory = [];
            for(var x = 0; x < 256; x++){
                this.memory[x] = "00";
            }
            _currentMemory = this.memory;
        }


        //Read from memory pass the program counter
        public read(indexLocation : number): string{
            return _currentMemory[indexLocation];
        }

        //Write the user input to memory if it is Valid
        public write(): void{
            //Clear memory
            this.clearMemory();
            _memoryEmpty = false;
            var code = _loadedCode;
            var mem = _currentMemory;
            //Code location
            var x=0;
            //Array location
            var y=0;
            //Loop through the instructions and place them in memory
            while(x<_loadedCode.length && y<256){
                _currentMemory[y] = _loadedCode.substring(x, x+2);
                x=x+2;
                y=y+1;
            }
        }

        //Clear the memory for a new program
        public clearMemory():void{
            this.memory = [];
            _memoryEmpty = true;
            for(var x = 0; x < 256; x++){
                _currentMemory[x] = "00";
            }
        }

        //A9 03 8D 41 00 A9 01 8D 40 00 AC 40 00 A2 01 FF EE 40 00 AE 40 00 EC 41 00 D0 EF A9 44 8D 42 00 A9 4F 8D 43 00 A9 4E 8D 44 00 A9 45 8D 45 00 A9 00 8D 46 00 A2 02 A0 42 FF 00

        //a2 01 a0 02 FF a2 01 a0 05 FF a2 01 a0 12 FF

        //A2 02 A0 01 FF A2 02 A0 15 FF 00 00 00

    }
}
