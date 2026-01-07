import xlsxwriter
from datetime import datetime, timedelta
import random

def create_dashboard():
    # Create workbook and sheets
    workbook = xlsxwriter.Workbook('Quran_Dashboard_Fixed.xlsx')
    
    dash_sheet = workbook.add_worksheet('اللوحة الرئيسية')
    data_sheet = workbook.add_worksheet('البيانات اليومية')
    calc_sheet = workbook.add_worksheet('Calculations')
    
    dash_sheet.right_to_left()
    data_sheet.right_to_left()
    calc_sheet.hide() # Hide calculation sheet
    
    # --- Styles ---
    color_teal = '#115e59'
    color_beige = '#fef3c7'
    color_white = '#ffffff'
    
    fmt_title_main = workbook.add_format({
        'bold': True, 'align': 'center', 'valign': 'vcenter',
        'font_size': 22, 'font_color': color_teal, 'bg_color': color_white, 'border': 2, 'border_color': color_teal
    })
    
    fmt_title_sub = workbook.add_format({
        'bold': True, 'align': 'center', 'valign': 'vcenter',
        'font_size': 18, 'font_color': '#b91c1c', 'bg_color': color_white, 'border': 2, 'border_color': color_teal
    })

    fmt_section_header = workbook.add_format({
        'bold': True, 'align': 'center', 'valign': 'vcenter',
        'font_size': 16, 'font_color': 'black', 'bg_color': 'white', 'border': 1, 'border_color': color_teal
    })

    fmt_box_label = workbook.add_format({
        'bold': True, 'align': 'center', 'valign': 'vcenter',
        'font_size': 12, 'font_color': 'black', 'bg_color': color_beige, 'border': 1, 'border_color': color_teal
    })
    
    fmt_box_value = workbook.add_format({
        'bold': True, 'align': 'center', 'valign': 'vcenter',
        'font_size': 16, 'font_color': 'black', 'bg_color': color_white, 'border': 1, 'border_color': color_teal
    })

    fmt_box_value_red = workbook.add_format({
        'bold': True, 'align': 'center', 'valign': 'vcenter',
        'font_size': 16, 'font_color': 'red', 'bg_color': color_white, 'border': 1, 'border_color': color_teal
    })

    fmt_green_header = workbook.add_format({
        'bold': True, 'align': 'center', 'valign': 'vcenter',
        'font_size': 12, 'font_color': 'white', 'bg_color': '#134e4a', 'border': 1
    })

    fmt_table_row = workbook.add_format({
        'align': 'center', 'valign': 'vcenter', 'font_size': 11, 'border': 1, 'bg_color': 'white'
    })

    # --- Data Sheet Setup ---
    # We populate data sheet first so we can reference it
    columns = ['التاريخ', 'اسم الطالب', 'المعلم', 'الفرع', 'الحالة', 'عدد الصفحات', 'الأخطاء', 'التنبيهات', 'صفحات نقية', 'جزء']
    data_sheet.write_row('A1', columns, workbook.add_format({'bold': True, 'bg_color': color_teal, 'font_color': 'white'}))
    
    students = ['يوسف عبدالرحمن', 'علي عبدالحميد', 'يوسف خالد', 'قصي حسن', 'أيمن عبده', 'خالد علي', 'عمر يوسف', 'سعيد حسن', 'عبدالله إبراهيم', 'عمر محمد']
    teachers = ['الشيخ محمد', 'الشيخ أحمد', 'الشيخ محمود']
    branches = ['كامل القرآن', '20 جزء', '15 جزء', '10 أجزاء', '5 أجزاء', '3 أجزاء']
    
    # Simple map for Branch -> Pages (Used in Python for dummy data generation logic if needed, but important for Calc sheet)
    # We need to write this reference somewhere or hardcode the lookup logic.
    # Let's create a small hidden "Settings" or just formula mapping.
    # For simplicity, we'll embed the "Volume" in the Calculation sheet Lookup or just generated data columns.
    
    # Let's assign consistent branches to students for the breakdown
    student_branches = {s: random.choice(branches) for s in students}

    # Generate 300 rows of dummy data (spread over last 30 days)
    processed_dates = []
    start_date = datetime.now()
    
    for row in range(1, 301):
        name = random.choice(students)
        
        # Random date in last 30 days
        delta = random.randint(0, 30)
        rec_date = (start_date - timedelta(days=delta)).strftime('%Y-%m-%d')
        
        data_sheet.write(row, 0, rec_date)             # Date
        data_sheet.write(row, 1, name)                 # Name
        data_sheet.write(row, 2, random.choice(teachers))             # Teacher
        data_sheet.write(row, 3, student_branches[name])              # Branch
        data_sheet.write(row, 4, 'حاضر')                              # Status
        
        pages = random.randint(1, 10)
        errors = random.randint(0, 3)
        alerts = random.randint(0, 5)
        clean = max(0, pages - (errors + alerts)) 
        
        data_sheet.write_number(row, 5, pages)
        data_sheet.write_number(row, 6, errors)
        data_sheet.write_number(row, 7, alerts)
        data_sheet.write_number(row, 8, clean)
        data_sheet.write_formula(row, 9, '=1') # Juz (Dummy)

    # --- Calculations Sheet Setup ---
    calc_sheet.write('A1', 'Unique Students')
    calc_sheet.write('B1', 'Total Pages')
    calc_sheet.write('C1', 'Avg Quality')
    calc_sheet.write('D1', 'Total Clean')
    calc_sheet.write('E1', 'Total Errors')
    calc_sheet.write('F1', 'Total Alerts')
    calc_sheet.write('G1', 'Branch Vol')
    calc_sheet.write('H1', 'Cycles')

    # Mapping for Excel Formula (SWITCH/IFS not always available in older excel, use VLOOKUP table or nested IF)
    # We will write a small lookup table for Branches in Calc Sheet K/L
    calc_sheet.write('K1', 'Branch Name')
    calc_sheet.write('L1', 'Volume')
    
    branch_map = {
        'كامل القرآن': 604,
        '20 جزء': 400,
        '15 جزء': 300,
        '10 أجزاء': 200,
        '5 أجزاء': 100,
        '3 أجزاء': 60
    }
    
    for i, (b_name, b_vol) in enumerate(branch_map.items()):
        calc_sheet.write(f'K{i+2}', b_name)
        calc_sheet.write(f'L{i+2}', b_vol)

    # Write unique students and formulas
    for i, student in enumerate(students):
        r = i + 2
        calc_sheet.write(f'A{r}', student)
        # Sum Pages
        calc_sheet.write_formula(f'B{r}', f'=SUMIF(\'البيانات اليومية\'!B:B, A{r}, \'البيانات اليومية\'!F:F)')
        # Avg Quality
        calc_sheet.write_formula(f'C{r}', f'=IF(B{r}>0, SUMIF(\'البيانات اليومية\'!B:B, A{r}, \'البيانات اليومية\'!I:I)/B{r}, 0)')
        # Sum Clean
        calc_sheet.write_formula(f'D{r}', f'=SUMIF(\'البيانات اليومية\'!B:B, A{r}, \'البيانات اليومية\'!I:I)')
        # Sum Errors
        calc_sheet.write_formula(f'E{r}', f'=SUMIF(\'البيانات اليومية\'!B:B, A{r}, \'البيانات اليومية\'!G:G)')
        # Sum Alerts
        calc_sheet.write_formula(f'F{r}', f'=SUMIF(\'البيانات اليومية\'!B:B, A{r}, \'البيانات اليومية\'!H:H)')
        
        # Lookup Branch Volume: Find Student's Branch in Data (Take first match logic via INDEX/MATCH)
        # Formula: VLOOKUP(VLOOKUP(Name, Data!B:D, 3, 0), BranchTable, 2, 0)
        # Step 1: Get Branch Name: INDEX('البيانات اليومية'!D:D, MATCH(A{r}, 'البيانات اليومية'!B:B, 0))
        # Step 2: Get Volume: VLOOKUP(BranchName, $K$2:$L$7, 2, FALSE)
        branch_lookup = f'INDEX(\'البيانات اليومية\'!D:D, MATCH(A{r}, \'البيانات اليومية\'!B:B, 0))'
        calc_sheet.write_formula(f'G{r}', f'=VLOOKUP({branch_lookup}, $K$2:$L$7, 2, FALSE)')
        
        # Cycles: Pages / Volume
        calc_sheet.write_formula(f'H{r}', f'=B{r}/G{r}')

    # Summary Metrics
    # Total Pages
    calc_sheet.write('N1', 'Total Pages')
    calc_sheet.write_formula('N2', '=SUM(\'البيانات اليومية\'!F:F)')
    
    # Total Clean
    calc_sheet.write('O1', 'Total Clean')
    calc_sheet.write_formula('O2', '=SUM(\'البيانات اليومية\'!I:I)')
    
    # Total Cycles (Khatmas)
    calc_sheet.write('P1', 'Total Cycles')
    calc_sheet.write_formula('P2', '=SUM(H2:H15)')
    
    # Unique Teachers Count (Dynamic Formula)
    # Using COUNTIF to count unique values in Column C (Teachers)
    # Formula: =SUMPRODUCT((Table!C2:C1000<>"")/COUNTIF(Table!C2:C1000, Table!C2:C1000&""))
    calc_sheet.write('R1', 'Unique Teachers')
    calc_sheet.write_formula('R2', '=SUMPRODUCT((\'البيانات اليومية\'!C2:C1000<>"")/COUNTIF(\'البيانات اليومية\'!C2:C1000, \'البيانات اليومية\'!C2:C1000&""))')

    calc_sheet.write('Q1', 'Target')
    calc_sheet.write('Q2', 15460)

    # Chart Data Preparation (Standard logic remains same)
    # Completion Rate
    calc_sheet.write('A20', 'Completion')
    calc_sheet.write_formula('B20', '=N2/Q2') # Value
    calc_sheet.write_formula('C20', '=1-B20') # Remainder
    
    # Purity Rate
    calc_sheet.write('A21', 'Purity')
    calc_sheet.write_formula('B21', '=O2/N2')
    calc_sheet.write_formula('C21', '=1-B21')
    
    # Targets
    calc_sheet.write('A22', 'Targets')
    calc_sheet.write_formula('B22', '=B20*0.5')
    calc_sheet.write_formula('C22', '=1-B22')

    # General Quality
    calc_sheet.write('A23', 'Quality')
    calc_sheet.write_formula('B23', '=O2/N2') 
    calc_sheet.write_formula('C23', '=1-B23')


    # --- Dashboard Layout ---
    dash_sheet.hide_gridlines(2) # Hide all gridlines and headers
    
    # Column Widths & Spacing
    dash_sheet.set_column('A:A', 2)   # Margin Left
    
    # Left Card (Achievements + Table 1): B-E
    dash_sheet.set_column('B:B', 6)   # Rank
    dash_sheet.set_column('C:D', 15)  # Name/Stats
    dash_sheet.set_column('E:E', 12)  # Score
    
    # Spacer 1
    dash_sheet.set_column('F:F', 3)   # Gutter
    
    # Center Card (Logo + Charts): G-H
    dash_sheet.set_column('G:H', 18)  # Wide enough for charts
    
    # Spacer 2
    dash_sheet.set_column('I:I', 3)   # Gutter
    
    # Right Card (Stats + Table 2): J-M
    dash_sheet.set_column('J:K', 15)
    dash_sheet.set_column('L:M', 10)
    
    # Spacer Right
    dash_sheet.set_column('N:N', 2)

    # --- Header Section ---
    # We want a floating white header card or transparent?
    # Reference shows a top header box. Let's make it a White Card with Teal Borders.
    dash_sheet.merge_range('B2:M3', 'الاحصائيات العامة لمجالس مثاني القرآنية 3', 
                           workbook.add_format({'bold': True, 'align': 'center', 'valign': 'vcenter', 'font_size': 24, 'font_color': '#115e59', 'bg_color': 'white', 'border': 2, 'border_color': '#115e59'}))
                           
    dash_sheet.merge_range('B4:M5', 'جامع خالد بن الوليد', 
                           workbook.add_format({'bold': True, 'align': 'center', 'valign': 'vcenter', 'font_size': 16, 'font_color': '#cb9b51', 'bg_color': 'white', 'border': 2, 'border_color': '#115e59', 'top': 0}))

    # --- CARDS GENERATION ---
    # Helper format for Card Bodies (White BG, Thin Border)
    fmt_card = workbook.add_format({'bg_color': 'white', 'border': 1, 'border_color': '#cbd5e1'})
    
    # 1. Right Card (Stats) - J:M - Rows 7-11
    # Header
    dash_sheet.merge_range('J7:M7', 'الاحصائيات', fmt_section_header)
    # Body (Pre-fill white)
    for r in range(7, 12):
        for c in range(9, 13): # J=9, M=12
            if r > 6: # Skip header row which has its own format
                dash_sheet.write_blank(r, c, '', fmt_card)
    
    # Content
    dash_sheet.merge_range('L8:M8', 'المجلس', fmt_box_label)
    dash_sheet.merge_range('J8:K8', 'المعلمين', fmt_box_label)
    
    dash_sheet.merge_range('L9:M9', 'جميع الأيام', fmt_box_value_red)
    dash_sheet.merge_range('J9:K9', '=Calculations!R2', fmt_box_value) 
    
    dash_sheet.merge_range('L10:M10', 'جلسات التسميع', fmt_box_label)
    dash_sheet.merge_range('J10:K10', 'الحضور الفعلي', fmt_box_label)
    dash_sheet.merge_range('L11:M11', '=COUNTA(\'البيانات اليومية\'!A:A)-1', fmt_box_value) 
    dash_sheet.merge_range('J11:K11', '=COUNTIFS(\'البيانات اليومية\'!E:E, "حاضر")', fmt_box_value)


    # 2. Center Card (Logo & Collaboration) - G:H - Rows 7-11
    dash_sheet.merge_range('G7:H7', 'بالتعاون مع', fmt_section_header)
    # Body
    for r in range(7, 12):
        for c in range(6, 8): # G=6, H=7
            if r > 6:
                dash_sheet.write_blank(r, c, '', fmt_card)
                
    dash_sheet.merge_range('G8:H11', '', fmt_card) # Empty box for logo
    try:
        dash_sheet.insert_image('G8', 'logo.png', {'x_scale': 0.12, 'y_scale': 0.12, 'x_offset': 30, 'y_offset': 10})
    except:
        pass


    # 3. Left Card (Achievements) - B:E - Rows 7-11
    dash_sheet.merge_range('B7:E7', 'المنجزات', fmt_section_header)
    # Body
    for r in range(7, 12):
        for c in range(1, 5): # B=1, E=4
            if r > 6:
                dash_sheet.write_blank(r, c, '', fmt_card)

    dash_sheet.merge_range('D8:E8', 'المستهدف', fmt_box_label)
    dash_sheet.merge_range('B8:C8', 'الختمات', fmt_box_label)
    
    dash_sheet.merge_range('D9:E9', 15460, fmt_box_value)
    # Highlighted Box
    dash_sheet.merge_range('B9:C9', '=Calculations!P2', workbook.add_format({'num_format': '0.00', 'bold': True, 'align': 'center', 'valign': 'vcenter', 'font_size': 16, 'font_color': 'black', 'bg_color': '#f1f5f9', 'border': 1, 'border_color': '#0f766e'}))
    
    dash_sheet.merge_range('D10:E10', 'المنجزة', fmt_box_label)
    dash_sheet.merge_range('B10:C10', 'النقية', fmt_box_label)
    dash_sheet.merge_range('D11:E11', '=Calculations!N2', fmt_box_value)
    dash_sheet.merge_range('B11:C11', '=Calculations!O2', fmt_box_value)


    # --- Charts Area (Middle) ---
    # No card background here per se, just floating donuts? 
    # Or should we put them in white boxes? Reference has them in white boxes usually.
    # Let's create individual white cards for charts.
    
    # Row 13-19 for Top Charts
    # Row 20-26 for Bottom Charts
    
    def format_chart_card(row_start, col_start, title):
        # Create a white box 2x6 roughly
        # Actually simplified: Just use the cell behind graph? 
        # Excel charts float. Let's color the cells BEHIND them white.
        r_end = row_start + 6
        c_end = col_start + 1 # spans 2 columns
        
        # Header
        # dash_sheet.merge_range(row_start, col_start, row_start, col_start, title, fmt_box_label)
        
        # Body
        # for r in range(row_start, r_end+1):
        #    for c in range(col_start, c_end+1):
        #        dash_sheet.write_blank(r, c, '', fmt_card)
        pass # Let's trust the chart background logic.

    def insert_donut(title, data_row):
        chart = workbook.add_chart({'type': 'doughnut'})
        chart.add_series({
            'values': f'=Calculations!$B${data_row}:$C${data_row}',
            'points': [{'fill': {'color': '#134e4a'}}, {'fill': {'color': '#e2e8f0'}}], # Teal & Light Slate (Empty)
            'data_labels': {'value': True, 'position': 'center', 'font': {'bold': True, 'size': 10, 'color': '#115e59'}}
        })
        chart.set_legend({'none': True})
        chart.set_title({'name': title, 'name_font': {'size': 9, 'bold': True, 'color': '#115e59'}})
        # Make Chart Transparent Background or White? White looks cleaner on cards.
        chart.set_chartarea({'border': {'color': '#cbd5e1'}, 'fill': {'color': 'white'}}) 
        chart.set_plotarea({'border': {'none': True}, 'fill': {'color': 'white'}})
        return chart

    # Insert Charts
    dash_sheet.insert_chart('G13', insert_donut('معدل الإنجاز', 20), {'x_scale': 0.65, 'y_scale': 0.65})
    dash_sheet.insert_chart('H13', insert_donut('منجز النقاء', 21), {'x_scale': 0.65, 'y_scale': 0.65})
    dash_sheet.insert_chart('G20', insert_donut('تحقيق الأهداف', 22), {'x_scale': 0.65, 'y_scale': 0.65})
    dash_sheet.insert_chart('H20', insert_donut('معدل الجودة', 23), {'x_scale': 0.65, 'y_scale': 0.65})


    # --- Tables (Card Style) ---
    
    # 1. Top Reciters - Left (B:E)
    start_row_left = 13
    # Card Header
    dash_sheet.merge_range(f'B{start_row_left}:E{start_row_left}', 'المشاركين الأكثر تسميعاً', fmt_green_header)
    
    # Table Header Row
    dash_sheet.write(f'E{start_row_left+1}', 'الصفحات', fmt_box_label)
    dash_sheet.merge_range(f'B{start_row_left+1}:D{start_row_left+1}', 'المشارك', fmt_box_label)
    
    # Data Rows (White Background)
    for i in range(5):
        r = start_row_left + 2 + i
        # Apply White Card BG to row
        # dash_sheet.write_blank(r, 1, '', fmt_card) ...
        # Actually existing formats have BG? Let's check `fmt_table_row`.
        # We need to ensure `fmt_table_row` has bg_color='white'.
        
        dash_sheet.write_formula(r, 4, f'=LARGE(Calculations!B:B, {i+1})', fmt_table_row) 
        match_formula = f'MATCH(E{r+1}, Calculations!B:B, 0)'
        dash_sheet.merge_range(r, 1, r, 3, f'=INDEX(Calculations!A:A, {match_formula})', fmt_table_row) 

    # 2. Top Quality - Right (J:M)
    start_row_right = 13
    dash_sheet.merge_range(f'J{start_row_right}:M{start_row_right}', 'الأجود تسميعاً', fmt_green_header)
    dash_sheet.write(f'M{start_row_right+1}', 'النسبة', fmt_box_label)
    dash_sheet.merge_range(f'J{start_row_right+1}:L{start_row_right+1}', 'المشارك', fmt_box_label)
    
    for i in range(5):
        r = start_row_right + 2 + i
        dash_sheet.write_formula(r, 12, f'=LARGE(Calculations!C:C, {i+1})', workbook.add_format({'num_format': '0.0%', 'border': 1, 'align': 'center', 'bg_color': 'white', 'font_name': 'Calibri', 'font_size': 11})) 
        match_formula_qual = f'MATCH(M{r+1}, Calculations!C:C, 0)'
        dash_sheet.merge_range(r, 9, r, 11, f'=INDEX(Calculations!A:A, {match_formula_qual})', fmt_table_row)

    # Background
    try:
        dash_sheet.set_background('background.jpg')
    except:
        pass

    workbook.close()
    print("Dashboard generated successfully.")

if __name__ == "__main__":
    create_dashboard()
