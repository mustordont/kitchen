export const StaticSettings = {
    api: {
        about: '',
        auth: {
            login: '/auth/login',
            refresh: '/auth/refresh',
        },
        account: '/account',
        choiceSign: '/choice',
        employee: {
            search: '/employee/search',
        },
        structure: {
            generate: '/structure/generate',
            get: '/structure'
        },
        landscape: {
            domain: '/landscape/domain',
            group: '/landscape/group',
            kuber: '/landscape/kuber',
            network: '/landscape/network',
            host: '/landscape/host',
            application: '/landscape/application',
            search: {
                kuber: '/landscape/search/kuber',
                host: '/landscape/search/host',
            }
        },
        certificates: {
            root: '/certificate',
            file: '/certificate/file',
            job: '/certificate/job',
            analyze: '/certificate/analyze',
        }
    },
    branch: 'apps',
};

function replaceId(url: string, id: number | string): string {
    return url.replace('${id}', String(id));
}
