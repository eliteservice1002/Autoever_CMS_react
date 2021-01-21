import mock from 'src/utils/mock';

mock.onGet('/api/companies/1').reply(() => {
  const company = [
    {
      id: '1',
      name_text_id: '1',
      slogan: 'slogan',
      logo_path: 'https://app.lucidchart.com/images/logo.png',
      key: 'key',
      active: 'active',
      primary_color: '#ff0000',
      secondary_color: '#fff',
      home_background_image_path: '/static/images/avatars/avatar_6.png',
      payroll_disclaimer: 'payroll disclaimer',
      terms_and_conditions: 'terms and conditions',
      notice_of_privacy: 'notice of privacy',
      modules: 'modules'
    },
  ]

  return [200, { company }];
});

