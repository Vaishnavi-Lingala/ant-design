import { Rule } from 'antd/lib/form';

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
  validationMessages: overrideMessages,
  input: [
    {
      label: 'Citrix Storefront URL',
      name: 'url',
      rules: [storefrontRules]
    },
    {
      label: 'Citrix PNA Store URL',
      name: 'path',
      disabled: true,
      placeholder: 'Determine where to place in database.',
      rules: [
        {
          required: true
        }
      ]
    },
    {
      label: 'Citrix Gateway URL',
      name: 'gateway_url',
      disabled: true,
      placeholder: 'Determine where to place in database.',
      rules: [
        {
          required: true
        }
      ]
    },
    {
      label: 'Window Title',
      name: 'window_title'
    },
    {
      label: 'Domain',
      name: 'domain',
      rules: [
        {
          required: true
        }
      ]
    }
  ],
  number: [
    {
      label: 'Timeout',
      name: 'wait_time',
      initialValue: 3000,
      formatter: value => `${value}ms`,
      parser: value => value.replace('ms', '')
    },
  ]
};
