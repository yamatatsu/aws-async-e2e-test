import {
	CloudWatchLogs,
	FilterLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import { mockClient } from "aws-sdk-client-mock";
import retry from "p-retry";
import { expect, test } from "vitest";

const logs = new CloudWatchLogs();
const logsMock = mockClient(CloudWatchLogs);

test("should pass", async () => {
	logsMock
		.on(FilterLogEventsCommand)
		.resolvesOnce({ events: [] })
		.resolvesOnce({ events: [] })
		.resolvesOnce({
			events: [{ timestamp: 0, message: "" }],
		});

	let res = await logs.filterLogEvents({ logGroupName: "test" });
	expect(res).toEqual({ events: [] });
	res = await logs.filterLogEvents({ logGroupName: "test" });
	expect(res).toEqual({ events: [] });
	res = await logs.filterLogEvents({ logGroupName: "test" });
	expect(res).toEqual({ events: [{ timestamp: 0, message: "" }] });
});
