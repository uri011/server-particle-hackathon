import fetch from 'node-fetch'
import { parse } from 'csv-parse/sync'

import type { CsvRow } from '../../../utils/types/index.js'

async function fetchCsvData(queryId: number): Promise<CsvRow[]> {
    if (process.env.duneApiKey == undefined) throw new Error('API Key Required')

    const url = `https://api.dune.com/api/v1/query/${queryId}/results/csv`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Dune-API-Key': process.env.duneApiKey,
            },
        })

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const csvText = await response.text()

        const data: CsvRow[] = parse(csvText, {
            columns: true,
            skip_empty_lines: true,
        })

        return data
    } catch (error) {
        console.error('Error fetching CSV data:', error)
        throw error
    }
}

export default fetchCsvData
