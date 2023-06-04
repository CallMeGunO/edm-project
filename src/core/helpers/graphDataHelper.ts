import { TableRowData } from "../../components/DocumentsTable/DocumentsTable"

interface GraphSeries {
    series: number[]
    categories: string[]
}

class GraphDataHelper {
    getNonAxisGraphPropsFromTableGroups(categories: string[], tableRowData: TableRowData[], column: keyof TableRowData): GraphSeries {
        const result: GraphSeries = { series: [], categories: [] }

        let amount: number
        categories.forEach((category) => {
            amount = 0
            tableRowData.forEach((docGroup) => {
                if (docGroup[column] === category) {
                    amount += Number(docGroup.total)
                }
            })
            if (amount !== 0) {
                result.categories.push(category)
                result.series.push(amount)
            }
        })

        return result
    }
}

export default new GraphDataHelper()