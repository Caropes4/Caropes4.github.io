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
const APP_NAME: string    = "TSOS";   // 'cause Bob and I were at a loss for a better name.
const APP_VERSION: string = "Apple_Pie";   // What did you expect?

const CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

const TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                              // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ: number = 1;
const PRINT_INT_IRQ: number =2; //Print Int
const PRINT_STR_IRQ: number =3; //Print String
const BREAK_OPERATION_IRQ: number = 4; //For break op
const CPU_SCHEDULER_IRQ: number = 5; //For cpu scheduler.
const INVALID_OPCODE_IRQ: number = 6; //For invalid op codes.
const MEMORY_OUT_OF_BOUNDS_IRQ: number = 7; //For cpu scheduler.

//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _Memory: TSOS.Memory; // Utilize TypeScript's type annotation system to ensure that _Memory is an instance of the Memory class
var _MemoryManager: TSOS.MemoryManager; // Utilize TypeScript's type annotation system to ensure that _MemoryManager is an instance of the MemoryManager class
var _MemoryDisplay: TSOS.MemoryDisplay; // Utilize TypeScript's type annotation system to ensure that _MemoryDisplay is an instance of the MemoryDisplay class
//var _FileSystemDeviceDriver: TSOS.FileSystemDeviceDriver; // Utilize TypeScript's type annotation system to ensure that _FileSystemDeviceDriver is an instance of the FileSystemDeviceDriver class
var _FileSystemDisplay: TSOS.FileSystemDisplay; // Utilize TypeScript's type annotation system to ensure that _FileSystemDisplay is an instance of the FileSystemDisplay class
var _ReadyQueueDisplay: TSOS.ReadyQueueDisplay;


var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement;         // Initialized in Control.hostInit().
var _DrawingContext: any; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;              // Additional space added to font size when advancing a line.

var _Trace: boolean = true;  // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue;          // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue: any = null;  // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers: any[] = null;   // when clearly 'any' is not what we want. There is likely a better way, but what is it?

//Initialize the Ready, Resident, and Terminated Queues in Control.hostInit()
var _ReadyQueue: any = null;
var _ResidentQueue: any = null;
var _TerminatedQueue: any = null;

// Standard input and output
var _StdIn;    // Same "to null or not to null" issue as above.
var _StdOut;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
var _krnFileSystemDeviceDriver

var _hardwareClockID: number = null;

var _nextProcessID: number = 0;

var _currentPCB: TSOS.PCB;
var _nextPCB: TSOS.PCB;
//Var for updating the ready queue
var _PCBAtLocation: TSOS.PCB;
var _currentMemory: any [];
var _memoryTableDisplay: HTMLTableElement;
var _currentDisk: any [];
var _fileSystemTableDisplay: HTMLTableElement;
var _readyQueueTableDisplay: HTMLTableElement;
var _MemoryCheckStatus: string;

//The current base and limit to be used when going through memory
var _currentBase = 0;
var _currentLimit = 0;
//Booleans to distinguish if a block of memory is free or not
var _block1Empty : boolean = true;
var _block2Empty : boolean = true;
var _block3Empty : boolean = true;
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
var _originalQuantum = 6;
var _quantumLocation = 0;

//Add global variables for CPU registers
var _PCDisplay: HTMLTableDataCellElement;
var _AccDisplay: HTMLTableDataCellElement;
var _XRegDisplay: HTMLTableDataCellElement;
var _YRegDisplay: HTMLTableDataCellElement;
var _ZFlagDisplay: HTMLTableDataCellElement;

//Add global variables for Current PCB
var _PCBPIDDisplay: HTMLTableDataCellElement;
var _PCBPCDisplay: HTMLTableDataCellElement;
var _PCBAccDisplay: HTMLTableDataCellElement;
var _PCBXRegDisplay: HTMLTableDataCellElement;
var _PCBYRegDisplay: HTMLTableDataCellElement;
var _PCBZFlagDisplay: HTMLTableDataCellElement;
var _PCBStateDisplay: HTMLTableDataCellElement;
var _PCBLocationDisplay: HTMLTableDataCellElement;


//Add globals for Ready Queue display
var _RQPIDDisplay: HTMLTableDataCellElement;
var _RQStateDisplay: HTMLTableDataCellElement;
var _RQPCDisplay: HTMLTableDataCellElement;
var _RQAccDisplay: HTMLTableDataCellElement;
var _RQXRegDisplay: HTMLTableDataCellElement;
var _RQYRegDisplay: HTMLTableDataCellElement;
var _RQZFlagDisplay: HTMLTableDataCellElement;
var _RQLocationDisplay: HTMLTableDataCellElement;


//Holds the string containing the instructions.
var _loadedCode: string = "";

var _tracks = 4;
var _sectors = 8;
var _blocks = 8;
var _fileExists : boolean = false;
var _success : boolean = false;
//Set Schedule
var _RoundRobin : boolean = true;
var _FirstComeFirstServe : boolean = false;
var _Priority : boolean = false;


// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};
