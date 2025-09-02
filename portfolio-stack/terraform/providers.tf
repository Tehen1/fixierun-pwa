variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "state_bucket_name" {
  description = "Name for example S3 bucket (demo only)"
  type        = string
  default     = "portfolio-installer-tf-state-demo"
}

