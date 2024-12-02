
import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";

interface LambdaStackProps extends cdk.StackProps{
    stageName?: String 
}

export class LambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: LambdaStackProps) {
        super(scope, id, props);
    }
}