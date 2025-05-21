import {
	CreateQueueCommand,
	SendMessageCommand,
	GetQueueAttributesCommand,
} from "@aws-sdk/client-sqs";
import {
	LambdaClient,
	CreateEventSourceMappingCommand,
} from "@aws-sdk/client-lambda";

export async function startCrawlingService({
	targetUrl,
	searchText,
	maxDepth,
	maxPages,
	client,
}) {
	const queueName = `${client}-depth-0-queue`;
	const queueUrl = createQueue(queueName);

	const lambdaClient = new LambdaClient({ region: "eu-west-1" });
	const queueArn = getQueueArn(queueUrl);
	createEventSource(lambdaClient, queueArn, "CrawlerLambdaWorker");

	const messageBody = {
		targetUrl,
		currentDepth: 0,
		pagesCrawled: 0,
		searchText,
		maxDepth,
		maxPages,
		client,
	};
	sendMessage(queueUrl, messageBody);
}

async function createQueue(queueName) {
	try {
		const params = {
			QueueName: queueName,
			Attributes: {
				VisibilityTimeout: "30",
				MessageRetentionPeriod: "120",
			},
		};
		const command = new CreateQueueCommand(params);
		const result = await sqs.send(command);
		return result.QueueUrl;
	} catch (error) {
		console.error("Error creating a queue: ", error);
		throw error;
	}
}

async function sendMessage(queueUrl, messageBody) {
	try {
		const params = {
			QueueUrl: queueUrl,
			MessageBody: JSON.stringify(messageBody),
		};
		const command = new SendMessageCommand(params);
		const result = await sqs.send(command);
		return result;
	} catch (error) {
		console.error("Error sending a message: ", error);
		throw error;
	}
}

async function getQueueArn(queueUrl) {
	const { Attributes } = await sqsClient.send(
		new GetQueueAttributesCommand({
			QueueUrl: queueUrl,
			AttributeNames: ["QueueArn"],
		})
	);
	return Attributes?.QueueArn;
}

async function createEventSource(lambdaClient, queueArn, lambdaFunctionName) {
	await lambdaClient.send(
		new CreateEventSourceMappingCommand({
			EventSourceArn: queueArn,
			FunctionName: lambdaFunctionName,
			Enabled: true,
			BatchSize: 1,
		})
	);
}
