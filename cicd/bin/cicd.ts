#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CicdStack } from '../lib/cicd-stack';
import {CdkCicdStack} from '../lib/cdk-cicd-stack'

const app = new cdk.App();
new CdkCicdStack(app, 'CdkCicdStack', {
});

app.synth();