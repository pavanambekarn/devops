import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as TsStarter from '../lib/ts-starter-stack';

describe('checking', () => {
    let template: cdk.assertions.Template

    beforeAll(() => {
        const app = new cdk.App();
        const stack = new TsStarter.TsStarterStack(app, 'MyTestStack');
        const template = Template.fromStack(stack);
    })

    test('test for S3', () => {

        template.hasResourceProperties('AWS::S3::Bucket',  Match.objectLike({
            "LifecycleConfiguration": {
                "Rules": Match.arrayWith( [
                    {
                        "ExpirationInDays": 4,
                        "Status": "Enabled"
                    }
                ])
            }
        }));
        template.resourceCountIs('AWS::S3::Bucket', 1);
    });

});



