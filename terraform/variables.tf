# terraform/variables.tf
variable "aws_region" {
  type    = string
  default = "ap-southeast-2"
}

variable "project_name" {
  type    = string
  default = "baythngai"
}

variable "key_name" {
  type      = string
  sensitive = true
}

variable "mongo_uri" {
  type      = string
  sensitive = true
}

variable "cognito_user_pool_id" {
  type      = string
  sensitive = true
}

variable "cognito_domain" {
  type      = string
  sensitive = true
}

variable "cognito_client_id" {
  type      = string
  sensitive = true
}

variable "cognito_client_secret" {
  type      = string
  sensitive = true
}

variable "aws_redirect_uri" {
  type = string
}

variable "aws_s3_bucket_name" {
  type = string
}

variable "aba_merchant_id" {
  type = string
}

variable "aba_public_key" {
  type = string
}

variable "aba_endpoint" {
  type = string
}

variable "backend_callback_url" {
  type = string
}

variable "frontend_return_success_url" {
  type = string
}

variable "frontend_return_cancel_url" {
  type = string
}

variable "vapid_public_key" {
  type      = string
  sensitive = true
}

variable "vapid_private_key" {
  type      = string
  sensitive = true
}
