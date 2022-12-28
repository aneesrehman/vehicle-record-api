// AWS Lambda imports
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

// Enum imports
import { DatabaseTable, ResponseCode } from '/opt/nodejs/enums';

// Utility imports
import { Utility } from '/opt/nodejs/utility';

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
  if (!Utility.validateUUID(event.pathParameters.vehicleId)) {
    errorMessage.push('vehicleId must be a valid UUID');
  }

  // Verify date validity
  if (body.registrationDate && !Utility.validateDate(body.registrationDate)) {
    errorMessage.push('registrationDate must be in a valid format DD/MM/YYYY');
  }

  return [errorMessage.join('\n'), body];
}

/**
 * Function to construct update expression for dynamoDB client
 * @param updateObject
 * @returns
 */
const constructUpdateExpression = (updateObject: any) => {
  const updateExpressionArray = [];
  const expressionAttributeValues: any = {};
  const expressionAttributeNames: any = {};

  if (updateObject.make) {
    updateExpressionArray.push('#make = :make');
    expressionAttributeValues[':make'] = { S: updateObject.make };
    expressionAttributeNames['#make'] = 'make';
  }

  if (updateObject.model) {
    updateExpressionArray.push('#model = :model');
    expressionAttributeValues[':model'] = { S: updateObject.model };
    expressionAttributeNames['#model'] = 'model';
  }

  if (updateObject.reg) {
    updateExpressionArray.push('#reg = :reg');
    expressionAttributeValues[':reg'] = { S: updateObject.reg };
    expressionAttributeNames['#reg'] = 'reg';
  }

  if (updateObject.registrationDate) {
    updateExpressionArray.push('#registrationDate = :registrationDate');
    expressionAttributeValues[':registrationDate'] = { S: updateObject.registrationDate };
    expressionAttributeNames['#registrationDate'] = 'registrationDate';
  }

  return {
    updateExpressionArray,
    expressionAttributeValues,
    expressionAttributeNames
  };
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
    const [err, body] = verifyParams(event);
    if (err) {
      console.error('Invalid request body', err);
      return Utility.constructResponse(true, err, ResponseCode.BAD_REQUEST, {});
    }

    // Client creation
    const client = new DynamoDBClient({});
    // Command creation
    const command = new GetItemCommand({
      TableName: DatabaseTable.VEHICLES,
      Key: {
        id: {
          S: vehicleId
        }
      }
    });

    // Check if vehicle exist with provided ID
    const vehicleRecord = await client.send(command);
    if (!vehicleRecord.Item) {
      console.log(`Vehicle record does not exist for ${vehicleId}`);
      return Utility.constructResponse(true, 'No vehicle found with provided ID', ResponseCode.BAD_REQUEST, {});
    }

    // Constructing Update object
    const updateObject = {
      ...body.make && {make: body.make},
      ...body.model && {model: body.model},
      ...body.reg && {reg: body.reg},
      ...body.registrationDate && {registrationDate: body.registrationDate}
    }

    // check if update object contains anything
    if (!Object.keys(updateObject).length) {
      console.error('Update body is empty');
      return Utility.constructResponse(true, 'Update body is empty', ResponseCode.BAD_REQUEST, {});
    }

    const { updateExpressionArray, expressionAttributeValues, expressionAttributeNames} = constructUpdateExpression(updateObject);

    console.log(`Updating vehicle record in table: ${DatabaseTable.VEHICLES}`);
    const updateCommand = new UpdateItemCommand({
      TableName: DatabaseTable.VEHICLES,
      Key: {
        id: {
          S: vehicleId
        }
      },
      ExpressionAttributeValues: expressionAttributeValues,
      UpdateExpression: `set ${updateExpressionArray.join(', ')}`,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length ? expressionAttributeNames : null, // To cater for reserved keywords in dynamoDB
      ReturnValues: 'ALL_NEW',
    });

    const updatedVehicle = await client.send(updateCommand);
    const result = updatedVehicle.Attributes ? unmarshall(updatedVehicle.Attributes) : {};
    console.log('Vehicle record updated successfully');
    return Utility.constructResponse(false, 'Vehicle record updated successfully', ResponseCode.OK, result);
  } catch (error) {
    console.error('Failed to update vehicle record', error);
    return Utility.constructResponse(false, 'Failed to update vehicle record', ResponseCode.INTERNAL_SERVER_ERROR, {});
  }
}
