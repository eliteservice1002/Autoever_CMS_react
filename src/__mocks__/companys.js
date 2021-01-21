import mock from 'src/utils/mock';
mock.onGet('/api/companys').reply(() => {
    const companys = [
        {
            id: 1,
            name: 'CompanyA',
            slogan: 'CompanyA is good',
            logo_path: '',
            key: 'KMM',
            active: true,
            primary_color: '#3468B1',
            secondary_color: '#3468B1',
            home_background_image_path: '',
            payroll_disclaimer: 'company A payroll',
            terms_and_conditions: 'company A term',
            notice_of_privacy: 'company A privacy',
            modules: [{id:1,us:'Benefits',es:'Beneficios',  active:true},
            {id:2,us:'Buses',es:'Transporte de Persona', active:false},
            {id:3,us:'HR Requests',es:'HR Requests', active:true},]
        },
        {
            id: 2,
            name: 'CompanyB',
            slogan: 'CompanyA is good',
            logo_path: '',
            key: 'HVM',
            active: true,
            primary_color: '#3468B1',
            secondary_color: '#3468B1',
            home_background_image_path: '',
            payroll_disclaimer: 'company B payroll',
            terms_and_conditions: 'company B term',
            notice_of_privacy: 'company B privacy',
            modules: [{id:1,us:'Benefits',es:'Beneficios',  active:true},
            {id:2,us:'Buses',es:'Transporte de Persona', active:false},
            {id:3,us:'HR Requests',es:'HR Requests', active:true},]
        },
        {
            id: 3,
            name: 'CompanyC',
            slogan: 'CompanyC is good',
            logo_path: '',
            key: 'HGM',
            active: true,
            primary_color: '#3468B1',
            secondary_color: '#3468B1',
            home_background_image_path: '',
            payroll_disclaimer: 'company C payroll',
            terms_and_conditions: 'company C term',
            notice_of_privacy: 'company C privacy',
            modules: [{id:1,us:'Benefits',es:'Beneficios',  active:true},
            {id:2,us:'Buses',es:'Transporte de Persona', active:false},
            {id:3,us:'HR Requests',es:'HR Requests', active:true},]
        },
    ];

    return [200, { companys }];
});

mock.onGet('/api/companys/1').reply(() => {
    const company = {
        id: 2,
        name: 'CompanyB',
        slogan: 'CompanyA is good',
        logo_path: '',
        key: 'HVM',
        active: true,
        primary_color: '#3468B1',
        secondary_color: '#3468B1',
        home_background_image_path: '',
        payroll_disclaimer: 'company B payroll',
        terms_and_conditions: 'company B term',
        notice_of_privacy: 'company B privacy',
        modules: [
            {id:1,us:'Benefits',es:'Beneficios',  active:true},
            {id:2,us:'Buses',es:'Transporte de Persona', active:false},
            {id:3,us:'HR Requests',es:'HR Requests',  active:true},
        ],
    };
    return [200, { company }];
});
