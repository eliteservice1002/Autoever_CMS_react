import mock from 'src/utils/mock';
mock.onGet('/api/userroles').reply(() => {
    const userroles = [
        {
            id: 1,
            name: 'Custom Role A',
            description: 'Editores de contenido de la sección de noticias',
        },
        {
            id: 2,
            name: 'Viewers',
            description: 'Users who can only view content and can’t make changes.',
        },
        {
            id: 3,
            name: 'Editors',
            description: 'Users who can view and change content in sections.',
        },
    ];

    return [200, { userroles }];
});

mock.onGet('/api/userroles/1').reply(() => {
    const userrole = {
        id: 1,
        name: 'Custom Role A',
        description: 'Editores de contenido de la sección de noticias',
    };

    return [200, { userrole }];
});
