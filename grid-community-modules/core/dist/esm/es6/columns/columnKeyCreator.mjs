// class returns a unique id to use for the column. it checks the existing columns, and if the requested
// id is already taken, it will start appending numbers until it gets a unique id.
// eg, if the col field is 'name', it will try ids: {name, name_1, name_2...}
// if no field or id provided in the col, it will try the ids of natural numbers
import { toStringOrNull } from "../utils/generic.mjs";
export class ColumnKeyCreator {
    constructor() {
        this.existingKeys = {};
    }
    addExistingKeys(keys) {
        for (let i = 0; i < keys.length; i++) {
            this.existingKeys[keys[i]] = true;
        }
    }
    getUniqueKey(colId, colField) {
        // in case user passed in number for colId, convert to string
        colId = toStringOrNull(colId);
        let count = 0;
        while (true) {
            let idToTry;
            if (colId) {
                idToTry = colId;
                if (count !== 0) {
                    idToTry += '_' + count;
                }
            }
            else if (colField) {
                idToTry = colField;
                if (count !== 0) {
                    idToTry += '_' + count;
                }
            }
            else {
                // no point in stringing this, object treats it the same anyway.
                idToTry = count;
            }
            if (!this.existingKeys[idToTry]) {
                this.existingKeys[idToTry] = true;
                return String(idToTry);
            }
            count++;
        }
    }
}
