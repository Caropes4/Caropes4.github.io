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




        //public read(): void{}

        public write(): void{



        }

        //A9 03 8D 41 00 A9 01 8D 40 00 AC 40 00 A2 01 FF EE 40 00 AE 40 00 EC 41 00 D0 EF A9 44 8D 42 00 A9 4F 8D 43 00 A9 4E 8D 44 00 A9 45 8D 45 00 A9 00 8D 46 00 A2 02 A0 42 FF 00



    }
}
