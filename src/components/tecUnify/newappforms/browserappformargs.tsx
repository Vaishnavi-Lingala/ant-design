import { FormArgs } from "../types";
import { UserCredentials, SelectTermination } from "./FormComponents";

const formArgs: FormArgs = {
  formTitle: 'Configure Browser App',
  formItems: [
    {
      label: 'Name',
      name: 'name',
      type: 'input'
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
      type: 'input'
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
      initialValue: 0,
      step: 100,
      formatter: value => `${value}ms`,
      parser: value => value!.replace('ms', '')
    },
    {
      label: 'Termination Method',
      name: ['template', 'termination_method'],
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

export default formArgs;
