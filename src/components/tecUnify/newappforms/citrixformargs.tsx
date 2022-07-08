import SelectDomain from './SelectDomain';
import type { Rule } from 'antd/lib/form';


// RegExp matches urls to the format specified by Citrix 'https://StoreFront.domain.com/Citrix/Store'
const storefrontRules: Rule = {
  required: true,
  pattern: new RegExp('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9]{1,256}\\.[a-zA-Z0-9]{1,6}\\b/Citrix/[-a-zA-Z]{1,256}'),
};

const overrideMessages = {
  required: '${label} is required!',
  pattern: {
    mismatch: 'Please enter a valid Storefront URL.'
  }
};

// Complete validation rules for the Citrix form
export const formArgs = {
  form_title: 'Configure Citrix VDI App',
  validationMessages: overrideMessages,
  form_items: [
    {
      label: 'Citrix Storefront URL',
      name: 'url',
      type: 'input',
      rules: [storefrontRules]
    },
    {
      label: 'Citrix PNA Store URL',
      name: 'path',
      type: 'input',
      rules: [
        {
          required: true
        }
      ]
    },
    {
      label: 'Citrix Gateway URL',
      name: 'gateway_url',
      type: 'input',
    },
    {
      label: 'Window Title',
      name: 'window_title',
      type: 'input',
    },
    {
      label: 'Resource Type',
      name: 'resource_type',
      type: 'radio',
      options: [
        {
          label: 'Published App',
          value: 'published_app_name',
          render: {
            label: 'Published App Name',
            name: 'published_app_name',
            type: 'input'
          }
        },
        {
          label: 'Desktop App',
          value: 'desktop_app_name',
          render: {
            label: 'Desktop App Name',
            name: 'desktop_app_name',
            type: 'input'
          }
        }
      ],
    },
    {
      label: 'Domain',
      name: 'domain',
      type: 'select',
      options: <SelectDomain />
    }
  ]
};
