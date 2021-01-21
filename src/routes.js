import React, {
  lazy,
  Suspense,
  Fragment,
} from 'react';
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';
import AuthGuard from 'src/components/AuthGuard';
import GuestGuard from 'src/components/GuestGuard';
import RestricGuard from 'src/components/RestricGuard';
import LoadingScreen from 'src/components/LoadingScreen';
import DashboardLayout from 'src/layouts/DashboardLayout';

/* connectIntl */
import { formatMessage } from 'src/contexts/Intl';

export const renderRoutes = (routes = [], intl) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route, i) => {
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Component = route.component;

          function renderComponent(props) {
            return (route.roles)
              ? (
                <RestricGuard roles={route.roles} >
                  <Component {...props} />
                </RestricGuard>
              )
              : <Component intl={intl} {...props} />
          }

          let path = route.path;
          if (route.multilanguage) {
            if (typeof path === 'object') {
              path = formatMessage(intl[path.value], path.params);
            } else {
              path = formatMessage(intl[path]);
            }
          }

          return (
            <Route
              key={i}
              path={path}
              exact={route.exact}
              render={(props) => (
                <Guard>
                  <Layout>
                    {
                      route.routes
                        ? renderRoutes(route.routes, intl)
                        : renderComponent(props)
                    }
                  </Layout>
                </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  );
};

const routes = [
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/views/errors/NotFoundView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: 'urlLogin',
    multilanguage: true,
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/verification',
    component: lazy(() => import('src/views/auth/VerificationView/JWTVerification'))
  },
  {
    exact: true,
    path: '/verification-unprotected',
    component: lazy(() => import('src/views/auth/VerificationView/JWTVerification'))
  },
  {
    exact: true,
    guard: GuestGuard,
    multilanguage: true,
    path: 'urlRegister',
    component: lazy(() => import('src/views/auth/RegisterView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/forgotpassword',
    component: lazy(() => import('src/views/auth/ForgotpasswordView'))
  },
  {
    exact: true,
    path: '/resetpass',
    component: lazy(() => import('src/views/auth/ResetPasswordView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    multilanguage: true,
    path: 'url2faLogin',
    component: lazy(() => import('src/views/2falogin'))
  },
  {
    path: '*',
    guard: AuthGuard,
    layout: DashboardLayout,
    routes: [
      {
        path: '/',
        exact: true,
        redirect: true,
        component: ({ intl }) => {
          return (<Redirect to={formatMessage(intl.urlDashboard)} />);
        }
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlDashboard',
        component: lazy(() => import('src/views/Dashboard'))
      },
      // 2020-09-29 CMC Component1 start
      // app users route start
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: 'urlAppuserList',
        component: lazy(() => import('src/views/customer/UserListView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: {
          value: 'urlAppuserEdit',
          params: { userId: ':userId' }
        },
        component: lazy(() => import('src/views/customer/UserEditView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: 'urlAppuserAdd',
        component: lazy(() => import('src/views/customer/UserAddView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: {
          value: 'urlAppuserDetail',
          params: { userId: ':userId' }
        },
        component: lazy(() => import('src/views/customer/UserDetailsView'))
      },
      // app users route end

      // sos contact route start
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: 'urlSosContacts',
        component: lazy(() => import('src/views/soscontacts/ListView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: 'urlSosContactsAdd',
        component: lazy(() => import('src/views/soscontacts/AddView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: {
          value: 'urlSosContactsEdit',
          params: { contactId: ':contactId' }
        },
        component: lazy(() => import('src/views/soscontacts/EditView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: {
          value: 'urlSosContactsDetail',
          params: { contactId: ':contactId' }
        },
        component: lazy(() => import('src/views/soscontacts/DetailsView'))
      },
      // sos contact route end

      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        path: 'urlRequestForHelp',
        multilanguage: true,
        component: lazy(() => import('src/views/RequestForHelp'))
      },

      // Surveys route start
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        path: 'urlSurveys',
        multilanguage: true,
        component: lazy(() => import('src/views/Surveys/ListView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        path: 'urlSurveysAdd',
        multilanguage: true,
        component: lazy(() => import('src/views/Surveys/AddView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        path: 'urlSurveysEdit',
        multilanguage: true,
        component: lazy(() => import('src/views/Surveys/Statistics'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        path: {
          value: 'urlSurveysDetail',
          params: { surveysId: ':surveysId' }
        },
        multilanguage: true,
        component: lazy(() => import('src/views/Surveys/EditView'))
      },
      // Surveys route end

      // FAQS route start
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        path: 'urlFaqs',
        multilanguage: true,
        component: lazy(() => import('src/views/FAQS/ListView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        path: 'urlFaqsAdd',
        multilanguage: true,
        component: lazy(() => import('src/views/FAQS/AddView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: {
          value: 'urlFaqsEdit',
          params: { faqsId: ':faqsId' }
        },
        component: lazy(() => import('src/views/FAQS/EditView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: {
          value: 'urlFaqsDetail',
          params: { faqsId: ':faqsId' }
        },
        component: lazy(() => import('src/views/FAQS/DetailsView'))
      },
      // FAQS route end

      // terms and conditions route start
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: 'urlTerminConditions',
        component: lazy(() => import('src/views/terms/View'))
      },
      // terms and conditions route end

      // privacy route start
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: 'urlPrivacyNotice',
        component: lazy(() => import('src/views/privacy/View'))
      },
      // privacy route end

      // Beneficios route start
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: 'urlBenefits',
        component: lazy(() => import('src/views/Beneficios/ListView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: 'urlBenefitsAdd',
        component: lazy(() => import('src/views/Beneficios/AddView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: {
          value: 'urlBenefitsEdit',
          params: {
            benefitId: ':benefitId'
          }
        },
        component: lazy(() => import('src/views/Beneficios/EditView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: {
          value: 'urlBenefitsDetail',
          params: {
            benefitId: ':benefitId'
          }
        },
        component: lazy(() => import('src/views/Beneficios/DetailsView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlBenefitsCategoriesEdit',
          params: {
            categoryId: ':categoryId'
          }
        },
        component: lazy(() => import('src/views/Beneficios/CategoryEditView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlBenefitsCategoriesAdd',
        component: lazy(() => import('src/views/Beneficios/CategoryAddView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlBenefitsCategories',
        component: lazy(() => import('src/views/Beneficios/CategoriesListView'))
      },
      // Beneficios route end

      // BusRoute route start
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: 'urlBusRoutesList',
        component: lazy(() => import('src/views/bus_route/BusRouteListView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: 'urlBusRoutesAdd',
        component: lazy(() => import('src/views/bus_route/BusRouteAddView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: {
          value: 'urlBusRoutesEdit',
          params: {
            id: ':id'
          }
        },
        component: lazy(() => import('src/views/bus_route/BusRouteEditView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: {
          value: 'urlBusRoutesDetail',
          params: {
            id: ':id'
          }
        },
        component: lazy(() => import('src/views/bus_route/BusRouteDetailsView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlBusRoutesTypeDetail',
          params: {
            id: ':id'
          }
        },
        component: lazy(() => import('src/views/bus_route/BusRouteTypeDetailsView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlBusRoutesTypeEdit',
          params: {
            id: ':id'
          }
        },
        component: lazy(() => import('src/views/bus_route/BusRouteTypeEditView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlBusRoutesTypeAdd',
        component: lazy(() => import('src/views/bus_route/BusRouteTypeAddView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlBusRoutesTypeList',
        component: lazy(() => import('src/views/bus_route/BusRouteTypeListView'))
      },
      // BusRoute route end

      // Noticias route start
      {
        exact: true,
        path: 'urlNews',
        multilanguage: true,
        component: lazy(() => import('src/views/Noticias/ListView'))
      },
      {
        exact: true,
        path: 'urlNewsAdd',
        multilanguage: true,
        component: lazy(() => import('src/views/Noticias/AddView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlNewsEdit',
          params: { newId: ':newId' }
        },
        component: lazy(() => import('src/views/Noticias/EditView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlNewsDetail',
          params: { newId: ':newId' }
        },
        component: lazy(() => import('src/views/Noticias/DetailsView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlNewsCategories',
        component: lazy(() => import('src/views/Noticias/CategoriesListView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlNewsCategoriesAdd',
        component: lazy(() => import('src/views/Noticias/CategoryAddView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlNewsCategoriesEdit',
          params: { categoryId: ':categoryId' }
        },
        component: lazy(() => import('src/views/Noticias/CategoryEditView'))
      },
      // Noticias route end

      // events route start
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        path: 'urlEvents',
        multilanguage: true,
        component: lazy(() => import('src/views/events/EventListView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: {
          value: 'urlEventsEdit',
          params: { eventId: ':eventId' }
        },
        component: lazy(() => import('src/views/events/EventEditView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: {
          value: 'urlEventsDetail',
          params: { eventId: ':eventId' }
        },
        component: lazy(() => import('src/views/events/EventDetailsView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: 'urlEventsAdd',
        component: lazy(() => import('src/views/events/EventAddView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlEventsCategoriesEdit',
          params: { categoryId: ':categoryId' }
        },
        component: lazy(() => import('src/views/events/CategoryEditView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlEventsCategoriesAdd',
        component: lazy(() => import('src/views/events/CategoryAddView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlEventsCategories',
        component: lazy(() => import('src/views/events/CategoriesListView'))
      },
      // events route end

      // 2fa route start
      {
        exact: true,
        multilanguage: true,
        path: 'urlSetup2fa',
        component: lazy(() => import('src/views/setup2fa/View'))
      },
      // 2fa route end

      // innovation box route start
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: 'urlInnovationBox',
        component: lazy(() => import('src/views/innovation/InnovationListView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: {
          value: 'urlInnovationBoxDetail',
          params: { innovationId: ':innovationId' }
        },
        component: lazy(() => import('src/views/innovation/InnovationDetailsView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: 'urlFastAnswers',
        component: lazy(() => import('src/views/innovation/FastAnswerList'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: 'urlFastAnswersAdd',
        component: lazy(() => import('src/views/innovation/FastAnswerAddView'))
      },
      {
        exact: true,
        roles: ['SYSTEMADMIN', 'CMSUSER'],
        multilanguage: true,
        path: {
          value: 'urlFastAnswersEdit',
          params: { fastAnswerId: ':fastAnswerId' }
        },
        component: lazy(() => import('src/views/innovation/FastAnswerEditView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlInnovationBoxCategoriesDetail',
          params: { categoryId: ':categoryId' }
        },
        component: lazy(() => import('src/views/innovation/CategoryDetailsView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlInnovationBoxCategoriesEdit',
          params: { categoryId: ':categoryId' }
        },
        component: lazy(() => import('src/views/innovation/CategoryEditView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlInnovationBoxCategoriesAdd',
        component: lazy(() => import('src/views/innovation/CategoryAddView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlInnovationBoxCategories',
        component: lazy(() => import('src/views/innovation/CategoriesListView'))
      },
      {
        exact: true,
        path: '/app/management/innovation/:customerId',
        component: lazy(() => import('src/views/innovation/CategoryDetailsView'))
      },
      // innovation box route end

      {
        exact: true,
        multilanguage: true,
        roles: ['SYSTEMADMIN'],
        path: 'urlSecurityCheks',
        component: lazy(() => import('src/views/company/SecurityCheckListView'))
      },
      {
        exact: true,
        multilanguage: true,
        roles: ['SYSTEMADMIN'],
        path: 'urlSecurityChekAdd',
        component: lazy(() => import('src/views/company/SecurityCheckAddView'))
      },
      {
        exact: true,
        multilanguage: true,
        roles: ['SYSTEMADMIN'],
        path: {
          value: 'urlSecurityChekEdit',
          params: { id: ':id' }
        },
        component: lazy(() => import('src/views/company/SecurityCheckEditView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlSettingCompany',
        roles: ['SYSTEMADMIN'],
        component: lazy(() => import('src/views/company/CompanyEditView'))
      },

      {
        exact: true,
        multilanguage: true,
        path: 'urlUserRoles',
        roles: ['SUPERADMIN', 'SYSTEMADMIN'],
        component: lazy(() => import('src/views/userrole/UserroleListView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlUserRolesEdit',
          params: { userId: ':userId' }
        },
        roles: ['SUPERADMIN', 'SYSTEMADMIN'],
        component: lazy(() => import('src/views/userrole/UserroleEditView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlUserRolesAdd',
        roles: ['SUPERADMIN', 'SYSTEMADMIN'],
        component: lazy(() => import('src/views/userrole/UserroleAddView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlCmsUsers',
        roles: ['SUPERADMIN', 'SYSTEMADMIN'],
        component: lazy(() => import('src/views/cmsuser/CmsuserListView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlCmsUsersEdit',
          params: { cmsuserId: ':cmsuserId' }
        },
        roles: ['SUPERADMIN', 'SYSTEMADMIN'],
        component: lazy(() => import('src/views/cmsuser/CmsuserEditView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlCmsUsersAdd',
        roles: ['SUPERADMIN', 'SYSTEMADMIN'],
        component: lazy(() => import('src/views/cmsuser/CmsuserAddView'))
      },
      {
        exact: true,
        roles: ['SUPERADMIN'],
        multilanguage: true,
        path: 'urlCompanies',
        component: lazy(() => import('src/views/company/CompanyListView'))
      },
      {
        exact: true,
        roles: ['SUPERADMIN'],
        multilanguage: true,
        path: {
          value: 'urlCompaniesEdit',
          params: { companyId: ':companyId' }
        },
        component: lazy(() => import('src/views/company/CompanyEditView'))
      },
      {
        exact: true,
        roles: ['SUPERADMIN'],
        multilanguage: true,
        path: 'urlCompaniesAdd',
        component: lazy(() => import('src/views/company/CompanyAddView'))
      },
      {
        exact: true,
        roles: ['SUPERADMIN'],
        multilanguage: true,
        path: 'urlSystemAdmins',
        component: lazy(() => import('src/views/systemadministrators/SystemadministratorListView'))
      },
      {
        exact: true,
        roles: ['SUPERADMIN', 'SYSTEMADMIN'],
        multilanguage: true,
        path: 'urlCmsAccessLog',
        component: lazy(() => import('src/views/Dashboard/LogsLoginsCms'))
      },
      {
        exact: true,
        roles: ['SUPERADMIN'],
        multilanguage: true,
        path: {
          value: 'urlSystemAdminsEdit',
          params: { userId: ':userId' }
        },
        component: lazy(() => import('src/views/systemadministrators/SystemadministratorEditView'))
      },
      {
        exact: true,
        roles: ['SUPERADMIN'],
        multilanguage: true,
        path: 'urlSystemAdminsAdd',
        component: lazy(() => import('src/views/systemadministrators/SystemadministratorAddView'))
      },
      {
        exact: true,
        path: '/app/account',
        component: lazy(() => import('src/views/account/AccountView'))
      },
      {
        exact: true,
        path: '/app/calendar',
        component: lazy(() => import('src/views/calendar/CalendarView'))
      },
      {
        exact: true,
        path: [
          '/app/chat/new',
          '/app/chat/:threadKey'
        ],
        component: lazy(() => import('src/views/chat/ChatView'))
      },
      {
        exact: true,
        path: '/app/chat',
        component: () => <Redirect to="/app/chat/new" />
      },
      {
        exact: true,
        path: '/app/extra/charts/apex',
        component: lazy(() => import('src/views/extra/charts/ApexChartsView'))
      },
      {
        exact: true,
        path: '/app/extra/forms/formik',
        component: lazy(() => import('src/views/extra/forms/FormikView'))
      },
      {
        exact: true,
        path: '/app/extra/forms/redux',
        component: lazy(() => import('src/views/extra/forms/ReduxFormView'))
      },
      {
        exact: true,
        path: '/app/extra/editors/draft-js',
        component: lazy(() => import('src/views/extra/editors/DraftEditorView'))
      },
      {
        exact: true,
        path: '/app/extra/editors/quill',
        component: lazy(() => import('src/views/extra/editors/QuillEditorView'))
      },
      {
        exact: true,
        path: '/app/kanban',
        component: lazy(() => import('src/views/kanban/KanbanView'))
      },
      {
        exact: true,
        path: [
          '/app/mail/label/:customLabel/:mailId?',
          '/app/mail/:systemLabel/:mailId?'
        ],
        component: lazy(() => import('src/views/mail/MailView'))
      },
      {
        exact: true,
        path: '/app/mail',
        component: () => <Redirect to="/app/mail/all" />
      },

      {
        exact: true,
        path: '/app/management/invoices',
        component: lazy(() => import('src/views/invoice/InvoiceListView'))
      },
      {
        exact: true,
        path: '/app/management/invoices/:invoiceId',
        component: lazy(() => import('src/views/invoice/InvoiceDetailsView'))
      },
      {
        exact: true,
        path: '/app/management/products',
        component: lazy(() => import('src/views/product/ProductListView'))
      },
      {
        exact: true,
        path: '/app/management/products/create',
        component: lazy(() => import('src/views/product/ProductCreateView'))
      },
      {
        exact: true,
        path: '/app/projects/overview',
        component: lazy(() => import('src/views/project/OverviewView'))
      },
      {
        exact: true,
        path: '/app/projects/browse',
        component: lazy(() => import('src/views/project/ProjectBrowseView'))
      },
      {
        exact: true,
        path: '/app/projects/create',
        component: lazy(() => import('src/views/project/ProjectCreateView'))
      },
      {
        exact: true,
        path: '/app/projects/:id',
        component: lazy(() => import('src/views/project/ProjectDetailsView'))
      },
      {
        exact: true,
        path: '/app/social/feed',
        component: lazy(() => import('src/views/social/FeedView'))
      },
      {
        exact: true,
        path: '/app/social/profile',
        component: lazy(() => import('src/views/social/ProfileView'))
      },
      {
        exact: true,
        path: '/app/social',
        component: () => <Redirect to="/app/social/profile" />
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  },
];

export default routes;
