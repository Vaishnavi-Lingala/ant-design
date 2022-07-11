/* 
 * Define custom behavior for a form item, much easier than trying to
 * describe the behavior in a formargs file and handle that in the form renderer
*/
import { Select, Form, Input, Checkbox } from 'antd';
import { useFetchDomains } from '../hooks/useFetch';

// Browser App Specific
export function UserCredentials() {
  return (
    <>
      <Form.Item
        label={<span className='Modal-FormLabel'>Same as Windows account</span>}
        name='same_credentials'
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
            return (
              <Form.Item noStyle hidden={getFieldValue('same_credentials')}>
                <Form.Item
                  label={<span className='Modal-FormLabel'>Username</span>}
                  name='username'
                  children={<Input />}
                  rules={[{ required: true }]}
                />

                <Form.Item
                  label={<span className='Modal-FormLabel'>Password</span>}
                  name='password'
                  children={<Input />}
                  rules={[{ required: true }]}
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

  function FieldSwitch(value: string) {
    switch (value) {
      case 'process_name':
        return (
          <Form.Item
            label={<span className='Modal-FormLabel'>Process Name*</span>}
            name='process_name'
            rules={[{ required: true }]}
            children={<Input />}
          />
        )

      case 'window_title':
        return (
          <Form.Item
            label={<span className='Modal-FormLabel'>Window Title*</span>}
            name='window_title'
            rules={[{ required: true }]}
            children={<Input />}
          />
        )
      default:
        return null;
    }
  }

  return (
    <Form.Item
      noStyle
      shouldUpdate={(prev, curr) => prev !== curr}
    >
      {({ getFieldValue }) => FieldSwitch(getFieldValue('termination_method'))}
    </Form.Item>
  );
}

// Citrix Specific
export function SelectResource() {

  function FieldSwitch(value: string) {
    switch (value) {
      case 'published_app_name':
        return (
          <Form.Item
            label={<span className='Modal-FormLabel'>Published App Name*</span>}
            name='published_app_name'
            rules={[{ required: true }]}
            children={<Input />}
          />
        )

      case 'desktop_app_name':
        return (
          <Form.Item
            label={<span className='Modal-FormLabel'>App Name*</span>}
            name='app_name'
            rules={[{ required: true }]}
            children={<Input />}
          />
        )
      default:
        return null;
    }
  }

  return (
    <Form.Item
      noStyle
      shouldUpdate={(prev, curr) => prev !== curr}
    >
      {({ getFieldValue }) => FieldSwitch(getFieldValue('resource_type'))}
    </Form.Item>
  );
}

// Citrix Specific
export function SelectDomain() {
  const { domains, isFetching: fetchingDomains } = useFetchDomains();

  return (
    <Form.Item
      label={<span className='Modal-FormLabel'>Domain</span>}
      name='domain'
    >
      <Select
        loading={fetchingDomains}
        options={
          domains.map(
            (domain) => {
              return {
                label: domain,
                value: domain
              }
            })}
      />
    </Form.Item>
  );
};
