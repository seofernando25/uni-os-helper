import type { Process } from "./Process";
import { Scheduler } from "./Scheduler";
import { TimeTable } from "./TimeTable";




export class SJFScheduler extends Scheduler {
    public getTimeTable(maxT: number = Number.MAX_VALUE): TimeTable[] {
        if (this.processes.length === 0) {
            return [];
        };

        let procs = this.processes.slice();
        let timetable: TimeTable[] = [];
        let maxArrivalTime: number = 0;
        this.processes.forEach((process) => {
            if (process.arrivalTime > maxArrivalTime) {
                maxArrivalTime = process.arrivalTime;
            }
        });
        // Sort by arrival time
        this.processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
        this.readyQueue = [];
        let t = this.processes[0].arrivalTime;
        let curProc = procs.shift() as Process;
        while (curProc) {

            // Add all processes who's start time are between start and end of current time
            procs.forEach((proc) => {
                if (proc.arrivalTime <= curProc.arrivalTime + curProc.burstTime) {
                    this.readyQueue.push(proc);
                }
            });


            curProc.finishTime = t + curProc.burstTime;
            curProc.turnaroundTime = curProc.finishTime - curProc.arrivalTime;
            curProc.waitingTime = curProc.turnaroundTime - curProc.burstTime;
            timetable.push(
                new TimeTable(
                    t,
                    Math.min(curProc.finishTime, maxT),
                    curProc.uid
                )
            );
            t += curProc.burstTime;

            if (t > maxT) {
                break;
            }
            // Remove them from the list
            procs = procs.filter((proc) => proc.arrivalTime > curProc.arrivalTime + curProc.burstTime);

            // If there are no processes left, we are done
            if (this.readyQueue.length + procs.length == 0) {
                break;
            }


            // Add the subsequent processes from the queue
            if (this.readyQueue.length > 0) {
                // Sort ready queue by burst time
                this.readyQueue.sort((a, b) => a.burstTime - b.burstTime);
                curProc = this.readyQueue.shift() as Process;
            } else {
                curProc = procs.shift() as Process;
                t = curProc.arrivalTime;
            }
        }

        // Remove items in processQueue that are less than maxT
        this.readyQueue = this.readyQueue.filter((proc) => proc.arrivalTime <= maxT);
        // Set arriving to all processes that are less than maxT
        timetable = TimeTable.fillGaps(timetable, t);
        this.totalProcessingTime = t;
        return timetable;
    }

}