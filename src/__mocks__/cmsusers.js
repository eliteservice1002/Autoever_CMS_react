import mock from 'src/utils/mock';
mock.onGet('/api/cmsusers').reply(() => {
    const cmsusers = [
        {
            company_id: 1,
            id: 1,
            passwordhash: 'kkk',
            name: 'cmsuserA',
            email: 'gmail@gmail.com',
            role_id: 2,
            active: true,
        },
        {
            company_id: 1,
            id: 2,
            passwordhash: 'kkk',
            name: 'customer1',
            email: 'gmail@gmail.com',
            role_id: 1,
            active: true,
        },
        {
            company_id: 1,
            id: 3,
            passwordhash: 'kkk',
            name: 'cmsuser2',
            email: 'gmail@gmail.com',
            role_id: 3,
            active: false,
        },
    ];

    return [200, { cmsusers }];
});

mock.onGet('/api/cmsusers/1').reply(() => {
    const cmsuser = {
        company_id: 1,
            id: 1,
            passwordhash: 'kkk',
            name: 'cmsuserA',
            email: 'gmail@gmail.com',
            role_id: 1,
            active: true,
    };

    return [200, { cmsuser }];
});
