


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
}