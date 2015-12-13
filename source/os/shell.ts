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
        public statusStr = "";
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

            //run
            //This shell command will run the loaded program matching the given PID
            sc = new ShellCommand(this.shellRun,
                "run",
                "- Run the program loaded into memory associated with the given PID");
            this.commandList[this.commandList.length] = sc;

            //run
            //This shell command will run the loaded program matching the given PID
            sc = new ShellCommand(this.shellRunAll,
                "runall",
                "- Run all the programs loaded into memory");
            this.commandList[this.commandList.length] = sc;

            //kill
            //This shell command will end the running program
            sc = new ShellCommand(this.shellKill,
                "kill",
                "- End the program matching the PID given");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            //Will clear all memory partitions.
            sc = new ShellCommand(this.shellClearMem,
                "clearmem",
                "- Clears all memory partitions");
            this.commandList[this.commandList.length] = sc;

            //Will change the quantum
            sc = new ShellCommand(this.shellQuantum,
                "quantum",
                "- Sets the quantum <int>");
            this.commandList[this.commandList.length] = sc;

            //Will list the active PIDs
            sc = new ShellCommand(this.shellPS,
                "ps",
                "- Lists the active PIDs");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellSetSchedule,
                "setschedule",
                "- Changes the current Scheduling algorithm <rr, fcfs, or priority>");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellGetSchedule,
                "getschedule",
                "- Rerurns the current scheduling algorithm");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellCreate,
                "create",
                "- creates a file <filename>");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRead,
                "read",
                "- reads a file <filename>");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellDelete,
                "delete",
                "- deletes a file <filename>");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellLs,
                "ls",
                "- Lists the files on disk");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellFormat,
                "format",
                "- Formats the disk");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellWrite,
                "write",
                "- Writes data to a file on the disk");
            this.commandList[this.commandList.length] = sc;


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

        //Will display the date and time
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
                //_OsShell.statusStr = args;
                //This allows us to have spaces in our status. Makes the args a bit pointless though...
                _OsShell.statusStr = _Console.buffer.substring(7,_Console.buffer.length );
                //Will update the date, time, and Status on the task bar
                var taskBar = <HTMLInputElement> document.getElementById("taskBar");
                taskBar.value = "Date: " + Date() + "\n" + "Status: " + _OsShell.statusStr;
            } else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        }

        //

        //Will display a BSOD
        public shellBsod(args) {
            //Will clear the Console and display a BSOD
            _OsShell.shellCls(0);
            _Canvas.style.backgroundColor = "#000099";
            var taskBar = <HTMLInputElement> document.getElementById("taskBar");
            taskBar.value = "Date: " + Date() + "\n" + "Status: " + "Oh no its a BSOD better restart.";

        }



        //Will say if the User Program Input is valid or not or if its just plain empty...
        public shellLoad(args) {
            var programInput = <HTMLInputElement> document.getElementById("taProgramInput");
            var inputLength = programInput.value.length;
            var code = "";
            if (inputLength > 0) {
                var x = 0;
                var isValid = true;
                while (x < inputLength) {

                    var char = programInput.value.substring(x , x+1);
                    //Check if the input is hex by going through the string
                    if (char == "a" || char == "b" || char == "c" || char == "d" || char == "e" || char == "f" || char == "A" || char == "B" || char == "C" || char == "D" ||
                        char == "E" || char == "F" || char == "0" || char == "1" || char == "2" || char == "3" || char == "4" || char == "5" || char == "6" || char == "7" ||
                        char == "8" || char == "9" || char == " ") {
                        //remove all spaces and add the character to a string
                        if(char !== " "){
                            code = code + char;
                        }
                        x = x + 1;
                    }
                    //If the char is not a hex then set is valid to false and break the loop by setting x to length
                    else {
                        _StdOut.putText("Invalid.");
                        x=inputLength;
                        isValid = false;
                    }
                }
                //If isValid is true print valid
                if(isValid) {
                    //Check to make sure that all of memory is not taken
                    if(_block1Empty == false && _block2Empty == false && _block3Empty == false){
                        _MemoryCheckStatus = "All memory is currently occupied.";
                        _StdOut.putText(""+_MemoryCheckStatus);
                    }
                    //If memory is not full do the following.
                    else {
                        //Save the string in _loadedCode to be used by memory.
                        _loadedCode = code;
                        _MemoryManager.memoryCheck();

                        //Setup Process Control Block
                        _currentPCB = new PCB();
                        _currentPCB.init();
                        _currentPCB.pid = _nextProcessID;
                        _currentPCB.programCounter = _currentBase;
                        _currentPCB.processState = "New";
                        _currentPCB.acc = _CPU.Acc;
                        _currentPCB.xReg = _CPU.Xreg;
                        _currentPCB.yReg = _CPU.Yreg;
                        _currentPCB.zFlag = _CPU.Zflag;
                        _currentPCB.isExecuting = _CPU.isExecuting;
                        _currentPCB.base = _currentBase;
                        _currentPCB.limit = _currentLimit;

                        _ResidentQueue.enqueue(_currentPCB);
                        //console.log(_ResidentQueue.getSize());
                        //console.log(_currentPCB.pid);
                        //console.log(_currentPCB.base);
                        //console.log(_currentPCB.limit);

                        _StdOut.putText("PID: " + _nextProcessID + "   " + _MemoryCheckStatus);
                        _nextProcessID = _nextProcessID + 1;
                    }

                }
            }
            //If text area is empty tell the user
            else{
                _StdOut.putText("There is no data to validate.");
            }
        }

        //Will display run a program
        public shellRun(args) {
            if (args.length > 0) {
                //loop thought the resident queue to see if the requested PID is in the Resident queue.
                for (var x = 0; x < _ResidentQueue.getSize(); x++) {
                    _currentPCB = _ResidentQueue.dequeue();
                    if (_currentPCB.pid == args) {
                        _currentBase = _currentPCB.base;
                        _currentLimit = _currentPCB.limit;
                        _currentPCB.processState = "Running";
                        _CPU.PC = _currentPCB.programCounter;
                        _CPU.Acc = _currentPCB.acc;
                        _CPU.Xreg = _currentPCB.xReg;
                        _CPU.Yreg = _currentPCB.yReg;
                        _CPU.Zflag = _currentPCB.zFlag;
                        //_ReadyQueue.enqueue(_currentPCB);
                        _CPU.isExecuting = true;
                        _Kernel.updateCurrentPCBStatus();
                    }
                    else{
                        _ResidentQueue.enqueue(_currentPCB);
                    }
                }
            }
            //If no Pid is given or found tell the user the following.
            else {
                _StdOut.putText("Usage: run <pid>  Please supply a valid PID.");
            }
            /*//Run a program
            if (args.length > 0) {

                _CPU.isExecuting = true;

            }
            else {
                _StdOut.putText("Usage: run <pid>  Please supply a PID.");
            }*/
        }

        public shellRunAll(args) {
            //place all processes in the ready queue
            while (_ResidentQueue.getSize() != 0) {
                _currentPCB = _ResidentQueue.dequeue();
                _currentPCB.processState = "Ready";
                _ReadyQueue.enqueue(_currentPCB);
            }
            if(_ReadyQueue.getSize()!=0) {
                //Grab the first process to run.
                _currentPCB = _ReadyQueue.dequeue();
                _currentBase = _currentPCB.base;
                _currentLimit = _currentPCB.limit;
                _currentPCB.processState = "Running";
                _CPU.PC = _currentPCB.programCounter;
                _CPU.Acc = _currentPCB.acc;
                _CPU.Xreg = _currentPCB.xReg;
                _CPU.Yreg = _currentPCB.yReg;
                _CPU.Zflag = _currentPCB.zFlag;
                //_ReadyQueue.enqueue_currentPCB;
                _CPU.isExecuting = true;
                _Kernel.updateCurrentPCBStatus();
            }
            else{
                _StdOut.putText("No programs are currently loaded.");
            }
            _Kernel.updateReadyQueueStatus();
        }

        //Will kill the given program.
        public shellKill(args) {
            //End a program
            if(args.length >0) {
                if(_currentPCB.pid == parseInt(args)) {
                    _CPU.breakOper();
                }
                else if (_ReadyQueue.getSize() != 0) {
                    for (var x = 0; x < _ReadyQueue.getSize(); x = x + 1) {
                        _PCBAtLocation = _ReadyQueue.dequeue();
                        if(_PCBAtLocation.pid == parseInt(args)){
                            _TerminatedQueue.enqueue(_PCBAtLocation);
                            _StdOut.putText("Process: PID "+ args + " was terminated.");
                            _Memory.clearMemory();
                            _MemoryManager.updateMemoryPartitionStatus();
                        }
                        else{
                            _ReadyQueue.enqueue(_PCBAtLocation);
                        }
                    }
                }
                else{
                    _StdOut.putText("No program with that PID is running.");
                }
            }
            else {
                _StdOut.putText("Usage: kill <pid>  Please supply a valid PID.");
            }
        }

        //Clears all memory
        public shellClearMem(args) {
            //Make sure no programs are running
            if(_ReadyQueue.getSize() == 0 && _currentPCB.processState != "Running") {
                //Loop thtough all of memory and clear it
                for (var x = 0; x < 768; x++) {
                    _currentMemory[x] = "00";
                }
                //Set all memory block status' to empty
                _block1Empty = true;
                _block2Empty = true;
                _block3Empty = true;
                //Update the memory display
                _MemoryDisplay.updateDisplay();

                _CPU.PC = 0;
                _CPU.Acc = 0;
                _CPU.Xreg = 0;
                _CPU.Yreg = 0;
                _CPU.Zflag = 0;
                _Kernel.updateCPUStatus();
            }
            else{
                _StdOut.putText("A program is currently running. Kill all processes before attempting to clear memory.");
            }
        }

        //Will set the quantum to the specified number
        public shellQuantum(args) {
            //Set the new quantum
            if (args.length > 0) {
                _quantum = parseInt(args);
                //Will save the Quantum that has been selected incase the user uses first come first serve
                _originalQuantum = _quantum;
                //console.log(""+_quantum);
            }
            //If no int is given
            else {
                _StdOut.putText("Usage: quantum <int>  Please supply a valid int.");
            }
        }

        //Will list the active PIDs (Anything in the Ready queue or the process currently running
        public shellPS(args) {
            var message = "";
            if(_currentPCB.processState =="Running") {
                message = message + _currentPCB.pid;
                if (_ReadyQueue.getSize() != 0) {
                    for (var x = 0; x < _ReadyQueue.getSize(); x = x + 1) {
                        _PCBAtLocation = _ReadyQueue.getPCB(x);
                        message = message + ", " + _PCBAtLocation.pid;
                    }
                }
                _StdOut.putText("PIDs: " + message);
            }
            //If no programs are running.
            else {
                _StdOut.putText("No processes are currently running.");
            }
        }

        //Will set the schedule to the algorithm selected
        public shellSetSchedule(args) {
            if (args.length > 0) {
                //round robin
                if(args == "rr"){
                    _RoundRobin = true;
                    _FirstComeFirstServe = false;
                    _Priority = false;
                }
                //First come first serve
                else if(args == "fcfs"){
                    _RoundRobin = true;
                    _FirstComeFirstServe = true;
                    _Priority = false;
                }
                //Priority
                else if(args = "priority"){
                    _RoundRobin = false;
                    _FirstComeFirstServe = false;
                    _Priority = true;
                }
            }
            //If no arg is given
            else {
                _StdOut.putText("Usage: setschedule <rr, fcfs, priority>  Please supply a valid command.");
            }
        }

        //Will return the current scheduleing algorithm being used
        public shellGetSchedule(args) {
            if(_RoundRobin == true && _FirstComeFirstServe == false){
                _StdOut.putText("Current Scheduling Algorithm : Round Robin");
            }
            else if(_RoundRobin == true && _FirstComeFirstServe == true){
                _StdOut.putText("Current Scheduling Algorithm : First Come First Serve");
            }
            else if(_Priority == true){
                _StdOut.putText("Current Scheduling Algorithm : Priority");
            }
        }

        //Will create a file
        public shellCreate(args) {
            _success = false;

            if (args.length > 0) {
                //call create function
                _krnFileSystemDeviceDriver.create(args);
                if(_success){
                    _StdOut.putText("Success");
                }else{
                    _StdOut.putText("Failure");
                }
            }
            //If no filename is given
            else {
                _StdOut.putText("Usage: create <filename>  Please supply a filename.");
            }
        }

        //Will read a file
        public shellRead(args) {
            _success = false;
            if (args.length > 0) {
                //Call read function
                _krnFileSystemDeviceDriver.read(args);
                if(_success){
                    _StdOut.putText("Success");
                }else{
                    _StdOut.putText("Failure it is possible there is no data to read");
                }
            }
            //If no filename is given
            else {
                _StdOut.putText("Usage: read <filename>  Please supply a filename.");
            }
        }

        //Will delete a file
        public shellDelete(args) {
            _success = false;
            if (args.length > 0) {
                //Call read function
                _krnFileSystemDeviceDriver.delete(args);
                if(_success){
                    _StdOut.putText("Success");
                }else{
                    _StdOut.putText("Failure");
                }
            }
            //If no filename is given
            else {
                _StdOut.putText("Usage: delete <filename>  Please supply a filename.");
            }
        }

        //Will format the disk
        public shellFormat(args) {
            _krnFileSystemDeviceDriver.format();
            _FileSystemDisplay.updateDisplay();
            //Print the files on disk
            _StdOut.putText("Success");
        }


        //Will display all files on disk
        public shellLs(args) {
            var keysArray = _krnFileSystemDeviceDriver.filesOnDisk();
            var files = "";
            //loop through the array of filekeys
            for(var x = 0; x < keysArray.length; x++){
                files = files +_krnFileSystemDeviceDriver.getFileName(keysArray[x]) + ", ";
            }
            //If the array is empty say nothing is on the disk
            if(keysArray.length == 0){
                _StdOut.putText("No Files on Disk");
            }else {
                //Print the files on disk
                _StdOut.putText("Files on Disk: " + files);
            }
        }

        //Will write data to a file on the disk
        public shellWrite(args) {
            _success = false;
            if(args.length > 1) {
                //If the file exists
                if(_krnFileSystemDeviceDriver.doesFileExist(args[0])) {
                    _krnFileSystemDeviceDriver.write(args[0], args[1]);
                    //If it was successful
                    if(_success){
                        _FileSystemDisplay.updateDisplay();
                        _StdOut.putText("Success");
                    }
                    //If it failed
                    else{
                        _StdOut.putText("Failed to write");
                    }
                }
                //If the file does not exist
                else{
                    _StdOut.putText("File does not exist. Failed to write");
                }

            }
            else{
                _StdOut.putText("Please provide a <filename> and <data>");
            }
        }

    }
}
