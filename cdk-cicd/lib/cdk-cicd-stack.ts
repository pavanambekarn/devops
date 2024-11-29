import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CodePipeline(this, 'cicd', {
      pipelineName: 'cicd',
      synth: new ShellStep('Synt', {
        input: CodePipelineSource.gitHub('pavanambekarn/devops', 'cdk', {
          authentication: cdk.SecretValue.secretsManager('cicd'), // Replace with your Secrets Manager key
        }),
        commands: [
          'cd cdk-cicd',
          'npm ci',
          'npx cdk synth'
        ],
        primaryOutputDirectory: 'cdk-cicd/cdk.out'
      }),
    });
  }

}
