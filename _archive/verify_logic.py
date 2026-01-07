import random
from datetime import datetime

def verify_logic():
    print("--- 1. Generating Data ---")
    students = ['يوسف عبدالرحمن', 'علي عبدالحميد', 'يوسف خالد', 'قصي حسن', 'أيمن عبده', 'خالد علي', 'عمر يوسف', 'سعيد حسن', 'عبدالله إبراهيم', 'عمر محمد']
    branches = ['كامل القرآن', '20 جزء', '15 جزء', '10 أجزاء', '5 أجزاء', '3 أجزاء']
    
    # Map branches to pages (approx)
    branch_map = {
        'كامل القرآن': 604,
        '20 جزء': 400,
        '15 جزء': 300,
        '10 أجزاء': 200,
        '5 أجزاء': 100,
        '3 أجزاء': 60
    }
    
    # Assign a fixed branch to each student for consistency in this test
    student_branches = {s: random.choice(branches) for s in students}
    
    teachers = ['الشيخ محمد', 'الشيخ أحمد', 'الشيخ محمود']
    
    # Store dynamic data
    rows = []
    
    # Generate 100 rows
    for _ in range(100):
        student = random.choice(students)
        row = {
            'date': datetime.now().strftime('%Y-%m-%d'),
            'student': student,
            'branch': student_branches[student],
            'teacher': random.choice(teachers),
            'status': 'حاضر',
            'pages': random.randint(5, 20), # increased pages to see cycles
            'errors': random.randint(0, 2)
        }
        
        alerts = random.randint(0, 3)
        row['clean'] = max(0, row['pages'] - (row['errors'] + alerts))
        rows.append(row)
        
    print(f"Generated {len(rows)} records.\n")

    print("--- 2. Calculating Stats ---")
    
    # Group by Student to calc Cycles
    student_stats = {}
    for r in rows:
        name = r['student']
        if name not in student_stats:
            student_stats[name] = {'pages': 0, 'clean': 0, 'errors': 0, 'branch': r['branch']}
        
        student_stats[name]['pages'] += r['pages']
        student_stats[name]['clean'] += r['clean']
        student_stats[name]['errors'] += r['errors']

    # Aggregations
    total_pages_recited = sum(s['pages'] for s in student_stats.values())
    total_clean = sum(s['clean'] for s in student_stats.values())
    
    # Calculate Cycles (Khatmas)
    total_cycles = 0
    print(f"{'Name':<20} {'Branch':<12} {'Pages':<8} {'BranchPages':<12} {'Cycles':<8}")
    print("-" * 65)
    
    for name, stats in student_stats.items():
        branch_pages = branch_map.get(stats['branch'], 604)
        stats['cycles'] = stats['pages'] / branch_pages
        total_cycles += stats['cycles']
        print(f"{name:<20} {stats['branch']:<12} {stats['pages']:<8} {branch_pages:<12} {stats['cycles']:.2f}")

    total_target = 15460 # Static for now
    
    print(f"\n--- Dashboard Metrics ---")
    print(f"Goal (المستهدف): {total_target}")
    print(f"Completed (المنجزة): {total_pages_recited}")
    print(f"Clean (النقية): {total_clean}")
    print(f"Total Khatmas (Cycles): {total_cycles:.2f}")
    
    # Charts
    completion_rate = total_pages_recited / total_target
    purity_rate = total_clean / total_pages_recited if total_pages_recited > 0 else 0
    general_quality = total_clean / total_pages_recited if total_pages_recited > 0 else 0
    
    print(f"\n--- Chart Rates ---")
    print(f"Completion Rate: {completion_rate:.1%}")
    print(f"Purity Rate: {purity_rate:.1%}")
    print(f"General Quality: {general_quality:.1%} (Global Weighted Avg)")
    
    print("\n--- 3. Top Reciters (Pages) ---")
    sorted_by_pages = sorted(student_stats.items(), key=lambda x: x[1]['pages'], reverse=True)
    print(f"{'Rank':<5} {'Name':<20} {'Pages':<8} {'Clean':<8} {'Errors':<8}")
    print("-" * 60)
    for i, (name, stats) in enumerate(sorted_by_pages[:5]):
        print(f"{i+1:<5} {name:<20} {stats['pages']:<8} {stats['clean']:<8} {stats['errors']:<8}")

if __name__ == "__main__":
    verify_logic()
