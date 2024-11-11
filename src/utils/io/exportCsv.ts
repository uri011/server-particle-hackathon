import { writeFile } from 'fs'

import path from 'path'

import type { CsvRow } from '../types/index.js'

import { exportsDirPath } from '../system.js'

const toCsv = (data: CsvRow[]) => {
    const csvRows = []
    const headers = Object.keys(data[0])
    csvRows.push(headers.join(',')) // Add column headers

    for (const row of data) {
        const values = headers.map(header => JSON.stringify(row[header]))
        csvRows.push(values.join(','))
    }

    return csvRows.join('\n')
}

const exportToCsv = (data: CsvRow[], filename: string) => {
    const csvData = toCsv(data)
    const filePath = path.join(exportsDirPath, `${filename}.csv`)

    writeFile(filePath, csvData, err => {
        if (err) {
            console.error('Error writing to CSV file', err)
        } else {
            console.log(`Successfully saved data to ${filename}`)
        }
    })
}

export default exportToCsv
