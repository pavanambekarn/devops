import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './PipelineStage';


export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const pipeline = new CodePipeline(this, 'Pipelin', {
      pipelineName: 'Pipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('pavanambekarn/devops', 'cdk', {
          authentication: cdk.SecretValue.secretsManager('cicd'),
        }),
        commands: [
          'cd cicd',
          'npm ci',
          'npx cdk synth'
        ],
        primaryOutputDirectory: 'cicd/cdk.out'
      })
    });

    const testStage = pipeline.addStage(new PipelineStage(this, 'PipelineTestStage', {
       stageName: 'test'
    }))
  }
}
