# Impact Measurement Dashboard for NGOs

> Converting NGO program activities into measurable, decision-ready impact outcomes.

---

## Overview

This project was developed for **Challenge 5.1 — Impact Measurement Dashboard for a Partner NGO** under the Analytics & Insights Track.

### Technology Stack

- Next.js 14
- React 18
- Python 3.9+
- Tailwind CSS

---

## What the Dashboard Delivers

- Executive KPI focused on **Cost-per-Impacted Student**
- Outcome and impact tracking in near real time
- Theory of Change–driven measurement framework
- Impact threshold analysis
- Geographic and demographic exploration
- CSR and donor-ready reporting
- Automated data quality checks
- Fast dashboard performance (< 3 seconds)

---

## Navigation

1. Problem Statement
2. Solution Approach
3. Theory of Change Framework
4. Challenge Responses
5. Features
6. Architecture
7. Folder Structure
8. Data Pipeline
9. Setup Guide
10. Success Metrics
11. Roadmap
12. Expected Impact

---

## Problem Statement

NGOs often monitor activity-focused metrics such as:

- Workshops conducted
- Beneficiaries reached
- Volunteers engaged

However, these numbers do not answer a critical question:

> Are the interventions generating measurable impact?

This limitation affects:

- Fundraising efforts
- Program evaluation
- Strategic planning
- Donor communication
- Resource allocation

Without outcome-based measurement, identifying truly effective interventions becomes difficult.

---

## Solution Approach

The dashboard connects field-level operations with leadership-level decision making.

Process Flow:

```text
Activities
    ↓
Outputs
    ↓
Outcomes
    ↓
Impact
```

The platform transforms:

- Attendance records
- Assessment results
- Financial expenditure data
- Beneficiary demographics

into actionable KPIs for NGO stakeholders.

---

## Theory of Change Framework

### 1. Activity (Input)

Resources are allocated and educational programs are delivered.

**Metrics**

- Program Budget
- Learning Hours Delivered
- Number of Sessions Conducted

### 2. Output (Participation)

Students participate in program activities.

**Metrics**

- Attendance Rate
- Participation Rate
- Student Retention

### 3. Outcome (Learning Improvement)

Students demonstrate measurable learning progress.

**Metrics**

- Baseline vs Endline Improvement
- Percentage Improvement
- Learning Achievement Rate

### 4. Impact (Mission Achievement)

Educational outcomes improve efficiently and at scale.

**Metrics**

- Cost-per-Impacted Student
- Program Effectiveness Index
- Overall Impact Score

---

## Challenge Responses

### Executive Director KPI

**Cost-per-Impacted Student**

```text
Cost-per-Impacted Student =
Total Program Cost / Number of Impacted Students
```

This metric combines:

- Financial efficiency
- Outcome achievement
- Program effectiveness

into a single executive-level indicator.

### Data Quality Strategy

The pipeline automatically:

- Removes duplicate records
- Validates beneficiary information
- Handles missing values
- Standardizes formats
- Normalizes attendance data
- Merges datasets consistently

Validation occurs before dashboard ingestion.

### Reporting Frequency

| Stakeholder | Cadence |
|------------|----------|
| Field Workers | Weekly |
| Program Managers | Weekly |
| Executive Director | Monthly |
| Board Members | Quarterly |

Monthly reviews provide stronger impact trends than daily monitoring.

---

## Core Features

### Executive Dashboard

Organization-wide monitoring of:

- Cost-per-Impact
- Beneficiaries Reached
- Program Performance
- Budget Utilization

### Dynamic KPI Engine

Calculates KPIs using:

- Attendance
- Assessments
- Expense Data

Includes configurable impact thresholds.

### Geographic Analytics

Compare performance across:

- Villages
- Districts
- Regions

Supported visualizations:

- Scatter Charts
- Bar Charts
- Comparative Views

### Demographic Insights

Analyze outcomes by:

- Gender
- Age Group
- Village

Helps identify underserved populations.

### CSR Reporting

Generate reports for:

- Donors
- CSR Partners
- Board Reviews
- Funding Applications

### Dark Mode Experience

Built for NGO teams, managers, and leadership with an accessible interface.

---

## System Architecture

```text
Raw NGO Data
(Attendance, Assessments, Expenses)
            │
            ▼
    Python ETL Pipeline
            │
            ▼
  Cleaned Analytics Dataset
            │
            ▼
      KPI Engine
            │
            ▼
   Interactive Dashboard
            │
            ▼
 Executive Decision Making
```

---

## Repository Structure

```text
impact-dashboard/
│
├── scripts/
│   ├── generate_data.py
│   └── transform_data.py
│
├── raw_data/
│   ├── beneficiaries.csv
│   ├── attendance.csv
│   ├── assessments.csv
│   └── expenses.csv
│
├── public/
│   └── final_dashboard_data.csv
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
└── package.json
```

---

## Data Pipeline

### Step 1: Data Generation

`generate_data.py` creates synthetic NGO datasets including:

- 500 Students
- 4 Villages
- Six-Month Program Duration
- Attendance Records
- Assessment Scores
- Financial Data

### Step 2: Data Transformation

`transform_data.py` computes:

- Attendance Rate
- Score Improvement
- Impact Metrics
- Program Costs

Output:

```text
public/final_dashboard_data.csv
```

The dataset is flattened for faster dashboard rendering.

---

## Setup Instructions

### Requirements

- Node.js 18+
- Python 3.9+

### Clone

```bash
git clone <your-repository-url>
cd impact-dashboard
```

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

Visit:

```text
http://localhost:3000
```

### Optional Data Generation

```bash
cd scripts

python -m venv venv

venv\Scripts\activate
# OR
source venv/bin/activate

pip install pandas numpy

python generate_data.py
python transform_data.py
```

---

## Success Metrics

| Metric | Target |
|----------|----------|
| Dashboard Load Time | < 3 Seconds |
| KPI Accuracy | 100% |
| Data Validation | Automated |
| Stakeholder Usability Score | ≥ 8/10 |
| Refresh Performance | Near Real-Time |

---

## Future Roadmap

### PostgreSQL / Supabase Migration

Move from CSV-based storage to a scalable database backend.

### Role-Based Access Control

**Field Workers**
- Attendance Entry
- Assessment Submission

**Program Managers**
- Performance Monitoring
- Resource Allocation

**Executive Directors**
- Impact Monitoring
- Strategic Planning

### AI-Powered Insights

Automatically generate:

- Weekly Summaries
- Trend Analysis
- Performance Alerts
- Intervention Recommendations

### IRIS+ Alignment

Supports globally recognized impact measurement standards through:

- Better donor reporting
- Easier grant applications
- Improved transparency

---

## Expected Impact

The framework is reusable across NGOs of different scales and sectors.

Benefits include:

- Better funding decisions
- Improved program effectiveness
- Stronger donor confidence
- Data-driven leadership
- Scalable impact measurement

---

**Built for Challenge 5.1 — Impact Measurement Dashboard for a Partner NGO**
