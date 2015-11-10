/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */
//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
var APP_NAME = "TSOS"; // 'cause Bob and I were at a loss for a better name.
var APP_VERSION = "Apple_Pie"; // What did you expect?
var CPU_CLOCK_INTERVAL = 100; // This is in ms (milliseconds) so 1000 = 1 second.
var TIMER_IRQ = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;
var PRINT_INT_IRQ = 2; //Print Int
var PRINT_STR_IRQ = 3; //Print String
var BREAK_OPERATION_IRQ = 4; //For break op
var CPU_SCHEDULER_IRQ = 5; //For cpu scheduler.
var INVALID_OPCODE_IRQ = 6; //For invalid op codes.
var MEMORY_OUT_OF_BOUNDS_IRQ = 7; //For cpu scheduler.
//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU; // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _Memory; // Utilize TypeScript's type annotation system to ensure that _Memory is an instance of the Memory class
var _MemoryManager; // Utilize TypeScript's type annotation system to ensure that _MemoryManager is an instance of the MemoryManager class
var _MemoryDisplay; // Utilize TypeScript's type annotation system to ensure that _MemoryDisplay is an instance of the MemoryDisplay class
var _OSclock = 0; // Page 23.
var _Mode = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
var _Canvas; // Initialized in Control.hostInit().
var _DrawingContext; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.
var _Trace = true; // Default the OS trace to be on.
// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue; // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue = null; // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers = null; // when clearly 'any' is not what we want. There is likely a better way, but what is it?
//Initialize the Ready, Resident, and Terminated Queues in Control.hostInit()
var _ReadyQueue = null;
var _ResidentQueue = null;
var _TerminatedQueue = null;
// Standard input and output
var _StdIn; // Same "to null or not to null" issue as above.
var _StdOut;
// UI
var _Console;
var _OsShell;
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
var _hardwareClockID = null;
var _nextProcessID = 0;
var _currentPCB;
var _currentMemory;
var _memoryTableDisplay;
var _MemoryCheckStatus;
//The current base and limit to be used when going through memory
var _currentBase = 0;
var _currentLimit = 0;
//Booleans to distinguish if a block of memory is free or not
var _block1Empty = true;
var _block2Empty = true;
var _block3Empty = true;
//The limit for eack block of memory
var _limit1 = 256;
var _limit2 = 512;
var _limit3 = 768;
//The base for each block of memory
var _base1 = 0;
var _base2 = 256;
var _base3 = 512;
//Initialize a global quantum variable
var _quantum = 6;
var _quantumLocation = 0;
//Add global variables for CPU registers
var _PCDisplay;
var _AccDisplay;
var _XRegDisplay;
var _YRegDisplay;
var _ZFlagDisplay;
//Holds the string containing the instructions.
var _loadedCode = "";
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
