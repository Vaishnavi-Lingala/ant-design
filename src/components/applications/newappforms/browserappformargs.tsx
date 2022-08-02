import { FormArgs } from "../types";
import { UserCredentials, SelectTermination } from "./FormComponents";

const overrideMessages = {
  required: 'Field is required!'
};

const formArgs: FormArgs = {
  formTitle: 'Configure Browser App',
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
      label: 'Browser',
      name: ['template', 'browser'],
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
      name: ['template', 'window_title'],
      type: 'input',
      rules: [
        {
          required: true
        }
      ]
    },
    {
      label: 'App Url',
      name: ['template', 'app_url'],
      type: 'input',
      rules: [
        {
          required: true
        }
      ]
    },
    {
      label: 'Wait Time',
      name: ['template', 'wait_time'],
      type: 'numeric',
      step: 100,
      formatter: value => `${value}ms`,
      parser: value => value!.replace('ms', '')
    },
    {
      label: 'Termination Method',
      name: ['template', 'termination_method'],
      type: 'radio-group',
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

export default formArgs;
