import React, { useState } from 'react';
import { parseSOW } from '../../agents/sowParser';

const EXAMPLES = {
  ecommerce: `We need a scalable e-commerce platform on AWS. The system should have a React frontend hosted on S3 and served via CloudFront CDN. An API Gateway will route requests to multiple Lambda functions handling products, orders, and users. We need a PostgreSQL RDS database in a private subnet with read replicas. Product images go to S3. Users authenticate with Cognito. We need SQS queues for order processing and SNS for notifications. Everything should be in a VPC with proper public and private subnets.`,
  datapipeline: `Build a data ingestion pipeline on AWS. Raw data arrives from IoT devices via Kinesis Data Streams, processed by Lambda, and stored in S3 data lake. Glue jobs run ETL transformations nightly. Processed data lands in Redshift for analytics. A QuickSight dashboard sits on top. We need CloudWatch for monitoring and SNS alerts if ingestion fails.`,
  microservices: `We need a microservices architecture. API Gateway sits at the edge. Behind it are 3 services: User Service, Product Service, and Order Service, each running on ECS Fargate. Each service has its own RDS PostgreSQL database. Services communicate via SQS. There is a Redis ElastiCache for session storage. ECR stores our Docker images. ALB distributes traffic to ECS tasks. Cognito handles authentication.`,
};

export default function InputPanel({
  sowText, setSowText, setStep,
  setArchitecture, setChatHistory,
  setIsLoading, isLoading
}) {
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!sowText.trim()) {
      setError('Please enter your project description before continuing.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const apiKey = process.env.REACT_APP_GROQ_API_KEY;
      const parsed = await parseSOW(sowText, apiKey);
      setArchitecture(parsed);
      const firstMessage = {
        role: 'assistant',
        content: parsed.ambiguities && parsed.ambiguities.length > 0
          ? `I have analyzed your project description and identified the following AWS services: ${parsed.services.map(s => s.name).join(', ')}.\n\nBefore generating the diagram, I have a few clarifying questions.`
          : `I have analyzed your project description and identified all the AWS services needed. Generating your architecture diagram now!`,
        options: [],
      };
      setChatHistory([firstMessage]);
      setStep('chat');
    } catch (err) {
      setError(`Analysis failed: ${err.message}. Please check your API key and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
          Describe your AWS infrastructure
        </h2>
        <p style={{ fontSize: 14, color: '#64748b' }}>
          Paste your Statement of Work, project description, or customer transcript.
          The AI will extract AWS services and ask clarifying questions.
        </p>
      </div>

      <textarea
        rows={10}
        placeholder="e.g. We need a scalable web application on AWS with a React frontend served via CloudFront, API Gateway connecting to Lambda functions, RDS PostgreSQL in a private subnet, S3 for file storage, and Cognito for authentication..."
        value={sowText}
        onChange={e => setSowText(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 8, padding: '10px 14px',
          fontSize: 13, color: '#dc2626', marginBottom: 12
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
          Or try an example:
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries({ ecommerce: 'E-commerce platform', datapipeline: 'Data pipeline', microservices: 'Microservices app' }).map(([key, label]) => (
            <button
              key={key}
              className="btn-secondary"
              style={{ fontSize: 12, padding: '6px 14px' }}
              onClick={() => setSowText(EXAMPLES[key])}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn-primary"
          onClick={handleAnalyze}
          disabled={isLoading}
        >
          {isLoading ? (
            <><span className="spinner" />Analyzing...</>
          ) : (
            'Analyze & Continue →'
          )}
        </button>
      </div>
    </div>
  );
}
