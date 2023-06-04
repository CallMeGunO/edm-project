class DepartmentsApi {
    static async getDepartments() {
        try {
            const url = `/api/us/superuser/department/getList`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    filters: null,
                    sorting: null,
                    paging: { page: 0, rowsPerPage: 500, enableNext: true }
                })
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

    static async getLdapDepartments() {
        try {
            const url = `/api/us/superuser/domain/d8d48303-40e4-4163-9f03-a733c461e8a5/unit/getList`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    filters: null,
                    sorting: null,
                    paging: { page: 0, rowsPerPage: 1000, enableNext: true }
                })
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

export default DepartmentsApi
