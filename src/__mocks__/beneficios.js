import mock from 'src/utils/mock';

mock.onGet('/api/beneficios').reply(() => {
  const beneficios = [
    {
      id: '20922',
      trade: 'Comercio A',
      category: 'Education',
      promotion: '%desc',
      expiration_date: '31-Dic-2020',
      promoted_home: "Yes"
    },
    {
      id: '20921',
      trade: 'Comercio B',
      category: 'Education',
      promotion: '%desc',
      expiration_date: '31-Dic-2020',
      promoted_home: "Yes"
    },
    {
      id: '20920',
      trade: 'Comercio C',
      category: 'Education',
      promotion: '%desc',
      expiration_date: '31-Dic-2020',
      promoted_home: "Yes"
    },
    {
      id: '20919',
      trade: 'Comercio D',
      category: 'Education',
      promotion: '%desc',
      expiration_date: '31-Dic-2020',
      promoted_home: "Yes"
    },
    {
      id: '20918',
      trade: 'Comercio E',
      category: 'Education',
      promotion: '%desc',
      expiration_date: '31-Dic-2020',
      promoted_home: "Yes"
    },
    {
      id: '20917',
      trade: 'Comercio F',
      category: 'Education',
      promotion: '%desc',
      expiration_date: '31-Dic-2020',
      promoted_home: "Yes"
    },
    {
      id: '20916',
      trade: 'Comercio G',
      category: 'Education',
      promotion: '%desc',
      expiration_date: '31-Dic-2020',
      promoted_home: "Yes"
    },
    {
      id: '20915',
      trade: 'Comercio H',
      category: 'Education',
      promotion: '%desc',
      expiration_date: '31-Dic-2020',
      promoted_home: "Yes"
    },
    {
      id: '20914',
      trade: 'Comercio I',
      category: 'Education',
      promotion: '%desc',
      expiration_date: '31-Dic-2020',
      promoted_home: "Yes"
    },
    {
      id: '20913',
      trade: 'Comercio J',
      category: 'Education',
      promotion: '%desc',
      expiration_date: '31-Dic-2020',
      promoted_home: "Yes"
    },
    {
      id: '20912',
      trade: 'Comercio K',
      category: 'Education',
      promotion: '%desc',
      expiration_date: '31-Dic-2020',
      promoted_home: "Yes"
    },
    {
      id: '20911',
      trade: 'Comercio L',
      category: 'Education',
      promotion: '%desc',
      expiration_date: '31-Dic-2020',
      promoted_home: "Yes"
    },
    {
      id: '20910',
      trade: 'Comercio M',
      category: 'Education',
      promotion: '%desc',
      expiration_date: '31-Dic-2020',
      promoted_home: "Yes"
    },
  ];

  return [200, { beneficios }];
});


mock.onGet('/api/beneficios/1').reply(() => {
  const beneficios = {
    business_name: 'Nombre del comercio',
    spanish_promotion: 'Promoción español',
    english_promotion: 'Promoción inglés',
    category: 'first',
    trade_logo: '../',
    main_pic: '../',
    spanish_explanation: 'Descripción español',
    english_explanation: 'Descripción inglés',
    promoted_home: false,
    publishing: true,
    expiration: false,
    expiration_date: '08/10/2020',
  };

  return [200, { beneficios }];
});

mock.onGet('/api/beneficios/1/detail').reply(() => {
  const beneficios = {
    business_name: 'Nombre del comercio',
    spanish_promotion: 'Promoción español',
    english_promotion: 'Promoción inglés',
    category: 'first',
    trade_logo: '../',
    main_pic: '../',
    spanish_explanation: 'Descripción español',
    english_explanation: 'Descripción inglés',
    promoted_home: false,
    publishing: true,
    expiration: false,
    expiration_date: '08/10/2020',
  };

  return [200, { beneficios }];
});
