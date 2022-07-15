import { useState, useEffect } from 'react';
import { FormArgs } from '../types';

// Hook will import a different file to supply Form Render Component with
// the proper formArg data. Can be extending to include more Template Types
// in the future

function useFormSwitch() {
  const [currentTemplateType, setTemplateType] = useState('');

  // TODO(Cody): Come up with proper types and structure that each form file
  // should follow.
  const [formArgs, setFormArgs] = useState<FormArgs>();

  useEffect(() => {
    let file = '';
    switch (currentTemplateType) {
      case 'CITRIX':
        file = 'citrixformargs';
        break;
      case 'APP':
        file = 'browserappformargs';
        break;
    }

    async function importForm() {
      await import(`../newappforms/${file}`)
        .then(args => setFormArgs(args.default));
    }

    (file !== '') && importForm();
  }, [currentTemplateType]);


  return { formArgs, setTemplateType }
}

export default useFormSwitch;
