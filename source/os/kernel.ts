///<reference path="../globals.ts" />
///<reference path="queue.ts" />

/* ------------
     Kernel.ts

     Requires globals.ts
              queue.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Kernel {
        //
        // OS Startup and Shutdown Routines
        //
        public krnBootstrap() {      // Page 8. {
            Control.hostLog("bootstrap", "host");  // Use hostLog because we ALWAYS want this, even if _Trace is off.

            // Initialize our global queues.
            _KernelInterruptQueue = new Queue();  // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array();         // Buffers... for the kernel.
            _KernelInputQueue = new Queue();      // Where device input lands before being processed out somewhere.

            // Initialize the console.
            _Console = new Console();          // The command line interface / console I/O device.
            _Console.init();

            // Initialize standard input and output to the _Console.
            _StdIn  = _Console;
            _StdOut = _Console;

            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new DeviceDriverKeyboard();     // Construct it.
            _krnKeyboardDriver.driverEntry();                    // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);

            // Load the file system Device Driver
            this.krnTrace("Loading the file system device driver.");
            _krnFileSystemDeviceDriver = new FileSystemDeviceDriver();     // Construct it.
            _krnFileSystemDeviceDriver.driverEntry();                    // Call the driverEntry() initialization routine.
            this.krnTrace(_krnFileSystemDeviceDriver.status);
            //will format the disk
            _krnFileSystemDeviceDriver.format();

            //
            // ... more?
            //

            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();

            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new Shell();
            _OsShell.init();

            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }

        public krnShutdown() {
            this.krnTrace("begin shutdown OS");
            // TODO: Check for running processes.  If there are some, alert and stop. Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();
            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");
        }


        public krnOnCPUClockPulse() {
            /* This gets called from the host hardware simulation every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware / VM / host that tells the kernel
               that it has to look for interrupts and process them if it finds any.                           */

            // Check for an interrupt, are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            } else if (_CPU.isExecuting) { // If there are no interrupts then run one CPU cycle if there is anything being processed. {
                _CPU.cycle();
            } else {                      // If there are no interrupts and there is nothing being executed then just be idle. {
                this.krnTrace("Idle");
            }
        }


        //
        // Interrupt Handling
        //
        public krnEnableInterrupts() {
            // Keyboard
            Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        }

        public krnDisableInterrupts() {
            // Keyboard
            Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        }

        public krnInterruptHandler(irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);

            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR();              // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params);   // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case PRINT_INT_IRQ:
                    //console.log(_CPU.Yreg.toString());
                    _Console.putText(_CPU.Yreg.toString());
                    _Console.advanceLine();
                    _Console.putText(_OsShell.promptStr);
                    //console.log(""+ _currentPCB.xReg);
                    break;

                case PRINT_STR_IRQ:
                    var dec = _CPU.Yreg + _currentPCB.base;
                    while(_currentMemory[dec] !== "00") {

                        //console.log("I RAN" + _MemoryManager.getByte(x));
                        var byte = _currentMemory[dec];
                        var code = _MemoryManager.hexToDec(byte);
                        var char = String.fromCharCode(code);
                        _Console.putText(char);
                        dec = dec+1;
                    }
                    _Console.advanceLine();
                    _Console.putText(_OsShell.promptStr);

                    break;

                case BREAK_OPERATION_IRQ:
                    //console.log("I RAN");
                    //If the ready queue is empty let user know that the processes are done running.
                    this.updatePCB();
                    _currentPCB.processState = "Terminated";
                    _TerminatedQueue.enqueue(_currentPCB);
                    this.updateCurrentPCBStatus();
                    this.clearReadyQueueStatus();
                    //_ReadyQueueDisplay.updateDisplay();
                    this.updateReadyQueueStatus();

                    //Set the quatumlocation back to 0 for the new process
                    _quantumLocation = 0;

                    //Clear the memory since process is done running. And update the status
                    //_Memory.clearMemory();
                    _MemoryManager.updateMemoryPartitionStatus();

                    //If the ready queue still has PCBs in it grab the next one and continue running
                    if(_ReadyQueue.getSize() != 0) {
                        _currentPCB = _ReadyQueue.dequeue();
                        this.updateCPURegisters();
                        _currentPCB.processState = "Running";
                    }
                    else if(_ReadyQueue.getSize() == 0 && _currentPCB.processState == "Terminated"){
                        this.resetReadyQueueStatus();
                        _CPU.isExecuting = false;
                        _Console.advanceLine();
                        _Console.putText(_OsShell.promptStr);
                        _Console.putText("Program no longer Executing.");
                        _Console.advanceLine();
                        _Console.putText(_OsShell.promptStr);

                    }
                    _MemoryDisplay.updateDisplay();
                    this.updateCPUStatus();
                    break;

                //Runs what ever algorithm is selected
                case CPU_SCHEDULER_IRQ:
                    this.firstComeFirstServe();
                    this.roundRobin();
                    break;

                //If given an invalid op code do the following
                case INVALID_OPCODE_IRQ:

                    break;

                //If memory goes out of bound do the following
                case MEMORY_OUT_OF_BOUNDS_IRQ:
                    _CPU.isExecuting = false;
                    _Console.putText("Program used all avalible memory and has been terminated.");
                    _Console.advanceLine();
                    _Console.putText(_OsShell.promptStr);
                    break;

                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        }

        //Will swap things from memory to the disk and then back
        public rollInRollOut(){

        }

        //Round robin scheduling algorithm
        public roundRobin() {
            //Round robin
            _FileSystemDisplay.updateDisplay();
            if (_RoundRobin = true) {
                if (_ReadyQueue.getSize() != 0) {
                    //_ReadyQueueDisplay.updateDisplay();
                    this.updateReadyQueueStatus();
                    this.updatePCB();
                    if (_quantumLocation == _quantum) {
                        //_ReadyQueueDisplay.updateDisplay();
                        this.updateReadyQueueStatus();
                        //Save the current CPU registers in the current PCB
                        this.updatePCB();
                        //check to make sure it was not terminated
                        if (_currentPCB.processState == "Terminated") {
                            _TerminatedQueue.enqueue(_currentPCB);
                            _Memory.clearMemory();
                            _currentPCB = _ReadyQueue.dequeue();
                        }
                        //Place the PCB back in the ready queue.
                        else if (_currentPCB.processState != "Terminated") {
                            _currentPCB.processState = "Ready";
                            //Check the next pcb in the queue and if its on_disk swap it with the process that just finished
                            if (_ReadyQueue.getSize() > 0) {
                                _nextPCB = _ReadyQueue.dequeue();
                                //If the next pcb is on disk move it to memory and put the pcb that just ended into memory
                                if (_nextPCB.loc == "On_Disk") {
                                    if (_ReadyQueue.getSize() > 1) {
                                        //Set current pcb to on_disk and write it to disk
                                        _currentPCB.loc = "On_Disk";
                                        _krnFileSystemDeviceDriver.create("#" + _currentPCB.pid);
                                        _krnFileSystemDeviceDriver.writeHex("#" + _currentPCB.pid, _MemoryManager.getMemorySeg(_currentPCB.base, _currentPCB.limit));
                                        _FileSystemDisplay.updateDisplay();
                                        //Clear its data in memory
                                        _Memory.clearMemory();
                                        _MemoryManager.updateMemoryPartitionStatus();
                                    }
                                    //Get the pcb data on disk and move it to memory
                                    _loadedCode = _krnFileSystemDeviceDriver.readHex("#" + _nextPCB.pid);
                                    //Write the data from the disk to memory
                                    _MemoryManager.memoryCheck();
                                    //Remove the pcb data from disk
                                    _krnFileSystemDeviceDriver.delete("#" + _nextPCB.pid);
                                    _FileSystemDisplay.updateDisplay();
                                    //Update pcb as needed
                                    _nextPCB.loc = "In_Memory";
                                    _nextPCB.programCounter = _nextPCB.programCounter + _currentBase - _nextPCB.base;
                                    _nextPCB.base = _currentBase;
                                    _nextPCB.limit = _currentLimit;
                                    //_nextPCB.programCounter = _nextPCB.programCounter-_currentBase;
                                }
                                _ReadyQueue.enqueue(_currentPCB);
                                _currentPCB = _nextPCB;
                            }
                        }
                        //Update the Displays and registers
                        this.updateCPURegisters();
                        _currentPCB.processState = "Running";
                        this.updateCurrentPCBStatus();

                        //Set the quatumlocation back to 0 for the new process
                        _quantumLocation = 0;
                    }
                    //Add 1 to the quantum location
                    _quantumLocation = _quantumLocation + 1;
                }
            }
        }

        //FCFS algorithm
        public firstComeFirstServe(){
            if(_FirstComeFirstServe == true ) {
                //If the quantum is high enough RoundRobin becomes first come first serve
                _quantum = 10000000000000;
            }
            else{
                //if it is not enabled set it back to the original;
                _quantum = _originalQuantum;
            }
        }

        //Priority Algorithm
        public priority() {
            if(_Priority == true){

            }
        }

        //Will update the current PCB with the CPU registers
        public updatePCB(){
            //Set the current PCB registers to the current CPU ones.
            _currentPCB.programCounter = _CPU.PC;
            _currentPCB.acc = _CPU.Acc;
            _currentPCB.xReg = _CPU.Xreg;
            _currentPCB.yReg = _CPU.Yreg;
            _currentPCB.zFlag = _CPU.Zflag;
            //console.log(""+_currentPCB.processState);
        }

        //Will set the cpu registers to the information from the currentPCB
        public updateCPURegisters(){
            //Set the current CPU registers to the current PCB ones.
            _CPU.PC = _currentPCB.programCounter;
            _CPU.Acc = _currentPCB.acc;
            _CPU.Xreg = _currentPCB.xReg;
            _CPU.Yreg = _currentPCB.yReg;
            _CPU.Zflag = _currentPCB.zFlag;
            //console.log(_ReadyQueue.getPCB(0));
        }

        //Will update the information in CPU Status on index.html when called
        public updateCurrentPCBStatus(): void {
            _PCBStateDisplay.innerHTML = "" + _currentPCB.processState;
            _PCBPIDDisplay.innerHTML = "" + _currentPCB.pid;
            _PCBPCDisplay.innerHTML = "" + _currentPCB.programCounter;
            _PCBAccDisplay.innerHTML = "" + _currentPCB.acc;
            _PCBXRegDisplay.innerHTML = "" + _currentPCB.xReg;
            _PCBYRegDisplay.innerHTML ="" + _currentPCB.yReg;
            _PCBZFlagDisplay.innerHTML ="" + _currentPCB.zFlag;
            _PCBLocationDisplay.innerHTML ="" + _currentPCB.loc;
            //console.log("I RAN UPDATE");
        }

        //Will update the Readyqueue display with the PCB information of the PCBs inside it.
        public updateReadyQueueStatus(): void{
            this.clearReadyQueueStatus();
            if(_ReadyQueue.getSize() != 0){
                for(var x = 0; x< 6; x=x+1){
                    _RQPIDDisplay = <HTMLTableDataCellElement>document.getElementById("PID"+x);
                    _RQStateDisplay = <HTMLTableDataCellElement>document.getElementById("State"+x);
                    _RQPCDisplay = <HTMLTableDataCellElement>document.getElementById("PC"+x);
                    _RQAccDisplay = <HTMLTableDataCellElement>document.getElementById("Acc"+x);
                    _RQXRegDisplay = <HTMLTableDataCellElement>document.getElementById("XReg"+x);
                    _RQYRegDisplay = <HTMLTableDataCellElement>document.getElementById("YReg"+x);
                    _RQZFlagDisplay = <HTMLTableDataCellElement>document.getElementById("ZFlag"+x);
                    _RQLocationDisplay = <HTMLTableDataCellElement>document.getElementById("Loc"+x);
                    //console.log(""+_RQPIDDisplay.innerHTML);

                    //Store the PCB in the global variable.
                    _PCBAtLocation = _ReadyQueue.getPCB(x);

                    //Set the Ready queue display to the PCB contents
                    _RQPIDDisplay.innerHTML = "" + _PCBAtLocation.pid;
                    _RQStateDisplay.innerHTML = "" + _PCBAtLocation.processState;
                    _RQPCDisplay.innerHTML = "" + _PCBAtLocation.programCounter;
                    _RQAccDisplay.innerHTML = "" + _PCBAtLocation.acc;
                    _RQXRegDisplay.innerHTML = "" + _PCBAtLocation.xReg;
                    _RQYRegDisplay.innerHTML ="" + _PCBAtLocation.yReg;
                    _RQZFlagDisplay.innerHTML ="" + _PCBAtLocation.zFlag;
                    _RQLocationDisplay.innerHTML ="" + _PCBAtLocation.loc;
                }
            }

        }

        //Will clear the ready queue display when a process is no longer in it.
        public clearReadyQueueStatus(){
                for(var x = 0; x<2; x=x+1) {
                    //Grab the PID data cell
                    _RQPIDDisplay = <HTMLTableDataCellElement>document.getElementById("PID" + x);

                    //If the running PID matched on in the table clear the data for that PID
                    if(_currentPCB.pid == parseInt(_RQPIDDisplay.innerHTML)) {
                        _RQPIDDisplay = <HTMLTableDataCellElement>document.getElementById("PID" + x);
                        _RQStateDisplay = <HTMLTableDataCellElement>document.getElementById("State" + x);
                        _RQPCDisplay = <HTMLTableDataCellElement>document.getElementById("PC" + x);
                        _RQAccDisplay = <HTMLTableDataCellElement>document.getElementById("Acc" + x);
                        _RQXRegDisplay = <HTMLTableDataCellElement>document.getElementById("XReg" + x);
                        _RQYRegDisplay = <HTMLTableDataCellElement>document.getElementById("YReg" + x);
                        _RQZFlagDisplay = <HTMLTableDataCellElement>document.getElementById("ZFlag" + x);
                        _RQLocationDisplay = <HTMLTableDataCellElement>document.getElementById("Loc" + x);
                        //Set the display to empty
                        _RQPIDDisplay.innerHTML = " ";
                        _RQStateDisplay.innerHTML = " ";
                        _RQPCDisplay.innerHTML = " ";
                        _RQAccDisplay.innerHTML = " ";
                        _RQXRegDisplay.innerHTML = " ";
                        _RQYRegDisplay.innerHTML = " ";
                        _RQZFlagDisplay.innerHTML = " ";
                        _RQLocationDisplay.innerHTML = " ";
                    }
                }
            }

        public resetReadyQueueStatus(){
            for(var x =0; x<6; x++){
                _RQPIDDisplay = <HTMLTableDataCellElement>document.getElementById("PID" + x);

                _RQPIDDisplay = <HTMLTableDataCellElement>document.getElementById("PID" + x);
                _RQStateDisplay = <HTMLTableDataCellElement>document.getElementById("State" + x);
                _RQPCDisplay = <HTMLTableDataCellElement>document.getElementById("PC" + x);
                _RQAccDisplay = <HTMLTableDataCellElement>document.getElementById("Acc" + x);
                _RQXRegDisplay = <HTMLTableDataCellElement>document.getElementById("XReg" + x);
                _RQYRegDisplay = <HTMLTableDataCellElement>document.getElementById("YReg" + x);
                _RQZFlagDisplay = <HTMLTableDataCellElement>document.getElementById("ZFlag" + x);
                _RQLocationDisplay = <HTMLTableDataCellElement>document.getElementById("Loc" + x);
                //Set the display to empty
                _RQPIDDisplay.innerHTML = " ";
                _RQStateDisplay.innerHTML = " ";
                _RQPCDisplay.innerHTML = " ";
                _RQAccDisplay.innerHTML = " ";
                _RQXRegDisplay.innerHTML = " ";
                _RQYRegDisplay.innerHTML = " ";
                _RQZFlagDisplay.innerHTML = " ";
                _RQLocationDisplay.innerHTML = " ";
            }

        }

        //Will update the information in CPU Status on index.html when called
        public updateCPUStatus(): void {
            _PCDisplay.innerHTML = "" + _CPU.PC;
            _AccDisplay.innerHTML = "" + _CPU.Acc;
            _XRegDisplay.innerHTML = "" + _CPU.Xreg;
            _YRegDisplay.innerHTML ="" + _CPU.Yreg;
            _ZFlagDisplay.innerHTML ="" + _CPU.Zflag;
            //console.log("I RAN UPDATE");
        }


        public krnTimerISR() {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
        }

        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile


        //
        // OS Utility Routines
        //
        public krnTrace(msg: string) {
             // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
             if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would lag the browser very quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        Control.hostLog(msg, "OS");
                    }
                } else {
                    Control.hostLog(msg, "OS");
                }
             }
        }

        public krnTrapError(msg) {
            Control.hostLog("OS ERROR - TRAP: " + msg);
            //Will clear the Console and display a BSOD
            _OsShell.shellCls(0);
            _Canvas.style.backgroundColor="#000099";
            // TODO: Display error on console, perhaps in some sort of colored screen. (Maybe blue?)
            this.krnShutdown();
        }
    }
}
