#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TsStarterStack } from '../lib/ts-starter-stack';
import { TsHandlerStack } from '../lib/ts-handler-stack';
import { Checker } from '../lib/check';

const app = new cdk.App();
const tsStarterStack = new TsStarterStack(app, 'TsStarterStack', {});
new TsHandlerStack(app, 'TsHandlerStack', {
     coolBucket: tsStarterStack.coolBucket
})
cdk.Tags.of(tsStarterStack).add('env','Prod',{
     includeResourceTypes: ['AWS::S3::Bucket'], priority: 150
});

cdk.Aspects.of(app).add(new Checker());


