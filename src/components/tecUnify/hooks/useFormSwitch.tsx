import { useState, useEffect } from 'react';
import { FormArgs } from '../types';

// Hook will import a different file to supply Form Render Component with
// the proper formArg data. Can be extending to include more Template Types
// in the future
function useFormSwitch({ templateType }) {
  const [formArgs, setFormArgs] = useState<FormArgs>();

  useEffect(() => {
    let file: string | undefined;
    switch (templateType) {
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

    // Do not import any form if file is undefined
    (file !== undefined) && importForm();

    // Clear the currently selected formArgs if templateType is undefined
    (templateType === undefined) && setFormArgs(undefined);

  }, [templateType]);

  return { formArgs }
}

export default useFormSwitch;
