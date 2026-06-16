# Notification Engine Operations & Monitoring Platform

## Complete Technical Specification for Cursor

# Project Overview

Build a production-ready web application called:

**Notification Engine Operations & Monitoring Platform**

The platform provides real-time monitoring, troubleshooting, operational control, analytics, and management capabilities for an enterprise Notification Engine.

The platform consumes REST APIs exposed by an Enterprise Service Bus (ESB).

This project must be designed as a modern enterprise-grade SaaS-style operations dashboard.

---

# Deployment Target

The application will be deployed on:

* Hetzner Cloud VPS
* Ubuntu 24.04
* Docker
* Coolify
* PostgreSQL

The entire solution must be containerized.

Generate:

* Dockerfile(s)
* docker-compose.yml
* .env.example
* README.md
* Deployment Guide

---

# Technology Stack

## Frontend

Use:

* Angular 20+
* Angular Material
* RxJS
* SCSS
* ApexCharts
* Responsive Design

Requirements:

* Dark Mode
* Light Mode
* Mobile Friendly
* Modern Enterprise UI

---

## Backend

Use:

* NestJS
* TypeScript
* REST APIs
* Swagger/OpenAPI
* JWT Authentication
* Role Based Access Control (RBAC)

---

## Database

Use:

* PostgreSQL

ORM:

* Prisma

---

# Architecture

Create the following architecture:

Frontend (Angular)

↓

Backend API (NestJS)

↓

PostgreSQL

↓

Mock ESB Service Layer

The system must support replacing mock APIs later with real ESB endpoints.

Use Repository Pattern.

Use Service Layer Architecture.

Use DTO Validation.

Use Structured Logging.

---

# Authentication

Implement:

## Login

Fields:

* Username
* Password

Generate JWT Token

---

## Roles

Create roles:

### Admin

Full access

### Operations

Can monitor and perform operational actions

### Auditor

Read-only access

### Viewer

Dashboard access only

---

# Main Modules

---

# Module 1: Dashboard

Create dashboard summary page.

Display:

* Total Notifications
* Success Count
* Failure Count
* Pending Count
* In Flight Count
* Success Rate
* Failure Rate
* Queue Depth

Display charts:

* Notifications Trend
* Success vs Failure
* Channel Distribution
* Provider Distribution

Refresh every 30 seconds.

Show:

Last Updated Timestamp

---

# Module 2: Channel Health Monitoring

Display tiles for:

* SMS
* Email
* Push Notification

Status:

* Healthy
* Degraded
* Down

Display:

* Throughput
* Error Rate
* Average Latency

Use color indicators.

---

# Module 3: Provider Monitoring

Display provider cards.

Show:

* Provider Name
* Throughput
* Success Rate
* Failure Rate
* Average Latency
* Current Status

Support:

Enable Provider

Disable Provider

Confirmation dialog required.

---

# Module 4: Notification Search

Create advanced search page.

Filters:

* Notification ID
* Request ID
* Event ID
* Message ID
* Business Reference
* Status
* Channel
* Provider
* Consumer Channel
* Date Range

Results Grid:

* Notification ID
* Event ID
* Request ID
* Channel
* Status
* Recipient
* Created Date

Support:

Pagination

Sorting

Export CSV

---

# Module 5: Notification Details

Show full notification lifecycle.

Display:

Timeline View

Statuses:

NE_CREATED

NE_PROCESSING

NE_PROCESSED

NE_FAILED

NE_SENDING

NE_SENT

NE_INITIALIZED

NE_UNDER_PROCESSING

NE_ROUTED

NE_SUCCESS

NE_RETRY

NE_PARTIALLY_FAILED

NE_PENDING

Display:

* Provider Response
* Error Details
* Retry Attempts
* Metadata
* Payload Information

---

# Module 6: Templates Management

Create Templates page.

Display:

* Template ID
* Notification Code
* Event Code
* Channel
* Language
* Enabled
* Retry Count

Actions:

Enable Template

Disable Template

Update Retry Count

Audit all changes.

---

# Module 7: IDM Contact Configuration

Display:

* GovAgency
* VRPCode
* RoleName
* UserId
* Sector
* VendorId
* PrivateSector

Allow:

Enable

Disable

Edit Configuration

All changes must be audited.

---

# Module 8: Queue Monitoring

Display:

* Queue Name
* Capacity
* Current Depth
* Drain Rate
* Oldest Message Age
* Status

Visual Indicators:

Healthy

Warning

Critical

Support:

Update Capacity

Audit Changes

---

# Module 9: Consumer Channel Management

Display channels.

Actions:

Authorize

Ban

Enable SMS Simulator

Disable SMS Simulator

Enable International SMS

Disable International SMS

Audit all actions.

---

# Module 10: Retry & Recovery

Implement:

Manual Retry

Bulk Retry

Show:

* Retry ID
* Retry Status
* Retry History

Audit Required.

---

# Module 11: Workload Management

Display:

* Active Instances
* Max Instances
* CPU Usage
* Memory Usage
* Queue Pressure

Allow:

Scale Instances

Validation:

Maximum 250 Instances

Audit Required.

---

# Module 12: Alerts & Incident Management

Create alerts page.

Alert Types:

* Queue Backlog
* Provider Down
* SLA Breach
* Error Spike

Fields:

* Severity
* Source
* Start Time
* Status

Actions:

Acknowledge

Resolve

Silence

---

# Module 13: SLA Monitoring

Display:

* SLA Compliance
* P50 Latency
* P90 Latency
* P95 Latency
* P99 Latency

Create charts and gauges.

---

# Module 14: Audit Logs

Store every action.

Audit Fields:

* User
* Action
* Timestamp
* Resource
* Before State
* After State
* Reason

Features:

* Search
* Filter
* Export

Audit records must be immutable.

---

# Module 15: Reports

Generate reports:

* Delivery Summary
* Failure Summary
* SLA Report
* Provider Scorecard
* Queue Performance

Export Formats:

* CSV
* Excel
* PDF

---

# API Layer

Base Path:

/api/v1/notification-engine

Generate:

Swagger Documentation

Versioned APIs

Global Error Handler

Validation Pipe

Response Wrapper

Standard Response Format:

{
"success": true,
"data": {}
}

Error Format:

{
"success": false,
"error": {
"code": "",
"message": "",
"details": ""
}
}

---

# Mock Data

Generate realistic seed data:

* 10000 notifications
* Multiple providers
* Multiple channels
* Queue metrics
* Audit records
* Templates
* Alerts

Use Prisma Seed.

---

# Coolify Requirements

Application must be deployable using:

docker-compose up -d

Services:

* frontend
* backend
* postgres

Environment variables must be configurable.

---

# Deliverables

Generate:

1. Complete Angular Frontend
2. Complete NestJS Backend
3. PostgreSQL Schema
4. Prisma Models
5. Dockerfiles
6. docker-compose.yml
7. Swagger Documentation
8. Seed Data
9. README.md
10. Deployment Guide
11. Folder Structure Documentation

The final solution must be production-ready and fully deployable on Hetzner VPS using Coolify.
