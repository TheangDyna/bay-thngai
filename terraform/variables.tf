variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}

variable "project_name" {
  description = "Project name for resource tagging"
  type        = string
  default     = "iot-dev"
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

variable "cognito_user_pool_id" {
  description = "AWS Cognito User Pool ID"
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

variable "cognito_domain" {
  description = "AWS Cognito Domain"
  type        = string
  sensitive   = true
}

variable "mqtt_host" {
  description = "MQTT broker host"
  type        = string
  sensitive   = true
}

variable "mqtt_port" {
  description = "MQTT broker port"
  type        = string
  sensitive   = true
}

variable "mqtt_username" {
  description = "MQTT username"
  type        = string
  sensitive   = true
}

variable "mqtt_password" {
  description = "MQTT password"
  type        = string
  sensitive   = true
}
