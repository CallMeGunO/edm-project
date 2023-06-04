class PlatformApi {
    static DEFAULT_PARAMS = {
        filters: null,
        sorting: null,
        paging: { page: 0, rowsPerPage: 500, enableNext: true }
    }
    static async getEntityLists() {
        try {
            const url = `/api/ecm/entity/getList`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(this.DEFAULT_PARAMS)
            })

            if (response.ok) {
                const json = await response.json()
                return json
            } else {
                return Promise.reject(response)
            }
        } catch (error) {
            console.log(error)
        }
    }
    static async getListItems(listId: string, params?: object | null) {
        try {
            const url = `/api/ecm/entity/${listId}/instance/getList`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(params || this.DEFAULT_PARAMS)
            })

            if (response.ok) {
                const json = await response.json()
                return json
            } else {
                return Promise.reject(response)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default PlatformApi
