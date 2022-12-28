// Interface imports
import { ResponseBody } from './interfaces';

// Third party imports
import moment from 'moment';

export class Utility {
  /**
   * Function to construct response from lambda functions
   * @param isError
   * @param message
   * @param statusCode
   * @param data
   * @returns
   */
  public static constructResponse(isError: boolean, message: string, statusCode: number, data: object | object[]) {
    const body: ResponseBody = {};
    if (isError) {
      body.error = message;
    } else {
      body.message = message;
      body.data = data;
    }

    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,PUT,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,token',
        'Content-Type': 'application/json',
      },
    };
  }

  /**
   * Function to parse request made to lambda function
   * @param event
   * @returns
   */
  public static parseRequest(event: any) {
    let err = '';
    let body;
    try {
      if (event.isBase64Encoded) {
        console.log('Decoding base64 encoded event body and parsing JSON from it');
        body = JSON.parse(Buffer.from(event.body, 'base64').toString());
      } else {
        console.log('Parsing JSON from event body');
        body = JSON.parse(event.body);
      }
      console.log('Successfully parsed event body');
    } catch (error) {
      console.error('An error occurred while parsing the event body:', error);
      err = 'Failed to parse request body';
    }
    return [err, body];
  }

  /**
   * Function to validate UUID
   * @param value
   * @returns
   */
  public static validateUUID(value: string) {
   return /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(value);
  }

  /**
   * Function to validate date
   * @param value
   */
  public static validateDate(value: string) {
    return moment(value, ['DD/MM/YYYY'], true).isValid();
  }
}