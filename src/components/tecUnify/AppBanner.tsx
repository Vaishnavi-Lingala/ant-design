import { Link } from "react-router-dom";
import type { App } from './types';

interface ABProps {
  app: App;
  optionsMenu: JSX.Element;
}

const placeholderImg = "https://placeholder.pics/svg/100";
function AppListItem({app, optionsMenu}: ABProps): JSX.Element {
  return (
    <li className='AppList-Item AppList-Banner' key={app.config_id}>
      <Link to={{
        pathname: `/apps/${app.config_id}/${app.name}`,
        state: {app}
      }}>
        { 
          app.logo === undefined ?
            <img src={app.logo} width={50} height={50}/> :
            <img src={placeholderImg} width={50} height={50}/>
        }
        {app.name}
      </Link>
      {optionsMenu}
    </li>
  );
}

export default AppListItem;
