import React from 'react';
import { Consumer as ApiConsumer} from '../../utils/ApiContext'
import { Consumer as TemplateConsumer} from '../../utils/TemplateContext'

const withData = (Comp) => (
  (props) =>   <ApiConsumer>
    {apis => <TemplateConsumer>
      {templates => <Comp apis={apis} templates={templates} {...props}/>}
    </TemplateConsumer>}
  </ApiConsumer>
);
export default withData
