# ── Find the latest Amazon Linux 2023 x86_64 AMI ──
data "aws_ami" "amazon_linux_2023_x86" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["*al2023-ami-*-x86_64*"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

# --- EC2 Instance for Core API (x86_64) ---
resource "aws_instance" "app" {
  ami                         = data.aws_ami.amazon_linux_2023_x86.id
  instance_type               = "t3.micro"
  key_name                    = var.key_name
  subnet_id                   = module.vpc.public_subnets[0]
  vpc_security_group_ids      = [aws_security_group.ec2.id]
  associate_public_ip_address = true

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y gcc-c++ make libpng-devel libjpeg-turbo-devel glib2-devel
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

# --- Security Group for EC2 ---
resource "aws_security_group" "ec2" {
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 4000
    to_port     = 4000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow CloudFront (restrict to CloudFront IPs in production)
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Restrict SSH to your IP
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ec2-sg"
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
      origin_protocol_policy = "http-only" # Ensure EC2 listens on HTTP port 4000
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

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  viewer_certificate {
    acm_certificate_arn      = "arn:aws:acm:us-east-1:390402568377:certificate/ed207760-a5a9-40a9-b010-7ceb0c632d07"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name = "${var.project_name}-cloudfront"
  }
}
