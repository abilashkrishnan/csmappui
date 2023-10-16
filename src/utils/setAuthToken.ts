import axios from 'axios';

const setAuthToken = (environment:string) => {
  if (environment==='DEV') {
    axios.defaults.headers.common['Store-Hash'] = '94bastr1it';
    axios.defaults.headers.common['X-Auth-Token'] = 'btghi8uws3o12gvegewj8wnaarplcyi';

  } else if(environment==='QA') {
    axios.defaults.headers.common['Store-Hash'] = '94bastr1it';
    axios.defaults.headers.common['X-Auth-Token'] = 'btghi8uws3o12gvegewj8wnaarplcyi';
  }else{
    axios.defaults.headers.common['Store-Hash'] = '94bastr1it';
    axios.defaults.headers.common['X-Auth-Token'] = 'btghi8uws3o12gvegewj8wnaarplcyi';
  }
};

export default setAuthToken;