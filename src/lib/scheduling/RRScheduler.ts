import { compute_rest_props } from "svelte/internal";
import type { Process } from "./Process";
import { Scheduler } from "./Scheduler";
import { TimeTable } from "./TimeTable";




export class RRScheduler extends Scheduler {
    constructor(proccesses: Process[], public quantum: number = 2) {
        super(proccesses);
    }

    public getTimeTable(maxT: number = Number.MAX_VALUE): TimeTable[] {
        if (this.processes.length === 0) {
            return [];
        };
        console.log("#############")

        // Sort by lowest priority number
        this.processes.sort((a, b) =>
            (a.priority === b.priority) ? a.arrivalTime - b.arrivalTime : a.priority - b.priority
        );

        let procs = this.processes.slice();
        let pointed = 0;
        let timetable: TimeTable[] = [];

        // t is min arrivaltime
        let t = this.processes.reduce((prev, cur) => Math.min(prev, cur.arrivalTime), Number.MAX_VALUE);
        this.readyQueue = [];
        let n_iter = 0;
        this.quantum = 2;
        let quantum_left = this.quantum;
        let nSkips = 0;

        console.log(procs);
        while (true) {


            if (nSkips > procs.length) {
                console.log("Skipping all processes");
                console.log("t", t);
                console.log(procs);
                t++;
                nSkips = 0;
                continue
            }

            // Check if everything is done
            let done = procs.every((p) => p.remainingTime <= 0);
            if (done) {
                console.log("Done");
                break;
            }

            let curProc = procs[pointed];
            // Check if the process already finished
            if (curProc.arrivalTime > t || curProc.remainingTime <= 0) {
                pointed = (pointed + 1) % procs.length;
                nSkips++;

                continue
            }
            nSkips = 0


            // Check if there is any process arriving at t whose priority is higher than the current process (lower priority number)
            let arriving = procs.filter(p => p.arrivalTime === t && p !== curProc);
            // console.log("Arriving: ", arriving);
            let nextProc = arriving.find(p => p.priority < curProc.priority);

            if (nextProc) {
                // console.log("Interrupting", curProc.uid, "by", nextProc.uid, "at time", t);
                pointed = procs.indexOf(nextProc);
                quantum_left = this.quantum;
                continue;
            } else {
                // console.log("Process: ", curProc.uid, " at time: ", t, "remaining: ", curProc.remainingTime);
            }


            curProc.executionTime += 1;
            quantum_left = quantum_left - 1;
            t++;

            if (curProc.remainingTime <= 0) {
                curProc.finishTime = t;
                curProc.turnaroundTime = curProc.finishTime - curProc.arrivalTime;
                curProc.waitingTime = curProc.turnaroundTime - curProc.burstTime;
            }

            if (quantum_left <= 0 || curProc.remainingTime <= 0) {
                console.log("Quantum ended");
                quantum_left = this.quantum;
                pointed = (pointed + 1) % procs.length;
            }

            if (t > maxT) {
                break;
            }

            timetable.push(
                new TimeTable(
                    Math.max(0, t - 1),
                    t,
                    curProc.uid
                )
            );
        }
        this.readyQueue = procs.filter(p => p.remainingTime > 0 && p.arrivalTime < t);
        console.log(procs)
        // throw new Error("Stop");
        this.totalProcessingTime = t;
        // Set arriving to all processes that are less than maxT
        timetable = TimeTable.simplify(timetable);
        timetable = TimeTable.fillGaps(timetable, this.totalProcessingTime);
        // Set all execution times to 0
        this.processes.forEach(p => p.executionTime = 0);
        this.totalProcessingTime = t;
        return timetable;

    }
}