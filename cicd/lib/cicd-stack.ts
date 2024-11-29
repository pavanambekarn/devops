import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipelineActions from 'aws-cdk-lib/aws-codepipeline-actions';

export class CicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the source step
    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    // Create the pipeline
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'cicd',
    });

    // Add the Source stage
    const sourceAction = new codepipelineActions.GitHubSourceAction({
      actionName: 'GitHub_Source',
      owner: 'pavanambekarn',
      repo: 'devops',
      branch: 'cdk',
      oauthToken: cdk.SecretValue.secretsManager('cicd'),
      output: sourceArtifact,
    });

    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

    // Add a Manual Approval stage
    pipeline.addStage({
      stageName: 'ManualApproval',
      actions: [
        new codepipelineActions.ManualApprovalAction({
          actionName: 'ApproveBeforeBuild',
        }),
      ],
    });

    // Add the Build (Synth) stage
    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipelineActions.CodeBuildAction({
          actionName: 'Synth',
          input: sourceArtifact,
          outputs: [cloudAssemblyArtifact],
          project: new cdk.aws_codebuild.PipelineProject(this, 'CodeBuild', {
            buildSpec: cdk.aws_codebuild.BuildSpec.fromObject({
              version: '0.2',
              phases: {
                install: {
                  commands: ['cd cicd', 'npm ci'],
                },
                build: {
                  commands: ['npx cdk synth'],
                },
              },
              artifacts: {
                'base-directory': 'cicd/cdk.out',
                files: '**/*',
              },
            }),
          }),
        }),
      ],
    });
  }
}
