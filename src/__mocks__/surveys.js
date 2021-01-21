import moment from 'moment';
import mock from 'src/utils/mock';

mock.onGet('/api/surveys').reply(() => {
  const surveys = [
    {
      id: '4',
      title: 'Testing IT',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      date: '8/15/2020',
    },
    {
      id: '3',
      title: 'Testing IT',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      date: '7/15/2020',
    },
    {
      id: '2',
      title: 'Testing IT',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      date: '6/15/2020',
    },
    {
      id: '1',
      title: 'Testing IT',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      date: '5/15/2020',
    },
  ];

  return [200, { surveys }];
});

mock.onGet('/api/surveys/1').reply(() => {
  const invoice = {
    id: '5ecb86785312dcc69b5799ad',
    currency: '$',
    customer: {
      address: '271 Richmond Rd, Grey Lynn, Auckland 1022, New Zealand',
      company: 'Countdown Grey Lynn',
      email: 'contact@anahenisky.io',
      name: 'Ana Henisky',
      taxId: '6934656584231'
    },
    dueDate: moment()
      .toDate()
      .getTime(),
    issueDate: moment()
      .subtract(1, 'hours')
      .toDate()
      .getTime(),
    items: [
      {
        id: '5ecb8694db1760a701dfbf74',
        currency: '$',
        description: 'Freelancer Subscription (12/05/2019 - 11/06/2019)',
        unitAmount: 55.50
      }
    ],
    number: 'DEV-9483',
    status: 'paid',
    subtotalAmount: 50.00,
    taxAmount: 5.50,
    totalAmount: 55.50
  }

  return [200, { invoice }];
});
