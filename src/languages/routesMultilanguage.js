export default function routes(keyGen) {
	return {
	urlLogin: {
		key: keyGen(),
		defaultMessage: '/login'
	},
	urlRegister: {
		key: keyGen(),
		defaultMessage: '/register'
	},
	urlSetup2fa: {
		key: keyGen(),
		defaultMessage: '/setup2fa'
	},
	url2faLogin: {
		key: keyGen(),
		defaultMessage: '/2fa-login'
	},
	urlSettingCompany: {
		key: keyGen(),
		defaultMessage: '/setting/company'
	},
	urlSecurityCheks: {
		key: keyGen(),
		defaultMessage: '/setting/security-checks'
	},
	urlSecurityChekAdd: {
		key: keyGen(),
		defaultMessage: '/setting/security-checks/add'
	},
	urlSecurityChekEdit: {
		key: keyGen(),
		defaultMessage: '/setting/security-checks/{id}/edit'
	},
	urlSuperAdmin: {
		key: keyGen(),
		defaultMessage: '/super-admin'
	},
	urlSystemAdmins: {
		key: keyGen(),
		defaultMessage: '/super-admin/system-admins'
	},
	urlSystemAdminsAdd: {
		key: keyGen(),
		defaultMessage: '/super-admin/system-admins/add'
	},
	urlSystemAdminsEdit: {
		key: keyGen(),
		defaultMessage: '/super-admin/system-admins/{userId}/edit'
	},
	urlCompanies: {
		key: keyGen(),
		defaultMessage: '/super-admin/companies'
	},
	urlCompaniesAdd: {
		key: keyGen(),
		defaultMessage: '/super-admin/companies/add'
	},
	urlCompaniesEdit: {
		key: keyGen(),
		defaultMessage: '/super-admin/companies/{companyId}/edit'
	},
	urlCmsAccessLog: {
		key: keyGen(),
		defaultMessage: '/super-admin/cms-access-log'
	},
	urlCmsUsers: {
		key: keyGen(),
		defaultMessage: '/settings/cms-users'
	},
	urlCmsUsersAdd: {
		key: keyGen(),
		defaultMessage: '/settings/cms-users/add'
	},
	urlCmsUsersEdit: {
		key: keyGen(),
		defaultMessage: '/settings/cms-users/{cmsuserId}/edit'
	},
	urlSettings: {
		key: keyGen(),
		defaultMessage: '/settings'
	},
	urlUserRoles: {
		key: keyGen(),
		defaultMessage: '/settings/user-roles'
	},
	urlUserRolesAdd: {
		key: keyGen(),
		defaultMessage: '/settings/user-roles/add'
	},
	urlUserRolesEdit: {
		key: keyGen(),
		defaultMessage: '/settings/user-roles/{userId}/edit'
	},
	urlFaqs: {
		key: keyGen(),
		defaultMessage: '/app/management/faqs'
	},
	urlRequestForHelp: {
		key: keyGen(),
		defaultMessage: '/app/request-for-help'
	},
	urlFaqsAdd: {
		key: keyGen(),
		defaultMessage: '/app/management/faqs/add'
	},
	urlFaqsEdit: {
		key: keyGen(),
		defaultMessage: '/app/management/faqs/{faqsId}/edit'
	},
	urlFaqsDetail: {
		key: keyGen(),
		defaultMessage: '/app/management/faqs/{faqsId}/detail'
	},
	urlInnovationBox: {
		key: keyGen(),
		defaultMessage: '/app/management/innovation'
	},
	urlInnovationBoxDetail: {
		key: keyGen(),
		defaultMessage: '/app/management/innovation/{innovationId}/detail'
	},
	urlInnovationBoxCategories: {
		key: keyGen(),
		defaultMessage: '/app/management/innovation/categories'
	},
	urlFastAnswers: {
		key: keyGen(),
		defaultMessage: '/app/management/innovation/fast-answers'
	},
	urlFastAnswersAdd: {
		key: keyGen(),
		defaultMessage: '/app/management/innovation/fast-answers/add'
	},
	urlFastAnswersEdit: {
		key: keyGen(),
		defaultMessage: '/app/management/innovation/fast-answers/{fastAnswerId}/edit'
	},
	urlInnovationBoxCategoriesAdd: {
		key: keyGen(),
		defaultMessage: '/app/management/innovation/categories/add'
	},
	urlInnovationBoxCategoriesEdit: {
		key: keyGen(),
		defaultMessage: '/app/management/innovation/categories/{categoryId}/edit'
	},
	urlInnovationBoxCategoriesDetail: {
		key: keyGen(),
		defaultMessage: '/app/management/innovation/categories/{categoryId}/detail'
	},
	urlEvents: {
		key: keyGen(),
		defaultMessage: '/app/management/events'
	},
	urlEventsAdd: {
		key: keyGen(),
		defaultMessage: '/app/management/events/add'
	},
	urlEventsEdit: {
		key: keyGen(),
		defaultMessage: '/app/management/events/{eventId}/edit'
	},
	urlEventsDetail: {
		key: keyGen(),
		defaultMessage: '/app/management/events/{eventId}/detail'
	},
	urlEventsCategories: {
		key: keyGen(),
		defaultMessage: '/app/management/events/categories'
	},
	urlEventsCategoriesAdd: {
		key: keyGen(),
		defaultMessage: '/app/management/events/categories/add'
	},
	urlEventsCategoriesEdit: {
		key: keyGen(),
		defaultMessage: '/app/management/events/categories/{categoryId}/edit'
	},
	urlNews: {
		key: keyGen(),
		defaultMessage: '/app/management/news'
	},
	urlNewsAdd: {
		key: keyGen(),
		defaultMessage: '/app/management/news/add'
	},
	urlNewsEdit: {
		key: keyGen(),
		defaultMessage: '/app/management/news/{newId}/edit'
	},
	urlNewsDetail: {
		key: keyGen(),
		defaultMessage: '/app/management/news/{newId}/detail'
	},
	urlNewsCategories: {
		key: keyGen(),
		defaultMessage: '/app/management/news/categories'
	},
	urlNewsCategoriesAdd: {
		key: keyGen(),
		defaultMessage: '/app/management/news/categories/add'
	},
	urlNewsCategoriesEdit: {
		key: keyGen(),
		defaultMessage: '/app/management/news/categories/{categoryId}/edit'
	},
	urlBusRoutes: {
		key: keyGen(),
		defaultMessage: '/app/management/bus-routes'
	},
	urlBusRoutesAdd: {
		key: keyGen(),
		defaultMessage: '/app/management/bus-routes/add'
	},
	urlBusRoutesEdit: {
		key: keyGen(),
		defaultMessage: '/app/management/bus-routes/{id}/edit'
	},
	urlBusRoutesDetail: {
		key: keyGen(),
		defaultMessage: '/app/management/bus-routes/{id}/detail'
	},
	urlBusRoutesList: {
		key: keyGen(),
		defaultMessage: '/app/management/bus-routes/list'
	},
	urlBusRoutesTypeList: {
		key: keyGen(),
		defaultMessage: '/app/management/bus-routes/type'
	},
	urlBusRoutesTypeAdd: {
		key: keyGen(),
		defaultMessage: '/app/management/bus-routes/type/add'
	},
	urlBusRoutesTypeDetail: {
		key: keyGen(),
		defaultMessage: '/app/management/bus-routes/type/{id}/detail'
	},
	urlBusRoutesTypeEdit: {
		key: keyGen(),
		defaultMessage: '/app/management/bus-routes/type/{id}/edit'
	},
	urlBenefits: {
		key: keyGen(),
		defaultMessage: '/app/management/benefits'
	},
	urlBenefitsAdd: {
		key: keyGen(),
		defaultMessage: '/app/management/benefits/add'
	},
	urlBenefitsEdit: {
		key: keyGen(),
		defaultMessage: '/app/management/benefits/{benefitId}/edit'
	},
	urlBenefitsDetail: {
		key: keyGen(),
		defaultMessage: '/app/management/benefits/{benefitId}/detail'
	},
	urlBenefitsCategories: {
		key: keyGen(),
		defaultMessage: '/app/management/benefits/categories'
	},
	urlBenefitsCategoriesEdit: {
		key: keyGen(),
		defaultMessage: '/app/management/benefits/categories/{categoryId}/edit'
	},
	urlBenefitsCategoriesAdd: {
		key: keyGen(),
		defaultMessage: '/app/management/benefits/categories/add'
	},
	urlAppContents: {
		key: keyGen(),
		defaultMessage: '/app/management'
	},
	urlDashboard: {
		key: keyGen(),
		defaultMessage: '/dashboard'
	},
	urlPrivacyNotice: {
		key: keyGen(),
		defaultMessage: '/app/management/privacy'
	},
	urlAppuserList: {
		key: keyGen(),
		defaultMessage: '/app/management/users'
	},
	urlAppuserAdd: {
		key: keyGen(),
		defaultMessage: '/app/management/users/add'
	},
	urlAppuserEdit: {
		key: keyGen(),
		defaultMessage: '/app/management/users/{userId}/edit'
	},
	urlAppuserDetail: {
		key: keyGen(),
		defaultMessage: '/app/management/users/{userId}/detail'
	},
	urlSosContacts: {
		key: keyGen(),
		defaultMessage: '/app/management/soscontacts'
	},
	urlSosContactsAdd: {
		key: keyGen(),
		defaultMessage: '/app/management/soscontacts/add'
	},
	urlSosContactsEdit: {
		key: keyGen(),
		defaultMessage: '/app/management/soscontacts/{contactId}/edit'
	},
	urlSosContactsDetail: {
		key: keyGen(),
		defaultMessage: '/app/management/soscontacts/{contactId}/detail'
	},
	urlSurveys: {
		key: keyGen(),
		defaultMessage: '/app/management/surveys'
	},
	urlSurveysAdd: {
		key: keyGen(),
		defaultMessage: '/app/management/surveys/add'
	},
	urlSurveysEdit: {
		key: keyGen(),
		defaultMessage: '/app/management/surveys/{surveysId}/edit'
	},
	urlSurveysDetail: {
		key: keyGen(),
		defaultMessage: '/app/management/surveys/{surveysId}/detail'
	},
	urlTerminConditions: {
		key: keyGen(),
		defaultMessage: '/app/management/terms'
	}
	}
}
