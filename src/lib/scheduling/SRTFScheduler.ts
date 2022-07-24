import { compute_rest_props } from "svelte/internal";
import type { Process } from "./Process";
import { Scheduler } from "./Scheduler";
import { TimeTable } from "./TimeTable";




export class SRTFScheduler extends Scheduler {
    public getTimeTable(maxT: number = Number.MAX_VALUE): TimeTable[] {
        if (this.processes.length === 0) {
            return [];
        };

        // Sort by lowest arrival time and burst time
        this.processes.sort((a, b) =>
            (a.arrivalTime === b.arrivalTime) ? a.burstTime - b.burstTime : a.arrivalTime - b.arrivalTime
        );

        let procs = this.processes.slice();

        let timetable: TimeTable[] = [];
        let maxArrivalTime: number = 0;
        procs.forEach((process) => {
            if (process.arrivalTime > maxArrivalTime) {
                maxArrivalTime = process.arrivalTime;
            }
        });

        this.readyQueue = [];
        let t = procs[0].arrivalTime;
        let curProc = procs.shift() as Process;

        let remaining = curProc.burstTime - curProc.executionTime;
        let n_iter = 0;
        while (curProc) {
            n_iter++;
            if (n_iter > 500) {
                console.error("Infinite loop detected");
                break;
            }


            remaining = curProc.burstTime - curProc.executionTime;
            if (remaining > 0) {
                curProc.executionTime += 1;
                t++;
                remaining = curProc.burstTime - curProc.executionTime;
            }


            if (t > maxT) {
                break;
            }
            if (remaining <= 0) {
                curProc.finishTime = t;
                curProc.turnaroundTime = curProc.finishTime - curProc.arrivalTime;
                curProc.waitingTime = curProc.turnaroundTime - curProc.burstTime;
                // t += 1;
            }
            timetable.push(
                new TimeTable(
                    Math.max(0, t - 1),
                    t,
                    curProc.uid
                )
            );

            if (remaining <= 0 && procs.length == 0 && this.readyQueue.length === 0) {
                break;
            }

            // Add all arriving processes to the ready queue
            procs.forEach((proc) => {
                if (proc.arrivalTime === t) {
                    this.readyQueue.push(proc);
                }
            });
            // Remove them from the list
            procs = procs.filter((proc) => proc.arrivalTime !== t);

            // Sort by remaining time
            this.readyQueue.sort((a, b) =>
                (a.burstTime - a.executionTime) - (b.burstTime - b.executionTime)
            );



            // If curProc remaining is less than readyQueue[0].burstTime, replace it with readyQueue[0]
            // if curProc remaining is less than 0, its actually finished, so we don't add it
            if (this.readyQueue.length > 0) {
                let smallestRemaining = this.readyQueue[0].burstTime - this.readyQueue[0].executionTime;
                if (smallestRemaining < remaining || remaining <= 0) {
                    // Swap with smallest remaining
                    let temp = this.readyQueue.shift();
                    if (remaining > 0) {
                        this.readyQueue.push(curProc);
                    }
                    curProc = temp as Process;
                    // Sort by remaining time
                    this.readyQueue.sort((a, b) =>
                        (a.burstTime - a.executionTime) - (b.burstTime - b.executionTime)
                    );
                }
            }

            // Check if process is over and no other in ready queue
            remaining = curProc.burstTime - curProc.executionTime;
            if (remaining <= 0 && this.readyQueue.length === 0) {
                curProc.finishTime = t - 1;
                curProc.turnaroundTime = curProc.finishTime - curProc.arrivalTime;
                curProc.waitingTime = curProc.turnaroundTime - curProc.burstTime;
                if (procs.length > 0) {
                    t = procs[0].arrivalTime;// fast forward to next process arrival time
                    curProc = procs.shift() as Process;
                }

                // If its still undefined, we're done
                if (!curProc) {
                    break;
                }
            }
        }
        this.totalProcessingTime = t;
        // Set arriving to all processes that are less than maxT
        timetable = TimeTable.simplify(timetable);
        timetable = TimeTable.fillGaps(timetable, this.totalProcessingTime);
        // Set all execution times to 0
        this.processes.forEach((proc) => {
            proc.executionTime = 0;
        });
        this.totalProcessingTime = t;
        return timetable;

    }
}