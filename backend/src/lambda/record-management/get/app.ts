// AWS Lambda imports
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

// Enum imports
import { DatabaseTable, ResponseCode } from '/opt/nodejs/enums';

// Utility imports
import { Utility } from '/opt/nodejs/utility';

/**
 * Main lambda event handler
 * @param event
 * @returns
 */
export const lambdaHandler = async (event: APIGatewayProxyEvent | any): Promise<APIGatewayProxyResult> => {
  try {
    const client = new DynamoDBClient({});

    console.log(`Fetching data from table: ${DatabaseTable.VEHICLES}`);
    const command = new ScanCommand({
      TableName: DatabaseTable.VEHICLES
    });
    const response = await client.send(command);
    const vehicles = response.Items?.map((item) => unmarshall(item)) || [];
    console.log('Vehicle records fetched successfully');
    return Utility.constructResponse(false, 'Vehicle records fetched successfully', ResponseCode.OK, vehicles);
  } catch (error) {
    console.error('Failed to fetch vehicle records', error);
    return Utility.constructResponse(false, 'Failed to fetch vehicle records', ResponseCode.INTERNAL_SERVER_ERROR, {});
  }
}

lambdaHandler({});