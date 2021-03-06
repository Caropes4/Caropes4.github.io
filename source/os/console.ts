///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public historyArray = [""],
                    public arrayLoc = 0,
                    public img1 = null) {}

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        //Will clear the current line of text
        private clearLine(): void {
            //find the offset from the left
            var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer);
            //reset the x position
            this.currentXPosition = this.currentXPosition - offset;
            //find the y position of the line we are editing
            var y = (this.currentYPosition - _DefaultFontSize);
            //Remove the line
            _DrawingContext.clearRect(this.currentXPosition, y, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();

                //If the input is a backspace remove the last value on the buffer and reset the line
                if(chr === String.fromCharCode(8)){

                        var leng = this.buffer.length;
                    if(leng >0 ) {
                        //call the clear line function
                        this.clearLine();
                        //Remove the last char from the buffer
                        this.buffer = this.buffer.substring(0, (leng - 1));

                    }
                    //print the new buffer
                    _StdOut.putText(this.buffer);
                }

                //Tab auto fill
                if(chr === String.fromCharCode(9)){
                    var i = 0;
                    var leng = this.buffer.length;
                    //Loop through commands
                    while ( i < _OsShell.commandList.length){
                        //If a command starts with the same char as whats in the buffer assume this is the command they want
                        if (_OsShell.commandList[i].command.substring(0, leng) === this.buffer){
                            var cmdLeng = _OsShell.commandList[i].command.length;
                            //Grab the end of the command
                            var cmdEnd = _OsShell.commandList[i].command.substring(leng, cmdLeng);
                            //Add the end of the command to the buffer
                            this.buffer = this.buffer + cmdEnd;
                            //Then tyoe the rest of the command in the console
                            _StdOut.putText(cmdEnd);
                            //Break the loop when the command has been found
                            break;
                        }
                        //If command not found increment and continue
                        else{
                            i = i +1;
                        }
                    }
                }

                //Up arrow
                if (chr === String.fromCharCode(38)) {
                    //Travers array and get whatever came before
                    if (this.historyArray.length > this.arrayLoc-1 && this.arrayLoc > 1) {
                        this.arrayLoc = this.arrayLoc - 1;
                        this.clearLine();
                        this.buffer = this.historyArray[this.arrayLoc];
                        _StdOut.putText(this.buffer);
                    }

                }
                //Down arrow
                if (chr === String.fromCharCode(40)) {
                    //Traverse array and get whatever came after
                    if (this.historyArray.length > this.arrayLoc+1) {
                        this.arrayLoc = this.arrayLoc + 1;
                        this.clearLine();
                        this.buffer = this.historyArray[this.arrayLoc];
                        _StdOut.putText(this.buffer);
                    }
                    //Clear the buffer after the last element in the history
                    else if(this.buffer != ""){
                        this.clearLine();
                        this.buffer = "";
                    }

                }

                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);

                    if(this.buffer != "") {
                        this.historyArray.push(this.buffer);
                        this.arrayLoc = this.historyArray.length;
                    }
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                //Don't add backspace, tab, up or down arrow to the buffer
                else if(chr != String.fromCharCode(8) && chr != String.fromCharCode(9) && chr != String.fromCharCode(38) && chr != String.fromCharCode(40)){
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public textWrap(text): void {
            var char;
            // Draw the text at the current X and Y coordinates.
            //for(var i=0; i < text.length(); i++){
            //    char = text.substring(i, i+1);

                if (this.currentXPosition > 490)
                {
                    this.advanceLine();
                    //this.putText(char);

                }

            //}

        }


        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.

            //Text Wrap?

           if (text !== "") {
               var char = null;
               var x =0;
               //Loop and take each character separately and so textWrap can check that they do not pass the max X coord
               while (x < text.length) {
                   char = text.substring(x , x+1);
                   x=x+1;

                   //Call TextWrap
                   this.textWrap(char);

                   _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, char);
                   // Move the current X position.
                   var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, char);
                   this.currentXPosition = this.currentXPosition + offset;
               }
            }
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */

            this.currentYPosition += _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin;


            //Take a Image of the current canvas/console area
            this.img1 = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);

            //Check if canvas goes past the 500px threshold
            if (this.currentYPosition > 500) {
                //If so clear the screen
                this.clearScreen();
                //Reset the Y
                this.currentYPosition = (500 - (_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize + _FontHeightMargin)));
                //And redraw the image with the same shift as the new Y value
                _DrawingContext.putImageData(this.img1, 0,-(_DefaultFontSize  + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin));
            }

            // TODO: Handle scrolling. (iProject 1)
        }
    }
 }
