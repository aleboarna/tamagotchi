import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

export interface IDbProps extends cdk.StackProps {
  readonly projectName: string;
  readonly stackEnv: string;
}

export class DbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IDbProps) {
    super(scope, id, props);

    const { projectName, stackEnv } = props;

    const db = new Table(
      this,
      `${projectName}-Gateway-Configuration-${stackEnv}`,
      {
        tableName: `${projectName}-users-${stackEnv}`,
        partitionKey: { name: 'userName', type: AttributeType.STRING },
      }
    );
  }
}
