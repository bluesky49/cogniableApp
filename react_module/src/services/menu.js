/* eslint-disable no-unused-vars */
import React, { useState } from 'react'

export async function getLeftMenuData() {
  return [
    {
      title: 'Settings',
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
    },
    {
      title: 'Documentation',
      key: 'documentation',
      url: 'https://docs.cleanuitemplate.com',
      target: '_blank',
      icon: 'icmn icmn-books',
    },
    {
      divider: true,
    },
    {
      title: 'Dashboard Alpha',
      key: 'dashboardAlpha',
      url: '/dashboard/alpha',
      icon: 'icmn icmn-home',
    },
  ]
}

export async function getTopMenuData(role) {
  if (role === 'parents') {
    return [
      {
        title: 'Dashboard',
        key: 'settings',
        icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
      },
      {
        title: 'Family Members',
        key: 'partners',
        url: '/family/',
        icon: 'icmn icmn-books',
      },
      // {
      //   title: 'Assessment',
      //   key: 'parentAssessment',
      //   // url: '/dashboard/alpha',
      //   icon: 'icmn icmn-books',
      //   children: [
      //     {
      //       title: 'VB-MAPP',
      //       key: 'parentVBMAPP',
      //       url: '/parent/VBMAPP',
      //     },
      //     {
      //       title: 'PEAK',
      //       key: 'parentPEAK',
      //       url: '/parent/PEAK',
      //     },
      //     {
      //       title: 'CogniAble',
      //       key: 'parentCogniAble',
      //       url: '/parent/COGNIABLE',
      //     },
      //     {
      //       title: 'ABC',
      //       key: 'parentABC',
      //       url: '/parent/ABC',
      //     },
      //     {
      //       title: 'Preference Assessment',
      //       key: 'parentPreferenceAssessment',
      //       url: '/parent/PreferenceAssessment',
      //     },
      //   ]
      // },
      {
        title: 'Goals',
        key: 'parentGoals',
        url: '/partners/editprofile',
        icon: 'icmn icmn-books',
        children: [
          {
            title: 'Long Term',
            key: 'revenueAuthorizations',
            url: '/revenue/authorization',
          },
          {
            title: 'Short Term',
            key: 'revenueAuthorizationByPayor',
            url: '/revenue/authorizationbypayor',
          },
          {
            title: 'Tragets',
            key: 'revenueBilling',
            url: '/revenue/billing',
          },
        ],
      },
      {
        title: 'Sessions',
        key: 'parentSessions',
        url: '/therapy/sessionrecording',
        icon: 'icmn icmn-books',
        // children: [
        //   {
        //     title: 'Skill Acquisition',
        //     key: 'parentSkillAcquisition',
        //     // url: '/therapy/assessment',
        //   },
        //   {
        //     key: 'parentBehaviorReduction',
        //     title: 'Behavior Reduction',
        //     url: '/therapy/targetmapping',
        //     // pro: true,
        //   },
        //   {
        //     key: 'parentMaintenance',
        //     title: 'Maintenance',
        //     url: '/therapy/assessment/peak',
        //   },

        // ]
      },
      {
        title: 'Daily Vitals',
        key: 'parentDailyVitals',
        icon: 'icmn icmn-books',
        children: [
          {
            title: 'Mand',
            key: 'parentMand',
            url: '/mand/',
          },
          {
            title: 'Behavior',
            key: 'ParentBehavior',
            url: '/decel/',
          },
          // {
          //   title: 'Height',
          //   key: 'parentHeight',
          //   url: '/scheduling/viewcalendar',
          // },
          // {
          //   title: 'Weight',
          //   key: 'parentWeight',
          //   url: '/scheduling/viewdayplanner',
          // },
          {
            title: 'Toileting',
            key: 'parentToileting',
            url: '/toilet/',
          },
          {
            title: 'Meal',
            key: 'parentMeal',
            url: '/mealData/',
          },
          {
            title: 'Medical Data',
            key: 'parentPrescription',
            url: '/medicalData/',
          },
        ],
      },
    ]
  }

  if (role === 'therapist') {
    return [
      {
        title: 'Dashboard',
        key: 'settings',
        icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
      },
    ]
  }

  return [
    {
      title: 'Dashboard',
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
    },
    {
      title: 'Partners',
      key: 'partners',
      // url: '/partners/laerners',
      icon: 'icmn icmn-books',
      children: [
        {
          title: 'Learners',
          key: 'partnersLearner',
          url: '/partners/viewlearners',
        },
        {
          title: 'Staff',
          key: 'partnersStaff',
          url: '/partners/viewstaffs',
        },
        {
          title: 'Network Providers',
          key: 'partnersProviders',
          url: '/partners/providers',
        },
        {
          title: 'Others',
          key: 'partnersOthers',
          url: '/partners/others',
        },
      ],
    },
    {
      title: 'Files',
      key: 'files',
      // url: '/dashboard/alpha',
      icon: 'icmn icmn-books',
      children: [
        {
          title: 'Upload',
          key: 'filesUpload',
          url: '/files/upload',
        },
        {
          title: 'All Files',
          key: 'filesAllFiles',
          url: '/files/allfiles',
        },
        {
          title: 'New Files',
          key: 'filesNewFiles',
          url: '/files/newfiles',
        },
        {
          title: 'Files shared with me',
          key: 'filesSharedWithMe',
          url: '/files/filessharedwithme',
        },
        {
          title: 'Files owned by me',
          key: 'filesOwnedByMe',
          url: '/files/filesownedbyme',
        },
        {
          title: 'Files uploaded by me',
          key: 'filesUploadedByMe',
          url: '/files/filesuploadedbyme',
        },
        {
          title: 'Documentry Report',
          key: 'filesDocumentryReport',
          url: '/files/filesdocumentryreport',
        },
        {
          title: 'Survey',
          key: 'filesSurvey',
          url: '/files/filessurvey',
        },
      ],
    },
    // {
    //   title: 'Revenue',
    //   key: 'revenue',
    //   url: '/partners/editprofile',
    //   icon: 'icmn icmn-books',
    //   children: [
    //     {
    //       title: 'Authorizations',
    //       key: 'revenueAuthorizations',
    //       url: '/revenue/authorization',
    //     },
    //     {
    //       title: 'Authorization by payor',
    //       key: 'revenueAuthorizationByPayor',
    //       url: '/revenue/authorizationbypayor',
    //     },
    //     {
    //       title: 'Billing',
    //       key: 'revenueBilling',
    //       url: '/revenue/billing',
    //     },
    //     {
    //       title: 'Invoices',
    //       key: 'revenueInvoices',
    //       url: '/revenue/invoices',
    //     },
    //     {
    //       title: 'Sales',
    //       key: 'revenueSales',
    //       url: '/revenue/sales',
    //     },
    //     {
    //       title: 'Leads',
    //       key: 'revenueLeads',
    //       url: '/revenue/leads',
    //     },
    //     {
    //       title: 'Opportunities',
    //       key: 'revenueOpportunities',
    //       url: '/revenue/opportunities',
    //     },
    //   ]
    // },
    {
      title: 'Record Data',
      key: 'record_data',
      url: '#',
      icon: 'icmn icmn-home',
      children: [
        {
          title: 'Meal Data',
          key: 'meal_data',
          url: '/mealData/',
          icon: 'icmn icmn-home',
        },
        {
          title: 'Medical Data',
          key: 'medical_data',
          url: '/medicalData/',
          icon: 'icmn icmn-home',
        },
        {
          title: 'Family Members',
          key: 'family',
          url: '/family/',
          icon: 'icmn icmn-home',
        },
        {
          title: 'Toilet Data',
          key: 'toilet',
          url: '/toilet/',
          icon: 'icmn icmn-home',
        },
        {
          title: 'Decel Data',
          key: 'decel',
          url: '/decel/',
          icon: 'icmn icmn-home',
        },
        {
          title: 'Mand Data',
          key: 'mand',
          url: '/mand/',
          icon: 'icmn icmn-home',
        },
      ],
    },
    {
      title: 'Therapy',
      key: 'therapy',
      // url: '/therapy/tables',
      icon: 'icmn icmn-books',
      children: [
        {
          title: 'Assessment',
          key: 'therapyAssessment',
          // url: '/therapy/assessment',
          children: [
            {
              key: 'vbmapp',
              title: 'VB-MAPP',
              url: '/therapy/targetmapping',
              // pro: true,
            },
            {
              key: 'peak',
              title: 'PEAK',
              url: '/therapy/assessment/peak',
            },
            {
              key: 'preferredAssessment',
              title: 'Preferred Assessment',
              url: '/therapy/assessment/preferredassessment',
            },
            {
              key: 'cogniableAssessment',
              title: 'CogniAble Assessment',
              url: '/therapy/assessment/cogniableassessment',
            },
          ],
        },
        {
          title: 'Learners Binder',
          key: 'therapyLearnerNameBinder',
          // url: '/therapy/learnernamebinder',
          children: [
            {
              key: 'createBinder',
              title: 'Create Binder',
              url: '/therapy/learnernamebinder/createbinder',
              // pro: true,
            },
            {
              key: 'goals',
              title: 'Goals',
              url: '/therapy/learnernamebinder/goals',
            },
            {
              key: 'hierarchy',
              title: 'Hierarchy',
              url: '/therapy/learnernamebinder/hierarchy',
            },
            {
              key: 'targets',
              title: 'Targets',
              url: '/targets/suggest_target',
            },
            {
              key: 'reinforcerlist',
              title: 'Reinforcer List',
              url: '/therapy/learnernamebinder/reinforcerlist',
            },
            {
              key: 'excelLoad',
              title: 'Excel Upload',
              url: '/therapy/learnernamebinder/excelupload',
            },
          ],
        },
        {
          title: 'Session',
          key: 'therapySession',
          url: '/therapy/sessionrecording',
        },
        {
          title: 'New Session',
          key: 'therapySupervisionFeedback',
          url: '/sessionrecording',
        },
        {
          title: 'Session Feedback',
          key: 'therapySessionFeedback',
          url: '/therapy/sessionfeedback',
        },
        {
          title: 'Supervision Records',
          key: 'therapySupervisionRecords',
          url: '/therapy/supervisionrecords',
        },
        {
          title: 'Requesting form',
          key: 'therapyRequestingForm',
          url: '/therapy/requestingform',
        },
        {
          title: 'Reminder Forms',
          key: 'therapyRiminderForm',
          url: '/therapy/reminderform',
        },
        {
          title: 'Toileting Schedule',
          key: 'therapyToiletingSchedule',
          url: '/therapy/toiletingschedule',
        },
      ],
    },
    {
      title: 'Scheduling',
      key: 'scheduling',
      // url: 'https://docs.cleanuitemplate.com',
      icon: 'icmn icmn-books',
      children: [
        {
          title: 'Task',
          key: 'schedulingTask',
          url: '/scheduling/task',
        },
        {
          title: 'Appointments',
          key: 'schedulingAppointments',
          url: '/scheduling/appointments',
        },
        {
          title: 'View Calendar',
          key: 'schedulingViewCalendar',
          url: '/scheduling/viewcalendar',
        },
        {
          title: 'View Day planner',
          key: 'schedulingViewDayPlanner',
          url: '/scheduling/viewdayplanner',
        },
        {
          title: 'View as grid',
          key: 'schedulingViewAsGrid',
          url: '/scheduling/viewasgrid',
        },
        {
          title: 'History and Audits',
          key: 'schedulingHistoryAndAudits',
          url: '/scheduling/historyandaudits',
        },
        {
          title: 'Attendance',
          key: 'schedulingAttendance',
          url: '/scheduling/attendance',
        },
        {
          title: 'Settings',
          key: 'schedulingSettings',
          url: '/scheduling/settings',
        },
        {
          title: 'Add Timesheet',
          key: 'schedulingAddTimesheet',
          url: '/scheduling/addtimesheet',
        },
        {
          title: 'Timesheet',
          key: 'schedulingTimesheet',
          url: '/scheduling/timesheet',
        },
        {
          title: 'Schedule a Meeting',
          key: 'schedulingMeeting',
          url: '/scheduling/meeting',
        },
      ],
    },
    {
      title: 'HR',
      key: 'hr',
      // url: 'https://docs.cleanuitemplate.com',
      icon: 'icmn icmn-books',
      children: [
        {
          title: 'Hiring',
          key: 'hrHiring',
          url: '/hr/hiring',
        },
        {
          title: 'Onboarding',
          key: 'hrOnboarding',
          url: '/hr/onboarding',
        },
        {
          title: 'Employment Details',
          key: 'hrEmploymentDetails',
          url: '/hr/employmentdetails',
        },
        {
          title: 'Payroll',
          key: 'hrPayroll',
          url: '/hr/payroll',
        },
        {
          title: 'Benefits',
          key: 'hrBenefits',
          url: '/hr/benefits',
        },
        {
          title: 'Time Management',
          key: 'hrTimeManagement',
          url: '/hr/timemanagement',
        },
        {
          title: 'Taxes',
          key: 'hrTaxes',
          url: '/hr/taxes',
        },
        {
          title: 'Travel Management',
          key: 'hrTravelManagement',
          url: '/hr/travelmanagement',
        },
        {
          title: 'Training',
          key: 'hrTraining',
          url: '/hr/training',
        },
        {
          title: 'Performemnce Appraisal',
          key: 'hrPerformemnceAppraisal',
          url: '/hr/performemnceappraisal',
        },
        {
          title: 'Expense Claims',
          key: 'hrExpenseClaims',
          url: '/hr/expenseclaims',
        },
      ],
    },
    {
      title: 'Analytics',
      key: 'analytics',
      // url: 'https://docs.cleanuitemplate.com',
      icon: 'icmn icmn-books',
      children: [
        {
          title: 'Graphs',
          key: 'analyticsGraphs',
          url: '/analytics/graphs',
        },
        {
          title: 'Reports',
          key: 'analyticsReports',
          url: '/analytics/reports',
        },
      ],
    },
    {
      title: 'Messages',
      key: 'messages',
      // url: 'https://docs.cleanuitemplate.com',
      icon: 'icmn icmn-books',
      children: [
        {
          title: 'Compose New Message',
          key: 'messagesCompose',
          url: '/messages/compose',
        },
        {
          title: 'Inbox',
          key: 'messagesInbox',
          url: '/messages/inbox',
        },
        {
          title: 'Sent',
          key: 'messagesSent',
          url: '/messages/sent',
        },
        {
          title: 'Archived',
          key: 'messagesArchived',
          url: '/messages/archived',
        },
        {
          title: 'Reachme',
          key: 'messagesReachme',
          url: '/messages/reachme',
        },
      ],
    },
    {
      title: 'Customize',
      key: 'customize',
      url: 'https://docs.cleanuitemplate.com',

      icon: 'icmn icmn-books',
    },
    // {
    //   title: 'Dashboard Alpha',
    //   key: 'dashboardAlpha',
    //   url: '/dashboard/alpha',
    //   icon: 'icmn icmn-home',
    // },
    // {
    //   title: 'Pages',
    //   key: 'pages',
    //   icon: 'icmn icmn-stack',
    //   children: [
    //     {
    //       title: 'Dashboard Alpha',
    //       key: 'dashboardAlpha',
    //       url: '/dashboard/alpha',
    //     },
    //     {
    //       title: 'Dashboard Beta',
    //       key: 'dashboardBeta',
    //       url: '/dashboard/beta',
    //       pro: true,
    //     },
    //     {
    //       title: 'Dashboard Crypto',
    //       key: 'dashboardCrypto',
    //       url: '/dashboard/crypto',
    //       pro: true,
    //     },
    //     {
    //       title: 'Dashboard Gamma',
    //       key: 'dashboardGamma',
    //       url: '/dashboard/gamma',
    //       pro: true,
    //     },
    //     {
    //       title: 'Dashboard Docs',
    //       key: 'dashboardDocs',
    //       url: '/dashboard/docs',
    //       pro: true,
    //     },
    //     {
    //       divider: true,
    //     },
    //     {
    //       title: 'Default Pages',
    //       key: 'defaultPages',
    //       children: [
    //         {
    //           key: 'loginAlpha',
    //           title: 'Login Alpha',
    //           url: '/pages/login-alpha',
    //           pro: true,
    //         },
    //         {
    //           key: 'loginBeta',
    //           title: 'Login Beta',
    //           url: '/pages/login-beta',
    //           pro: true,
    //         },
    //         {
    //           key: 'register',
    //           title: 'Register',
    //           url: '/pages/register',
    //           pro: true,
    //         },
    //         {
    //           key: 'lockscreen',
    //           title: 'Lockscreen',
    //           url: '/pages/lockscreen',
    //           pro: true,
    //         },
    //         {
    //           key: 'pricingTable',
    //           title: 'Pricing Tables',
    //           url: '/pages/pricing-table',
    //           pro: true,
    //         },
    //         {
    //           key: 'invoice',
    //           title: 'Invoice',
    //           url: '/pages/invoice',
    //           pro: true,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Ecommerce',
    //       key: 'ecommerce',
    //       children: [
    //         {
    //           title: 'Dashboard',
    //           key: 'dashboard',
    //           url: '/ecommerce/dashboard',
    //           pro: true,
    //         },
    //         {
    //           title: 'Products Catalog',
    //           key: 'productsCatalog',
    //           url: '/ecommerce/products-catalog',
    //           pro: true,
    //         },
    //         {
    //           title: 'Products Details',
    //           key: 'productsDetails',
    //           url: '/ecommerce/product-details',
    //           pro: true,
    //         },
    //         {
    //           title: 'Products Edit',
    //           key: 'productsEdit',
    //           url: '/ecommerce/product-edit',
    //           pro: true,
    //         },
    //         {
    //           title: 'Products List',
    //           key: 'productsList',
    //           url: '/ecommerce/products-list',
    //           pro: true,
    //         },
    //         {
    //           title: 'Orders',
    //           key: 'orders',
    //           url: '/ecommerce/orders',
    //           pro: true,
    //         },
    //         {
    //           title: 'Cart',
    //           key: 'cart',
    //           url: '/ecommerce/cart',
    //           pro: true,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Apps',
    //       key: 'apps',
    //       children: [
    //         {
    //           title: 'Messaging',
    //           key: 'messaging',
    //           url: '/apps/messaging',
    //           pro: true,
    //         },
    //         {
    //           title: 'Mail',
    //           key: 'mail',
    //           url: '/apps/mail',
    //           pro: true,
    //         },
    //         {
    //           title: 'Profile',
    //           key: 'profile',
    //           url: '/apps/profile',
    //           pro: true,
    //         },
    //         {
    //           title: 'Gallery',
    //           key: 'gallery',
    //           url: '/apps/gallery',
    //           pro: true,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Blog',
    //       key: 'blog',
    //       children: [
    //         {
    //           title: 'Feed',
    //           key: 'blogFeed',
    //           url: '/blog/feed',
    //           pro: true,
    //         },
    //         {
    //           title: 'Post',
    //           key: 'blogPost',
    //           url: '/blog/post',
    //           pro: true,
    //         },
    //         {
    //           title: 'Add Post',
    //           key: 'blogAddPost',
    //           url: '/blog/add-blog-post',
    //           pro: true,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'YouTube',
    //       key: 'youtube',
    //       children: [
    //         {
    //           title: 'Feed',
    //           key: 'youtubeFeed',
    //           url: '/youtube/feed',
    //           pro: true,
    //         },
    //         {
    //           title: 'View',
    //           key: 'youtubeView',
    //           url: '/youtube/view',
    //           pro: true,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'GitHub',
    //       key: 'github',
    //       children: [
    //         {
    //           title: 'Explore',
    //           key: 'githubExplore',
    //           url: '/github/explore',
    //           pro: true,
    //         },
    //         {
    //           title: 'Discuss',
    //           key: 'githubDiscuss',
    //           url: '/github/discuss',
    //           pro: true,
    //         },
    //       ],
    //     },
    //   ],
    // },
  ]
}
