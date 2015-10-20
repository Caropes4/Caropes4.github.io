///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.statusStr = "";
            this.quoteNum = 0;
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date
            // this shell command will display the date and time when called
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            // this shell command will tell the user where they are...well a rough discription of where they are.
            sc = new TSOS.ShellCommand(this.shellWhereami, "whereami", "- Will give you your general location...");
            this.commandList[this.commandList.length] = sc;
            // quote
            // this shell command will give you a quote.
            sc = new TSOS.ShellCommand(this.shellQuote, "quote", "- Will give you a quote");
            this.commandList[this.commandList.length] = sc;
            // status <string>
            // This shell command will change the status message
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Changes the status message.");
            this.commandList[this.commandList.length] = sc;
            // BSOD
            // this shell command will be used to test the BSOD.
            sc = new TSOS.ShellCommand(this.shellBsod, "bsod", "- Used for testing the BSOD");
            this.commandList[this.commandList.length] = sc;
            // load
            // this shell command will tell the user if the input in User Program Input is valid Hex or not.
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Will let you know if the input in User Program Input is valid");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            //
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                }
                else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "ver":
                        _StdOut.putText("Displays the current version of the OS.");
                        break;
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Will shutdown the Operating System");
                        break;
                    case "cls":
                        _StdOut.putText("Will clear the Canvas/Console.");
                        break;
                    case "man":
                        _StdOut.putText("Displays a list of commands and explains what they do.");
                        break;
                    case "trace":
                        _StdOut.putText("Turns the Operating System trace on or off.");
                        break;
                    case "rot13":
                        _StdOut.putText("Does rot13 obfuscation on strings.");
                        break;
                    case "prompt":
                        _StdOut.putText("Will set the console prompt.");
                        break;
                    case "date":
                        _StdOut.putText("Will give you the date and time.");
                        break;
                    case "whereami":
                        _StdOut.putText("Will give you a rough estimation on your location.");
                        break;
                    case "quote":
                        _StdOut.putText("Will display a quote for you.");
                        break;
                    case "status":
                        _StdOut.putText("Will update the status and date in the task bar.");
                        break;
                    case "bsod":
                        _StdOut.putText("Used for testing the BSOD.");
                        break;
                    case "load":
                        _StdOut.putText("Checks to see if user input is valid hex.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        //Will display the date and time
        Shell.prototype.shellDate = function (args) {
            _StdOut.putText("Date: " + Date());
        };
        //Will display where the users general location is
        Shell.prototype.shellWhereami = function (args) {
            _StdOut.putText("You are probably on the planet Earth. If you want an exact location go Google it... ");
        };
        //Will display a quote
        Shell.prototype.shellQuote = function (args) {
            var quote = "";
            var jaredLeto = "Try and fail, but never fail to try. ~ Jared Leto";
            var stevenTyler = "Maybe life is random, but I doubt it. ~ Steven Tyler";
            var abLincoln = "Whatever you are, be a good one. ~ Abraham Lincoln";
            if (_OsShell.quoteNum == 0) {
                _OsShell.quoteNum = _OsShell.quoteNum + 1;
                _StdOut.putText(jaredLeto);
            }
            else if (_OsShell.quoteNum == 1) {
                _OsShell.quoteNum = _OsShell.quoteNum + 1;
                _StdOut.putText(stevenTyler);
            }
            else if (_OsShell.quoteNum == 2) {
                _OsShell.quoteNum = _OsShell.quoteNum + 1;
                _StdOut.putText(abLincoln);
            }
            else {
                _StdOut.putText("You have gotten all the quotes possible");
            }
        };
        //Updates the task bar with a status message
        Shell.prototype.shellStatus = function (args) {
            if (args.length > 0) {
                //_OsShell.statusStr = args;
                //This allows us to have spaces in our status. Makes the args a bit pointless though...
                _OsShell.statusStr = _Console.buffer.substring(7, _Console.buffer.length);
                //Will update the date, time, and Status on the task bar
                var taskBar = document.getElementById("taskBar");
                taskBar.value = "Date: " + Date() + "\n" + "Status: " + _OsShell.statusStr;
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        };
        //
        //Will display a BSOD
        Shell.prototype.shellBsod = function (args) {
            //Will clear the Console and display a BSOD
            _OsShell.shellCls(0);
            _Canvas.style.backgroundColor = "#000099";
            var taskBar = document.getElementById("taskBar");
            taskBar.value = "Date: " + Date() + "\n" + "Status: " + "Oh no its a BSOD better restart.";
        };
        //Will say if the User Program Input is valid or not or if its just plain empty...
        Shell.prototype.shellLoad = function (args) {
            var programInput = document.getElementById("taProgramInput");
            var inputLength = programInput.value.length;
            var code = "";
            if (inputLength > 0) {
                var x = 0;
                var isValid = true;
                while (x < inputLength) {
                    var char = programInput.value.substring(x, x + 1);
                    //Check if the input is hex by going through the string
                    if (char == "a" || char == "b" || char == "c" || char == "d" || char == "e" || char == "f" || char == "A" || char == "B" || char == "C" || char == "D" ||
                        char == "E" || char == "F" || char == "0" || char == "1" || char == "2" || char == "3" || char == "4" || char == "5" || char == "6" || char == "7" ||
                        char == "8" || char == "9" || char == " ") {
                        //remove all spaces and add the character to a string
                        if (char !== " ") {
                            code = code + char;
                        }
                        x = x + 1;
                    }
                    else {
                        _StdOut.putText("Invalid.");
                        x = inputLength;
                        isValid = false;
                    }
                }
                //If isValid is true print valid
                if (isValid) {
                    //Save the string in _loadedCode to be used by memory.
                    _loadedCode = code;
                    //_MemoryManager.memoryCheck();
                    _Memory.write();
                    _CPU.isExecuting = true;
                    _StdOut.putText("Valid." + "PID:" + _nextProcessID + _currentMemory + "    " + "     " + _CPU.Acc);
                    _nextProcessID = _nextProcessID + 1;
                }
            }
            else {
                _StdOut.putText("There is no data to validate.");
            }
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
