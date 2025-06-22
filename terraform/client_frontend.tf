# --- S3 Buckets & Policies for Client Frontend ---
resource "aws_s3_bucket" "client" {
  bucket = "${var.project_name}-client-frontend"
}

resource "aws_cloudfront_origin_access_identity" "client" {
  comment = "OAI for ${aws_s3_bucket.client.id}"
}

resource "aws_s3_bucket_policy" "client" {
  bucket = aws_s3_bucket.client.id
  policy = data.aws_iam_policy_document.client_oai.json
}

data "aws_iam_policy_document" "client_oai" {
  statement {
    actions = ["s3:GetObject"]
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.client.iam_arn]
    }
    resources = ["${aws_s3_bucket.client.arn}/*"]
  }
}

# --- CloudFront Distribution: Client ---
resource "aws_cloudfront_distribution" "client" {
  origin {
    domain_name = aws_s3_bucket.client.bucket_regional_domain_name
    origin_id   = "${var.project_name}-client"
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.client.cloudfront_access_identity_path
    }
    origin_shield {
      enabled              = true
      origin_shield_region = var.aws_region
    }
  }
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = ["client.baythngai.shop"]

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${var.project_name}-client"
    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = "arn:aws:acm:ap-southeast-2:390402568377:certificate/f491add0-ced4-4bc3-a5f0-7fc37be9447a"
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "client_cleanup" {
  bucket = aws_s3_bucket.client.id
  rule {
    id     = "transition-to-ia"
    status = "Enabled"
    filter {
      prefix = ""
    }
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
  }
  rule {
    id     = "expire-old-builds"
    status = "Enabled"
    filter {
      prefix = ""
    }
    expiration {
      days = 30
    }
  }
}
