import {
  AddCommand,
  PageReplacement,
  type PageReference,
} from "./PageReplacement";
import { ReplacementCommand } from "./ReplacementCommand";
import { SetExtraCommand } from "./SetExtraCommand";
import { ComandGroup } from "../common/ComandGroup";
import type { Command } from "$lib/common/Command";

export class LRUReplacement extends PageReplacement {
  override init() {
    // Set extra data for each page to be the lru value
    this.pages.forEach((page, i) => {
      page.extra = 0;
    });
  }

  getSteps(): Command[] {
    const steps: Command[] = [];
    this.faultHistory = [];
    let time = 0;
    this.pages.forEach((page, i) => {
      time++;
      var cmd: Command;

      const frame = this.getFrame();
      if (this.pageInFrame(page)) {
        cmd = new SetExtraCommand(frame.get(page.value), time);
        cmd.execute();
        steps.push(cmd);
        this.faultHistory.push(false);
        return;
      }
      var cmdGroup = new ComandGroup();

      // If there are less than nFrames pages in the frame, add the page
      if (this.frameHasSpace()) {
        cmd = new AddCommand(page, frame.size);
        cmdGroup.commands.push(cmd);
        cmd = new SetExtraCommand(page, time);
        cmdGroup.commands.push(cmd);
        cmdGroup.execute();
        steps.push(cmdGroup);
        this.faultHistory.push(true);
        return;
      }

      // Iterate frame sorted by value.frameI
      let lruSorted = Array.from(frame.values()).sort(
        (a, b) => a.extra - b.extra
      );
      let min_lru_page: PageReference = lruSorted[0];

      cmd = new ReplacementCommand(min_lru_page, page, min_lru_page.frameI);
      cmdGroup.commands.push(cmd);
      cmd = new SetExtraCommand(page, time);
      cmdGroup.commands.push(cmd);
      cmdGroup.execute();
      steps.push(cmdGroup);
      this.faultHistory.push(true);
    });

    // Undo everything
    steps.reverse().forEach((step) => step.undo());
    return steps.reverse();
  }
}
