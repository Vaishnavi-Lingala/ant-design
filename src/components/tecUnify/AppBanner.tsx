import { Link, useRouteMatch } from "react-router-dom";
import type { App } from './types';

interface ABProps {
  app: App;
  optionsMenu: JSX.Element;
}

const placeholderImg = "https://placeholder.pics/svg/100";

function AppListItem({ app, optionsMenu }: ABProps): JSX.Element {
  const match = useRouteMatch();

  return (
    <li className='AppList-Item AppList-Banner' key={app.config_id}>
      <Link to={{
        pathname: `${match.url}/${app.config_id}/${app.display_name}`,
        state: { app }
      }}>
        {
          app.logo === undefined ?
            <img src={app.logo} width={50} height={50} /> :
            <img src={placeholderImg} width={50} height={50} />
        }
        {app.display_name}
      </Link>
      {optionsMenu}
    </li>
  );
}

export default AppListItem;
