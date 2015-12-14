/**
 * Created by CharlieRopes on 12/14/15.
 */
var TSOS;
(function (TSOS) {
    var ReadyQueueDisplay = (function () {
        function ReadyQueueDisplay(table) {
            this.table = table;
        }
        ReadyQueueDisplay.prototype.init = function () {
            this.table = _readyQueueTableDisplay;
        };
        return ReadyQueueDisplay;
    })();
    TSOS.ReadyQueueDisplay = ReadyQueueDisplay;
})(TSOS || (TSOS = {}));
