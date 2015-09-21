///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            //Check if shift is pressed and if the key code is for 0-9
            else if(isShifted && ((keyCode >= 48) && (keyCode <= 57))){
                if(keyCode == 48){
                    chr = String.fromCharCode(41); // ) 41
                }
                else if(keyCode == 49){
                    chr = String.fromCharCode(33); // ! 33
                }
                else if(keyCode == 50){
                    chr = String.fromCharCode(64); // @ 64
                }
                else if(keyCode == 51){
                    chr = String.fromCharCode(35); // # 35
                }
                else if(keyCode == 52){
                    chr = String.fromCharCode(36); // $ 36
                }
                else if(keyCode == 53){
                    chr = String.fromCharCode(37); // % 37
                }
                else if(keyCode == 54){
                    chr = String.fromCharCode(94); // ^ 94
                }
                else if(keyCode == 55){
                    chr = String.fromCharCode(38); // & 38
                }
                else if(keyCode == 56){
                    chr = String.fromCharCode(42); // * 42
                }
                else if(keyCode == 57){
                    chr = String.fromCharCode(40); // ( 40
                }
                _KernelInputQueue.enqueue(chr);
            }
            //Code for special char mac keys (not sure if windows has different values for some of these keys)
            else if (isShifted && ((keyCode >= 186) && (keyCode <= 192))){
                if(keyCode == 186){
                    chr = String.fromCharCode(58); // : 58
                }
                else if(keyCode == 187){
                    chr = String.fromCharCode(43); // + 43
                }
                else if(keyCode == 188){
                    chr = String.fromCharCode(60); // < 60
                }
                else if(keyCode == 189){
                    chr = String.fromCharCode(95); // _ 95
                }
                else if(keyCode == 190){
                    chr = String.fromCharCode(62); // > 62
                }
                else if(keyCode == 191){
                    chr = String.fromCharCode(63); // ? 63
                }
                else if(keyCode == 192){
                    chr = String.fromCharCode(126); // ~ 126
                }
                _KernelInputQueue.enqueue(chr);
            }
            //Code for special char mac keys (not sure if windows has different values for some of these keys)
            else if ((keyCode >= 186) && (keyCode <= 192)){
                if(keyCode == 186){
                    chr = String.fromCharCode(59); // ; 59
                }
                else if(keyCode == 187){
                    chr = String.fromCharCode(61); // = 61
                }
                else if(keyCode == 188){
                    chr = String.fromCharCode(44); // , 44
                }
                else if(keyCode == 189){
                    chr = String.fromCharCode(45); // - 45
                }
                else if(keyCode == 190){
                    chr = String.fromCharCode(46); // . 46
                }
                else if(keyCode == 191){
                    chr = String.fromCharCode(47); // / 47
                }
                else if(keyCode == 192){
                    chr = String.fromCharCode(96); // `96
                }
                _KernelInputQueue.enqueue(chr);
            }
            //Code for special char mac keys (not sure if windows has different values for some of these keys)
            else if (isShifted && ((keyCode >= 219) && (keyCode <= 222))){
                if(keyCode == 219){
                    chr = String.fromCharCode(123); // { 123
                }
                else if(keyCode == 220){
                    chr = String.fromCharCode(124); // | 124
                }
                else if(keyCode == 221){
                    chr = String.fromCharCode(125); // } 125
                }
                else if(keyCode == 222){
                    chr = String.fromCharCode(34); // " 34
                }
                _KernelInputQueue.enqueue(chr);
            }
            //Code for special char mac keys (not sure if windows has different values for some of these keys)
            else if ((keyCode >= 219) && (keyCode <= 222)){
                if(keyCode == 219){
                    chr = String.fromCharCode(91); // [ 91
                }
                else if(keyCode == 220){
                    chr = String.fromCharCode(92); // \ 92
                }
                else if(keyCode == 221){
                    chr = String.fromCharCode(93); // ] 93
                }
                else if(keyCode == 222){
                    chr = String.fromCharCode(39); // ' 39
                }
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode >= 48) && (keyCode <= 57)) ||   // digits
                        (keyCode == 32)                   ||   // space
                        (keyCode == 13)) {                       // enter
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
        }
    }
}
