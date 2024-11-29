import { IAspect } from "aws-cdk-lib";
import { IConstruct } from "constructs";



export class Checker implements IAspect{
    visit(node: IConstruct): void {
        console.log('Visiting '+ node.node.id)
    }
    
}