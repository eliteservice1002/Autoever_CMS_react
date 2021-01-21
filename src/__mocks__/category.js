import mock from 'src/utils/mock';

mock.onGet('/api/category').reply(() => {
    const category = [
        {
            id: 1,
            name: 'CompanyA',
            slogan: 'CompanyA is good',
            logo_path: '',
            key: 'KMM',
            active: true,
            primary_color: 'red',
            secondary_color: 'pink',
            home_background_image_path: '',
            payroll_disclaimer: 'company A payroll',
            terms_and_conditions: 'company A term',
            notice_of_privacy: 'company A privacy',
        },
        {
            id: 2,
            name: 'CompanyB',
            slogan: 'CompanyA is good',
            logo_path: '',
            key: 'HVM',
            active: true,
            primary_color: 'white',
            secondary_color: 'black',
            home_background_image_path: '',
            payroll_disclaimer: 'company B payroll',
            terms_and_conditions: 'company B term',
            notice_of_privacy: 'company B privacy',
        },
        {
            id: 3,
            name: 'CompanyC',
            slogan: 'CompanyC is good',
            logo_path: '',
            key: 'HGM',
            active: true,
            primary_color: 'blue',
            secondary_color: 'green',
            home_background_image_path: '',
            payroll_disclaimer: 'company C payroll',
            terms_and_conditions: 'company C term',
            notice_of_privacy: 'company C privacy',
        },
    ];

    return [200, { category }];
});

