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

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public statusStr = "Cooking Pie";
        public quoteNum = 0;
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";


        constructor() {
        }

        public init() {
            var sc;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                "ver",
                "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                "help",
                "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                "shutdown",
                "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                "cls",
                "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                "man",
                "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                "trace",
                "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                "rot13",
                "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                "prompt",
                "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // date
            // this shell command will display the date and time when called
            sc = new ShellCommand(this.shellDate,
                "date",
                "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            // this shell command will tell the user where they are...well a rough discription of where they are.
            sc = new ShellCommand(this.shellWhereami,
                "whereami",
                "- Will give you your general location...");
            this.commandList[this.commandList.length] = sc;

            // quote
            // this shell command will give you a quote.
            sc = new ShellCommand(this.shellQuote,
                "quote",
                "- Will give you a quote");
            this.commandList[this.commandList.length] = sc;

            // status <string>
            // This shell command will change the status message
            sc = new ShellCommand(this.shellStatus,
                "status",
                "<string> - Changes the status message.");
            this.commandList[this.commandList.length] = sc;

            // BSOD
            // this shell command will be used to test the BSOD.
            sc = new ShellCommand(this.shellBsod,
                "bsod",
                "- Used for testing the BSOD");
            this.commandList[this.commandList.length] = sc;

            // load
            // this shell command will tell the user if the input in User Program Input is valid Hex or not.
            sc = new ShellCommand(this.shellLoad,
                "load",
                "- Will let you know if the input in User Program Input is valid");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
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
            var index:number = 0;
            var found:boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
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
        }

        public parseInput(buffer):UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            } else {
                _StdOut.putText("For what?");
            }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) + "'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        //Will display the date
        public shellDate(args) {
            _StdOut.putText("Date: " + Date());
        }

        //Will display where the users general location is
        public shellWhereami(args) {
            _StdOut.putText("You are probably on the planet Earth. If you want an exact location go Google it... ");
        }

        //Will display a quote
        public shellQuote(args) {
            var quote = "";
            var jaredLeto = "Try and fail, but never fail to try. ~ Jared Leto";
            var stevenTyler = "Maybe life is random, but I doubt it. ~ Steven Tyler";
            var abLincoln = "Whatever you are, be a good one. ~ Abraham Lincoln";

            if (_OsShell.quoteNum == 0) {
                _OsShell.quoteNum = _OsShell.quoteNum + 1;
                _StdOut.putText(jaredLeto);
            } else if (_OsShell.quoteNum == 1) {
                _OsShell.quoteNum = _OsShell.quoteNum + 1;
                _StdOut.putText(stevenTyler);
            } else if (_OsShell.quoteNum == 2) {
                _OsShell.quoteNum = _OsShell.quoteNum + 1;
                _StdOut.putText(abLincoln);
            } else {
                _StdOut.putText("You have gotten all the quotes possible");
            }

        }

        //Updates the task bar with a status message
        public shellStatus(args) {
            if (args.length > 0) {
                _OsShell.statusStr = args[0];
                //Will update the date, time, and Status on the task bar
                var taskBar = <HTMLInputElement> document.getElementById("taskBar");
                taskBar.value = "Date: " + Date() + "\n" + _OsShell.statusStr;
            } else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        }

        //Will display a BSOD
        public shellBsod(args) {
            //Will clear the Console and display a BSOD
            _OsShell.shellCls(0);
            _Canvas.style.backgroundColor = "#000099";
        }

        //Will say if the User Program Input is valid or not
        public shellLoad(args) {
            var programInput = <HTMLInputElement> document.getElementById("taProgramInput");
            var inputLength = programInput.value.length;
            if (inputLength > 0) {
                var x = 0
                var isValid = true;
                while (x < inputLength) {

                    var char = programInput.value.substring(x , x+1);
                    //Check if the input is hex by going through the string
                    if (char == "a" || char == "b" || char == "c" || char == "d" || char == "e" || char == "f" || char == "A" || char == "B" || char == "C" || char == "D" ||
                        char == "E" || char == "F" || char == "0" || char == "1" || char == "2" || char == "3" || char == "4" || char == "5" || char == "6" || char == "7" ||
                        char == "8" || char == "9" || char == " ") {
                        x = x + 1;
                    }
                    //If the char is not a hex then set is valid to false and break the loop by setting x to length
                    else {
                        _StdOut.putText("Invalid");
                        x=inputLength;
                        isValid = false;
                    }
                }
                //If isValid is true print valid
                if(isValid) {
                    _StdOut.putText("Valid");
                }
            }
            //If text area is empty tell the user
            else{
                _StdOut.putText("There is no data to validate");
            }
        }
    }
}