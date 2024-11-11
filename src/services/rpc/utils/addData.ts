import { AbiFunction } from 'viem'
import { ReadData } from '../../../utils/types/index.js'

export const addInputs = (
    r: ReadData,
    item: AbiFunction,
    args: any[],
    inputs?: string[],
): ReadData => {
    if (inputs == undefined) {
        for (let n = 0; n < item.inputs.length; n++) {
            let inputName = item.inputs[n].name
            if (inputName == undefined || inputName === '') {
                r.inputs[`unnamed${n}`] = args[n]
            } else {
                r.inputs[inputName] = args[n]
            }
        }
    } else {
        for (let n = 0; n < inputs.length; n++) r.inputs[inputs[n]] = args[n]
    }

    return r
}

export const addOutputs = (
    r: ReadData,
    item: AbiFunction,
    data: unknown,
    outputs?: string[],
): ReadData => {
    if (outputs == undefined) {
        for (let n = 0; n < item.outputs.length; n++) {
            let outputName = item.outputs[n].name
            if (outputName == undefined || outputName === '') {
                r.outputs[`unnamed${n}`] = !Array.isArray(data) ? data : data[n]
            } else {
                r.outputs[outputName] = !Array.isArray(data) ? data : data[n]
            }
        }
    } else {
        if (!Array.isArray(data)) {
            r.outputs[outputs[0]] = data
        } else {
            for (let n = 0; n < outputs.length; n++) r.outputs[outputs[n]] = data[n]
        }
    }

    return r
}
