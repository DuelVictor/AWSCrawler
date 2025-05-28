import {
	CreateQueueCommand,
	SendMessageCommand,
	GetQueueAttributesCommand,
	SQSClient
} from "@aws-sdk/client-sqs";
import {
	LambdaClient,
	CreateEventSourceMappingCommand,
} from "@aws-sdk/client-lambda";

const sqs = new SQSClient({region: "eu-west-1"});

export async function startCrawlingService2({
	targetUrl,
	searchText,
	maxDepth,
	maxPages,
	clientGuid,
}) {
	const queueName = `${clientGuid}-depth-0-queue`;
	const queueUrl = await createQueue(queueName);
	console.log("Created queue: ", queueUrl);

	const lambdaClient = new LambdaClient({ region: "eu-west-1" });

	const queueArn = await getQueueArn(queueUrl);
	console.log("Queue arn: ", queueArn);

	await createEventSource(lambdaClient, queueArn, "CrawlerLambdaWorker");

	const messageBody = {
		targetUrl,
		currentDepth: 0,
		pagesCrawled: 0,
		searchText,
		maxDepth,
		maxPages,
		clientGuid,
	};
	const result = await sendMessage(queueUrl, messageBody);
	console.log("Sent message: ", result);
}

async function createQueue(queueName) {
	try {
		const params = {
			QueueName: queueName,
			Attributes: {
				VisibilityTimeout: "600",
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
	const { Attributes } = await sqs.send(
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

