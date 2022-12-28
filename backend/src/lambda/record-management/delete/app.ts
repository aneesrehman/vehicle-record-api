// AWS imports
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Enum imports
import { ResponseCode, DatabaseTable } from '/opt/nodejs/enums';

// Utility imports
import { Utility } from '/opt/nodejs/utility';

/**
 * Function to verify params of the request
 * @param event
 * @returns
 */
const verifyParams = (event: any) => {
  const [err, body] = Utility.parseRequest(event);
  if (err) {
    throw new Error(err);
  }
  // Verify body
  let errorMessage = '';
  if (!Utility.validateUUID(event.pathParameters.vehicleId)) {
    errorMessage += 'vehicleId must be a valid uuid';
  }
  return [errorMessage, body];
}

/**
 * Main lambda event handler
 * @param event
 * @returns
 */
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { vehicleId } = event.pathParameters!;
  if (!vehicleId) {
    return Utility.constructResponse(true, 'vehicleId not found in path', ResponseCode.BAD_REQUEST, {});
  }
  try {
    console.log('Verifying params');
    const [err, body] = verifyParams(event);
    if (err) {
      // Param verification failed
      console.error('Invalid request', err);
      return Utility.constructResponse(true, err, ResponseCode.BAD_REQUEST, {});
    }

    const client = new DynamoDBClient({});

    console.log(`Deleting item from table: ${DatabaseTable.VEHICLES}`);
    const command = new DeleteItemCommand({
      TableName: DatabaseTable.VEHICLES,
      Key: {
        id: {
          S: vehicleId
        }
      },
      ReturnValues: 'ALL_OLD'
    });

    const response = await client.send(command);
    // Check if requested record existed
    if (response.Attributes) {
      console.log('Vehicle record deleted successfully');
      return Utility.constructResponse(false, 'Vehicle record deleted successfully',ResponseCode.OK, {});
    } else {
      console.error('No vehicle record found with provided ID');
      return Utility.constructResponse(true, 'No vehicle record found with provided ID', ResponseCode.BAD_REQUEST, {});
    }
  } catch(error) {
    console.error('Failed to delete vehicle record', error);
    return Utility.constructResponse(true, 'Failed to delete vehicle record', ResponseCode.INTERNAL_SERVER_ERROR, {});
  }
}
