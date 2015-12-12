/**
 * Created by CharlieRopes on 12/11/15.
 */
module TSOS {

    export class FileSystemDisplay {

        constructor(public table : HTMLTableElement) {
        }

        public init():void {
            this.table = _fileSystemDisplay;
            //this.row = null;
            //this.cell = null;

            //this.initRows();
        }