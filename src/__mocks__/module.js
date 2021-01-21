import mock from 'src/utils/mock';
mock.onGet('/api/module').reply(() => {
    const module = [
        {
            id: 1,
            name: 'Beneficios',
           
        },
        {
            id: 2,
            name: 'Bus routes',
           
        },
        {
            id: 3,
            name: 'Counceling room',
          
        },
        {
            id: 4,
            name: 'Events',
          
        },
        {
            id: 5,
            name: 'FAQs',
          
        },
        {
            id: 6,
            name: 'Innovation Box',
          
        },
        {
            id: 7,
            name: 'News',
          
        },
        {
            id: 8,
            name: 'Surveys',
          
        },
        {
            id: 9,
            name: 'SOS contacts',
          
        },
        {
            id: 10,
            name: 'Payroll',
          
        },
        {
            id: 11,
            name: 'Payroll slips',
          
        },
        {
            id: 12,
            name: 'Attendance',
          
        },
        
    ];

    return [200, { module }];
});

