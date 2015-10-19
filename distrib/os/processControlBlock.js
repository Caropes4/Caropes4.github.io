/**
 * Created by CharlieRopes on 10/18/15.
 */
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB() {
            //this.pid =
        }
        PCB.prototype.getPID = function () {
            return this.pid;
        };
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
