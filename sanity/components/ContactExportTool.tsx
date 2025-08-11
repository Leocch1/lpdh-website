import React from 'react'
import { Card, Button, Flex, Text, Stack } from '@sanity/ui'
import { DownloadIcon, DocumentIcon, CalendarIcon } from '@sanity/icons'

export function ContactExportTool() {
  const handleExport = (filters = '') => {
    const url = `${window.location.origin}/api/contact/export?format=csv${filters}`
    window.open(url, '_blank')
  }

  const handleExportThisMonth = () => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()
    handleExport(`&dateFrom=${firstDay}&dateTo=${lastDay}`)
  }

  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={4}>
        <Text size={2} weight="semibold">
          📊 Export Contact Messages to Excel
        </Text>
        
        <Flex gap={3} wrap="wrap">
          <Button
            icon={DownloadIcon}
            text="Export All Messages"
            tone="primary"
            onClick={() => handleExport()}
          />
          
          <Button
            icon={DocumentIcon}
            text="Export Complaints Only"
            tone="critical"
            onClick={() => handleExport('&messageType=complaint')}
          />
          
          <Button
            icon={CalendarIcon}
            text="Export This Month"
            tone="positive"
            onClick={handleExportThisMonth}
          />
        </Flex>
        
        <Text size={1} muted>
          Click any button above to download a CSV file that opens directly in Excel.
          The file will include all message details, timestamps, and status information.
        </Text>
      </Stack>
    </Card>
  )
}
