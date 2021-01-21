import mock from 'src/utils/mock';

mock.onGet('/api/noticias').reply(() => {
  const noticias = [
    {
      date: '2020-08-04 46:45:41',
      employee_num: '521130',
      employee_name: 'First Name',
      category: 'Productividad',
      comment: 'Lerem Opsum is simply dummy test of the printing and typesettig industry...[vermas]'
    },
    {
      date: '2020-08-04 46:45:41',
      employee_num: '521131',
      employee_name: 'First Name',
      category: 'Productividad',
      comment: 'Lerem Opsum is simply dummy test of the printing and typesettig industry...[vermas]'
    },
    {
      date: '2020-08-04 46:45:41',
      employee_num: '521132',
      employee_name: 'First Name',
      category: 'Productividad',
      comment: 'Lerem Opsum is simply dummy test of the printing and typesettig industry...[vermas]'
    },
    {
      date: '2020-08-04 46:45:41',
      employee_num: '521133',
      employee_name: 'First Name',
      category: 'Productividad',
      comment: 'Lerem Opsum is simply dummy test of the printing and typesettig industry...[vermas]'
    },
    {
      date: '2020-08-04 46:45:41',
      employee_num: '521134',
      employee_name: 'First Name',
      category: 'Productividad',
      comment: 'Lerem Opsum is simply dummy test of the printing and typesettig industry...[vermas]'
    },
  ];

  return [200, { noticias }];
});


mock.onGet('/api/noticias/1').reply(() => {
  const noticias = {
    title: 'title',
    titleen: 'title(inglish)',
    content: 'content',
    contenten: 'content(inglish)',
    category1: true,
    category2: true,
    category3: false,
    category4: true,
    category5: false,
    everyone: false,
    profile1: false,
    profile2: true,
    emlocation1: true,
    emlocation2: false,
    emdepartment1: false,
    emdepartment2: true,
    emarea1: true,
    emarea2: false,
    emsubarea1: false,
    emsubarea2: true,
    emtype1: false,
    emtype2: true,
    emtype3: false,
    image: './static/images/covers/cover_1.jpg',
    archivo: 'cover_1.jpg',
    promote: false,
    publish: true,
    expira: false,
    date: '2017-05-24',
  };

  return [200, { noticias }];
});

mock.onGet('/api/noticias/1/detail').reply(() => {
  const noticias = {
    id: '12345',
    date: '30-oct-2020',
    employee_num: '12345678',
    employee_name: 'Juan',
    phone: '(81)1234-5678',
    email: 'name@domain.com',
    category: 'PRODUCTIVITY',
    suggestion: 'Lerem iosum doilor sit amet, conectetur adipiscing elit. Ut pulvinar,leo eu luctus imperdiet, velit ligula rhoncus tortor, facilisis rhoncus sem turpis in au gue, Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.'
  };

  return [200, { noticias }];
});

mock.onGet('/api/innovation/category').reply(() => {
  const categories = [
    {
      sp: 'Productividad',
      en: 'Productivity',
      id: 1
    },
    {
      sp: 'Reduccion de costos',
      en: 'Cost Saving',
      id: 2
    },
    {
      sp: 'Seguridad/Medio Ambiente',
      en: 'safety/Environemnt',
      id: 3
    },
    {
      sp: 'Catetoria 1',
      en: 'Category 1',
      id: 4
    },
  ];

  return [200, { categories }];
});


mock.onGet('/api/innovation/categories/1/detail').reply(() => {
  const category = {
    sp: 'Catetoria 1',
  };

  return [200, { category }];
});
