output "ec2_public_ip" {
  description = "Public IP of the EC2 host"
  value       = aws_instance.app.public_ip
  sensitive   = true
}

output "api_cloudfront_domain" {
  description = "Core-API backend CloudFront domain"
  value       = aws_cloudfront_distribution.api.domain_name
  sensitive   = true
}

output "admin_cloudfront_domain" {
  description = "Admin frontend CloudFront domain"
  value       = aws_cloudfront_distribution.admin.domain_name
  sensitive   = true
}


output "admin_bucket_name" {
  description = "S3 bucket name for the admin frontend"
  value       = aws_s3_bucket.admin.id
  sensitive   = true
}

output "admin_cloudfront_id" {
  description = "CloudFront distribution ID for the admin frontend"
  value       = aws_cloudfront_distribution.admin.id
  sensitive   = true
}

output "client_cloudfront_domain" {
  description = "Client frontend CloudFront domain"
  value       = aws_cloudfront_distribution.client.domain_name
  sensitive   = true
}

output "client_bucket_name" {
  description = "S3 bucket name for the client frontend"
  value       = aws_s3_bucket.client.id
  sensitive   = true
}

output "client_cloudfront_id" {
  description = "CloudFront distribution ID for the client frontend"
  value       = aws_cloudfront_distribution.client.id
  sensitive   = true
}

locals {
  backend_callback_url        = "https://${aws_cloudfront_distribution.api.domain_name}/api/v1/payment/callback"
  frontend_return_success_url = "https://${aws_cloudfront_distribution.client.domain_name}/payment-return"
  frontend_return_cancel_url  = "https://${aws_cloudfront_distribution.client.domain_name}/payment-cancel"
}

output "backend_callback_url" {
  description = "Backend callback URL for payment gateway"
  value       = local.backend_callback_url
}
