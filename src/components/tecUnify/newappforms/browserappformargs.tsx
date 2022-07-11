import { UserCredentials, SelectTermination } from "./FormComponents";

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
      name: 'termination_method',
      type: 'radio',
      options: [
        {
          label: 'Process Name',
          value: 'process_name'
        },
        {
          label: 'Window Title',
          value: 'window_title'
        }
      ]
    },
    {
      type: 'custom',
      render: <SelectTermination />
    },
    {
      label: 'Credentials',
      type: 'heading',
    },
    {
      type: 'custom',
      render: <UserCredentials />
    },
  ]
};
