


export class TimeTable {
    constructor(public start: number, public end: number, public uid: number = -1) { }


    // Given a list of non overlapping time tables, return the list of the tables
    // but add time tables with uid -1 between them
    public static fillGaps(timeTable: TimeTable[], maxTime: number = -1): TimeTable[] {
        const result: TimeTable[] = [];
        let lastEnd = 0;
        timeTable.forEach((table) => {
            if (table.start > lastEnd) {
                result.push(new TimeTable(lastEnd, table.start, -1));
            }
            result.push(table);
            lastEnd = table.end;
        });
        if (lastEnd < maxTime) {
            result.push(new TimeTable(lastEnd, maxTime, -1));
        }
        return result;
    }

    // Given a list of time tables, simplify neighbouring time tables with the same uid
    // They are considered neighbours if a.start == b.end or a.end == b.start and a.uid == b.uid
    public static simplify(timeTable: TimeTable[]): TimeTable[] {
        const result: TimeTable[] = [];
        let changed = true;
        for (let i = 0; i < timeTable.length; i++) {
            let compare = result[result.length - 1];
            // if comporae is undefined, we are at the start of the list
            if (!compare) {
                result.push(timeTable[i]);
                continue;
            }

            let toMerge = timeTable[i];

            // Check if we can merge with the last table
            if (toMerge.start === compare.end && toMerge.uid === compare.uid) {
                compare.end = toMerge.end;
            } else {
                result.push(toMerge);
            }
        }
        return result;
    }
}