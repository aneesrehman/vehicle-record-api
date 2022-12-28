// AWS imports
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

// Utility imports
import { Utility } from '/opt/nodejs/utility';

// Enum imports
import { ResponseCode, DatabaseTable } from '/opt/nodejs/enums';

// Interface imports
import { Vehicle } from '/opt/nodejs/interfaces';

// Third party imports
import { v4 as uuidv4 } from 'uuid';

/**
 * Function to verify params
 * @param event
 * @returns
 */
const verifyParams = (event: any) => {
  const [err, body] = Utility.parseRequest(event);
  if (err) {
    return [err, body];
  }

  let errorMessage = [];
  // Verify make
  if (!body.make) {
    errorMessage.push('make is required');
  }

  // Verify model
  if (!body.model) {
    errorMessage.push('model is required');
  }

  // Verify reg
  if (!body.reg) {
    errorMessage.push('reg is required');
  }

  // Verify date validity
  if (!body.registrationDate || !Utility.validateDate(body.registrationDate)) {
    errorMessage.push('registrationDate is required and must be in a valid format DD/MM/YYYY');
  }
  return [errorMessage.join('\n'), body];
}

/**
 * Main lambda event handler
 * @param event
 * @returns
 */
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Verifying params');
    const [err, body] = verifyParams(event);
    if (err) {
      console.error('Invalid request', err);
      return Utility.constructResponse(true, err, ResponseCode.BAD_REQUEST, {});
    }

    console.log('Constructing vehicle object')
    const vehicleObj: Vehicle = {
      id: uuidv4(),
      make: body.make,
      model: body.model,
      reg: body.reg,
      registrationDate: body.registrationDate
    };
    const client = new DynamoDBClient({});

    console.log('Adding item in DynamoDB');
    const command = new PutItemCommand({
      TableName: DatabaseTable.VEHICLES,
      Item: marshall(vehicleObj)
    });
    await client.send(command);
    console.log('Vehicle record added successfully.');
    return Utility.constructResponse(false, 'Record added successfully', ResponseCode.CREATED, vehicleObj);
  } catch(error) {
    console.log('Failed to create vehicle record', error);
    return Utility.constructResponse(true, 'Failed to create vehicle record', ResponseCode.INTERNAL_SERVER_ERROR, {});
  }
}
