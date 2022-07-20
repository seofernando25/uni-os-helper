<script lang="ts">
  import Fa from "svelte-fa";
  import {
    faArrowRight,
    faCheck,
    faCircle,
    faXmark,
  } from "@fortawesome/free-solid-svg-icons";
  import { LRUReplacement } from "@lib/pageReplacement/LRUReplacement";
  import type { Command } from "@lib/pageReplacement/Command";
  import type {
    PageReference,
    PageReplacement,
  } from "@lib/pageReplacement/PageReplacement";
  import { FIFOReplacement } from "@lib/pageReplacement/FIFOReplacement";

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  let solvers: [string, (size: number, symbol: any[]) => PageReplacement][] = [
    ["LRU", (refStr, size) => new LRUReplacement(refStr, size)],
    ["FIFO", (refStr, size) => new FIFOReplacement(refStr, size)],
  ];

  let selectedSolver = solvers[1][0];
  let referenceString: string = "1 2 3 4 2 1 5 6 2 1 2 3 7 6 3 2 1 2 3 6";
  let frameSize: number = 4;
  let pageReplacement: PageReplacement;
  let pages: PageReference[];
  let faultHistory: boolean[];
  let steps: Command[];
  let symbols: any[] = [];
  let symbolCount: number = 0;
  let desiredStep = -1;
  let curStep = -1;
  let solverCtor = solvers.find(([name, _]) => name === selectedSolver)[1];
  updatePage(referenceString, frameSize, solverCtor);

  let currentRowElement: HTMLElement = null;

  // convert refs to array of ints

  $: {
    faultHistory = [];
    console.log(selectedSolver);
    let solverCtor = solvers.find(([name, _]) => name === selectedSolver)[1];
    updatePage(referenceString, frameSize, solverCtor);
    symbolCount = new Set(symbols).size;
  }

  function updatePage(
    referenceString: string,
    frameSize: number,
    solverCtor: (size: number, symbols: string[]) => PageReplacement
  ) {
    //Replace , ; and spaces with a space
    symbols = referenceString
      .trim()
      .replace(/[,;:.|]/g, " ")
      .split(/\s+/);
    pageReplacement = solverCtor(frameSize, symbols);
    // convert refs to array of ints
    pages = pageReplacement.pages;
    steps = pageReplacement.getSteps();
    faultHistory = pageReplacement.faultHistory;
    curStep = -1;
    desiredStep = curStep;
  }

  $: {
    while (curStep != desiredStep) {
      if (desiredStep > curStep) {
        steps[curStep + 1]?.execute();
        curStep++;
      } else {
        steps[curStep]?.undo();
        curStep--;
      }
      if (currentRowElement) {
        if (!isMobile) {
          currentRowElement.scrollIntoView({
            behavior: "auto",
            block: "center",
          });
        }
      }
    }
    pages = pages;
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-4">
  <div>
    <div class="prose">
      <h1>Page Replacement Algorithms</h1>
    </div>

    <div class="grid gap-y-8">
      <!-- Select Solver -->
      <label class="input-group input-group-vertical">
        <span>Solver</span>
        <select bind:value={selectedSolver} class="select select-bordered ">
          {#each solvers as solver}
            <option>{solver[0]}</option>
          {/each}
        </select>
      </label>
      <!-- Reference String -->
      <label class="input-group input-group-vertical">
        <span>Reference String</span>
        <input
          bind:value={referenceString}
          class="input input-bordered"
          type="text"
          placeholder="1 2 3 4 2 1 5 6 2 1 2 3 7 6 3 2 1 2 3 6"
        />
      </label>
      <!-- Frame Size -->
      <label class="input-group input-group-vertical">
        <span>Frame Size</span>
        <input
          bind:value={frameSize}
          class="input input-bordered"
          type="number"
          placeholder="4"
        />
      </label>
      <label for="stepsRange"
        >Steps:

        <input
          id="stepsRange"
          bind:value={desiredStep}
          type="range"
          min="-1"
          max={steps.length - 1}
          class="range  "
        />
        <div class="flex justify-between ">
          <Fa icon={faCircle} class="ml-1" />
          {#each faultHistory as fault}
            {#if fault}
              <Fa icon={faXmark} class="text-error" />
            {:else}
              <Fa icon={faCheck} class="text-success" />
            {/if}
          {/each}
        </div>
      </label>
    </div>
  </div>

  <div class="grid grid-cols-1  gap-y-8">
    <div class="stats shadow  ">
      <div class="stat ">
        <div class="stat-title">References</div>
        <div class="stat-value">{symbolCount} unique</div>
        <div class="stat-desc ">out of {symbols.length}</div>
      </div>
    </div>

    <div class="stats stats-vertical sm:stats-horizontal ">
      <div class="stat shadow text-success">
        <div class="stat-figure">
          <Fa icon={faCheck} scale="3" />
        </div>
        <div class="stat-title ">Hit Rate</div>
        <div class="stat-value">
          {(
            (faultHistory.filter((f) => !f).length / faultHistory.length) *
            100
          ).toFixed(2)}%
        </div>
        <div class="stat-desc">
          {faultHistory.filter((f) => !f).length}/{faultHistory.length}
        </div>
      </div>

      <div class=" stat shadow ">
        <div class="stat text-error">
          <div class="stat-figure ">
            <Fa icon={faXmark} scale="3" />
          </div>
          <div class="stat-title">Fault Rate</div>
          <div class="stat-value ">
            {(
              (faultHistory.filter((f) => f).length / faultHistory.length) *
              100
            ).toFixed(2)}%
          </div>
          <div class="stat-desc">
            {faultHistory.filter((f) => !f).length}/{faultHistory.length}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!--   -->
<div class="flex flex-col-reverse sm:flex-row overflow-hidden gap-4 mt-4">
  <div class="flex-1 overflow-auto overflow-x-hidden">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Current</th>
          <th>Fault</th>
          <th>Time</th>
          <th>References</th>
        </tr>
      </thead>
      <tbody>
        {#each pages as page, index (page.id)}
          <tr class:active={page.frameI > -1}>
            <td>
              {#if curStep == index}
                <span bind:this={currentRowElement}>
                  <Fa icon={faArrowRight} />
                </span>
              {/if}
            </td>
            <td>
              {#if faultHistory[index]}
                <Fa icon={faXmark} class="text-error" />
              {:else}
                <Fa icon={faCheck} class="text-success" />
              {/if}
            </td>
            <td>{index}</td>
            <td>{page.value}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="flex-1  overflow-auto overflow-x-hidden">
    <table class="table w-full ">
      <thead>
        <tr>
          <th>Current</th>
          <th>Frame</th>
          <th>Extra</th>
          <th>References</th>
        </tr>
      </thead>
      <tbody>
        {#each pages
          .filter((page) => page.frameI > -1)
          .sort((a, b) => a.frameI - b.frameI) as page (page.id)}
          <tr class:active={page.id == curStep}>
            <td>
              {#if page.id == curStep}
                <span bind:this={currentRowElement}>
                  <Fa icon={faArrowRight} />
                </span>
              {/if}
            </td>
            <td>{page.frameI}</td>
            <td>{page.extra ?? ""}</td>
            <td>{page.value ?? "?"}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
