import type { Command } from "$lib/common/Command";
import type { Process } from "./Process";
import type { TimeTable } from "./TimeTable";


export class PushCommand<T> implements Command {
    constructor(public array: T[], public item: T) {
    }

    execute() {
        this.array.push(this.item);
    }

    undo() {
        this.array.pop();
    }
}

export class PopCommand<T> implements Command {
    item: T | undefined;
    constructor(public array: T[]) {
    }

    execute() {
        this.item = this.array.pop();
    }

    undo() {
        if (this.item) {
            this.array.push(this.item);
        }
    }
}

export abstract class Scheduler {
    public readyQueue: Process[] = [];
    public totalProcessingTime = 0;
    public readonly originalTotalProcessingTime;
    public history: Command[] = [];

    constructor(public readonly processes: Process[]) {
        this.init();
        this.getTimeTable();
        this.originalTotalProcessingTime = this.totalProcessingTime;
    }



    protected init() { }

    public abstract getTimeTable(maxT?: number): TimeTable[];
}
