# ── find the latest Amazon Linux 2023 ARM (Graviton2) AMI ──
data "aws_ami" "amazon_linux_2023_arm" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["*al2023-ami-*-arm64*"]
  }

  filter {
    name   = "architecture"
    values = ["arm64"]
  }
}

# --- EC2 Instance for Core API (Graviton2) ---
resource "aws_instance" "app" {
  ami                         = data.aws_ami.amazon_linux_2023_arm.id
  instance_type               = "t4g.micro"
  key_name                    = var.key_name
  subnet_id                   = module.vpc.public_subnets[0]
  vpc_security_group_ids      = [aws_security_group.ec2.id]
  associate_public_ip_address = true

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    curl -fsSL https://rpm.nodesource.com/setup_22.x | bash -
    yum install -y nodejs git
    npm install -g pm2
    mkdir -p /home/ec2-user/app
    chown ec2-user:ec2-user /home/ec2-user/app
  EOF

  tags = {
    Name = "${var.project_name}-ec2"
  }
}

# --- CloudFront Distribution: Core-API ---
resource "aws_cloudfront_distribution" "api" {
  origin {
    domain_name = aws_instance.app.public_dns
    origin_id   = "${var.project_name}-core-api"

    custom_origin_config {
      http_port              = 4000
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = ""

  aliases = ["api.baythngai.shop"]

  default_cache_behavior {
    target_origin_id       = "${var.project_name}-core-api"
    viewer_protocol_policy = "https-only"
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Content-Type"]
      cookies {
        forward = "all"
      }
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}
