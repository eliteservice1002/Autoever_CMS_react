import mock from 'src/utils/mock';
import wait from 'src/utils/wait';

mock.onPost('/api/languaje').reply( async (config) => {
	await wait(1000);
	var response = null;
	try {
		var data = JSON.parse(config.data);
	} catch(err) {}

	const languages = {
		en: {
			dashboard: {
				key: 1,
				defaultMessage: 'Dashboard'
			},
			appContents: {
				key: 2,
				defaultMessage: 'App contents'
			},
			setting: {
				key: 3,
				defaultMessage: 'Settings'
			},
			language_default: {
				key: 4,
				defaultMessage: 'Español'
			},
			language_en: {
				key: 5,
				defaultMessage: 'English'
			},
			language_ko: {
				key: 6,
				defaultMessage: 'Coreano'
			},
			superAdmin: {
				key: 7,
				defaultMessage: 'Super Admin'
			}
		},
		cor: {
			dashboard: {
				key: 1,
				defaultMessage: '계기반'
			},
			appContents: {
				key: 2,
				defaultMessage: '앱 콘텐츠'
			},
			setting: {
				key: 3,
				defaultMessage: '설정'
			},
			language_default: {
				key: 4,
				defaultMessage: 'Español'
			},
			language_en: {
				key: 5,
				defaultMessage: 'English'
			},
			language_ko: {
				key: 6,
				defaultMessage: '한국어'
			},
			superAdmin: {
				key: 7,
				defaultMessage: '최고 관리자'
			}
		}
	}

	if(data) {
		response = languages[data.language];
	}

	return [200, response];
});