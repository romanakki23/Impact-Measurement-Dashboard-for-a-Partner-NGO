import pandas as pd
import os

# Create processed_data directory if it doesn't exist
os.makedirs('../processed_data', exist_ok=True)

RAW_DIR = '../raw_data'
PROCESSED_DIR = '../processed_data'

print("Loading raw data...")
df_students = pd.read_csv(f'{RAW_DIR}/beneficiaries.csv')
df_attendance = pd.read_csv(f'{RAW_DIR}/attendance.csv')
df_assessments = pd.read_csv(f'{RAW_DIR}/assessments.csv')
df_expenses = pd.read_csv(f'{RAW_DIR}/expenses.csv')

# 1. Calculate Outputs: Attendance
print("Calculating attendance rates...")
att_summary = df_attendance.groupby('student_id')['attended'].agg(['sum', 'count']).reset_index()
att_summary['attendance_rate'] = (att_summary['sum'] / att_summary['count']) * 100
att_summary = att_summary.rename(columns={'sum': 'classes_attended', 'count': 'total_classes'})

# 2. Merge all entities
print("Merging datasets...")
df_merged = df_students.merge(att_summary, on='student_id', how='left').merge(df_assessments[['student_id', 'endline_score']], on='student_id', how='left')

# 3. Calculate Outcomes: Learning Improvement
df_merged['score_improvement'] = df_merged['endline_score'] - df_merged['baseline_score']
df_merged['pct_improvement'] = (df_merged['score_improvement'] / df_merged['baseline_score']) * 100

# 4. Define 'Impact': A student is considered 'impacted' if their score improved by at least 20%
df_merged['is_impacted'] = (df_merged['pct_improvement'] >= 20).astype(int)

# 5. Financial Translation Layer
total_spend = df_expenses['amount'].sum()
total_impacted = df_merged['is_impacted'].sum()
cost_per_impact = total_spend / total_impacted if total_impacted > 0 else 0

print("\n" + "="*30)
print(" KPI TRANSLATION SUMMARY ")
print("="*30)
print(f"Total Budget Spent: ₹{total_spend:,.2f}")
print(f"Total Students Enrolled: {len(df_merged)}")
print(f"Impacted Students (>20% Improvement): {total_impacted}")
print(f"COST PER IMPACTED STUDENT: ₹{cost_per_impact:,.2f}")
print("="*30 + "\n")

# Export flattened data
output_path = f'{PROCESSED_DIR}/final_dashboard_data.csv'
df_merged.to_csv(output_path, index=False)
print(f"✅ Phase 2 Complete: Transformed dataset saved to {output_path}.")