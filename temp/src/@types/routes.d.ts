interface IWithAuthRouter {
  component?: any;
  pageProps?: any;
  layout: any;
  isHasHeader?: boolean;
  header?: any;
  isHasFooter?: boolean;
  footer?: any;
  backgroundColor?: boolean;
}

interface IWithUnAuthRouter {
  component?: any;
  pageProps?: any;
  layout: any;
  isHasHeader?: boolean;
  header?: any;
  isHasFooter?: boolean;
  footer?: any;
  backgroundColor?: boolean;
  isAuthPage?: boolean;
}
