import { useState } from 'react';
import {
  Modal,
  Form,
  Upload,
  Divider,
  UploadProps,
} from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

import { ApiResError, ConfiguredTemplate, TemplateFormData } from '../types';
import ApiService from '../../../Api.service';
import ApiUrls from '../../../ApiUtils';
import { openNotification } from '../../Layout/Notification';
import { useFormSwitch } from '../hooks';
import InputSelect from '../InputSwitch';

export interface AppFormProps {
  showModal: boolean;
  toggleModal: () => void;
  defaultValues?: ConfiguredTemplate;
  appUID: string;
  templateType?: string;
}

async function updateDB(values: TemplateFormData, appUID: string, hasDefaultVals: boolean) {
  let res: ConfiguredTemplate | ApiResError;

  const accountId = localStorage.getItem('accountId') as string;
  const productId = localStorage.getItem('productId') as string;

  // If form has default values then we need to update the template
  // otherwise add a new entry to the DB
  values.product_uid = productId;
  if (hasDefaultVals) {
    res = await ApiService.put(ApiUrls.updateTemplate(accountId, appUID), values)
  }
  else {
    res = await ApiService.post(ApiUrls.addTemplate(accountId, appUID), values)
  }

  if ('errorSummary' in res)
    throw res;

  return res;
}

function AppFormRenderer({
  showModal,
  toggleModal,
  appUID,
  templateType,
  defaultValues
}: AppFormProps) {

  const [sendingData, toggleSendingData] = useState(false);
  const [image, setImage] = useState<string>();
  const [form] = Form.useForm<TemplateFormData>();

  const { formArgs } = useFormSwitch({
    templateType
  });

  const hasDefaultVals = defaultValues !== undefined;

  if (formArgs === undefined) return <></>

  const uploadSettings: UploadProps = {
    fileList: undefined,
    maxCount: 1,
    showUploadList: false,
    listType: 'picture-card',
    beforeUpload: (file) => {
      const isPngOrJpg = file.type === 'image/png' || file.type === 'image/jpeg';

      if (!isPngOrJpg) {
        openNotification('error', 'Please upload a file in the correct format.');
        return false
      }

      const aboveSizeLimit = file.size / 1024 / 1024 < 1;
      if (!aboveSizeLimit) {
        openNotification('error', 'File size is too large.')
        return false
      }

      file.arrayBuffer().then((buf) => {
        // set tsconfig target to es6 or use --downleveliteration flag at compile time
        // https://mariusschulz.com/blog/downlevel-iteration-for-es3-es5-in-typescript
        //@ts-ignore 
        const b64Img = btoa(String.fromCharCode(...new Uint8Array(buf)));
        form.setFieldsValue({ new_logo: b64Img });
        setImage(`data:${file.type};base64,${b64Img}`);
      })
        .catch(() =>
          openNotification('error', 'There was a problem converting the file.')
        );
      return isPngOrJpg && aboveSizeLimit
    },
    // Avoid using the default upload methods
    customRequest: () => { }
  }

  function onOk() {
    form.validateFields()
      .then(values => {
        toggleSendingData(true)
        updateDB(values, appUID, hasDefaultVals)
          .then((res) => {
            if (hasDefaultVals)
              openNotification('success', `Updated template ${res.name}`)
            else
              openNotification('success', `Added template ${res.name}`)
          })
          .catch((err: ApiResError) => {
            console.error(err)
            openNotification('error', err.errorSummary);
          })
          .finally(() =>
            toggleSendingData(false)
          );
      })
      .catch((err: ApiResError) => {
        console.error('Validate Failed:', err);
      });
  }

  function onCancel() {
    form.resetFields();
    toggleModal();
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title={<span className='Modal-Header'>{formArgs.formTitle}</span>}
      closeIcon={<CloseOutlined />}
      maskClosable={false}
      centered
      visible={showModal}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={sendingData}
      okText={<span>Add</span>}
    >
      <Form
        name='NewApp'
        labelCol={{ span: 9 }}
        labelAlign='left'
        autoComplete='off'
        size='small'
        form={form}
        validateMessages={formArgs.validationMessages}
        requiredMark={false}
        initialValues={defaultValues}
        colon={false}
      >
        {formArgs.formItems.map((args, index) => <InputSelect {...args} key={index} />)}
        <Divider>App logo</Divider>


        <h4 style={{ textAlign: 'center' }}>Requirments</h4>
        <div className='Modal-UploadRulesContainer'>
          <ul className='Modal-UploadRules'>
            <li>Images should be less than 1mb</li>
            <li>Images should be png or jpeg format</li>
          </ul>

          <ul className='Modal-UploadRules'>
            <li>Transparent background</li>
            <li>Minimum image size of 420x120px</li>
          </ul>
        </div>

        <Form.Item name='new_logo'>
          <Upload {...uploadSettings}>
            {
              image ?
                <img
                  alt='App logo'
                  src={image}
                  style={{ height: '100%' }}
                />
                :
                uploadButton
            }
          </Upload>
        </Form.Item>

      </Form>
    </Modal>
  );
}

export default AppFormRenderer;
