import { SelectDomain, SelectResource } from './FormComponents';
import type { Rule } from 'antd/lib/form';
import { FormArgs } from '../types';

// RegExp matches urls to the format specified by Citrix 'https://StoreFront.domain.com/Citrix/Store'
const storefrontRules: Rule = {
  required: true,
  pattern: new RegExp('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9]{1,256}\\.[a-zA-Z0-9]{1,6}\\b/Citrix/[-a-zA-Z]{1,256}'),
  message: 'Not a valid storefront url'
};

const overrideMessages = {
  required: 'Field is required!',
  pattern: {
    mismatch: 'Please enter a valid Storefront URL.'
  }
};

const formArgs: FormArgs = {
  formTitle: 'Configure Citrix VDI App',
  validationMessages: overrideMessages,
  formItems: [
    {
      label: 'Name',
      name: 'name',
      type: 'input',
      rules: [
        {
          required: true
        }
      ]
    },
    {
      label: 'Citrix Storefront URL',
      name: ['template', 'url'],
      type: 'input',
      rules: [storefrontRules]
    },
    {
      label: 'Citrix PNA Store URL',
      name: ['template', 'path'],
      type: 'input',
      rules: [
        {
          required: true
        }
      ]
    },
    {
      label: 'Citrix Gateway URL',
      name: ['template', 'gatway_url'],
      type: 'input',
    },
    {
      label: 'Window Title',
      name: ['template', 'window_title'],
      type: 'input',
    },
    {
      label: 'Resource Type',
      name: ['template', 'resource_type'],
      type: 'radio',
      rules: [
        {
          required: true
        }
      ],
      options: [
        {
          label: 'Published App',
          value: 'published_app_name',
        },
        {
          label: 'Desktop App',
          value: 'desktop_app_name',
        }
      ],
    },
    {
      type: 'custom',
      render: <SelectResource />
    },
    {
      type: 'custom',
      render: <SelectDomain />
    }
  ]
};

export default formArgs;
