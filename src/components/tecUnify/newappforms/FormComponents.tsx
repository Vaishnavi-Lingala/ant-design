/* 
 * Define custom behavior for a form item, much easier than trying to
 * describe the behavior in a formargs file and handle that in the form renderer
*/
import { Select, Form, Input, Checkbox } from 'antd';

import ApiUrls from '../../../ApiUtils';
import { useFetch } from '../hooks/useFetch';

function FieldSwitch(value: string) {
  switch (value) {
    case 'published_app_name':
      return (
        <Form.Item
          label={<span className='Modal-FormLabel'>Published App Name*</span>}
          name={['template', 'published_app_name']}
          rules={[{ required: true }]}
          children={<Input />}
        />
      )

    case 'desktop_app_name':
      return (
        <Form.Item
          label={<span className='Modal-FormLabel'>App Name*</span>}
          name={['template', 'app_name']}
          rules={[{ required: true }]}
          children={<Input />}
        />
      )

    case 'process_name':
      return (
        <Form.Item
          label={<span className='Modal-FormLabel'>Process Name*</span>}
          name={['template', 'process_name']}
          rules={[{ required: true }]}
          children={<Input />}
        />
      )

    default:
      return null;
  }
}

// Browser App Specific
export function UserCredentials() {
  return (
    <>
      <Form.Item
        label={<span className='Modal-FormLabel'>Same as Windows account</span>}
        name={['template', 'same_credentials']}
        valuePropName='checked'
      >
        <Checkbox />
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) => prev !== curr}
      >
        {
          ({ getFieldValue }) => {
            const notChecked = !getFieldValue(['template', 'same_credentials']);

            return (
              <Form.Item noStyle hidden={!notChecked}>
                <Form.Item
                  label={
                    <span className='Modal-FormLabel'>
                      {`Username ${notChecked ? '*' : ''}`}
                    </span>
                  }
                  name={['template', 'username']}
                  children={<Input />}
                  rules={[{ required: notChecked }]}
                />

                <Form.Item
                  label={
                    <span className='Modal-FormLabel'>
                      {`Password ${notChecked ? '*' : ''}`}
                    </span>
                  }
                  name={['template', 'password']}
                  children={<Input.Password />}
                  rules={[{ required: notChecked }]}
                />

                <Form.Item
                  label={
                    <span className='Modal-FormLabel'>
                      {`Confirm Password ${notChecked ? '*' : ''}`}
                    </span>
                  }
                  dependencies={['template', 'password']}
                  name='confirm_password'
                  children={<Input.Password />}
                  rules={[
                    {
                      required: notChecked,
                      message: 'Please Confirm your password!'
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue(['template', 'password']) === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'))
                      }
                    })
                  ]}
                />

              </Form.Item>
            );
          }
        }
      </Form.Item>
    </>
  );
}

export function SelectTermination() {
  return (
    <Form.Item
      noStyle
      shouldUpdate={(prev, curr) => prev !== curr}
    >
      {({ getFieldValue }) => FieldSwitch(getFieldValue(['template', 'termination_method']))}
    </Form.Item>
  );
}

// Citrix Specific
export function SelectResource() {
  return (
    <Form.Item
      noStyle
      shouldUpdate={(prev, curr) => prev !== curr}
    >
      {({ getFieldValue }) => FieldSwitch(getFieldValue(['template', 'resource_type']))}
    </Form.Item>
  );
}

// Citrix Specific
export function SelectDomain() {

  const accountId = localStorage.getItem('accountId') as string;
  const { data, status } = useFetch<string>({
    url: ApiUrls.domains(accountId)
  });

  return (
    <Form.Item
      label={<span className='Modal-FormLabel'>Domain</span>}
      name={['template', 'domain']}
    >
      {
        (data !== undefined) &&
        <Select
          loading={status === 'fetching'}
          options={
            data.results.filter(domain => !domain.match('WORKGROUP'))
              .map(
                (domain) => {
                  return {
                    label: domain,
                    value: domain
                  }
                })}
        />
      }
    </Form.Item>
  );
};
