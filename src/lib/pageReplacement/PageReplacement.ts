import type { Command } from "$lib/common/Command";

export class AddCommand implements Command {
  oldFrameI: number;

  constructor(public newPage: PageReference, public frameI: number) {
    this.oldFrameI = newPage.frameI;
  }

  execute() {
    this.newPage.frameI = this.frameI;
  }

  undo() {
    this.newPage.frameI = this.oldFrameI;
  }
}

export type PageReference = {
  id: number;
  value: any;
  frameI: number;
  extra: any;
};

export type SolverConstructor<T> = new (
  nFrames: number,
  pagesArrivalOrder: any[]
) => T;

export abstract class PageReplacement {
  public readonly pages: PageReference[];
  public history: Command[] = [];
  public faultHistory: boolean[] = [];

  constructor(public nFrames: number, pagesArrivalOrder: any[]) {
    this.pages = [];
    pagesArrivalOrder.forEach((page, i) => {
      this.pages.push({
        id: i,
        value: page,
        frameI: -1,
        extra: undefined,
      });
    });
    this.init();
  }


  getFrame(): Map<number, PageReference> {
    const frame = new Map<number, PageReference>();
    this.pages
      .filter((page) => page.frameI > -1)
      .forEach((page) => {
        frame.set(page.value, page);
      });
    return frame;
  }

  pageInFrame(page: PageReference): boolean {
    const frame = this.getFrame();

    return frame.has(page.value)
  }

  frameHasSpace(): boolean {
    const frame = this.getFrame();
    return frame.size < this.nFrames;
  }

  protected init() { }

  public abstract getSteps(): Command[];
}
