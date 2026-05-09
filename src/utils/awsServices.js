const AWS_ICON_BASE = "https://d1.awsstatic.com/webteam/architecture-icons/q3-2023";

export const AWS_SERVICES = {
  cloudfront:  { name: "CloudFront",     category: "network",   color: "#E6F1FB", border: "#185FA5", text: "#0C447C", icon: AWS_ICON_BASE + "/Arch_Amazon-CloudFront_64.svg" },
  apigateway:  { name: "API Gateway",    category: "network",   color: "#E6F1FB", border: "#185FA5", text: "#0C447C", icon: AWS_ICON_BASE + "/Arch_Amazon-API-Gateway_64.svg" },
  alb:         { name: "App Load Balancer", category: "network", color: "#E6F1FB", border: "#185FA5", text: "#0C447C", icon: AWS_ICON_BASE + "/Arch_Elastic-Load-Balancing_64.svg" },
  route53:     { name: "Route 53",       category: "network",   color: "#E6F1FB", border: "#185FA5", text: "#0C447C", icon: AWS_ICON_BASE + "/Arch_Amazon-Route-53_64.svg" },
  vpc:         { name: "VPC",            category: "network",   color: "#E6F1FB", border: "#185FA5", text: "#0C447C", icon: AWS_ICON_BASE + "/Arch_Amazon-VPC_64.svg" },
  lambda:      { name: "Lambda",         category: "compute",   color: "#FAEEDA", border: "#854F0B", text: "#633806", icon: AWS_ICON_BASE + "/Arch_AWS-Lambda_64.svg" },
  ec2:         { name: "EC2",            category: "compute",   color: "#FAEEDA", border: "#854F0B", text: "#633806", icon: AWS_ICON_BASE + "/Arch_Amazon-EC2_64.svg" },
  ecs:         { name: "ECS",            category: "compute",   color: "#FAEEDA", border: "#854F0B", text: "#633806", icon: AWS_ICON_BASE + "/Arch_Amazon-Elastic-Container-Service_64.svg" },
  fargate:     { name: "Fargate",        category: "compute",   color: "#FAEEDA", border: "#854F0B", text: "#633806", icon: AWS_ICON_BASE + "/Arch_AWS-Fargate_64.svg" },
  eks:         { name: "EKS",            category: "compute",   color: "#FAEEDA", border: "#854F0B", text: "#633806", icon: AWS_ICON_BASE + "/Arch_Amazon-Elastic-Kubernetes-Service_64.svg" },
  s3:          { name: "S3",             category: "storage",   color: "#EAF3DE", border: "#3B6D11", text: "#27500A", icon: AWS_ICON_BASE + "/Arch_Amazon-Simple-Storage-Service_64.svg" },
  efs:         { name: "EFS",            category: "storage",   color: "#EAF3DE", border: "#3B6D11", text: "#27500A", icon: AWS_ICON_BASE + "/Arch_Amazon-EFS_64.svg" },
  rds:         { name: "RDS",            category: "database",  color: "#EEEDFE", border: "#534AB7", text: "#3C3489", icon: AWS_ICON_BASE + "/Arch_Amazon-RDS_64.svg" },
  dynamodb:    { name: "DynamoDB",       category: "database",  color: "#EEEDFE", border: "#534AB7", text: "#3C3489", icon: AWS_ICON_BASE + "/Arch_Amazon-DynamoDB_64.svg" },
  aurora:      { name: "Aurora",         category: "database",  color: "#EEEDFE", border: "#534AB7", text: "#3C3489", icon: AWS_ICON_BASE + "/Arch_Amazon-Aurora_64.svg" },
  elasticache: { name: "ElastiCache",    category: "database",  color: "#EEEDFE", border: "#534AB7", text: "#3C3489", icon: AWS_ICON_BASE + "/Arch_Amazon-ElastiCache_64.svg" },
  redshift:    { name: "Redshift",       category: "database",  color: "#EEEDFE", border: "#534AB7", text: "#3C3489", icon: AWS_ICON_BASE + "/Arch_Amazon-Redshift_64.svg" },
  cognito:     { name: "Cognito",        category: "security",  color: "#FAECE7", border: "#993C1D", text: "#712B13", icon: AWS_ICON_BASE + "/Arch_Amazon-Cognito_64.svg" },
  iam:         { name: "IAM",            category: "security",  color: "#FAECE7", border: "#993C1D", text: "#712B13", icon: AWS_ICON_BASE + "/Arch_AWS-Identity-and-Access-Management_64.svg" },
  waf:         { name: "WAF",            category: "security",  color: "#FAECE7", border: "#993C1D", text: "#712B13", icon: AWS_ICON_BASE + "/Arch_AWS-WAF_64.svg" },
  kms:         { name: "KMS",            category: "security",  color: "#FAECE7", border: "#993C1D", text: "#712B13", icon: AWS_ICON_BASE + "/Arch_AWS-Key-Management-Service_64.svg" },
  sqs:         { name: "SQS",            category: "messaging", color: "#E1F5EE", border: "#0F6E56", text: "#085041", icon: AWS_ICON_BASE + "/Arch_Amazon-Simple-Queue-Service_64.svg" },
  sns:         { name: "SNS",            category: "messaging", color: "#E1F5EE", border: "#0F6E56", text: "#085041", icon: AWS_ICON_BASE + "/Arch_Amazon-Simple-Notification-Service_64.svg" },
  eventbridge: { name: "EventBridge",    category: "messaging", color: "#E1F5EE", border: "#0F6E56", text: "#085041", icon: AWS_ICON_BASE + "/Arch_Amazon-EventBridge_64.svg" },
  kinesis:     { name: "Kinesis",        category: "messaging", color: "#E1F5EE", border: "#0F6E56", text: "#085041", icon: AWS_ICON_BASE + "/Arch_Amazon-Kinesis_64.svg" },
  cloudwatch:  { name: "CloudWatch",     category: "monitoring",color: "#F1EFE8", border: "#5F5E5A", text: "#444441", icon: AWS_ICON_BASE + "/Arch_Amazon-CloudWatch_64.svg" },
  glue:        { name: "AWS Glue",       category: "analytics", color: "#EAF3DE", border: "#3B6D11", text: "#27500A", icon: AWS_ICON_BASE + "/Arch_AWS-Glue_64.svg" },
  stepfunctions:{ name: "Step Functions",category: "compute",   color: "#FAEEDA", border: "#854F0B", text: "#633806", icon: AWS_ICON_BASE + "/Arch_AWS-Step-Functions_64.svg" },
  dms:         { name: "DMS",            category: "migration", color: "#E1F5EE", border: "#0F6E56", text: "#085041", icon: AWS_ICON_BASE + "/Arch_AWS-Database-Migration-Service_64.svg" },
  bedrock:     { name: "Bedrock",        category: "ai",        color: "#FBEAF0", border: "#993556", text: "#72243E", icon: AWS_ICON_BASE + "/Arch_Amazon-Bedrock_64.svg" },
  sagemaker:   { name: "SageMaker",      category: "ai",        color: "#FBEAF0", border: "#993556", text: "#72243E", icon: AWS_ICON_BASE + "/Arch_Amazon-SageMaker_64.svg" },
  default:     { name: "AWS Service",    category: "general",   color: "#F1EFE8", border: "#5F5E5A", text: "#444441", icon: null },
};

