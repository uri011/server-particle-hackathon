import type { CsvRow } from '../../utils/types/index.js'

import { fetchCsvData } from './utils/index.js'

const extractQuery = async (id: number): Promise<CsvRow[]> => {
    console.log('REQUEST')
    const res: CsvRow[] = await fetchCsvData(id)

    return res
}

export default extractQuery
