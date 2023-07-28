#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DbStack } from '../lib/db-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { ApiStack } from '../lib/api-stack';

const app = new cdk.App();

const projectName = 'empowher';
const stackEnv = app.node.tryGetContext('stackEnv');

const db = new DbStack(app, `${projectName}-DB-${stackEnv}`, {
  // https://docs.aws.amazon.com/cdk/v2/guide/environments.html
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  projectName: projectName,
  description: 'Contains the DB tier resources',
  stackEnv,
});

const lambda = new LambdaStack(app, `${projectName}-Lambda-API-${stackEnv}`, {
  // https://docs.aws.amazon.com/cdk/v2/guide/environments.html
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  projectName: projectName,
  description: 'Contains the API backend tier resources',
  stackEnv,
});

const api = new ApiStack(app, `${projectName}-API-${stackEnv}`, {
  // https://docs.aws.amazon.com/cdk/v2/guide/environments.html
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  projectName: projectName,
  description: `Contains the API tier resources`,
  stackEnv,
});

api.addDependency(lambda);
