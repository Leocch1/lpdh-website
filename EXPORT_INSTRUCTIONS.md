# 📊 How to Export Contact Messages to Excel

## Quick Export URLs (Copy and paste into your browser):

### Export All Messages:
```
http://localhost:3000/api/contact/export
```

### Export Complaints Only:
```
http://localhost:3000/api/contact/export?messageType=complaint
```

### Export This Month (August 2025):
```
http://localhost:3000/api/contact/export?dateFrom=2025-08-01&dateTo=2025-08-31
```

### Export New Messages Only:
```
http://localhost:3000/api/contact/export?status=new
```

### Export Date Range (Example: Last 7 days):
```
http://localhost:3000/api/contact/export?dateFrom=2025-08-01&dateTo=2025-08-07
```

## Advanced Export Options:

### Custom Filters:
- `messageType=complaint` - Only complaints
- `messageType=inquiry` - Only general inquiries
- `status=new` - New messages only
- `status=resolved` - Resolved messages only
- `dateFrom=YYYY-MM-DD` - Start date
- `dateTo=YYYY-MM-DD` - End date

### Combined Examples:
- New complaints: `?messageType=complaint&status=new`
- Resolved inquiries: `?messageType=inquiry&status=resolved`
- Last month complaints: `?messageType=complaint&dateFrom=2025-07-01&dateTo=2025-07-31`

## File Details:
- Format: CSV (opens directly in Excel)
- Encoding: UTF-8 with BOM (proper Excel compatibility)
- Timezone: Philippine Time (Asia/Manila)
- Includes: All message details, timestamps, status, and internal notes

## Alternative Access:
You can also use the admin dashboard at:
```
http://localhost:3000/admin/export
```
