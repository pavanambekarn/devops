import { Stage } from "aws-cdk-lib";
import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { LambdaStack } from "./LambdaStack";


export class PipelineStage extends Stage {
    constructor(scope: Construct, id: string, props: cdk.StageProps) {
        super(scope, id, props);

        new LambdaStack(this, 'LambdaStack', {
            stageName: props.stageName
        })
    }
}