<script type="ts">
  import ColorHash from "color-hash";
  import { flip } from "svelte/animate";
  import { Process } from "$lib/scheduling/Process";
  import type { Scheduler } from "$lib/scheduling/Scheduler";
  import { FCFSScheduler } from "$lib/scheduling/FCFSScheduler";
  import { TimeTable } from "$lib/scheduling/TimeTable";

  let colorHash: ColorHash = new ColorHash();
  let solvers: any[] = [
    ["FCFS", (processes: Process[]) => new FCFSScheduler(processes)],
  ];

  let selectedSolver = solvers[0][0];

  let totalProcessingTime = 2;
  let uidPIDMapper: Map<number, number> = new Map();
  let processes: Process[] = [];
  let desiredStep = 999;
  //   Create dummy processes
  let uid = 0;

  processes.push(new Process(uid++, 0, 1, 0));
  // processes.push(new Process(uid++, 5, 1, 0));

  let solver = new FCFSScheduler(processes);
  let timetable = solver.getTimeTable();
  totalProcessingTime = solver.totalProcessingTime;
  addProcess();

  function addProcess() {
    // Get the latest arrival time
    let latestArrivalTime = processes.reduce(
      (latest, process) => Math.max(latest, process.arrivalTime),
      0
    );
    processes.push(
      new Process(
        uid++,
        latestArrivalTime + 1,
        1 + Math.floor(Math.random() * 10),
        0
      )
    );
    processes = processes;
    let sorted = processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    for (let i = 0; i < sorted.length; i++) {
      uidPIDMapper.set(sorted[i].uid, i + 1);
    }

    solver = new FCFSScheduler(sorted);
    totalProcessingTime = solver.totalProcessingTime;

    onChange();
    solver = solver;
  }

  function onChange() {
    // for (let i = 0; i < sorted.length; i++) {
    //   sorted[i].finishTime = 0;
    //   sorted[i].waitingTime = 0;
    //   sorted[i].turnaroundTime = 0;
    // }
    solver = new FCFSScheduler(processes);
    timetable = solver.getTimeTable(desiredStep);
    timetable = TimeTable.fillGaps(
      timetable,
      solver.originalTotalProcessingTime
    );
    processes = processes;
    solver = solver;
  }

  $: {
    desiredStep;
    onChange();
  }
</script>

<div class="flex  flex-wrap gap-x-4 gap-y-4">
  <!-- Solver picker, steps, buttons -->
  <div class="flex flex-1 flex-col items-start gap-8">
    <label class="input-group ">
      <span>Solver</span>
      <select bind:value={selectedSolver} class="select select-bordered flex-1">
        {#each solvers as solver}
          <option>{solvers[0][0]}</option>
        {/each}
      </select>
    </label>

    <label class="input-group flex-1 w-86">
      <span>Steps</span>
      <input
        id="desiredStep"
        bind:value={desiredStep}
        type="range"
        min="0"
        max={totalProcessingTime}
        class="range flex-1"
      />
    </label>

    <button
      class="w-full btn btn-accent mb-4 ml-4 flex-1"
      on:click={addProcess}
    >
      Add Process
    </button>
  </div>

  <!-- Arriving / Ready queues -->
  <div class="flex flex-1  m-4 flex-wrap gap-8">
    <div class="flex-1 card max-h-64 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Arriving</h2>
        <div class="flex flex-wrap">
          {#each processes.filter((proc) => proc.arrivalTime > desiredStep) as q}
            <div class="btn btn-sm">
              {uidPIDMapper.get(q.uid) ?? "?"}
            </div>
          {/each}
        </div>
      </div>
    </div>
    <div class="flex-1 max-h-64 card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Ready Queue</h2>
        <div class="flex flex-wrap">
          {#each solver.readyQueue as q}
            <div class="btn btn-sm">
              {q.uid}
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Solver current queue -->
<div>
  <!-- Chart -->
  <div class="flex w-full min-h-40 flex-wrap">
    {#each timetable as t, index}
      {#if t.uid == -1}
        <div class="flex-1 grid bg-neutral" style="flex: {t.end - t.start}" />
      {:else}
        <div class="flex-1 " style="flex: {t.end - t.start}">
          <span class="bg-neutral grid justify-center"
            >{uidPIDMapper.get(t.uid) ?? "?"}</span
          >
          <div
            style="background: {colorHash.hex(t.uid.toString())};"
            class="h-32 flex justify-between items-end"
          >
            <span class="btn btn-sm -translate-x-4">{t.start}</span>
            <span class="btn btn-sm translate-x-4">{t.end}</span>
          </div>
        </div>
      {/if}
    {/each}
  </div>

  <!-- Html table with -->
  <!-- ProcessID, Arrival Time, Burst Time, Priority -->

  <div class="overflow-auto overflow-y-hidden">
    <table class="table table-compact w-full ">
      <thead>
        <tr>
          <th>P ID</th>
          <th>Arrival T</th>
          <th>Burst T</th>
          <th>Priority</th>
          <th>Finish T</th>
          <th>Turnaround T</th>
          <th>Waiting T</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {#each processes.sort((a, b) => a.arrivalTime - b.arrivalTime) as process, index (process.uid)}
          <tr animate:flip={{ duration: 100 }}>
            <td>P{uidPIDMapper.get(process.uid) ?? "?"}</td>
            <td>
              <input
                type="number"
                placeholder="0"
                value={process.arrivalTime}
                on:change={(e) => {
                  e.preventDefault();
                  process.arrivalTime = parseInt(e.target.value);
                  onChange();
                }}
                class="input input-accent"
              />
            </td>

            <td>
              <input
                type="number"
                placeholder="0"
                value={process.burstTime}
                on:change={(e) => {
                  e.preventDefault();
                  process.burstTime = parseInt(e.target.value);
                  onChange();
                }}
                class="input input-accent"
              />
            </td>
            <td>
              <input
                type="number"
                placeholder="0"
                value={process.priority}
                on:change={(e) => {
                  e.preventDefault();
                  process.priority = parseInt(e.target.value);
                  onChange();
                }}
                class="input input-accent"
              />
            </td>
            <td>{process.finishTime}</td>
            <td>{process.turnaroundTime}</td>
            <td>{process.waitingTime}</td>
            <!-- Delete button -->
            <td>
              <button
                class="btn btn-error btn-outline w-full"
                on:click={() => {
                  processes.splice(index, 1);
                  processes = processes;
                  solver = new FCFSScheduler(processes);
                  totalProcessingTime = solver.totalProcessingTime;
                  onChange();
                }}
              >
                <i class="fa fa-trash text-error" />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  td > input {
    width: 100%;
  }

  * {
    word-wrap: break-word; /*old browsers*/
    overflow-wrap: break-word;
  }
</style>
