import mock from 'src/utils/mock';

mock.onGet('/api/soscontacts').reply(() => {
  const soscontacts = [
    {
      company_id: '1',
      id: '128',
      name_text_id: '821',
      telefono_prefix: '+1',
      telefono: '2127319863',
      icon_id: '128',
      active: 'active',
      name: 'Seguridad',
    },
    {
      company_id: '1',
      id: '128',
      name_text_id: '821',
      telefono_prefix: '+1',
      telefono: '2127319863',
      icon_id: '128',
      active: 'active',
      name: 'Seguridad',
    },
    {
      company_id: '1',
      id: '128',
      name_text_id: '821',
      telefono_prefix: '+1',
      telefono: '2127319863',
      icon_id: '128',
      active: 'active',
      name: 'Seguridad',
    },
    {
      company_id: '1',
      id: '128',
      name_text_id: '821',
      telefono_prefix: '+1',
      telefono: '2127319863',
      icon_id: '128',
      active: 'active',
      name: 'Seguridad',
    },
    {
      company_id: '1',
      id: '128',
      name_text_id: '821',
      telefono_prefix: '+1',
      telefono: '2127319863',
      icon_id: '128',
      active: 'active',
      name: 'Seguridad',
    },
    {
      company_id: '1',
      id: '128',
      name_text_id: '821',
      telefono_prefix: '+1',
      telefono: '2127319863',
      icon_id: '128',
      active: 'active',
      name: 'Seguridad',
    },
    {
      company_id: '1',
      id: '128',
      name_text_id: '821',
      telefono_prefix: '+1',
      telefono: '2127319863',
      icon_id: '128',
      active: 'active',
      name: 'Seguridad',
    },
    {
      company_id: '1',
      id: '128',
      name_text_id: '821',
      telefono_prefix: '+1',
      telefono: '2127319863',
      icon_id: '128',
      active: 'active',
      name: 'Seguridad',
    },
    {
      company_id: '1',
      id: '128',
      name_text_id: '821',
      telefono_prefix: '+1',
      telefono: '2127319863',
      icon_id: '128',
      active: 'active',
      name: 'Seguridad',
    },
    {
      company_id: '1',
      id: '128',
      name_text_id: '821',
      telefono_prefix: '+1',
      telefono: '2127319863',
      icon_id: '128',
      active: 'active',
      name: 'Seguridad',
    },
    {
      company_id: '1',
      id: '128',
      name_text_id: '821',
      telefono_prefix: '+1',
      telefono: '2127319863',
      icon_id: '128',
      active: 'active',
      name: 'Seguridad',
    },
    {
      company_id: '1',
      id: '128',
      name_text_id: '821',
      telefono_prefix: '+1',
      telefono: '2127319863',
      icon_id: '128',
      active: 'active',
      name: 'Seguridad',
    },
  ];

  return [200, { soscontacts }];
});


mock.onGet('/api/soscontacts/1').reply(() => {
  const customer = {
    company_id: '1',
    id: '128',
    name_text_id: '821',
    telefono_prefix: '+1',
    telefono: '2127319863',
    icon_id: '128',
    active: 'active',
    name: 'Seguridad',
  };

  return [200, { customer }];
});

mock.onGet('/api/soscontacts/1/detail').reply(() => {
  const soscontact = {
    company_id: '1',
    id: '128',
    name_text_id: '821',
    telefono_prefix: '+1',
    telefono: '2127319863',
    icon_id: '111',
    active: 'active',
    name: 'Seguridad',
  };

  return [200, { soscontact }];
});
