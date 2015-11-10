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
                    _currentPCB.processState = "terminated";
                    _TerminatedQueue.enqueue(_currentPCB);

                    //Set the quatumlocation back to 0 for the new process
                    _quantumLocation = 0;

                    //Clear the memory since process is done running. And update the status
                    _Memory.clearMemory();
                    _MemoryManager.updateMemoryPartitionStatus();

                    //If the ready queue still has PCBs in it grab the next one and continue running
                    if(_ReadyQueue.getSize() != 0) {
                        _currentPCB = _ReadyQueue.dequeue();
                        this.updateCPURegisters();
                        _currentPCB.processState = "running";
                    }
                    else if(_ReadyQueue.getSize() == 0 && _currentPCB.processState == "terminated"){
                        _CPU.isExecuting = false;
                        _Console.advanceLine();
                        _Console.putText(_OsShell.promptStr);
                        _Console.putText("Program no longer Executing.");
                        _Console.advanceLine();
                        _Console.putText(_OsShell.promptStr);
                    }
                    _MemoryDisplay.updateDisplay();
                    _CPU.updateCPUStatus();
                    break;

                //Runs round robin
                case CPU_SCHEDULER_IRQ:
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

        public roundRobin(){
            //Round robin
            if (_ReadyQueue.getSize() != 0) {
                if (_quantumLocation == _quantum) {
                    //Save the current CPU registers in the current PCB
                    this.updatePCB();
                    //Place the PCB back in the ready queue.
                    if(_currentPCB.processState != "terminated") {
                        _currentPCB.processState = "waiting";
                        _ReadyQueue.enqueue(_currentPCB);
                    }
                    //Grab the next PCB
                    _currentPCB = _ReadyQueue.dequeue();
                    if(_currentPCB.processState == "terminated"){
                        _currentPCB = _ReadyQueue.dequeue();
                    }
                    this.updateCPURegisters();
                    _currentPCB.processState = "running";
                    //Set the quatumlocation back to 0 for the new process
                    _quantumLocation = 0;
                }
                //Add 1 to the quantum location
                _quantumLocation = _quantumLocation + 1;
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

        //Will set the cpu registers to the information form the currentPCB
        public updateCPURegisters(){
            //Set the current CPU registers to the current PCB ones.
            _CPU.PC = _currentPCB.programCounter;
            _CPU.Acc = _currentPCB.acc;
            _CPU.Xreg = _currentPCB.xReg;
            _CPU.Yreg = _currentPCB.yReg;
            _CPU.Zflag = _currentPCB.zFlag;
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
