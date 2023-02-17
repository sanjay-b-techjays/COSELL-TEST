import App from './App';
import Campaign from './Campaign';
import SalesRep from './SalesRep';
import { AppBelong, hostUrl } from './strings';

export const Config = (domain) => {
  let value;
  switch (true) {
    case domain === hostUrl.ifPortal:
      value = AppBelong.manager;
      break;
    case domain === hostUrl.localPortal:
      value = AppBelong.manager;
      break;
    case domain === hostUrl.localSalesHub:
      value = AppBelong.salesHub;
      break;
    default:
      value = AppBelong.salesHub;
      break;
  }
  return value;
};

export const DomainName = () => {
  const textSplit = window.location.href.split('.');
  if (textSplit[0].includes(hostUrl.localSalesHub) === true) {
    return Config(hostUrl.localSalesHub);
  }
  if (textSplit[0].includes(hostUrl.localPortal) === true) {
    return Config(hostUrl.localPortal);
  }
  return Config(`${textSplit[0]}`);
};

export const Modules = () => {
  const textSplit = window.location.href.split('.');
  if (textSplit[0].includes(hostUrl.localSalesHub) === true) {
    return <SalesRep />;
  }
  if (textSplit[0].includes(hostUrl.localPortal) === true) {
    return <App />;
  }
  if (textSplit[0].includes(hostUrl.localCampaign) === true) {
    return <Campaign />;
  }
  // if (textSplit[0] + textSplit[1] + textSplit[2] === 'https://portal' + 'dev' + 'cosell') {
  //   return <App />;
  // }
  // if (textSplit[0] + textSplit[1] + textSplit[2] === 'https://portal' + 'stg' + 'cosell') {
  //   return <App />;
  // }
  // if (textSplit[1] + textSplit[2] === 'dev' + 'lp') {
  //   return <Campaign />;
  // }
  // if (textSplit[1] + textSplit[2] === 'stg' + 'lp') {
  //   return <Campaign />;
  // }
  if(window.location.hostname.split(".")[0] === 'portal'){
    return <App />;
  }
  if(window.location.hostname.split(".")[2] === 'lp'){
    return <Campaign />;
  }
  if(window.location.hostname.split(".")[1] === 'lp'){
    return <Campaign />;
  }
  return <SalesRep />;
};
