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
		defaultMessage: 'App contents'
	},
	setting: {
		key: keyGen(),
		defaultMessage: 'Settings'
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
		defaultMessage: 'Coreano'
	},
	superAdmin: {
		key: keyGen(),
		defaultMessage: 'Super Admin'
	},
	appuser: {
		key: keyGen(),
		defaultMessage: 'App User'
	},
	sosContacts: {
		key: keyGen(),
		defaultMessage: 'SOS contacts'
	},
	terminConditions: {
		key: keyGen(),
		defaultMessage: 'Terms and conditions'
	},
	privacyNotice: {
		key: keyGen(),
		defaultMessage: 'Privacy Notice'
	},
	benefits: {
		key: keyGen(),
		defaultMessage: 'Benefits'
	},
	list: {
		key: keyGen(),
		defaultMessage: 'List'
	},
	categories: {
		key: keyGen(),
		defaultMessage: 'Categories'
	},
	busRoutes: {
		key: keyGen(),
		defaultMessage: 'Bus Routes'
	},
	type: {
		key: keyGen(),
		defaultMessage: 'Type'
	},
	news: {
		key: keyGen(),
		defaultMessage: 'News'
	},
	events: {
		key: keyGen(),
		defaultMessage: 'Events'
	},
	innovationBox: {
		key: keyGen(),
		defaultMessage: 'Innovation Box'
	},
	fastAnswers: {
		key: keyGen(),
		defaultMessage: 'Fast Answers'
	},
	faqs: {
		key: keyGen(),
		defaultMessage: 'FAQs'
	},
	userRoles: {
		key: keyGen(),
		defaultMessage: 'User Roles'
	},
	cmsUsers: {
		key: keyGen(),
		defaultMessage: 'CMS Users'
	},
	companies: {
		key: keyGen(),
		defaultMessage: 'Companies'
	},
	companyInfo: {
		key: keyGen(),
		defaultMessage: 'Company Info'
	},
	systemAdmins: {
		key: keyGen(),
		defaultMessage: 'System Administrators'
	},
	twoFactor: {
		key: keyGen(),
		defaultMessage: 'OTP'
	},
	setup2fa: {
		key: keyGen(),
		defaultMessage: 'OTP Settings'
	},
	appUsers: {
		key: keyGen(),
		defaultMessage: 'App users'
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
  total_empleados: {
    key: keyGen(),
    defaultMessage: 'Total employees'
  },
  contestation: {
    key: keyGen(),
    defaultMessage: 'Answered'
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


	/*****************
	* END - NEWS - 2 *
	******************/
	LoginsOfTheCms: {
		key: keyGen(),
		defaultMessage: 'Logins of the CMS'
	},
	ip: {
		key: keyGen(),
		defaultMessage: 'IP'
	},
	httpUserAgent: {
		key: keyGen(),
		defaultMessage: 'HTTP USER AGENT'
	},
	rol: {
		key: keyGen(),
		defaultMessage: 'Role'
	},
	company: {
		key: keyGen(),
		defaultMessage: 'Company'
	},
	cmsAccessLog: {
		key: keyGen(),
		defaultMessage: 'CMS Access log'
	},
	requestForHelp: {
		key: keyGen(),
		defaultMessage: 'Request for help'
	},
	employeeNumber: {
		key: keyGen(),
		defaultMessage: 'Employee number'
	},
	departament: {
		key: keyGen(),
		defaultMessage: 'Departament'
	},
	registrationDate: {
		key: keyGen(),
		defaultMessage: 'Registration date'
	},
	successUpdatedAppuser: {
		key: keyGen(),
		defaultMessage: 'Successfully updated App user'
	},
	successAddedAppuser: {
		key: keyGen(),
		defaultMessage: 'Successfully added app user'
	},
	password: {
		key: keyGen(),
		defaultMessage: 'Password'
	},
	languages: {
		key: keyGen(),
		defaultMessage: 'Languages'
	},
	activeQuestion: {
		key: keyGen(),
		defaultMessage: 'Active?'
	},
	update: {
		key: keyGen(),
		defaultMessage: 'Update'
	},
	create: {
		key: keyGen(),
		defaultMessage: 'Create'
	},
	leaveEmptyPassword: {
		key: keyGen(),
		defaultMessage: 'leave empty if you don\'t want to update the password'
	},
	appuserDetail: {
		key: keyGen(),
		defaultMessage: 'App user detail'
	},
	status: {
		key: keyGen(),
		defaultMessage: 'Status'
	},
	email: {
		key: keyGen(),
		defaultMessage: 'Email'
	},
	phone: {
		key: keyGen(),
		defaultMessage: 'Phone'
	},
	message: {
		key: keyGen(),
		defaultMessage: 'Message'
	},
	successUpdatedUserRole: {
		key: keyGen(),
		defaultMessage: 'Successfully updated user role'
	},
	successAddedUserRoles: {
		key: keyGen(),
		defaultMessage: 'Successfully added user role'
	},
	modify: {
		key: keyGen(),
		defaultMessage: 'Modify'
	},
	write: {
		key: keyGen(),
		defaultMessage: 'Write'
	},
	view: {
		key: keyGen(),
		defaultMessage: 'View'
	},
	all: {
		key: keyGen(),
		defaultMessage: 'All'
	},
	module: {
		key: keyGen(),
		defaultMessage: 'Module'
	},
	submit: {
		key: keyGen(),
		defaultMessage: 'Submit'
	},
	eventStartDate: {
		key: keyGen(),
		defaultMessage: 'Event Start Date'
	},
	question: {
		key: keyGen(),
		defaultMessage: 'Question'
	},
	questions: {
		key: keyGen(),
		defaultMessage: 'Questions'
	},
	answer: {
		key: keyGen(),
		defaultMessage: 'Answer'
	},
	faqsList: {
		key: keyGen(),
		defaultMessage: 'FAQs List'
	},
	faqsInfo: {
		key: keyGen(),
		defaultMessage: 'FAQS info'
	},
	sessionExpired: {
		key: keyGen(),
		defaultMessage: 'Your session expired. Please login again'
	},
	securityChecks: {
		key: keyGen(),
		defaultMessage: 'Security checks'
	},
	securityChecksAdd: {
		key: keyGen(),
		defaultMessage: 'Add security check'
	},
	securityCheckEdit: {
		key: keyGen(),
		defaultMessage: 'Edit security check'
	},
	successUpdatedSecurityCheck: {
		key: keyGen(),
		defaultMessage: 'Successfully updated security check'
	},
	successAddedSecurityCheck: {
		key: keyGen(),
		defaultMessage: 'Successfully added security check'
	},
	surveys: {
		key: keyGen(),
		defaultMessage: 'Surveys'
	},
	surveysList: {
		key: keyGen(),
		defaultMessage: 'Surveys list'
	},
	/*****************
	* END - NEWS - 2 *
	******************/

	/*******
	* URLs *
	********/
	...routes(keyGen)
};
