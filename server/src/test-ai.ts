import "dotenv/config";
import { categorizeIssue } from "./services/ai.service";

async function test() {
    const result = await categorizeIssue(
        "There is a large pothole on the road near Dharampeth."
    );

    console.log(result);
}

test();