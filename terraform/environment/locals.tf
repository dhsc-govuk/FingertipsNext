locals {
  environment_hash = substr(sha1(var.environment), -7, -1)
  resource_prefix  = "${var.project}-${local.environment_hash}"

  tags = {
    project          = var.project
    environment      = var.environment
    environment_hash = local.environment_hash
  }
}
