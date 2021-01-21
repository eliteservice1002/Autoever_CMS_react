import mock from 'src/utils/mock';
mock.onGet('/api/roles').reply(() => {
    const roles = [
        {
            id: 1,
            view: false,
            write: false,
            modify: false,
            delete: false,
            active: false,
            module_id: 1,
            module_name: 'Beneficios',
        },
        {
            id: 2,
            view: false,
            write: false,
            modify: true,
            delete: false,
            active: false,
            module_id: 2,
            module_name: 'Bus routes',
        },
        {
            id: 3,
            view: false,
            write: false,
            modify: true,
            delete: true,
            active: false,
            module_id: 3,
            module_name: 'Counceling Room',
        },
    ];

    return [200, { roles }];
});
mock.onGet('/api/roles/1').reply(() => {
    const roles = [
        {
            id: 1,
            view: false,
            write: false,
            modify: false,
            delete: false,
            active: false,
            module_id: 1,
            module_name: 'Beneficios',
        },
        {
            id: 2,
            view: false,
            write: false,
            modify: false,
            delete: false,
            active: false,
            module_id: 2,
            module_name: 'Bus routes',
        },
        {
            id: 3,
            view: false,
            write: false,
            modify: false,
            delete: false,
            active: false,
            module_id: 3,
            module_name: 'Counceling Room',
        },
    ];

    return [200, { roles }];
});