import pandas as pd
import numpy as np
import random
import uuid
from datetime import datetime, timedelta
import os

# Create raw_data directory if it doesn't exist just in case
os.makedirs('../raw_data', exist_ok=True)

# Set seeds for reproducibility
np.random.seed(42)
random.seed(42)

NUM_STUDENTS = 500
START_DATE = datetime(2025, 6, 1)
END_DATE = datetime(2025, 12, 1)
VILLAGES = ['Rampur', 'Shantipur', 'Kusumpur', 'Devipur']
GENDERS = ['Male', 'Female']

print("Generating beneficiary data...")
students = [{'student_id': f"STU-{uuid.uuid4().hex[:6].upper()}", 'gender': random.choice(GENDERS), 'age': random.randint(8, 14), 'village': random.choice(VILLAGES), 'baseline_score': round(random.uniform(20.0, 60.0), 1)} for _ in range(NUM_STUDENTS)]
df_students = pd.DataFrame(students)

print("Generating attendance logs...")
session_dates = pd.date_range(start=START_DATE, end=END_DATE, freq='W-MON').tolist() + pd.date_range(start=START_DATE, end=END_DATE, freq='W-THU').tolist()
attendance = [{'log_id': f"ATT-{uuid.uuid4().hex[:8].upper()}", 'student_id': s['student_id'], 'session_date': d.strftime('%Y-%m-%d'), 'attended': 1 if random.random() < random.uniform(0.5, 0.95) else 0} for s in students for d in session_dates]
df_attendance = pd.DataFrame(attendance)

print("Generating assessment scores...")
assessments = []
for _, s in df_students.iterrows():
    att_rate = df_attendance[df_attendance['student_id'] == s['student_id']]['attended'].mean()
    endline = min(100.0, s['baseline_score'] + (att_rate * random.uniform(10.0, 30.0)) + random.uniform(-5.0, 10.0))
    assessments.append({'assessment_id': f"ASSESS-{uuid.uuid4().hex[:6].upper()}", 'student_id': s['student_id'], 'assessment_date': END_DATE.strftime('%Y-%m-%d'), 'endline_score': round(endline, 1)})
df_assessments = pd.DataFrame(assessments)

print("Generating financial expenses...")
expenses = []
curr = START_DATE
while curr <= END_DATE:
    if curr.day == 1:
        expenses.extend([{'expense_id': f"EXP-{uuid.uuid4().hex[:6].upper()}", 'date': curr.strftime('%Y-%m-%d'), 'category': 'Teacher Salary', 'amount': 50000}, {'expense_id': f"EXP-{uuid.uuid4().hex[:6].upper()}", 'date': curr.strftime('%Y-%m-%d'), 'category': 'Infrastructure', 'amount': 15000}])
    if random.random() < 0.1:
        expenses.append({'expense_id': f"EXP-{uuid.uuid4().hex[:6].upper()}", 'date': curr.strftime('%Y-%m-%d'), 'category': 'Operations', 'amount': round(random.uniform(2000, 10000), 2)})
    curr += timedelta(days=1)
df_expenses = pd.DataFrame(expenses)

# Save everything to the raw_data folder
out_dir = '../raw_data'
df_students.to_csv(f'{out_dir}/beneficiaries.csv', index=False)
df_attendance.to_csv(f'{out_dir}/attendance.csv', index=False)
df_assessments.to_csv(f'{out_dir}/assessments.csv', index=False)
df_expenses.to_csv(f'{out_dir}/expenses.csv', index=False)

print("✅ Phase 1 Complete: Synthetic data generated in raw_data folder.")