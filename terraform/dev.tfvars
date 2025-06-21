# dev.tfvars for Baythngai project (Development environment)

# General
project_name = "baythngai"
environment  = "dev"
aws_region   = "ap-southeast-2"

# MongoDB
mongo_uri = ""

# AWS Cognito
cognito_user_pool_id  = ""
cognito_client_id     = ""
cognito_client_secret = ""
cognito_domain        = ""

# EC2
key_name      = ""
instance_type = "t3.micro"

# S3
aws_s3_bucket_name = ""

# Redirect URI
aws_redirect_uri = ""

# ABA Payment Gateway
aba_merchant_id = ""
aba_public_key  = ""
aba_endpoint    = ""

# Callback URLs
backend_callback_url        = ""
frontend_return_success_url = ""
frontend_return_cancel_url  = ""

# VAPID Keys for Web Push
vapid_public_key  = ""
vapid_private_key = ""
