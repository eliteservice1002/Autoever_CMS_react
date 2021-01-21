import mock from 'src/utils/mock';
mock.onGet('/api/systemadministrators').reply(() => {
    const systemadministrators = [
        {
            company_id: 1,
            id: 1,
            passwordhash: 'kkk',
            name: 'cmsuserA',
            email: 'gmail@gmail.com',
            active: true,
        },
        {
            company_id: 1,
            id: 2,
            passwordhash: 'kkk',
            name: 'customer1',
            email: 'gmail@gmail.com',
            active: false,
        },
        {
            company_id: 1,
            id: 3,
            passwordhash: 'kkk',
            name: 'cmsuser2',
            email: 'gmail@gmail.com',
            active: true,
        },
    ];

    return [200, { systemadministrators }];
});

mock.onGet('/api/systemadministrators/1').reply(() => {
    const systemadministrator = {
        company_id: 1,
        id: 1,
        passwordhash: 'kkk',
        name: 'cmsuserA',
        email: 'gmail@gmail.com',
        active: true,
    };

    return [200, { systemadministrator }];
});
