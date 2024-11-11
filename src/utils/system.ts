import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const abisDirPath = path.join(__dirname, '../..', 'abis')
export const exportsDirPath = path.join(__dirname, '../..', 'exports')