export const CATEGORIES = {
  network:   { label: "Network",    color: "#E6F1FB", border: "#185FA5" },
  compute:   { label: "Compute",    color: "#FAEEDA", border: "#854F0B" },
  storage:   { label: "Storage",    color: "#EAF3DE", border: "#3B6D11" },
  database:  { label: "Database",   color: "#EEEDFE", border: "#534AB7" },
  security:  { label: "Security",   color: "#FAECE7", border: "#993C1D" },
  messaging: { label: "Messaging",  color: "#E1F5EE", border: "#0F6E56" },
  monitoring:{ label: "Monitoring", color: "#F1EFE8", border: "#5F5E5A" },
  analytics: { label: "Analytics",  color: "#EAF3DE", border: "#3B6D11" },
  migration: { label: "Migration",  color: "#E1F5EE", border: "#0F6E56" },
  ai:        { label: "AI / ML",    color: "#FBEAF0", border: "#993556" },
};

export function matchService(rawName) {
  if (!rawName) return "default";
  const lower = rawName.toLowerCase().replace(/[\s\-_]/g, "");
  const aliases = {
    cloudfront:    ["cloudfront","cdn"],
    apigateway:    ["apigateway","apigw","api"],
    alb:           ["alb","applicationloadbalancer"],
    route53:       ["route53","dns"],
    vpc:           ["vpc"],
    lambda:        ["lambda","function","serverless"],
    ec2:           ["ec2","instance"],
    ecs:           ["ecs","container"],
    fargate:       ["fargate"],
    eks:           ["eks","kubernetes","k8s"],
    s3:            ["s3","bucket","objectstorage"],
    efs:           ["efs","filesystem"],
    rds:           ["rds","mysql","postgres","postgresql"],
    dynamodb:      ["dynamodb","dynamo"],
    aurora:        ["aurora"],
    elasticache:   ["elasticache","redis","memcached"],
    redshift:      ["redshift","datawarehouse","spectrum"],
    cognito:       ["cognito","userpool","auth"],
    iam:           ["iam","role"],
    waf:           ["waf","firewall"],
    kms:           ["kms","encryption"],
    sqs:           ["sqs","queue"],
    sns:           ["sns","notification","topic"],
    eventbridge:   ["eventbridge","eventbus"],
    kinesis:       ["kinesis","stream"],
    cloudwatch:    ["cloudwatch","monitoring","logs"],
    glue:          ["glue","etl","datacatalog","catalog"],
    stepfunctions: ["stepfunctions","statemachine","workflow"],
    dms:           ["dms","datamigration","migrationservice"],
    bedrock:       ["bedrock"],
    sagemaker:     ["sagemaker","ml"],
  };
  for (const [key, terms] of Object.entries(aliases)) {
    if (terms.some(t => lower.includes(t))) return key;
  }
  return "default";
}
