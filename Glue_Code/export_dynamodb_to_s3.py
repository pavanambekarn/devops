import sys
import boto3
import json
from datetime import datetime
from pyspark.sql import SparkSession
from awsglue.context import GlueContext
from awsglue.utils import getResolvedOptions

# Get parameters from Glue job arguments
args = getResolvedOptions(sys.argv, ['S3_BUCKET', 'DYNAMODB_TABLE', 'FILE_NAME'])
s3_bucket = args['S3_BUCKET']
dynamodb_table = args['DYNAMODB_TABLE']
file_name = args['FILE_NAME']

# Initialize Spark and Glue Context
spark = SparkSession.builder.appName("ExportDynamoDBToS3").getOrCreate()
glueContext = GlueContext(spark.sparkContext)

# Read data from DynamoDB
dyf = glueContext.create_dynamic_frame.from_options(
    connection_type="dynamodb",
    connection_options={"dynamodb.input.tableName": dynamodb_table}
)

# Convert to DataFrame
df = dyf.toDF()

# Convert DataFrame rows to JSON strings and create a **single JSON array**
json_data = df.toJSON().collect()  # Collect all rows as JSON strings
json_array = "[" + ",".join(json_data) + "]"  # Create a single JSON array

# Save JSON array to S3 as a single file
s3 = boto3.client("s3")
s3.put_object(Bucket=s3_bucket, Key=file_name, Body=json_array, ContentType="application/json")

print(f"Successfully exported {df.count()} records from {dynamodb_table} to s3://{s3_bucket}/{file_name}")