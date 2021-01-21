import mock from 'src/utils/mock';

mock.onGet('/api/faqs').reply(() => {
  const faqs = [
    {
      id: '1',
      pregunta: 'Comercio A',
      respuesta: 'Education'
    },
    {
      id: '2',
      pregunta: 'Comercio A',
      respuesta: 'Education'
    },
    {
      id: '3',
      pregunta: 'Comercio A',
      respuesta: 'Education'
    },
    {
      id: '4',
      pregunta: 'Comercio A',
      respuesta: 'Education'
    },
    {
      id: '5',
      pregunta: 'Comercio A',
      respuesta: 'Education'
    },
    {
      id: '6',
      pregunta: 'Comercio A',
      respuesta: 'Education'
    },
    {
      id: '7',
      pregunta: 'Comercio A',
      respuesta: 'Education'
    },
    {
      id: '8',
      pregunta: 'Comercio A',
      respuesta: 'Education'
    },
    {
      id: '9',
      pregunta: 'Comercio A',
      respuesta: 'Education'
    },
    {
      id: '10',
      pregunta: 'Comercio A',
      respuesta: 'Education'
    },
    {
      id: '11',
      pregunta: 'Comercio A',
      respuesta: 'Education'
    },
  ];

  return [200, { faqs }];
});


mock.onGet('/api/faqs/1').reply(() => {
  const faqs = {
    id: '11',
    question: 'Comercio A',
    answer: 'Education A',
    questionen: 'Comercio B',
    answeren: 'Education B',
    promote: false,
    published: true
  };

  return [200, { faqs }];
});

mock.onGet('/api/faqs/1/detail').reply(() => {
  const faqs = {
    id: '11',
    question: 'Comercio A',
    answer: 'Education A',
    questionen: 'Comercio B',
    answeren: 'Education B',
    promote: false,
    published: true
  };

  return [200, { faqs }];
});
