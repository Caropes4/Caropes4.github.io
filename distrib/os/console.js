///<reference path="../globals.ts" />
/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, historyArray, arrayLoc, img1) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            if (historyArray === void 0) { historyArray = [""]; }
            if (arrayLoc === void 0) { arrayLoc = 0; }
            if (img1 === void 0) { img1 = null; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.historyArray = historyArray;
            this.arrayLoc = arrayLoc;
            this.img1 = img1;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        //Will clear the current line of text
        Console.prototype.clearLine = function () {
            //find the offset from the left
            var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer);
            //reset the x position
            this.currentXPosition = this.currentXPosition - offset;
            //find the y position of the line we are editing
            var y = (this.currentYPosition - _DefaultFontSize);
            //Remove the line
            _DrawingContext.clearRect(this.currentXPosition, y, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                //If the input is a backspace remove the last value on the buffer and reset the line
                if (chr === String.fromCharCode(8)) {
                    var leng = this.buffer.length;
                    if (leng > 0) {
                        //call the clear line function
                        this.clearLine();
                        //Remove the last char from the buffer
                        this.buffer = this.buffer.substring(0, (leng - 1));
                    }
                    //print the new buffer
                    _StdOut.putText(this.buffer);
                }
                //Tab auto fill
                if (chr === String.fromCharCode(9)) {
                    var i = 0;
                    var leng = this.buffer.length;
                    //Loop through commands
                    while (i < _OsShell.commandList.length) {
                        //If a command starts with the same char as whats in the buffer assume this is the command they want
                        if (_OsShell.commandList[i].command.substring(0, leng) === this.buffer) {
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
                        else {
                            i = i + 1;
                        }
                    }
                }
                //Up arrow
                if (chr === String.fromCharCode(38)) {
                    //Travers array and get whatever came before
                    if (this.historyArray.length > this.arrayLoc - 1 && this.arrayLoc > 1) {
                        this.arrayLoc = this.arrayLoc - 1;
                        this.clearLine();
                        this.buffer = this.historyArray[this.arrayLoc];
                        _StdOut.putText(this.buffer);
                    }
                }
                //Down arrow
                if (chr === String.fromCharCode(40)) {
                    //Traverse array and get whatever came after
                    if (this.historyArray.length > this.arrayLoc + 1) {
                        this.arrayLoc = this.arrayLoc + 1;
                        this.clearLine();
                        this.buffer = this.historyArray[this.arrayLoc];
                        _StdOut.putText(this.buffer);
                    }
                    else if (this.buffer != "") {
                        this.clearLine();
                        this.buffer = "";
                    }
                }
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    if (this.buffer != "") {
                        this.historyArray.push(this.buffer);
                        this.arrayLoc = this.historyArray.length;
                    }
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else if (chr != String.fromCharCode(8) && chr != String.fromCharCode(9) && chr != String.fromCharCode(38) && chr != String.fromCharCode(40)) {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
            }
        };
        Console.prototype.textWrap = function (text) {
            var char;
            // Draw the text at the current X and Y coordinates.
            //for(var i=0; i < text.length(); i++){
            //    char = text.substring(i, i+1);
            if (this.currentXPosition > 490) {
                this.advanceLine();
            }
            //}
        };
        Console.prototype.putText = function (text) {
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
                this.textWrap(text);
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        };
        Console.prototype.advanceLine = function () {
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
                _DrawingContext.putImageData(this.img1, 0, -(_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin));
            }
            // TODO: Handle scrolling. (iProject 1)
        };
        return Console;
    })();
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
