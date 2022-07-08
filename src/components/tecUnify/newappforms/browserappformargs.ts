import { FormArgs } from "../types";

export const formArgs = {
  form_title: 'Configure Browser App',
  form_items: [
    {
      label: 'Browser',
      name: 'browser',
      type: 'select',
      rules: [
        {
          required: true
        }
      ],
      options: [
        {
          label: 'Chrome',
          value: 'chrome'
        },
        {
          label: 'Internet Explorer',
          value: 'iexplorer'
        },
        {
          label: 'Edge',
          value: 'edge'
        }
      ]
    },
    {
      label: 'Window Title',
      name: 'window_title',
      type: 'input'
    },
    {
      label: 'App Url',
      name: 'app_url',
      type: 'input',
      rules: [
        {
          required: true
        }
      ]
    },
    {
      label: 'Wait Time',
      name: 'wait_time',
      type: 'numeric',
      initialValue: 0,
      step: 100,
      formatter: value => `${value}ms`,
      parser: value => value!.replace('ms', '')
    },
    {
      label: 'Termination Method',
      name: 'term_method',
      type: 'radio',
      options: [
        {
          label: 'Process Name',
          value: 'proc_name'
        },
        {
          label: 'Window Title',
          value: 'window_title'
        }
      ]
    },
    {
      label: 'Credentials',
      type: 'heading',
      children: [
        {
          label: 'Different from account',
          name: 'same_credentials',
          type: 'checkbox',
        },
        {
          label: 'Username',
          name: 'username',
          type: 'input',
          dependant: 'same_credentials',
        },
        {
          label: 'Password',
          name: 'password',
          type: 'input',
          dependant: 'same_credentials',
        }
      ]
    },
  ]
};
