

// Process data class with, name, arrival time, busrt time and priority

export class Process {
    public executionTime: number = 0;
    public finishTime: number = 0;
    public turnaroundTime: number = 0;
    public waitingTime: number = 0;

    constructor(
        public uid: number,
        public arrivalTime: number,
        public burstTime: number,
        public priority: number
    ) { }
}