import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as api from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export interface IApiProps extends cdk.StackProps {
  readonly projectName: string;
  readonly stackEnv: string;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IApiProps) {
    super(scope, id, props);

    const { projectName, stackEnv } = props;

    // import lambda based on arn
    const apiLambda = lambda.Function.fromFunctionArn(
      this,
      `${projectName}-API-Lambda-Import-${stackEnv}`,
      `arn:aws:lambda:${this.region}:${this.account}:function:${projectName}-API-${stackEnv}:${stackEnv}`
    );

    // create API GW lambda integration object
    const lambdaIntegration = new HttpLambdaIntegration(
      `${projectName}-Api-Lambda-Integration-${stackEnv}`,
      apiLambda
    );

    // create HTTP API GW using L3 construct with $default integration on above imported lambda
    const httpApi = new api.HttpApi(
      this,
      `${projectName}-HttpApi-${stackEnv}`,
      {
        apiName: `${projectName}-API-${stackEnv}`,
        description: `This is the main API for project.`,
        defaultIntegration: lambdaIntegration,
      }
    );
  }
}
