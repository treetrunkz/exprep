
export class QueryData {

    private readonly queryName: string;
    private data: any;

    constructor(queryName: string) {
        this.queryName = queryName;
        this.data = {};
    }

    async initData(filters: Map<string, string> | undefined) {

        let filterStr = '';
        if (filters) {
            filters.forEach((value, key) => {
                let prefix = '&';
                if (filterStr.length > 0) {
                    prefix = '&'
                }
                filterStr += prefix + key + '=' + value;
            });
        }

        this.data = await this.getAPIData(filterStr);

    }

    getAPIData(filterStr: string): Promise<any> {
        let url = process.env.REACT_APP_HPCCSYSTEMS_API_CLUSTER + this.queryName + `/json?` + filterStr + `&submit_type=json`;
        let headers = new Headers();
        let username = localStorage.getItem('hpccsystems.covid19.auth.username');
        let password = localStorage.getItem('hpccsystems.covid19.auth.password');
        headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
        return fetch(url, { method: 'GET', headers })
            .then(res => res.json())
    }

    getSetData(resultName: string): any {
        let fullstack: any[] = []
        this.traverseAll(this.data, resultName, fullstack)
        if (fullstack.length > 0) {
            let resultData = fullstack;
            return resultData;
        } else return [];
    }

    traverseAll(jsonObj: object, resultName: string, fullstack: any[]) {
        if (jsonObj !== null && typeof jsonObj == "object") {
            Object.entries(jsonObj).forEach(([key, value]) => {
                fullstack.push(value.Row)
                if (key === resultName) {
                    fullstack.push(value.Row);
                } else {
                    this.traverse(value, resultName, fullstack);
                }
            });
        }
        else {

        }
    }

    getData(resultName: string): any {
        let stack: any[] = [];
        let fullstack: any[] = []
        this.traverse(this.data, resultName, stack);
        console.log(this.data);
        if (stack.length > 0) {
            let resultData = stack.pop();
            return resultData;
        } else return [];
    }

    traverse(jsonObj: object, resultName: string, stack: any[]) {
        if (jsonObj !== null && typeof jsonObj == "object") {
            Object.entries(jsonObj).forEach(([key, value]) => {
                if (key === resultName) {
                    stack.push(value.Row);
                } else {
                    this.traverse(value, resultName, stack);
                }
            });
        }
        else {

        }
    }


}