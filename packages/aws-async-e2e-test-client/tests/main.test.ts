import {
	CloudWatchLogs,
	FilterLogEventsCommand,
	FilterLogEventsRequest,
} from "@aws-sdk/client-cloudwatch-logs";
import { mockClient } from "aws-sdk-client-mock";
import pRetry from "p-retry";
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

	const startTime = Date.now();
	const res = await filterLogEvents({ logGroupName: "test", startTime });
	expect(res).toEqual({ events: [{ timestamp: 0, message: "" }] });
});

const filterLogEvents = (request: FilterLogEventsRequest) =>
	pRetry(
		async () => {
			const response = await logs.filterLogEvents(request);
			if (response.events?.length === 0) {
				throw new Error("No logs found");
			}
			return response;
		},
		{
			minTimeout: 200,
			maxTimeout: 1000,
		},
	);
