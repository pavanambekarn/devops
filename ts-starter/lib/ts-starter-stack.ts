import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {aws_s3} from 'aws-cdk-lib';
import { CfnOutput, Fn } from 'aws-cdk-lib';

export class TsStarterStack extends cdk.Stack {
  
  public coolBucket: aws_s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = this.initializesuffix();
    this.coolBucket = new aws_s3.Bucket(this, 'TsBucket', {
      bucketName : Fn.join('', ['cool-bucket-', suffix]),
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(4)
        }
      ]
    })


    
    console.log('Bucket name: '+ this.coolBucket.bucketName )
    new CfnOutput(this, 'Bucket name', {value: this.coolBucket.bucketName})

  }

  private initializesuffix(){
       const StackID = Fn.select(2, Fn.split('/', this.stackId))
       const suffix = Fn.select(4, Fn.split('-', StackID))
       return suffix;
  }
}
