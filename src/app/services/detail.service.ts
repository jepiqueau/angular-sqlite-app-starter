import { Injectable } from '@angular/core';
@Injectable()

export class DetailService {
    private _existingConn: boolean;
    private _exportJson: boolean;

    constructor() {
    }
    setExistingConnection(value:boolean) {
        this._existingConn = value;
    }
    getExistingConnection(): boolean {
        console.log(`in getExistingConnection ${this._existingConn}`)
        return this._existingConn;
    }
    setExportJson(value:boolean) {
        this._exportJson = value;
    }
    getExportJson(): boolean {
        console.log(`in getExportJson ${this._exportJson}`)
        return this._exportJson;
    }
}
