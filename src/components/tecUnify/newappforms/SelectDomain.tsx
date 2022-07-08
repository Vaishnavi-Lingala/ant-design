import { memo } from 'react';
import { Select } from 'antd';
import { useFetchDomains } from '../hooks/useFetch';

function SelectDomain() {
  const { domains, isFetching: fetchingDomains } = useFetchDomains();

  return (
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
  );
}

export default memo(SelectDomain);
