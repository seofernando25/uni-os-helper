

// Process data class with, name, arrival time, busrt time and priority

export class Process {
    public executionTime: number = 0;
    public finishTime: number = 0;
    public turnaroundTime: number = 0;
    public waitingTime: number = 0;


    get remainingTime(): number {
        return this.burstTime - this.executionTime;
    }

    constructor(
        public uid: number,
        public arrivalTime: number,
        public burstTime: number,
        public priority: number
    ) { }

    public clone(): Process {
        return new Process(this.uid, this.arrivalTime, this.burstTime, this.priority);
    }
}