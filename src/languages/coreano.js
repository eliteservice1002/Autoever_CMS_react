import routes from './routesMultilanguage';
import { resetKey, keyGen } from './keyGenerate';

/*
 *
 * Resetear el generador de claves (ID) antes de utilizarlo
 * para mantener la coherencia con el resto de ficheros de idiomas
 * 
**/
resetKey();


/*
 *
 * export => { object => object }
 * --------------------------------------
 * Descripción
 * --------------------------------------
 * Se exporta un objeto donde se listarán cada uno de los textos que viven en todo el código.
 * Cada propiedad del objeto exportado es en si mismo un objeto que posee las siguientes
 * propiedades:
 * ---
 * 'key' => Debe ser un valor único, en caso de existir dos textos con la misma key causará
 * que se sobre escriban los texto de manera inapropiada
 * ---
 * 'defaultMessage' => es el mensaje (texto) que se mostrará en la UX.
 *
 * NOTA: Hay ciertos 'defaultMessage' que requeiren recibir parámetros, para poder hacerlo
 * se debe pasar el parámetro entre llaves '{}' con el nombre del parámetro dentro
 * EJEMPLO => defaultMessage: 'Hola {nombre_usuario} como estas?' donde nombre_usuario sería
 * el parámetro que será remplasado al llamar la función formatMessage() que se encuentra en
 * 'src/contexts/Intl.js'
 *
**/
export default {
	dashboard: {
		key: keyGen(),
		defaultMessage: 'Dashboard'
	},
	appContents: {
		key: keyGen(),
		defaultMessage: '앱 컨텐츠관리'
	},
	setting: {
		key: keyGen(),
		defaultMessage: '설정'
	},
	language_es: {
		key: keyGen(),
		defaultMessage: 'Español'
	},
	language_en: {
		key: keyGen(),
		defaultMessage: 'English'
	},
	language_ko: {
		key: keyGen(),
		defaultMessage: '한국어'
	},
	superAdmin: {
		key: keyGen(),
		defaultMessage: '슈퍼 Admin'
	},
	appuser: {
		key: keyGen(),
		defaultMessage: '앱 유저'
	},
	sosContacts: {
		key: keyGen(),
		defaultMessage: '긴급 연락처'
	},
	terminConditions: {
		key: keyGen(),
		defaultMessage: '이용 약관'
	},
	privacyNotice: {
		key: keyGen(),
		defaultMessage: '개인정보처리방침'
	},
	benefits: {
		key: keyGen(),
		defaultMessage: '직원 복지/복리후생'
	},
	list: {
		key: keyGen(),
		defaultMessage: '리스트'
	},
	categories: {
		key: keyGen(),
		defaultMessage: '카테고리'
	},
	busRoutes: {
		key: keyGen(),
		defaultMessage: '버스 노선'
	},
	type: {
		key: keyGen(),
		defaultMessage: '종류'
	},
	news: {
		key: keyGen(),
		defaultMessage: '회사 공지'
	},
	events: {
		key: keyGen(),
		defaultMessage: '행사'
	},
	innovationBox: {
		key: keyGen(),
		defaultMessage: '개선함'
	},
	fastAnswers: {
		key: keyGen(),
		defaultMessage: '빠른답변 설정'
	},
	faqs: {
		key: keyGen(),
		defaultMessage: 'FAQs'
	},
	userRoles: {
		key: keyGen(),
		defaultMessage: '유저 역할'
	},
	cmsUsers: {
		key: keyGen(),
		defaultMessage: 'CMS 유저'
	},
	companies: {
		key: keyGen(),
		defaultMessage: '회사'
	},
	companyInfo: {
		key: keyGen(),
		defaultMessage: '회사 정보'
	},
	systemAdmins: {
		key: keyGen(),
		defaultMessage: '시스템 관리자'
	},
	twoFactor: {
		key: keyGen(),
		defaultMessage: 'OTP'
	},
	setup2fa: {
		key: keyGen(),
		defaultMessage: 'OTP 설정'
	},
	appUsers: {
		key: keyGen(),
		defaultMessage: '앱 유저'
	},

	/*******
	* NEWS *
	********/
	dashboard: {
		key: keyGen(),
		defaultMessage: 'Dashboard'
	},
	LoginsOfTheApp: {
		key: keyGen(),
		defaultMessage: 'Logins of the application'
	},
	invalidDateFormat: {
		key: keyGen(),
		defaultMessage: 'Invalid Date Format'
	},
	listOfBenefits: {
		key: keyGen(),
		defaultMessage: 'List of benefits'
	},
	successUpdatedBenefit: {
		key: keyGen(),
		defaultMessage: 'Successfully updated benefit'
	},
	successUpdatedNews: {
		key: keyGen(),
		defaultMessage: 'Successfully updated news'
	},
	successUpdatedNewsCategory: {
		key: keyGen(),
		defaultMessage: 'Successfully updated news category'
	},
	successUpdatedEventCategory: {
		key: keyGen(),
		defaultMessage: 'Successfully updated event category'
	},
	successUpdatedEvent: {
		key: keyGen(),
		defaultMessage: 'Successfully updated event'
	},
	name: {
		key: keyGen(),
		defaultMessage: 'Name'
	},
	benefitDetails: {
		key: keyGen(),
		defaultMessage: 'Benefit details'
	},
	successUpdatedBenefitCategory: {
		key: keyGen(),
		defaultMessage: 'Successfully updated benefit category'
	},
	successAddedBenefit: {
		key: keyGen(),
		defaultMessage: 'Successfully added benefit'
	},
	successAddedNews: {
		key: keyGen(),
		defaultMessage: 'Successfully added news'
	},
	successAddedNewsCategory: {
		key: keyGen(),
		defaultMessage: 'Successfully added news category'
	},
	successAddedEventCategory: {
		key: keyGen(),
		defaultMessage: 'Successfully added event category'
	},
	successAddedEvent: {
		key: keyGen(),
		defaultMessage: 'Successfully added event'
	},
	startDate: {
		key: keyGen(),
		defaultMessage: 'Start date'
	},
	endingDate: {
		key: keyGen(),
		defaultMessage: 'Ending date'
	},
	location: {
		key: keyGen(),
		defaultMessage: 'Location'
	},
	successAddedBenefitCategory: {
		key: keyGen(),
		defaultMessage: 'Successfully added benefit category'
	},
	theFieldIsRequired: {
		key: keyGen(),
		defaultMessage: 'The field is required'
	},
	maximumCharacters: {
		key: keyGen(),
		defaultMessage: 'Must be at most {characters} characters'
	},
	serverError: {
		key: keyGen(),
		defaultMessage: 'An error occurred on the server'
	},
	alertDelete: {
		key: keyGen(),
		defaultMessage: 'You are about to do a permanent erase. Do you want to continue?'
	},
	eliminatedSuccess: {
		key: keyGen(),
		defaultMessage: 'Eliminated successful'
	},
	search: {
		key: keyGen(),
		defaultMessage: 'Search'
	},
	sortBy: {
		key: keyGen(),
		defaultMessage: 'Sort By'
	},
	delete: {
		key: keyGen(),
		defaultMessage: 'Delete'
	},
	deleteAll: {
		key: keyGen(),
		defaultMessage: 'Delete all'
	},
	trade: {
		key: keyGen(),
		defaultMessage: 'Trade'
	},
	category: {
		key: keyGen(),
		defaultMessage: 'Category'
	},
	publicationDate: {
		key: keyGen(),
		defaultMessage: 'Publication date'
	},
	promotion: {
		key: keyGen(),
		defaultMessage: 'Promotion'
	},
	expirationDate: {
		key: keyGen(),
		defaultMessage: 'Expiration date'
	},
	date: {
		key: keyGen(),
		defaultMessage: 'Date'
	},
	promotedToHome: {
		key: keyGen(),
		defaultMessage: 'Promoted to home'
	},
	promotedToHomeQuestion: {
		key: keyGen(),
		defaultMessage: 'Promoted to home?'
	},
	actions: {
		key: keyGen(),
		defaultMessage: 'Actions'
	},
	yes: {
		key: keyGen(),
		defaultMessage: 'Yes'
	},
	no: {
		key: keyGen(),
		defaultMessage: 'No'
	},
	editBenefit: {
		key: keyGen(),
		defaultMessage: 'Edit benefit'
	},
	edit: {
		key: keyGen(),
		defaultMessage: 'Edit'
	},
	unexpectedError: {
		key: keyGen(),
		defaultMessage: 'An unexpected error occurred. Please try again later'
	},
	tradeName: {
		key: keyGen(),
		defaultMessage: 'Trade Name'
	},
	tradeLogo: {
		key: keyGen(),
		defaultMessage: 'Trade logo'
	},
	chooseFile: {
		key: keyGen(),
		defaultMessage: 'Choose file'
	},
	attachedFile: {
		key: keyGen(),
		defaultMessage: 'Attached file'
	},
	mainPicture: {
		key: keyGen(),
		defaultMessage: 'Main picture'
	},
	description: {
		key: keyGen(),
		defaultMessage: 'Description'
	},
	publication: {
		key: keyGen(),
		defaultMessage: 'Publication'
	},
	published: {
		key: keyGen(),
		defaultMessage: 'Published'
	},
	editEvent: {
		key: keyGen(),
		defaultMessage: 'Edit event'
	},
	eventDetail: {
		key: keyGen(),
		defaultMessage: 'Event detail'
	},
	publishedQuestion: {
		key: keyGen(),
		defaultMessage: 'Published?'
	},
	ExpiresQuestion: {
		key: keyGen(),
		defaultMessage: 'Expires?'
	},
	goBack: {
		key: keyGen(),
		defaultMessage: 'Go back'
	},
	save: {
		key: keyGen(),
		defaultMessage: 'Save'
	},
	add: {
		key: keyGen(),
		defaultMessage: 'Add'
	},
	addEvent: {
		key: keyGen(),
		defaultMessage: 'Add event'
	},
	benefitsCategories: {
		key: keyGen(),
		defaultMessage: 'Benefits Categories'
	},
	editCategory: {
		key: keyGen(),
		defaultMessage: 'Edit category'
	},
	addBenefit: {
		key: keyGen(),
		defaultMessage: 'Add benefit'
	},
	addCategory: {
		key: keyGen(),
		defaultMessage: 'Add category'
	},
	newsList: {
		key: keyGen(),
		defaultMessage: 'News list'
	},
	eventsList: {
		key: keyGen(),
		defaultMessage: 'Event list'
	},
	title: {
		key: keyGen(),
		defaultMessage: 'Title'
	},
	content: {
		key: keyGen(),
		defaultMessage: 'Content'
	},
	image: {
		key: keyGen(),
		defaultMessage: 'Image'
	},
	media: {
		key: keyGen(),
		defaultMessage: 'Media'
	},
	imageRequired: {
		key: keyGen(),
		defaultMessage: 'You must upload an image'
	},
	selectOneCategory: {
		key: keyGen(),
		defaultMessage: 'You must select at least one category'
	},
	editNews: {
		key: keyGen(),
		defaultMessage: 'Edit news'
	},
	addNews: {
		key: keyGen(),
		defaultMessage: 'Add news'
	},
	detailOfTheNews: {
		key: keyGen(),
		defaultMessage: 'Detail of the news'
	},
	newsCategory: {
		key: keyGen(),
		defaultMessage: 'News category'
	},
	eventsCategory: {
		key: keyGen(),
		defaultMessage: 'Events category'
	},
	/*************
	* END - NEWS *
	**************/


	/*******
	* URLs *
	********/
	...routes(keyGen)
};
