import {
    AddCommand,
    PageReplacement,
    ReplacementCommand,
    type PageReference,
} from "./PageReplacement";
import { ComandGroup, SetExtraCommand, type Command } from "./Command";

export class OPTReplacement extends PageReplacement {
    override init() {
        // Set extra data for each page to be the lru value
        this.pages.forEach((page, i) => {
            page.extra = undefined;
        });
    }


    nextReplacementDistance(start: number, page: PageReference) {
        let rest = this.pages.slice(start);
        let distance = rest.findIndex((p) => p.value == page.value);
        return distance;
    }

    getSteps(): Command[] {
        const steps: Command[] = [];
        this.faultHistory = [];
        let time = 0;
        this.pages.forEach((page, i) => {
            time++;
            var cmdGroup: ComandGroup = new ComandGroup();

            let longest_distance = -2;
            let longest_page: PageReference | null = null;
            // Calculate next replacement distance
            for (let page of this.getFrame().values()) {
                let distance = this.nextReplacementDistance(i + 1, page);
                cmdGroup.commands.push(new SetExtraCommand(page, distance));
                if (distance == -1) {
                    longest_page = page;
                }
                if (distance > longest_distance && longest_distance != -1) {
                    longest_distance = distance;
                    longest_page = page;
                }
            }

            const frame = this.getFrame();
            if (this.pageInFrame(page)) {
                this.faultHistory.push(false);
                cmdGroup.execute();
                steps.push(cmdGroup);
                return;
            }

            if (this.frameHasSpace()) {
                console.log("frame has space");
                cmdGroup.commands.push(new AddCommand(page, frame.size));
                let distance = this.nextReplacementDistance(i + 1, page);
                cmdGroup.commands.push(new SetExtraCommand(page, distance));
                cmdGroup.execute();
                steps.push(cmdGroup);
                this.faultHistory.push(true);
                return;
            }


            // Iterate this.getFrame().values()
            for (let page of this.getFrame().values()) {
                let distance = this.nextReplacementDistance(i + 1, page);
                if (distance == -1) {
                    longest_page = page;
                    break;
                }
                if (distance > longest_distance) {
                    longest_distance = distance;
                    longest_page = page;
                }
            }

            if (longest_page == null) {
                console.error("Longest_page is null");
                this.faultHistory.push(false);
                steps.push(new ComandGroup());
                return;
            }

            cmdGroup.commands.push(
                new ReplacementCommand(longest_page, page, longest_page.frameI));

            let distance = this.nextReplacementDistance(i + 1, page);
            cmdGroup.commands.push(new SetExtraCommand(page, distance));

            cmdGroup.execute();
            steps.push(cmdGroup);
            this.faultHistory.push(true);
        });

        // Undo everything
        let frame = this.pages.filter((p) => p.frameI);
        steps.reverse().forEach((step) => step.undo());
        return steps.reverse();
    }
}
