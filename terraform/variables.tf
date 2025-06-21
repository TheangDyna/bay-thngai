variable "project_name" {
  description = "Project name for resource tagging"
  type        = string
  default     = "baythngai"
}

variable "key_name" {
  description = "Name of existing EC2 Key Pair for SSH"
  type        = string
  sensitive   = true
}

variable "mongo_uri" {
  description = "MongoDB connection string"
  type        = string
  sensitive   = true
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "cognito_user_pool_id" {
  description = "AWS Cognito User Pool ID"
  type        = string
  sensitive   = true
}

variable "cognito_domain" {
  description = "AWS Cognito Domain"
  type        = string
  sensitive   = true
}

variable "cognito_client_id" {
  description = "AWS Cognito Client ID"
  type        = string
  sensitive   = true
}

variable "cognito_client_secret" {
  description = "AWS Cognito Client Secret"
  type        = string
  sensitive   = true
}

variable "aws_redirect_uri" {
  description = "AWS Cognito Redirect URI"
  type        = string
}

variable "aws_s3_bucket_name" {
  description = "AWS S3 bucket name"
  type        = string
}

variable "aws_access_key" {
  description = "AWS Access Key"
  type        = string
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS Secret Access Key"
  type        = string
  sensitive   = true
}

variable "aba_merchant_id" {
  description = "ABA Merchant ID"
  type        = string
}

variable "aba_public_key" {
  description = "ABA Public Key"
  type        = string
}

variable "aba_endpoint" {
  description = "ABA Endpoint"
  type        = string
}

variable "backend_callback_url" {
  description = "Backend callback URL"
  type        = string
}

variable "frontend_return_success_url" {
  description = "Frontend payment return success URL"
  type        = string
}

variable "frontend_return_cancel_url" {
  description = "Frontend payment return cancel URL"
  type        = string
}

variable "vapid_public_key" {
  description = "VAPID public key"
  type        = string
  sensitive   = true
}

variable "vapid_private_key" {
  description = "VAPID private key"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environment (e.g., dev, prod)"
  type        = string
  default     = "production"
}
